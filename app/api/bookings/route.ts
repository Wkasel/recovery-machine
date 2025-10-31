import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendBookingConfirmation } from "@/lib/services/email";
import { services } from "@/lib/types/booking";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { stripeClient } from "@/lib/stripe/client";
import { type StripeCheckoutData } from "@/lib/stripe/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestBooking, guestEmail, guestPhone, devBypass = false } = body;

    const supabase = await createServerSupabaseClient();
    const serviceRoleClient = createServiceRoleClient();

    let user = null;

    if (!guestBooking) {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      user = authUser;
    } else {
      if (!guestEmail || !guestPhone) {
        return NextResponse.json(
          { error: "Email and phone are required for guest bookings" },
          { status: 400 }
        );
      }

      const { data: existingUser, error: existingUserError } =
        await serviceRoleClient.auth.admin.getUserByEmail(guestEmail);

      if (existingUserError && existingUserError.message !== "User not found") {
        console.error("Failed to look up user by email:", existingUserError);
        return NextResponse.json({ error: "Failed to verify account" }, { status: 500 });
      }

      if (existingUser?.user) {
        user = existingUser.user;
      } else {
        const { data: newUser, error: createError } =
          await serviceRoleClient.auth.admin.createUser({
            email: guestEmail,
            email_confirm: true,
            user_metadata: {
              phone: guestPhone,
              auto_created: true,
            },
          });

        if (createError || !newUser.user) {
          console.error("Failed to create user:", createError);
          return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
        }

        user = newUser.user;
      }
    }

    const {
      serviceType,
      dateTime,
      duration,
      address,
      addOns,
      specialInstructions,
      amount,
      setupFee,
      orderType = "one_time",
    } = body;

    if (!serviceType || !dateTime || !address || amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: serviceType, dateTime, address, amount" },
        { status: 400 }
      );
    }

    const rawAmount =
      typeof amount === "number" && Number.isFinite(amount)
        ? amount
        : parseInt(amount, 10);
    const totalAmount = Number.isFinite(rawAmount) ? rawAmount : 0;

    if (!devBypass && totalAmount <= 0) {
      return NextResponse.json(
        { error: "Payment amount must be greater than zero" },
        { status: 400 }
      );
    }

    const bookingDuration = Math.max(1, duration || 30);

    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + bookingDuration * 60000);

    const { data: existingBookings, error: overlapError } = await serviceRoleClient
      .from("bookings")
      .select("id, date_time, duration")
      .eq("user_id", user.id)
      .neq("status", "cancelled");

    if (overlapError) {
      console.error("Error checking overlapping bookings:", overlapError);
      return NextResponse.json({ error: "Failed to validate booking time" }, { status: 500 });
    }

    const hasOverlap = existingBookings?.some((booking) => {
      const bookingStart = new Date(booking.date_time);
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
      return startTime < bookingEnd && endTime > bookingStart;
    });

    if (hasOverlap) {
      return NextResponse.json(
        { error: "You already have a booking that overlaps with this time slot" },
        { status: 409 }
      );
    }

    const { data: existingProfile } = await serviceRoleClient
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await serviceRoleClient.from("profiles").insert({
        id: user.id,
        email: user.email || guestEmail || "",
        phone: guestBooking ? guestPhone : user.user_metadata?.phone || "",
        credits: 0,
      });

      if (profileError) {
        console.error("Failed to create user profile:", profileError);
        return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 });
      }
    }

    const normalizedSetupFee =
      typeof setupFee === "number" && Number.isFinite(setupFee)
        ? setupFee
        : parseInt(setupFee, 10) || 0;

    const customerEmail = guestBooking ? guestEmail : user.email;

    if (!customerEmail) {
      return NextResponse.json({ error: "Customer email is required" }, { status: 400 });
    }

    const customerPhone = guestBooking ? guestPhone : user.user_metadata?.phone;

    const selectedService = services.find((service) => service.id === serviceType);
    const orderDescription = selectedService
      ? `Recovery Machine - ${selectedService.name} session`
      : `Recovery Machine - ${serviceType} session`;

    const orderMetadata = {
      description: orderDescription,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      serviceType,
      dateTime,
      address,
      addOns,
      specialInstructions,
      setupFee: normalizedSetupFee,
      guest_booking: Boolean(guestBooking),
      dev_bypass: Boolean(devBypass),
      original_amount: totalAmount,
    };

    const persistedAmount = devBypass ? Math.max(totalAmount, 1) : totalAmount;

    const { data: order, error: orderError } = await serviceRoleClient
      .from("orders")
      .insert({
        user_id: user.id,
        amount: persistedAmount,
        setup_fee_applied: normalizedSetupFee,
        status: devBypass ? "paid" : "pending",
        order_type: orderType,
        metadata: orderMetadata,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    let dbServiceType = serviceType;
    if (serviceType === "combo_package") {
      dbServiceType = "combo";
    }

    const { data: booking, error: bookingError } = await serviceRoleClient
      .from("bookings")
      .insert({
        user_id: user.id,
        order_id: order.id,
        date_time: dateTime,
        duration: bookingDuration,
        service_type: dbServiceType,
        add_ons: {
          serviceType,
          extraVisits: addOns?.extraVisits || 0,
          familyMembers: addOns?.familyMembers || 0,
          extendedTime: addOns?.extendedTime || 0,
        },
        address,
        special_instructions: specialInstructions,
        status: devBypass ? "confirmed" : "scheduled",
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking creation error:", bookingError);
      await serviceRoleClient.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    const confirmationToken = createHash("sha256")
      .update(`${booking.id}-${booking.created_at}`)
      .digest("hex")
      .substring(0, 16);

    const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/booking/${booking.id}/confirmation?token=${confirmationToken}`;

    const metadataWithConfirmation = {
      ...orderMetadata,
      confirmation_token: confirmationToken,
      confirmation_url: confirmationUrl,
    };

    if (devBypass) {
      await serviceRoleClient
        .from("orders")
        .update({ metadata: metadataWithConfirmation })
        .eq("id", order.id);

      try {
        const { data: profile } = await serviceRoleClient
          .from("profiles")
          .select("*")
          .eq("id", booking.user_id)
          .single();

        if (profile?.email) {
          const bookingForEmail = {
            ...booking,
            location_address: booking.address || booking.location_address,
          };
          await sendBookingConfirmation(bookingForEmail as any, profile);
        }
      } catch (emailError) {
        console.error("Failed to send booking confirmation email:", emailError);
      }

      return NextResponse.json({
        success: true,
        booking,
        order: {
          ...order,
          metadata: metadataWithConfirmation,
        },
        confirmationUrl,
        requiresPayment: false,
      });
    }

    const checkoutMetadata: Record<string, any> = {
      ...metadataWithConfirmation,
      booking_id: booking.id,
      order_id: order.id,
      user_id: user.id,
    };

    const checkoutPayload: StripeCheckoutData = {
      amount: totalAmount,
      currency: "USD",
      order_reference: `order_${order.id}`,
      description: orderDescription,
      customer_email: customerEmail,
      customer_phone: customerPhone || undefined,
      order_type: orderType,
      metadata: checkoutMetadata,
    };

    try {
      const checkoutResponse = await stripeClient.createCheckoutSession(checkoutPayload);

      const updatedMetadata = {
        ...checkoutMetadata,
        stripe_session_id: checkoutResponse.session_id,
      };

      await serviceRoleClient
        .from("orders")
        .update({
          stripe_session_id: checkoutResponse.session_id,
          status: "processing",
          metadata: updatedMetadata,
        })
        .eq("id", order.id);

      return NextResponse.json({
        success: true,
        booking,
        order: {
          ...order,
          stripe_session_id: checkoutResponse.session_id,
          metadata: updatedMetadata,
        },
        confirmationUrl,
        requiresPayment: true,
        checkout: {
          amount: totalAmount,
          orderType,
          description: orderDescription,
          customerEmail,
          customerPhone,
          metadata: updatedMetadata,
          sessionId: checkoutResponse.session_id,
          checkoutUrl: checkoutResponse.checkout_url,
          prefetchedSession: {
            sessionId: checkoutResponse.session_id,
            checkoutUrl: checkoutResponse.checkout_url,
          },
        },
      });
    } catch (paymentError) {
      await serviceRoleClient.from("orders").update({ status: "failed" }).eq("id", order.id);
      console.error("Stripe checkout error:", paymentError);
      return NextResponse.json({ error: "Failed to initiate payment" }, { status: 502 });
    }
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        *,
        orders!bookings_order_id_fkey (
          amount,
          status
        )
      `)
      .eq("user_id", user.id)
      .order("date_time", { ascending: false });

    if (error) {
      console.error("Bookings fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      bookings: bookings || [],
    });

  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
