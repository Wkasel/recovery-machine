import { NextRequest, NextResponse } from 'next/server';
import { boltClient } from '@/lib/bolt/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Process a refund
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { order_id, amount, reason = 'customer_request' } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: 'order_id is required' },
        { status: 400 }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is eligible for refund
    if (order.status !== 'paid') {
      return NextResponse.json(
        { error: 'Order is not eligible for refund' },
        { status: 400 }
      );
    }

    if (!order.bolt_checkout_id) {
      return NextResponse.json(
        { error: 'No payment information found for this order' },
        { status: 400 }
      );
    }

    // Validate refund amount
    const refundAmount = amount || order.amount;
    if (refundAmount > order.amount) {
      return NextResponse.json(
        { error: 'Refund amount cannot exceed original payment amount' },
        { status: 400 }
      );
    }

    try {
      // Process refund with Bolt
      const refundResponse = await boltClient.processRefund(
        order.bolt_checkout_id,
        refundAmount
      );

      // Update order status
      await supabase
        .from('orders')
        .update({
          status: 'refunded',
          metadata: {
            ...order.metadata,
            refund_id: refundResponse.refund_id,
            refund_amount: refundAmount,
            refund_reason: reason,
            refunded_at: new Date().toISOString(),
          },
        })
        .eq('id', order_id);

      return NextResponse.json({
        success: true,
        refund_id: refundResponse.refund_id,
        refund_amount: refundAmount,
        original_amount: order.amount,
        message: 'Refund processed successfully',
      });

    } catch (boltError) {
      console.error('Bolt refund error:', boltError);
      return NextResponse.json(
        { error: 'Failed to process refund with payment provider' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Refund processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get refund status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'order_id parameter required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order_id: orderId,
      status: order.status,
      original_amount: order.amount,
      refund_amount: order.metadata?.refund_amount || null,
      refund_id: order.metadata?.refund_id || null,
      refunded_at: order.metadata?.refunded_at || null,
      refund_reason: order.metadata?.refund_reason || null,
    });

  } catch (error) {
    console.error('Refund status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}