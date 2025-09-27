// @ts-nocheck
import { boltClient } from "@/lib/bolt/client";
import { createServiceSupabaseClient } from "@/utils/supabase/service";
import { NextRequest, NextResponse } from "next/server";

// Webhook event types from Bolt
interface BoltWebhookEvent {
  event_type: string;
  data: {
    checkout_id?: string;
    subscription_id?: string;
    transaction_id?: string;
    status?: string;
    amount?: number;
    currency?: string;
    metadata?: Record<string, any>;
    error?: string;
    refund_id?: string;
  };
  created_at: string;
  webhook_id: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get("bolt-signature") || "";

    // Verify webhook signature
    if (!boltClient.verifyWebhookSignature(rawBody, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event: BoltWebhookEvent = JSON.parse(rawBody);
    console.log("Bolt webhook received:", event.event_type, event.data);

    // Initialize Supabase service client (bypasses RLS for webhook processing)
    const supabase = createServiceSupabaseClient();

    switch (event.event_type) {
      case "checkout.completed":
        await handleCheckoutCompleted(event, supabase);
        break;

      case "checkout.failed":
        await handleCheckoutFailed(event, supabase);
        break;

      case "subscription.created":
        await handleSubscriptionCreated(event, supabase);
        break;

      case "subscription.payment_succeeded":
        await handleSubscriptionPaymentSucceeded(event, supabase);
        break;

      case "subscription.payment_failed":
        await handleSubscriptionPaymentFailed(event, supabase);
        break;

      case "subscription.cancelled":
        await handleSubscriptionCancelled(event, supabase);
        break;

      case "refund.created":
        await handleRefundCreated(event, supabase);
        break;

      default:
        console.log("Unhandled webhook event type:", event.event_type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(event: BoltWebhookEvent, supabase: any) {
  const { checkout_id, transaction_id, amount, metadata } = event.data;

  if (!checkout_id) {
    console.error("No checkout_id in checkout.completed event");
    return;
  }

  try {
    // Update order status
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        metadata: {
          ...metadata,
          transaction_id,
          completed_at: event.created_at,
          webhook_processed_at: new Date().toISOString(),
        },
      })
      .eq("bolt_checkout_id", checkout_id)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update order:", updateError);
      return;
    }

    console.log("Order marked as paid:", order.id);

    // Update booking status to confirmed when payment is successful
    if (metadata?.bookingId || metadata?.booking_id) {
      const bookingId = metadata.bookingId || metadata.booking_id;

      const { error: bookingError } = await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .eq("order_id", order.id);

      if (bookingError) {
        console.error("Failed to update booking status:", bookingError);
      } else {
        console.log("Booking confirmed:", bookingId);
      }
    }

    // If this is a subscription order, handle additional logic
    if (order.order_type === "subscription" && metadata?.subscription_id) {
      await handleSubscriptionActivation(order, supabase);
    }

    // Send confirmation email (implement email service)
    await sendPaymentConfirmationEmail(order);
  } catch (error) {
    console.error("Error handling checkout completion:", error);
  }
}

async function handleCheckoutFailed(event: BoltWebhookEvent, supabase: any) {
  const { checkout_id, error: paymentError } = event.data;

  if (!checkout_id) {
    console.error("No checkout_id in checkout.failed event");
    return;
  }

  try {
    await supabase
      .from("orders")
      .update({
        status: "failed",
        metadata: {
          error: paymentError,
          failed_at: event.created_at,
          webhook_processed_at: new Date().toISOString(),
        },
      })
      .eq("bolt_checkout_id", checkout_id);

    console.log("Order marked as failed:", checkout_id);
  } catch (error) {
    console.error("Error handling checkout failure:", error);
  }
}

async function handleSubscriptionCreated(event: BoltWebhookEvent, supabase: any) {
  const { subscription_id, metadata } = event.data;

  console.log("Subscription created:", subscription_id);

  // Additional subscription setup logic can be added here
  // For example, granting access to subscription features
}

async function handleSubscriptionPaymentSucceeded(event: BoltWebhookEvent, supabase: any) {
  const { subscription_id, transaction_id, amount } = event.data;

  if (!subscription_id) {
    console.error("No subscription_id in subscription.payment_succeeded event");
    return;
  }

  try {
    // Create a new order record for the recurring payment
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("user_id, metadata")
      .contains("metadata", { subscription_id })
      .limit(1)
      .single();

    if (existingOrder) {
      const orderReference = `recurring_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await supabase.from("orders").insert({
        user_id: existingOrder.user_id,
        amount: amount || 0,
        setup_fee_applied: 0,
        status: "paid",
        order_type: "subscription",
        metadata: {
          subscription_id,
          transaction_id,
          order_reference: orderReference,
          is_recurring: true,
          payment_date: event.created_at,
          webhook_processed_at: new Date().toISOString(),
        },
      });

      console.log("Recurring payment recorded for subscription:", subscription_id);
    }
  } catch (error) {
    console.error("Error handling subscription payment:", error);
  }
}

async function handleSubscriptionPaymentFailed(event: BoltWebhookEvent, supabase: any) {
  const { subscription_id, error: paymentError } = event.data;

  console.log("Subscription payment failed:", subscription_id, paymentError);

  // Implement retry logic, grace period handling, etc.
  // Could send notification emails, update user access, etc.
}

async function handleSubscriptionCancelled(event: BoltWebhookEvent, supabase: any) {
  const { subscription_id } = event.data;

  if (!subscription_id) {
    console.error("No subscription_id in subscription.cancelled event");
    return;
  }

  try {
    // Update all orders for this subscription
    await supabase
      .from("orders")
      .update({
        status: "refunded",
        metadata: {
          cancelled_at: event.created_at,
          webhook_processed_at: new Date().toISOString(),
        },
      })
      .contains("metadata", { subscription_id });

    console.log("Subscription cancelled:", subscription_id);
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
  }
}

async function handleRefundCreated(event: BoltWebhookEvent, supabase: any) {
  const { refund_id, checkout_id, amount } = event.data;

  if (!checkout_id) {
    console.error("No checkout_id in refund.created event");
    return;
  }

  try {
    await supabase
      .from("orders")
      .update({
        status: "refunded",
        metadata: {
          refund_id,
          refund_amount: amount,
          refunded_at: event.created_at,
          webhook_processed_at: new Date().toISOString(),
        },
      })
      .eq("bolt_checkout_id", checkout_id);

    console.log("Refund processed:", refund_id, "for checkout:", checkout_id);
  } catch (error) {
    console.error("Error handling refund:", error);
  }
}

async function handleSubscriptionActivation(order: any, supabase: any) {
  // Implement subscription activation logic
  // This could include:
  // - Updating user profile with subscription status
  // - Granting access to subscription features
  // - Creating availability slots
  // - Sending welcome email

  console.log("Activating subscription for order:", order.id);
}

async function sendPaymentConfirmationEmail(order: any) {
  // Implement email service integration
  // This could use services like:
  // - SendGrid
  // - Mailgun
  // - Amazon SES
  // - Resend

  console.log("Sending confirmation email for order:", order.id);
}

// Handle GET requests (for webhook verification)
export async function GET() {
  return NextResponse.json({ message: "Bolt webhook endpoint" });
}
