// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/lib/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");
    const orderType = searchParams.get("order_type");

    // Build query
    let query = supabase
      .from("orders")
      .select(
        `
        *,
        profiles!orders_user_id_fkey (
          email,
          phone
        )
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (orderType && orderType !== "all") {
      query = query.eq("order_type", orderType);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error("Orders query error:", ordersError);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    // Transform data to include customer info
    const transformedOrders =
      orders?.map((order) => ({
        ...order,
        customer_email: order.profiles?.email || order.metadata?.customer_email,
        customer_phone: order.profiles?.phone || order.metadata?.customer_phone,
      })) || [];

    return NextResponse.json({
      orders: transformedOrders,
      total: transformedOrders.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
