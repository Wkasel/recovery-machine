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

    // Build query for referrals with user information
    let query = supabase
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
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: referrals, error } = await query;

    if (error) {
      console.error("Referrals query error:", error);
      return NextResponse.json({ error: "Failed to fetch referrals" }, { status: 500 });
    }

    // Transform data to include user info
    const transformedReferrals =
      referrals?.map((referral: any) => ({
        ...referral,
        referrer_email: referral.referrer?.email || null,
        invitee_name: referral.invitee?.full_name || null,
      })) || [];

    return NextResponse.json({
      referrals: transformedReferrals,
      total: transformedReferrals.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Admin referrals error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}