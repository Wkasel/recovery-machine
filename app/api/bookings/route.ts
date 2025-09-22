import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendBookingConfirmation } from "@/lib/services/email";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guestBooking, guestEmail, guestPhone } = body;
    
    const supabase = await createServerSupabaseClient();
    const serviceRoleClient = createServiceRoleClient();
    
    let user = null;
    
    // Handle authentication for existing users or guest bookings
    if (!guestBooking) {
      // Existing flow - require authentication
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }
      user = authUser;
    } else {
      // Guest booking - create account automatically
      if (!guestEmail || !guestPhone) {
        return NextResponse.json({ 
          error: "Email and phone are required for guest bookings" 
        }, { status: 400 });
      }
      
      // Check if user already exists with this email
      const { data: existingUser } = await serviceRoleClient.auth.admin.listUsers();
      const userExists = existingUser?.users?.find(u => u.email === guestEmail);
      
      if (userExists) {
        // User exists, use their account
        user = userExists;
      } else {
        // Create new user account
        const { data: newUser, error: createError } = await serviceRoleClient.auth.admin.createUser({
          email: guestEmail,
          email_confirm: true, // Auto-confirm for guest bookings
          user_metadata: {
            phone: guestPhone,
            auto_created: true,
          }
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
      orderType = "one_time"
    } = body;

    // Validate required fields
    if (!serviceType || !dateTime || !address || amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: serviceType, dateTime, address, amount" },
        { status: 400 }
      );
    }

    // Ensure duration is positive (constraint: duration > 0)
    const bookingDuration = Math.max(1, duration || 30);
    
    // Check for overlapping bookings for this user
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
    
    // Check for overlaps
    const hasOverlap = existingBookings?.some(booking => {
      const bookingStart = new Date(booking.date_time);
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60000);
      return startTime < bookingEnd && endTime > bookingStart;
    });
    
    if (hasOverlap) {
      return NextResponse.json({ 
        error: "You already have a booking that overlaps with this time slot" 
      }, { status: 409 });
    }

    // Ensure user profile exists (required for referral triggers and credit updates)
    const { data: existingProfile } = await serviceRoleClient
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();
    
    if (!existingProfile) {
      // Create profile if it doesn't exist
      const { error: profileError } = await serviceRoleClient
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email || "",
          phone: guestBooking ? guestPhone : "",
          credits: 0
        });
      
      if (profileError) {
        console.error("Failed to create user profile:", profileError);
        return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 });
      }
    }

    // For dev bypass, use minimum amount to satisfy constraint
    const devBypassAmount = amount === 0 ? 1 : parseInt(amount) || 1;
    
    const orderData = {
      user_id: user.id,
      amount: devBypassAmount,
      setup_fee_applied: parseInt(setupFee) || 0,
      status: "paid", // For dev bookings, mark as paid
      metadata: {
        description: `Recovery Machine - ${serviceType} session`,
        customer_email: user.email,
        serviceType,
        dateTime,
        address,
        addOns,
        specialInstructions,
        setupFee,
        dev_bypass: true,
        original_amount: amount, // Store original amount for reference
      },
    };

    console.log("🔍 Creating order with full data:", orderData);
    console.log("🔍 Amount processing:", { 
      originalAmount: amount, 
      finalAmount: devBypassAmount,
      type: typeof amount, 
      isNaN: isNaN(amount),
      parsed: parseInt(amount)
    });

    // Create order first using service role to bypass RLS
    const { data: order, error: orderError } = await serviceRoleClient
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create booking with all required fields per actual schema
    console.log("🔍 Creating booking with address:", address);
    console.log("🔍 Service type:", serviceType);
    
    // Map frontend serviceType to database service_type format
    let dbServiceType = serviceType;
    if (serviceType === "combo_package") {
      dbServiceType = "combo"; // Database expects 'combo' not 'combo_package'
    }
    
    const { data: booking, error: bookingError } = await serviceRoleClient
      .from("bookings") 
      .insert({
        user_id: user.id,
        order_id: order.id,
        date_time: dateTime,
        duration: bookingDuration, // Ensure > 0
        service_type: dbServiceType, // Required NOT NULL field
        add_ons: {
          serviceType: serviceType, // Keep original in add_ons for reference
          extraVisits: addOns?.extraVisits || 0,
          familyMembers: addOns?.familyMembers || 0,
          extendedTime: addOns?.extendedTime || 0,
        },
        address: address, // Required NOT NULL JSONB field  
        notes: specialInstructions, // Column is 'notes' not 'special_instructions'
        status: "confirmed", // Immediately confirmed for dev bookings
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking creation error:", bookingError);
      // Clean up the order if booking creation fails (use same service role client)
      await serviceRoleClient.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    console.log("✅ Booking created successfully:", booking.id);

    // Generate public confirmation token
    const confirmationToken = createHash("sha256")
      .update(`${booking.id}-${booking.created_at}`)
      .digest("hex")
      .substring(0, 16);

    const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/booking/${booking.id}/confirmation?token=${confirmationToken}`;

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
      confirmationUrl,
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