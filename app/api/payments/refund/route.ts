import { stripeClient } from "@/lib/stripe/client";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { requireAdminAccess } from "@/lib/utils/admin/auth";
import { NextRequest, NextResponse } from "next/server";

interface RefundRequestBody {
  order_id?: string;
  amount?: number;
  reason?: string;
}

export async function POST(request: NextRequest) {
  try {
    try {
      await requireAdminAccess(request, "admin");
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "Admin access required";
      return NextResponse.json({ error: message }, { status: 403 });
    }

    const body = (await request.json()) as RefundRequestBody;
    const orderId = body.order_id;
    const requestedAmount = body.amount;
    const reason = body.reason || "admin_refund";

    if (!orderId) {
      return NextResponse.json({ error: "order_id is required" }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        "id, amount, metadata, status, stripe_session_id, stripe_payment_intent_id"
      )
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "refunded") {
      return NextResponse.json({ error: "Order already refunded" }, { status: 400 });
    }

    const metadata = (order.metadata as Record<string, any>) || {};

    const normalizedAmount =
      typeof requestedAmount === "number" && Number.isFinite(requestedAmount)
        ? Math.trunc(requestedAmount)
        : order.amount;

    if (normalizedAmount <= 0) {
      return NextResponse.json({ error: "Refund amount must be greater than zero" }, { status: 400 });
    }

    if (normalizedAmount > order.amount) {
      return NextResponse.json({ error: "Refund amount exceeds original charge" }, { status: 400 });
    }

    let paymentIntentId = order.stripe_payment_intent_id as string | null;

    if (!paymentIntentId && typeof metadata.payment_intent_id === "string") {
      paymentIntentId = metadata.payment_intent_id;
    }

    if (!paymentIntentId && order.stripe_session_id) {
      try {
        const session = await stripeClient.getCheckoutSession(order.stripe_session_id);
        paymentIntentId = (session.payment_intent as string | null) ?? null;

        if (paymentIntentId) {
          await supabase
            .from("orders")
            .update({ stripe_payment_intent_id: paymentIntentId })
            .eq("id", order.id);
        }
      } catch (sessionError) {
        console.error("Failed to resolve Stripe checkout session", sessionError);
      }
    }

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent not found for this order" },
        { status: 400 }
      );
    }

    const refund = await stripeClient.processRefund(paymentIntentId, normalizedAmount);

    const updatedMetadata = {
      ...metadata,
      last_refund_id: refund.id,
      refunded_at: new Date().toISOString(),
      refund_reason: reason,
      refund_amount: refund.amount,
    };

    const isFullRefund = refund.amount >= order.amount;

    await supabase
      .from("orders")
      .update({
        status: isFullRefund ? "refunded" : order.status,
        metadata: updatedMetadata,
      })
      .eq("id", order.id);

    return NextResponse.json({ success: true, refund });
  } catch (error) {
    console.error("Refund processing error:", error);
    const message = error instanceof Error ? error.message : "Failed to process refund";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
