import { NextResponse } from 'next/server';
import { requireAdminAccess } from '@/utils/admin/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    await requireAdminAccess('operator');
    const supabase = createServerSupabaseClient();

    // Get recent activities from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Recent bookings
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select(`
        id,
        created_at,
        status,
        profiles!bookings_user_id_fkey (email)
      `)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Recent orders/payments
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        status,
        order_type,
        created_at,
        profiles!orders_user_id_fkey (email)
      `)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Recent reviews
    const { data: recentReviews } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        created_at,
        profiles!reviews_user_id_fkey (email)
      `)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Recent referrals
    const { data: recentReferrals } = await supabase
      .from('referrals')
      .select(`
        id,
        status,
        invitee_email,
        created_at,
        profiles!referrals_referrer_id_fkey (email)
      `)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Combine and format activities
    const activities = [];

    // Add booking activities
    recentBookings?.forEach(booking => {
      activities.push({
        id: booking.id,
        type: 'booking',
        description: `New booking ${booking.status}`,
        user_email: booking.profiles?.email || 'Unknown',
        created_at: booking.created_at,
      });
    });

    // Add payment activities
    recentOrders?.forEach(order => {
      activities.push({
        id: order.id,
        type: 'payment',
        description: `${order.order_type} payment ${order.status}`,
        user_email: order.profiles?.email || 'Unknown',
        amount: order.amount,
        created_at: order.created_at,
      });
    });

    // Add review activities
    recentReviews?.forEach(review => {
      activities.push({
        id: review.id,
        type: 'review',
        description: `New ${review.rating}-star review`,
        user_email: review.profiles?.email || 'Unknown',
        created_at: review.created_at,
      });
    });

    // Add referral activities
    recentReferrals?.forEach(referral => {
      activities.push({
        id: referral.id,
        type: 'referral',
        description: `Referral ${referral.status} for ${referral.invitee_email}`,
        user_email: referral.profiles?.email || 'Unknown',
        created_at: referral.created_at,
      });
    });

    // Sort by date and limit to 20 most recent
    activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const limitedActivities = activities.slice(0, 20);

    return NextResponse.json({
      activities: limitedActivities,
      total: limitedActivities.length,
    });

  } catch (error) {
    console.error('Dashboard activity error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}