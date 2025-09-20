// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    // Build query
    let query = supabase
      .from("bookings")
      .select(
        `
        *,
        profiles!bookings_user_id_fkey (
          email,
          phone
        ),
        orders!bookings_order_id_fkey (
          amount,
          status,
          order_type
        )
      `
      )
      .order("date_time", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (dateFrom) {
      query = query.gte("date_time", dateFrom);
    }

    if (dateTo) {
      query = query.lte("date_time", dateTo);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error("Bookings query error:", error);
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }

    // Transform data to include user info
    const transformedBookings =
      bookings?.map((booking: any) => ({
        ...booking,
        user_email: booking.profiles?.email || null,
        user_phone: booking.profiles?.phone || null,
        order_amount: booking.orders?.amount,
        order_status: booking.orders?.status,
      })) || [];

    return NextResponse.json({
      bookings: transformedBookings,
      total: transformedBookings.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Admin bookings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
