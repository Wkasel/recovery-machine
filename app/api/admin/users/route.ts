// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");

    // Build query for profiles
    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply search filter if provided
    if (search) {
      query = query.or(
        `email.ilike.%${search}%,phone.ilike.%${search}%,referral_code.ilike.%${search}%`
      );
    }

    const { data: profiles, error: profilesError } = await query;

    if (profilesError) {
      console.error("Profiles query error:", profilesError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // Get booking counts for each user
    const userIds = profiles?.map((p) => p.id) || [];

    let bookingCounts: Record<string, number> = {};
    let orderCounts: Record<string, number> = {};
    let totalSpent: Record<string, number> = {};

    if (userIds.length > 0) {
      // Get booking counts
      const { data: bookings } = await supabase
        .from("bookings")
        .select("user_id")
        .in("user_id", userIds);

      bookings?.forEach((booking) => {
        bookingCounts[booking.user_id] = (bookingCounts[booking.user_id] || 0) + 1;
      });

      // Get order counts and total spent
      const { data: orders } = await supabase
        .from("orders")
        .select("user_id, amount, status")
        .in("user_id", userIds);

      orders?.forEach((order) => {
        orderCounts[order.user_id] = (orderCounts[order.user_id] || 0) + 1;
        if (order.status === "paid") {
          totalSpent[order.user_id] = (totalSpent[order.user_id] || 0) + order.amount;
        }
      });
    }

    // Transform data to include activity stats
    const users = profiles?.map((profile) => ({
      ...profile,
      booking_count: bookingCounts[profile.id] || 0,
      order_count: orderCounts[profile.id] || 0,
      total_spent: totalSpent[profile.id] || 0,
    })) || [];

    return NextResponse.json({
      users,
      total: users.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
