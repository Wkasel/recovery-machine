import { stripeClient } from "@/lib/stripe/client";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendBookingConfirmation } from "@/lib/services/email";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature") || "";

    let event: Stripe.Event;

    try {
      event = stripeClient.constructWebhookEvent(rawBody, signature);
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase);
        break;
      case "checkout.session.expired":
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session, supabase);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription, supabase);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase);
        break;
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent, supabase);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, supabase);
        break;
      default:
        console.log("Unhandled Stripe webhook event:", event.type);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Stripe webhook endpoint" });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  const sessionId = session.id;

  if (!sessionId) {
    console.error("checkout.session.completed payload missing session id");
    return;
  }

  const { data: orderRecord, error: fetchError } = await supabase
    .from("orders")
    .select("id, user_id, metadata, order_type")
    .eq("stripe_session_id", sessionId)
    .single();

  if (fetchError || !orderRecord) {
    console.error("Order not found for session", sessionId, fetchError);
    return;
  }

  const orderMetadata = (orderRecord.metadata as Record<string, any>) || {};
  const bookingId = orderMetadata.booking_id || orderMetadata.bookingId || session.metadata?.booking_id;

  const updatedMetadata = {
    ...orderMetadata,
    payment_intent_id: session.payment_intent as string,
    paid_at: new Date().toISOString(),
    webhook_last_event: "checkout.session.completed",
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: session.subscription as string | null,
  };

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "paid",
      metadata: updatedMetadata,
      stripe_subscription_id: session.subscription as string | null,
    })
    .eq("id", orderRecord.id);

  if (updateError) {
    console.error("Failed updating order status", orderRecord.id, updateError);
  }

  // Update customer ID in profile if available
  if (session.customer && orderRecord.user_id) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: session.customer as string })
      .eq("id", orderRecord.user_id);

    if (profileError) {
      console.error("Failed to update stripe_customer_id for user", orderRecord.user_id, profileError);
    }
  }

  if (!bookingId) {
    return;
  }

  const { data: bookingRecord, error: bookingError } = await supabase
    .from("bookings")
    .select(
      `
        *,
        profiles:profiles!bookings_user_id_fkey(*)
      `
    )
    .eq("id", bookingId)
    .single();

  if (bookingError || !bookingRecord) {
    console.error("Booking not found for paid order", bookingId, bookingError);
    return;
  }

  const bookingStatusUpdate = await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (bookingStatusUpdate.error) {
    console.error("Failed to mark booking confirmed", bookingId, bookingStatusUpdate.error);
  }

  const profile = bookingRecord.profiles;
  const confirmationAlreadySent = Boolean(updatedMetadata.confirmation_email_sent_at);

  if (profile?.email && !confirmationAlreadySent) {
    try {
      await sendBookingConfirmation(bookingRecord as any, profile);
      const stampedMetadata = {
        ...updatedMetadata,
        confirmation_email_sent_at: new Date().toISOString(),
      };

      await supabase
        .from("orders")
        .update({ metadata: stampedMetadata })
        .eq("id", orderRecord.id);
    } catch (emailError) {
      console.error("Failed sending booking confirmation email", bookingId, emailError);
    }
  }
}

async function handleCheckoutExpired(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  const sessionId = session.id;

  if (!sessionId) {
    return;
  }

  const { data: orderRecord } = await supabase
    .from("orders")
    .select("id, metadata")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (!orderRecord) {
    console.warn("No order found for expired checkout session:", sessionId);
    return;
  }

  const metadata = {
    ...((orderRecord.metadata as Record<string, any>) || {}),
    webhook_last_event: "checkout.session.expired",
    expired_at: new Date().toISOString(),
  };

  const { error: orderUpdateError } = await supabase
    .from("orders")
    .update({
      status: "expired",
      metadata,
    })
    .eq("id", orderRecord.id);

  if (orderUpdateError) {
    console.error("Failed to mark order as expired", orderRecord.id, orderUpdateError);
  }

  const bookingId = metadata.booking_id || metadata.bookingId;

  if (bookingId) {
    const { error: bookingUpdateError } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (bookingUpdateError) {
      console.error("Failed to cancel booking for expired checkout", bookingId, bookingUpdateError);
    }
  }
}

async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  const customerId = subscription.customer as string;

  if (!customerId) {
    return;
  }

  // Find user by stripe customer ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (!profile) {
    console.error("No profile found for Stripe customer:", customerId);
    return;
  }

  // Check for existing order with this subscription ID
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id, metadata")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  const metadata = {
    subscription_status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    webhook_last_event: "customer.subscription.updated",
  };

  if (existingOrder) {
    // Map Stripe subscription status to order status
    let orderStatus: "paid" | "pending" | "processing" | "cancelled" | "failed" | "expired";
    switch (subscription.status) {
      case "active":
      case "trialing":
        orderStatus = "paid";
        break;
      case "past_due":
      case "incomplete":
        orderStatus = "processing";
        break;
      case "incomplete_expired":
        orderStatus = "expired";
        break;
      case "canceled":
        orderStatus = "cancelled";
        break;
      case "unpaid":
        orderStatus = "failed";
        break;
      default:
        orderStatus = "pending";
    }

    // Update existing order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: orderStatus,
        metadata: {
          ...(existingOrder.metadata as Record<string, any> || {}),
          ...metadata,
        },
      })
      .eq("id", existingOrder.id);

    if (updateError) {
      console.error("Failed to update order status for subscription", subscription.id, updateError);
    }
  } else {
    // Create new order for subscription if none exists (shouldn't happen - checkout should create it)
    console.warn("No order found for subscription update - subscription may have been created outside checkout flow:", subscription.id);
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  const { data: order } = await supabase
    .from("orders")
    .select("id, metadata")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (order) {
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        metadata: {
          ...(order.metadata as Record<string, any> || {}),
          subscription_status: "deleted",
          cancelled_at: new Date().toISOString(),
          webhook_last_event: "customer.subscription.deleted",
        },
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Failed to cancel order for deleted subscription", subscription.id, updateError);
    }
  } else {
    console.warn("No order found for subscription deletion:", subscription.id);
  }
}

async function handlePaymentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  // This is typically handled by checkout.session.completed
  // But we'll log it for reference
  console.log("Payment succeeded:", paymentIntent.id);
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof createServiceRoleClient>
) {
  console.error("Payment failed:", paymentIntent.id, paymentIntent.last_payment_error);

  // Try to find the order by payment intent metadata
  if (paymentIntent.metadata?.order_id) {
    await supabase
      .from("orders")
      .update({
        status: "failed",
        metadata: {
          payment_error: paymentIntent.last_payment_error?.message || "Payment failed",
          failed_at: new Date().toISOString(),
        },
      })
      .eq("id", paymentIntent.metadata.order_id);
  }
}
