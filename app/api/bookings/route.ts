import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendBookingConfirmation } from "@/lib/services/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const {
      serviceType,
      dateTime,
      duration,
      address,
      addOns,
      specialInstructions,
      amount,
      setupFee,
      orderType = "one_time"
    } = body;

    // Validate required fields
    if (!serviceType || !dateTime || !address || amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: serviceType, dateTime, address, amount" },
        { status: 400 }
      );
    }

    // Create order first
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        amount: amount,
        setup_fee_applied: setupFee || 0,
        status: "paid", // For dev bookings, mark as paid
        order_type: orderType,
        metadata: {
          description: `Recovery Machine - ${serviceType} session`,
          customer_email: user.email,
          serviceType,
          dateTime,
          address,
          addOns,
          specialInstructions,
          setupFee,
          dev_bypass: true, // Mark this as a dev bypass order
        },
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        order_id: order.id,
        date_time: dateTime,
        duration: duration || 30,
        add_ons: {
          serviceType,
          extraVisits: addOns?.extraVisits || 0,
          familyMembers: addOns?.familyMembers || 0,
          extendedTime: addOns?.extendedTime || 0,
        },
        location_address: address,
        special_instructions: specialInstructions,
        status: "confirmed", // Immediately confirmed for dev bookings
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking creation error:", bookingError);
      // Clean up the order if booking creation fails
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    console.log("✅ Booking created successfully:", booking.id);

    // Send booking confirmation email
    try {
      if (user.email) {
        // Create a profile object with the user's auth email (source of truth)
        const profileForEmail = { email: user.email };
        await sendBookingConfirmation(booking, profileForEmail);
        console.log("✅ Booking confirmation email sent to:", user.email);
      }
    } catch (emailError) {
      console.error("❌ Failed to send booking confirmation email:", emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      booking,
      order,
      message: "Booking created successfully! Check your email for confirmation.",
    });

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
          status,
          order_type
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