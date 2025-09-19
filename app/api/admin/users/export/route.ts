import { NextResponse } from 'next/server';
import { requireAdminAccess } from '@/utils/admin/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    await requireAdminAccess('operator');
    const supabase = createServerSupabaseClient();

    // Get all users with aggregated data
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        *,
        order_count:orders(count),
        booking_count:bookings(count),
        total_spent:orders!orders_user_id_fkey(amount)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Export query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user data for export' },
        { status: 500 }
      );
    }

    // Process data for CSV export
    const csvData = profiles?.map(profile => {
      const totalSpent = profile.total_spent
        ?.filter((order: any) => order.amount)
        .reduce((sum: number, order: any) => sum + order.amount, 0) || 0;

      return {
        id: profile.id,
        email: profile.email,
        phone: profile.phone || '',
        address: profile.address ? JSON.stringify(profile.address) : '',
        referral_code: profile.referral_code,
        credits: profile.credits,
        order_count: profile.order_count?.[0]?.count || 0,
        booking_count: profile.booking_count?.[0]?.count || 0,
        total_spent_cents: totalSpent,
        total_spent_dollars: (totalSpent / 100).toFixed(2),
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      };
    }) || [];

    // Create CSV content
    const headers = [
      'ID',
      'Email',
      'Phone',
      'Address',
      'Referral Code',
      'Credits',
      'Order Count',
      'Booking Count',
      'Total Spent (Cents)',
      'Total Spent (Dollars)',
      'Created At',
      'Updated At',
    ];

    const csvRows = [
      headers.join(','),
      ...csvData.map(row => [
        row.id,
        `"${row.email}"`,
        `"${row.phone}"`,
        `"${row.address.replace(/"/g, '""')}"`,
        `"${row.referral_code}"`,
        row.credits,
        row.order_count,
        row.booking_count,
        row.total_spent_cents,
        row.total_spent_dollars,
        `"${row.created_at}"`,
        `"${row.updated_at}"`,
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });

  } catch (error) {
    console.error('Users export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}