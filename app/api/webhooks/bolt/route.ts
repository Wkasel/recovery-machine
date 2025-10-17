import { boltClient } from "@/lib/bolt/client";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sendBookingConfirmation } from "@/lib/services/email";
import { NextRequest, NextResponse } from "next/server";

type BoltWebhookEvent = {
  event_type: string;
  data: {
    checkout_id?: string;
    transaction_id?: string;
    subscription_id?: string;
    status?: string;
    amount?: number;
    currency?: string;
    metadata?: Record<string, any> | null;
    error?: string;
    refund_id?: string;
  };
  created_at: string;
  webhook_id: string;
};

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("bolt-signature") || "";

    if (!boltClient.verifyWebhookSignature(rawBody, signature)) {
      console.error("Bolt webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event: BoltWebhookEvent = JSON.parse(rawBody);
    const supabase = createServiceRoleClient();

    switch (event.event_type) {
      case "checkout.completed":
        await handleCheckoutCompleted(event, supabase);
        break;
      case "checkout.failed":
        await handleCheckoutFailed(event, supabase);
        break;
      case "refund.created":
        await handleRefundCreated(event, supabase);
        break;
      default:
        console.log("Unhandled Bolt webhook event", event.event_type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bolt webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Bolt webhook endpoint" });
}

async function handleCheckoutCompleted(event: BoltWebhookEvent, supabase: ReturnType<typeof createServiceRoleClient>) {
  const checkoutId = event.data.checkout_id;

  if (!checkoutId) {
    console.error("checkout.completed payload missing checkout_id");
    return;
  }

  const { data: orderRecord, error: fetchError } = await supabase
    .from("orders")
    .select("id, user_id, metadata, order_type")
    .eq("bolt_checkout_id", checkoutId)
    .single();

  if (fetchError || !orderRecord) {
    console.error("Order not found for checkout", checkoutId, fetchError);
    return;
  }

  const orderMetadata = (orderRecord.metadata as Record<string, any>) || {};
  const bookingId = orderMetadata.booking_id || orderMetadata.bookingId || event.data.metadata?.booking_id;

  const updatedMetadata = {
    ...orderMetadata,
    transaction_id: event.data.transaction_id || orderMetadata.transaction_id,
    paid_at: event.created_at,
    webhook_last_event: event.event_type,
  };

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "paid",
      metadata: updatedMetadata,
    })
    .eq("id", orderRecord.id);

  if (updateError) {
    console.error("Failed updating order status", orderRecord.id, updateError);
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
    const bookingForEmail = {
      ...bookingRecord,
      location_address: bookingRecord.address || bookingRecord.location_address,
    };

    try {
      await sendBookingConfirmation(bookingForEmail as any, profile);
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

async function handleCheckoutFailed(event: BoltWebhookEvent, supabase: ReturnType<typeof createServiceRoleClient>) {
  const checkoutId = event.data.checkout_id;

  if (!checkoutId) {
    return;
  }

  const failureMetadata = {
    webhook_last_event: event.event_type,
    failure_reason: event.data.error || "unknown",
    failed_at: event.created_at,
  };

  const { data: orderRecord } = await supabase
    .from("orders")
    .select("id, metadata")
    .eq("bolt_checkout_id", checkoutId)
    .single();

  if (!orderRecord) {
    return;
  }

  const metadata = {
    ...(orderRecord.metadata as Record<string, any>) || {},
    ...failureMetadata,
  };

  await supabase
    .from("orders")
    .update({
      status: "failed",
      metadata,
    })
    .eq("id", orderRecord.id);

  const bookingId = metadata.booking_id || metadata.bookingId;

  if (bookingId) {
    await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);
  }
}

async function handleRefundCreated(event: BoltWebhookEvent, supabase: ReturnType<typeof createServiceRoleClient>) {
  const checkoutId = event.data.checkout_id;

  if (!checkoutId) {
    return;
  }

  const { data: orderRecord } = await supabase
    .from("orders")
    .select("id, metadata")
    .eq("bolt_checkout_id", checkoutId)
    .single();

  if (!orderRecord) {
    return;
  }

  const metadata = {
    ...(orderRecord.metadata as Record<string, any>) || {},
    refund_id: event.data.refund_id || null,
    refund_amount: event.data.amount || null,
    refunded_at: event.created_at,
    webhook_last_event: event.event_type,
  };

  await supabase
    .from("orders")
    .update({
      status: "refunded",
      metadata,
    })
    .eq("id", orderRecord.id);
}
