// Bolt API client
// Recovery Machine - Payment Processing

import { getBoltConfig, type BoltOrderData } from "./config";

export class BoltClient {
  private config;
  private baseUrl: string;

  constructor() {
    this.config = getBoltConfig();
    this.baseUrl =
      this.config.environment === "production"
        ? "https://api.bolt.com"
        : "https://api-sandbox.bolt.com";
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Bolt API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Create a checkout session
  async createCheckout(orderData: BoltOrderData) {
    const checkoutData = {
      cart: {
        total_amount: orderData.amount,
        currency: orderData.currency.toUpperCase(),
        order_reference: orderData.order_reference,
        order_description: orderData.description,
        items: [
          {
            name: orderData.description,
            total_amount: orderData.amount,
            quantity: 1,
            sku: orderData.order_type,
            description: orderData.description,
          },
        ],
      },
      shopper_identity: {
        email: orderData.customer_email,
        phone: orderData.customer_phone,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/bolt`,
      metadata: {
        order_type: orderData.order_type,
        subscription_id: orderData.subscription_id,
        ...orderData.metadata,
      },
    };

    return this.makeRequest("/v1/checkout", {
      method: "POST",
      body: JSON.stringify(checkoutData),
    });
  }

  // Create a subscription
  async createSubscription(customerData: {
    email: string;
    phone?: string;
    amount: number;
    interval: string;
    description: string;
    order_reference: string;
  }) {
    const subscriptionData = {
      amount: customerData.amount,
      currency: "USD",
      interval: customerData.interval,
      interval_count: 1,
      description: customerData.description,
      customer: {
        email: customerData.email,
        phone: customerData.phone,
      },
      metadata: {
        order_reference: customerData.order_reference,
        service_type: "recovery_machine_membership",
      },
    };

    return this.makeRequest("/v1/subscriptions", {
      method: "POST",
      body: JSON.stringify(subscriptionData),
    });
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId: string) {
    return this.makeRequest(`/v1/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
    });
  }

  // Process a refund
  async processRefund(checkoutId: string, amount?: number) {
    const refundData = {
      checkout_id: checkoutId,
      amount: amount, // If not provided, refunds full amount
      reason: "customer_request",
    };

    return this.makeRequest("/v1/refunds", {
      method: "POST",
      body: JSON.stringify(refundData),
    });
  }

  // Get order status
  async getOrderStatus(checkoutId: string) {
    return this.makeRequest(`/v1/checkout/${checkoutId}`);
  }

  // Get subscription details
  async getSubscription(subscriptionId: string) {
    return this.makeRequest(`/v1/subscriptions/${subscriptionId}`);
  }

  // Update subscription
  async updateSubscription(
    subscriptionId: string,
    updates: {
      amount?: number;
      status?: "active" | "paused" | "cancelled";
      metadata?: Record<string, any>;
    }
  ) {
    return this.makeRequest(`/v1/subscriptions/${subscriptionId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", this.config.webhookSecret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  }
}

// Singleton instance
export const boltClient = new BoltClient();
