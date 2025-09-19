import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get date range (last 30 days by default)
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Execute multiple queries in parallel
    const [
      totalRevenueResult,
      totalOrdersResult,
      activeSubscriptionsResult,
      monthlyRecurringResult,
      refundDataResult,
    ] = await Promise.all([
      // Total revenue from paid orders
      supabase
        .from('orders')
        .select('amount')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString()),

      // Total orders count
      supabase
        .from('orders')
        .select('id', { count: 'exact' })
        .gte('created_at', startDate.toISOString()),

      // Active subscriptions (orders with subscription_id in metadata and paid status)
      supabase
        .from('orders')
        .select('metadata')
        .eq('status', 'paid')
        .eq('order_type', 'subscription')
        .not('metadata->subscription_id', 'is', null),

      // Monthly recurring revenue (subscription orders from last month)
      supabase
        .from('orders')
        .select('amount')
        .eq('status', 'paid')
        .eq('order_type', 'subscription')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

      // Refund data
      supabase
        .from('orders')
        .select('amount')
        .eq('status', 'refunded')
        .gte('created_at', startDate.toISOString()),
    ]);

    // Calculate statistics
    const totalRevenue = totalRevenueResult.data?.reduce((sum, order) => sum + order.amount, 0) || 0;
    const totalOrders = totalOrdersResult.count || 0;
    const activeSubscriptions = activeSubscriptionsResult.data?.length || 0;
    const monthlyRecurring = monthlyRecurringResult.data?.reduce((sum, order) => sum + order.amount, 0) || 0;
    const refundedAmount = refundDataResult.data?.reduce((sum, order) => sum + order.amount, 0) || 0;
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const refundRate = totalRevenue > 0 ? (refundedAmount / totalRevenue) * 100 : 0;

    // Get recent order trends (last 7 days)
    const recentOrdersResult = await supabase
      .from('orders')
      .select('created_at, amount, status')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true });

    // Group by day for trend analysis
    const dailyStats = {};
    recentOrdersResult.data?.forEach(order => {
      const day = order.created_at.split('T')[0];
      if (!dailyStats[day]) {
        dailyStats[day] = { orders: 0, revenue: 0, paid: 0 };
      }
      dailyStats[day].orders += 1;
      if (order.status === 'paid') {
        dailyStats[day].revenue += order.amount;
        dailyStats[day].paid += 1;
      }
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      activeSubscriptions,
      monthlyRecurring,
      averageOrderValue: Math.round(averageOrderValue),
      refundRate: Math.round(refundRate * 100) / 100,
      refundedAmount,
      dailyStats,
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}