import { NextRequest, NextResponse } from 'next/server';
import { boltClient } from '@/lib/bolt/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PRICING, SUBSCRIPTION_CONFIG } from '@/lib/bolt/config';

// Create a new subscription
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
    const { plan = 'monthly', setup_fee_type = 'basic' } = body;

    // Validate plan
    if (plan !== 'monthly') {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Calculate amounts
    const subscriptionAmount = PRICING.MONTHLY_SUBSCRIPTION;
    const setupFeeAmount = PRICING.SETUP_FEES[setup_fee_type.toUpperCase() as keyof typeof PRICING.SETUP_FEES] || PRICING.SETUP_FEES.BASIC;
    const totalAmount = subscriptionAmount + setupFeeAmount;

    // Create order reference
    const orderReference = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Create subscription with Bolt
      const subscriptionResponse = await boltClient.createSubscription({
        email: profile.email,
        phone: profile.phone,
        amount: subscriptionAmount,
        interval: SUBSCRIPTION_CONFIG.INTERVAL,
        description: 'Recovery Machine Monthly Subscription',
        order_reference: orderReference,
      });

      // Create initial order record for setup fee + first month
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          amount: totalAmount,
          setup_fee_applied: setupFeeAmount,
          status: 'pending',
          order_type: 'subscription',
          metadata: {
            subscription_id: subscriptionResponse.subscription_id,
            plan,
            setup_fee_type,
            order_reference: orderReference,
            subscription_amount: subscriptionAmount,
            setup_fee_amount: setupFeeAmount,
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

      // Create checkout for initial payment
      const checkoutResponse = await boltClient.createCheckout({
        amount: totalAmount,
        currency: 'USD',
        order_reference: orderReference,
        description: `Recovery Machine Subscription + ${setup_fee_type} Setup Fee`,
        customer_email: profile.email,
        customer_phone: profile.phone,
        order_type: 'subscription',
        subscription_id: subscriptionResponse.subscription_id,
        metadata: {
          order_id: order.id,
          user_id: user.id,
          subscription_id: subscriptionResponse.subscription_id,
          includes_setup_fee: true,
        },
      });

      // Update order with checkout details
      await supabase
        .from('orders')
        .update({
          bolt_checkout_id: checkoutResponse.checkout_id,
          status: 'processing',
        })
        .eq('id', order.id);

      return NextResponse.json({
        success: true,
        subscription_id: subscriptionResponse.subscription_id,
        checkout_id: checkoutResponse.checkout_id,
        checkout_url: checkoutResponse.checkout_url,
        order_id: order.id,
        total_amount: totalAmount,
        subscription_amount: subscriptionAmount,
        setup_fee_amount: setupFeeAmount,
      });

    } catch (boltError) {
      console.error('Bolt subscription error:', boltError);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get subscription details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription_id');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'subscription_id parameter required' },
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

    // Get orders for this subscription
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .contains('metadata', { subscription_id: subscriptionId })
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Database error:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch subscription orders' },
        { status: 500 }
      );
    }

    // Get subscription details from Bolt
    try {
      const boltSubscription = await boltClient.getSubscription(subscriptionId);
      
      return NextResponse.json({
        subscription_id: subscriptionId,
        bolt_subscription: boltSubscription,
        orders: orders || [],
        total_orders: orders?.length || 0,
      });

    } catch (boltError) {
      console.error('Bolt subscription fetch error:', boltError);
      return NextResponse.json({
        subscription_id: subscriptionId,
        bolt_subscription: null,
        orders: orders || [],
        total_orders: orders?.length || 0,
        error: 'Could not fetch Bolt subscription details',
      });
    }

  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription_id');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'subscription_id parameter required' },
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

    // Verify user owns this subscription
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .contains('metadata', { subscription_id: subscriptionId })
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    try {
      // Cancel subscription with Bolt
      const cancelResponse = await boltClient.cancelSubscription(subscriptionId);

      // Update order status in database
      await supabase
        .from('orders')
        .update({
          status: 'refunded',
          metadata: {
            ...order.metadata,
            cancelled_at: new Date().toISOString(),
            cancellation_reason: 'user_request',
          },
        })
        .contains('metadata', { subscription_id: subscriptionId });

      return NextResponse.json({
        success: true,
        subscription_id: subscriptionId,
        cancellation: cancelResponse,
        message: 'Subscription cancelled successfully',
      });

    } catch (boltError) {
      console.error('Bolt cancellation error:', boltError);
      return NextResponse.json(
        { error: 'Failed to cancel subscription with payment provider' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}