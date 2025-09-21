// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    // Get all referrals with user information
    const { data: referrals, error } = await supabase
      .from("referrals")
      .select(
        `
        *,
        referrer:profiles!referrals_referrer_id_fkey (
          email
        ),
        invitee:profiles!referrals_invitee_id_fkey (
          email,
          full_name
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Referrals export query error:", error);
      return NextResponse.json({ error: "Failed to export referrals" }, { status: 500 });
    }

    // Create CSV content
    const headers = [
      "ID",
      "Referrer Email",
      "Invitee Email", 
      "Invitee Name",
      "Status",
      "Reward Credits",
      "Credits Awarded",
      "Created Date",
      "Expires Date"
    ];

    const csvRows = [
      headers.join(","),
      ...referrals.map((referral: any) => [
        referral.id,
        referral.referrer?.email || "",
        referral.invitee_email,
        referral.invitee?.full_name || "",
        referral.status,
        referral.reward_credits,
        referral.credits_awarded_at || "",
        new Date(referral.created_at).toISOString().split('T')[0],
        new Date(referral.expires_at).toISOString().split('T')[0]
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="referrals-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Referrals export error:", error);
    return NextResponse.json({ error: "Failed to export referrals" }, { status: 500 });
  }
}