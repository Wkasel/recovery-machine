// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    // Get referral counts by status
    const { count: totalReferrals } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true });

    const { count: activeReferrals } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: successfulReferrals } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("status", "first_booking");

    const { count: expiredReferrals } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("status", "expired");

    // Get total credits awarded
    const { data: awardedReferrals } = await supabase
      .from("referrals")
      .select("reward_credits")
      .not("credits_awarded_at", "is", null);

    const totalCreditsAwarded = awardedReferrals?.reduce(
      (sum, ref) => sum + ref.reward_credits,
      0
    ) || 0;

    // Calculate conversion rate
    const conversionRate = totalReferrals > 0 
      ? ((successfulReferrals || 0) / totalReferrals) * 100 
      : 0;

    const stats = {
      total_referrals: totalReferrals || 0,
      active_referrals: activeReferrals || 0,
      successful_referrals: successfulReferrals || 0,
      expired_referrals: expiredReferrals || 0,
      total_credits_awarded: totalCreditsAwarded,
      average_conversion_rate: Math.round(conversionRate * 100) / 100,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Referral stats error:", error);
    return NextResponse.json({ error: "Failed to fetch referral statistics" }, { status: 500 });
  }
}