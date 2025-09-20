// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    // Get all bookings with related data
    const { data: bookings, error } = await supabase
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
      .order("date_time", { ascending: false });

    if (error) {
      console.error("Export query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch booking data for export" },
        { status: 500 }
      );
    }

    // Process data for CSV export
    const csvData =
      bookings?.map((booking: any) => ({
        id: booking.id,
        user_email: booking.profiles?.email || "",
        user_phone: booking.profiles?.phone || "",
        date_time: booking.date_time,
        duration: booking.duration,
        status: booking.status,
        add_ons: JSON.stringify(booking.add_ons || {}),
        location_address: JSON.stringify(booking.location_address || {}),
        special_instructions: booking.special_instructions || "",
        order_amount: booking.orders?.amount || 0,
        order_status: booking.orders?.status || "",
        order_type: booking.orders?.order_type || "",
        created_at: booking.created_at,
        updated_at: booking.updated_at,
      })) || [];

    // Create CSV content
    const headers = [
      "ID",
      "Customer Email",
      "Phone",
      "Date Time",
      "Duration (min)",
      "Status",
      "Add-ons",
      "Location",
      "Special Instructions",
      "Order Amount (cents)",
      "Order Status",
      "Order Type",
      "Created At",
      "Updated At",
    ];

    const csvRows = [
      headers.join(","),
      ...csvData.map((row: any) =>
        [
          row.id,
          `"${row.user_email}"`,
          `"${row.user_phone}"`,
          `"${row.date_time}"`,
          row.duration,
          `"${row.status}"`,
          `"${row.add_ons.replace(/"/g, '""')}"`,
          `"${row.location_address.replace(/"/g, '""')}"`,
          `"${row.special_instructions.replace(/"/g, '""')}"`,
          row.order_amount,
          `"${row.order_status}"`,
          `"${row.order_type}"`,
          `"${row.created_at}"`,
          `"${row.updated_at}"`,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="bookings-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Bookings export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
