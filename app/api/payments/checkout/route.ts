import { NextRequest, NextResponse } from 'next/server';
import { boltClient } from '@/lib/bolt/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { type BoltOrderData } from '@/lib/bolt/config';

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

    const body: BoltOrderData = await request.json();

    // Validate required fields
    const requiredFields = ['amount', 'currency', 'order_reference', 'description', 'customer_email', 'order_type'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create order in database first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        amount: body.amount,
        setup_fee_applied: body.order_type === 'setup_fee' ? body.amount : 0,
        status: 'pending',
        order_type: body.order_type,
        metadata: {
          description: body.description,
          customer_email: body.customer_email,
          customer_phone: body.customer_phone,
          order_reference: body.order_reference,
          ...body.metadata,
        },
      })
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order record' },
        { status: 500 }
      );
    }

    try {
      // Create Bolt checkout session
      const checkoutResponse = await boltClient.createCheckout({
        ...body,
        metadata: {
          ...body.metadata,
          order_id: order.id,
          user_id: user.id,
        },
      });

      // Update order with Bolt checkout ID
      await supabase
        .from('orders')
        .update({
          bolt_checkout_id: checkoutResponse.checkout_id,
          status: 'processing',
        })
        .eq('id', order.id);

      return NextResponse.json({
        success: true,
        checkout_id: checkoutResponse.checkout_id,
        checkout_url: checkoutResponse.checkout_url,
        order_id: order.id,
      });

    } catch (boltError) {
      // Update order status to failed
      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', order.id);

      console.error('Bolt API error:', boltError);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get checkout status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get('checkout_id');

    if (!checkoutId) {
      return NextResponse.json(
        { error: 'checkout_id parameter required' },
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

    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('bolt_checkout_id', checkoutId)
      .eq('user_id', user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get status from Bolt
    try {
      const boltStatus = await boltClient.getOrderStatus(checkoutId);
      
      return NextResponse.json({
        order_id: order.id,
        checkout_id: checkoutId,
        status: order.status,
        amount: order.amount,
        bolt_status: boltStatus,
      });

    } catch (boltError) {
      console.error('Bolt status error:', boltError);
      return NextResponse.json({
        order_id: order.id,
        checkout_id: checkoutId,
        status: order.status,
        amount: order.amount,
        bolt_status: null,
        error: 'Could not fetch Bolt status',
      });
    }

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}