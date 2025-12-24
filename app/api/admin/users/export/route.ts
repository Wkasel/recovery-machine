// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    // Get all users/profiles
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Export query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch user data for export" },
        { status: 500 }
      );
    }

    // Process data for CSV export
    const csvData =
      profiles?.map((profile: any) => ({
        id: profile.id,
        email: profile.email || "",
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: JSON.stringify(profile.address || {}),
        referral_code: profile.referral_code || "",
        credits: profile.credits || 0,
        stripe_customer_id: profile.stripe_customer_id || "",
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      })) || [];

    // Create CSV content
    const headers = [
      "ID",
      "Email",
      "Full Name",
      "Phone",
      "Address",
      "Referral Code",
      "Credits",
      "Stripe Customer ID",
      "Created At",
      "Updated At",
    ];

    const csvRows = [
      headers.join(","),
      ...csvData.map((row: any) =>
        [
          row.id,
          `"${row.email}"`,
          `"${(row.full_name || "").replace(/"/g, '""')}"`,
          `"${row.phone}"`,
          `"${row.address.replace(/"/g, '""')}"`,
          `"${row.referral_code}"`,
          row.credits,
          `"${row.stripe_customer_id}"`,
          `"${row.created_at}"`,
          `"${row.updated_at}"`,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="users-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Users export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
