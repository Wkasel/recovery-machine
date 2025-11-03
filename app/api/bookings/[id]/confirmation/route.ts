import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const bookingId = params.id;

    if (!token || !bookingId) {
      return NextResponse.json(
        { error: "Missing booking ID or token" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS for public access
    const supabase = createServiceRoleClient();

    // Fetch booking with order details
    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        *,
        orders!bookings_order_id_fkey (
          amount,
          status,
          setup_fee_applied
        )
      `)
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      console.error("Booking fetch error:", error);
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify token - simple hash of booking ID + creation date for security
    const expectedToken = createHash("sha256")
      .update(`${booking.id}-${booking.created_at}`)
      .digest("hex")
      .substring(0, 16);

    if (token !== expectedToken) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Return booking data (no sensitive user info)
    const publicBookingData = {
      id: booking.id,
      user_id: booking.user_id,
      order_id: booking.order_id,
      date_time: booking.date_time,
      duration: booking.duration,
      service_type: booking.service_type,
      add_ons: booking.add_ons,
      status: booking.status,
      location_address: booking.location_address,
      special_instructions: booking.special_instructions,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      orders: booking.orders,
    };

    return NextResponse.json({
      success: true,
      booking: publicBookingData,
    });

  } catch (error) {
    console.error("Booking confirmation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}