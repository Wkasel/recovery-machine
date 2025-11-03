// Stripe API client
// Recovery Machine - Payment Processing

import Stripe from "stripe";
import { getStripeConfig, validateStripeConfig, type StripeCheckoutData } from "./config";

export class StripeClient {
  private config;
  private stripe: Stripe;

  constructor() {
    this.config = getStripeConfig();

    // Validate config only when instantiating
    if (this.config.secretKey) {
      this.stripe = new Stripe(this.config.secretKey, {
        apiVersion: "2024-12-18.acacia",
        typescript: true,
      });
    } else {
      // Dummy instance for when env vars aren't loaded yet
      this.stripe = {} as Stripe;
    }
  }

  // Create a checkout session
  async createCheckoutSession(checkoutData: StripeCheckoutData) {
    validateStripeConfig(this.config);

    const successUrl = checkoutData.metadata?.confirmation_url as string | undefined ||
      `${process.env.NEXT_PUBLIC_APP_URL}/stripe/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = checkoutData.metadata?.cancel_url as string | undefined ||
      `${process.env.NEXT_PUBLIC_APP_URL}/stripe/cancel`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: checkoutData.currency.toLowerCase(),
            product_data: {
              name: checkoutData.description,
              description: `${checkoutData.order_type} - ${checkoutData.order_reference}`,
            },
            unit_amount: checkoutData.amount,
            // Add recurring field for subscription mode
            ...(checkoutData.order_type === "subscription" && {
              recurring: {
                interval: "month",
                interval_count: 1,
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: checkoutData.order_type === "subscription" ? "subscription" : "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: checkoutData.customer_email,
      client_reference_id: checkoutData.order_reference,
      metadata: {
        order_type: checkoutData.order_type,
        order_reference: checkoutData.order_reference,
        subscription_id: checkoutData.subscription_id || "",
        ...checkoutData.metadata,
      },
    };

    // For subscriptions, add billing cycle anchor
    if (checkoutData.order_type === "subscription" && checkoutData.subscription_id) {
      sessionParams.subscription_data = {
        metadata: {
          subscription_id: checkoutData.subscription_id,
        },
      };
    }

    const session = await this.stripe.checkout.sessions.create(sessionParams);

    return {
      session_id: session.id,
      checkout_url: session.url,
    };
  }

  // Create a subscription (for existing customers)
  async createSubscription(customerData: {
    customer_id: string;
    price_id?: string;
    amount?: number;
    interval: string;
    description: string;
    metadata?: Record<string, any>;
  }) {
    validateStripeConfig(this.config);

    let priceId = customerData.price_id;

    // If no price_id provided, create a new price
    if (!priceId && customerData.amount) {
      const price = await this.stripe.prices.create({
        currency: "usd",
        unit_amount: customerData.amount,
        recurring: {
          interval: customerData.interval as Stripe.Price.Recurring.Interval,
          interval_count: 1,
        },
        product_data: {
          name: customerData.description,
        },
      });
      priceId = price.id;
    }

    if (!priceId) {
      throw new Error("Either price_id or amount must be provided");
    }

    const subscription = await this.stripe.subscriptions.create({
      customer: customerData.customer_id,
      items: [{ price: priceId }],
      metadata: customerData.metadata,
    });

    return subscription;
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId: string) {
    validateStripeConfig(this.config);
    return await this.stripe.subscriptions.cancel(subscriptionId);
  }

  // Process a refund
  async processRefund(paymentIntentId: string, amount?: number) {
    validateStripeConfig(this.config);

    const refundData: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
      ...(amount && { amount }),
      reason: "requested_by_customer",
    };

    return await this.stripe.refunds.create(refundData);
  }

  // Get checkout session
  async getCheckoutSession(sessionId: string) {
    validateStripeConfig(this.config);
    return await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"],
    });
  }

  // Get subscription details
  async getSubscription(subscriptionId: string) {
    validateStripeConfig(this.config);
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  // Update subscription
  async updateSubscription(
    subscriptionId: string,
    updates: {
      cancel_at_period_end?: boolean;
      metadata?: Record<string, any>;
    }
  ) {
    validateStripeConfig(this.config);
    return await this.stripe.subscriptions.update(subscriptionId, updates);
  }

  // Create customer portal session
  async createPortalSession(customerId: string, returnUrl: string) {
    validateStripeConfig(this.config);

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  }

  // Construct webhook event
  constructWebhookEvent(payload: string | Buffer, signature: string) {
    validateStripeConfig(this.config);

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.config.webhookSecret
    );
  }
}

// Singleton instance
export const stripeClient = new StripeClient();
