// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Check if user is admin
    const { data: admin } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const status = searchParams.get("status");

    // Build query for export
    let query = supabase
      .from("orders")
      .select(
        `
        id,
        user_id,
        bolt_checkout_id,
        amount,
        setup_fee_applied,
        status,
        order_type,
        metadata,
        created_at,
        updated_at,
        profiles!orders_user_id_fkey (
          email,
          phone
        )
      `
      )
      .order("created_at", { ascending: false });

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error("Export query error:", ordersError);
      return NextResponse.json({ error: "Failed to fetch orders for export" }, { status: 500 });
    }

    // Generate CSV content
    const csvHeaders = [
      "Order ID",
      "Customer Email",
      "Customer Phone",
      "Amount (USD)",
      "Setup Fee (USD)",
      "Status",
      "Order Type",
      "Bolt Checkout ID",
      "Transaction ID",
      "Subscription ID",
      "Created At",
      "Updated At",
    ];

    const csvRows =
      orders?.map((order) => {
        const formatAmount = (cents: number) => (cents / 100).toFixed(2);

        return [
          order.id,
          order.profiles?.email || order.metadata?.customer_email || "",
          order.profiles?.phone || order.metadata?.customer_phone || "",
          formatAmount(order.amount),
          formatAmount(order.setup_fee_applied || 0),
          order.status,
          order.order_type,
          order.bolt_checkout_id || "",
          order.metadata?.transaction_id || "",
          order.metadata?.subscription_id || "",
          new Date(order.created_at).toLocaleString(),
          new Date(order.updated_at).toLocaleString(),
        ];
      }) || [];

    // Create CSV content
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) =>
        row
          .map((field) => (typeof field === "string" && field.includes(",") ? `"${field}"` : field))
          .join(",")
      ),
    ].join("\n");

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="payments-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
