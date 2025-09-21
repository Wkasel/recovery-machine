// @ts-nocheck
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminAccess } from "@/utils/admin/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await requireAdminAccess(null, "operator");
    const supabase = await createServerSupabaseClient();

    // Get current and previous month dates for growth calculations
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Revenue stats
    const { data: totalRevenue } = await supabase
      .from("orders")
      .select("amount")
      .eq("status", "paid");

    const { data: monthlyRevenue } = await supabase
      .from("orders")
      .select("amount")
      .eq("status", "paid")
      .gte("created_at", currentMonthStart.toISOString());

    const { data: previousMonthRevenue } = await supabase
      .from("orders")
      .select("amount")
      .eq("status", "paid")
      .gte("created_at", previousMonthStart.toISOString())
      .lt("created_at", currentMonthStart.toISOString());

    // User stats
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: monthlyUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", currentMonthStart.toISOString());

    const { count: previousMonthUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", previousMonthStart.toISOString())
      .lt("created_at", currentMonthStart.toISOString());

    // Booking stats
    const { count: totalBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });

    const { count: monthlyBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", currentMonthStart.toISOString());

    const { count: previousMonthBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", previousMonthStart.toISOString())
      .lt("created_at", currentMonthStart.toISOString());

    const { count: pendingBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "scheduled");

    const { count: confirmedBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed");

    const { count: completedBookings } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed");

    // Review stats
    const { data: reviews } = await supabase.from("reviews").select("rating, is_featured");

    const { count: activeReferrals } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: convertedReferrals } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true })
      .eq("status", "first_booking");

    const { count: totalReferrals } = await supabase
      .from("referrals")
      .select("*", { count: "exact", head: true });

    // Calculate aggregated values
    const totalRevenueAmount = totalRevenue?.reduce((sum, order) => sum + order.amount, 0) || 0;
    const monthlyRevenueAmount = monthlyRevenue?.reduce((sum, order) => sum + order.amount, 0) || 0;
    const previousMonthRevenueAmount =
      previousMonthRevenue?.reduce((sum, order) => sum + order.amount, 0) || 0;

    const averageRating = reviews?.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    const featuredReviews = reviews?.filter((review) => review.is_featured).length || 0;

    // Calculate growth percentages
    const revenueGrowth =
      previousMonthRevenueAmount > 0
        ? ((monthlyRevenueAmount - previousMonthRevenueAmount) / previousMonthRevenueAmount) * 100
        : 0;

    const userGrowth =
      (previousMonthUsers || 0) > 0
        ? (((monthlyUsers || 0) - (previousMonthUsers || 0)) / (previousMonthUsers || 0)) * 100
        : 0;

    const bookingGrowth =
      (previousMonthBookings || 0) > 0
        ? (((monthlyBookings || 0) - (previousMonthBookings || 0)) / (previousMonthBookings || 0)) *
          100
        : 0;

    const conversionRate =
      (totalReferrals || 0) > 0 ? ((convertedReferrals || 0) / (totalReferrals || 0)) * 100 : 0;

    const stats = {
      revenue: {
        total: totalRevenueAmount,
        monthly: monthlyRevenueAmount,
        growth: Math.round(revenueGrowth * 100) / 100,
      },
      users: {
        total: totalUsers || 0,
        monthly: monthlyUsers || 0,
        growth: Math.round(userGrowth * 100) / 100,
      },
      bookings: {
        total: totalBookings || 0,
        monthly: monthlyBookings || 0,
        growth: Math.round(bookingGrowth * 100) / 100,
        pending: pendingBookings || 0,
        confirmed: confirmedBookings || 0,
        completed: completedBookings || 0,
      },
      reviews: {
        average: Math.round(averageRating * 10) / 10,
        total: reviews?.length || 0,
        featured: featuredReviews,
      },
      referrals: {
        active: activeReferrals || 0,
        converted: convertedReferrals || 0,
        conversion_rate: Math.round(conversionRate * 100) / 100,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 });
  }
}
