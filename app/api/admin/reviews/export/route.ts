// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    // Get all reviews with related data
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        profiles!reviews_user_id_fkey (
          email,
          full_name
        ),
        bookings!reviews_booking_id_fkey (
          date_time,
          add_ons
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Export query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch review data for export" },
        { status: 500 }
      );
    }

    // Process data for CSV export
    const csvData =
      reviews?.map((review: any) => ({
        id: review.id,
        user_email: review.profiles?.email || "",
        user_name: review.profiles?.full_name || "",
        reviewer_name: review.reviewer_name || "",
        rating: review.rating,
        comment: review.comment || "",
        is_featured: review.is_featured ? "Yes" : "No",
        google_synced: review.google_synced ? "Yes" : "No",
        booking_date: review.bookings?.date_time || "",
        service_type: review.bookings?.add_ons?.serviceType || "",
        created_at: review.created_at,
        updated_at: review.updated_at,
      })) || [];

    // Create CSV content
    const headers = [
      "ID",
      "User Email",
      "User Name",
      "Reviewer Name",
      "Rating",
      "Comment",
      "Featured",
      "Google Synced",
      "Booking Date",
      "Service Type",
      "Created At",
      "Updated At",
    ];

    const csvRows = [
      headers.join(","),
      ...csvData.map((row: any) =>
        [
          row.id,
          `"${row.user_email}"`,
          `"${(row.user_name || "").replace(/"/g, '""')}"`,
          `"${(row.reviewer_name || "").replace(/"/g, '""')}"`,
          row.rating,
          `"${(row.comment || "").replace(/"/g, '""')}"`,
          `"${row.is_featured}"`,
          `"${row.google_synced}"`,
          `"${row.booking_date}"`,
          `"${row.service_type}"`,
          `"${row.created_at}"`,
          `"${row.updated_at || ""}"`,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="reviews-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Reviews export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
