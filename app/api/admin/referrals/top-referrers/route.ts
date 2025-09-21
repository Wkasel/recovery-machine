// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await requireAdminAccess(request, "operator");
    const supabase = await createServerSupabaseClient();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Get top referrers with aggregated stats
    const { data: topReferrers, error } = await supabase
      .from("referrals")
      .select(
        `
        referrer_id,
        status,
        reward_credits,
        credits_awarded_at,
        profiles!referrals_referrer_id_fkey (
          email
        )
      `
      );

    if (error) {
      console.error("Top referrers query error:", error);
      return NextResponse.json({ error: "Failed to fetch top referrers" }, { status: 500 });
    }

    // Group by referrer and calculate stats
    const referrerStats = {};
    
    topReferrers?.forEach((referral: any) => {
      const referrerId = referral.referrer_id;
      const email = referral.profiles?.email || "Unknown";
      
      if (!referrerStats[referrerId]) {
        referrerStats[referrerId] = {
          referrer_id: referrerId,
          referrer_email: email,
          total_referrals: 0,
          successful_referrals: 0,
          total_credits_earned: 0,
          conversion_rate: 0,
        };
      }
      
      referrerStats[referrerId].total_referrals++;
      
      if (referral.status === "first_booking") {
        referrerStats[referrerId].successful_referrals++;
      }
      
      if (referral.credits_awarded_at) {
        referrerStats[referrerId].total_credits_earned += referral.reward_credits;
      }
    });

    // Calculate conversion rates and sort
    const processedReferrers = Object.values(referrerStats)
      .map((referrer: any) => ({
        ...referrer,
        conversion_rate: referrer.total_referrals > 0 
          ? (referrer.successful_referrals / referrer.total_referrals) * 100 
          : 0,
      }))
      .sort((a: any, b: any) => b.total_credits_earned - a.total_credits_earned)
      .slice(0, limit);

    return NextResponse.json({
      referrers: processedReferrers,
      total: processedReferrers.length,
    });
  } catch (error) {
    console.error("Top referrers error:", error);
    return NextResponse.json({ error: "Failed to fetch top referrers" }, { status: 500 });
  }
}