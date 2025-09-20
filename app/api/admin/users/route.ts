// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess("operator");
    const supabase = createServerSupabaseClient();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");

    // Build query to get users with aggregated data
    let query = supabase
      .from("profiles")
      .select(
        `
        *,
        order_count:orders(count),
        booking_count:bookings(count),
        total_spent:orders!orders_user_id_fkey(amount)
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(
        `email.ilike.%${search}%, phone.ilike.%${search}%, referral_code.ilike.%${search}%`
      );
    }

    const { data: profiles, error } = await query;

    if (error) {
      console.error("Users query error:", error);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // Process the data to calculate aggregated values
    const users =
      profiles?.map((profile) => {
        // Calculate total spent from paid orders
        const totalSpent =
          profile.total_spent
            ?.filter((order: any) => order.amount)
            .reduce((sum: number, order: any) => sum + order.amount, 0) || 0;

        return {
          ...profile,
          order_count: profile.order_count?.[0]?.count || 0,
          booking_count: profile.booking_count?.[0]?.count || 0,
          total_spent: totalSpent,
        };
      }) || [];

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
