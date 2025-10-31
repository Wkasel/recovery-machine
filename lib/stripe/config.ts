// Stripe payment configuration
// Recovery Machine - Stripe Integration

export interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  environment: "test" | "live";
}

// Pricing constants (in cents) - Updated 2025
export const PRICING = {
  // Membership subscriptions
  SUBSCRIPTIONS: {
    RECOVERY_LITE: 27500, // $275.00 (2 visits/month)
    FULL_SPECTRUM: 52500, // $525.00 (4 visits/month)
    ELITE_PERFORMANCE: 85000, // $850.00 (8 visits/month)
  },
  // Single sessions
  SINGLE_SESSIONS: {
    HOUSEHOLD_MIN: 17500, // $175.00 (up to 4 people, 60 min)
    HOUSEHOLD_MAX: 20000, // $200.00 (up to 4 people, 60 min)
    GROUP_TEAM_MIN: 25000, // $250.00 (5+ people, 90 min)
    GROUP_TEAM_MAX: 30000, // $300.00 (5+ people, 90 min)
  },
  // Corporate & Gym packages
  CORPORATE: {
    EVENT_MIN: 100000, // $1,000.00 (4+ hours)
    EVENT_MAX: 120000, // $1,200.00 (4+ hours)
    GYM_1DAY: 150000, // $1,500.00 (1 day/month, 8 hours)
    GYM_2DAY: 125000, // $1,250.00 per day (2 days/month)
    HALF_DAY: 75000, // $750.00 (4 hours)
  },
  // Travel fees
  TRAVEL: {
    BASE_RADIUS_MILES: 5, // Free within 5 miles of Costa Mesa
    PER_10_MILES: 2500, // $25.00 per 10 additional miles
  },
} as const;

// Get Stripe configuration from environment
export function getStripeConfig(): StripeConfig {
  const config = {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    environment: (process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_") ? "live" : "test") as "test" | "live",
  };

  return config;
}

// Validate Stripe configuration (call this only when actually using Stripe features)
export function validateStripeConfig(config: StripeConfig): void {
  const missing = Object.entries(config)
    .filter(([key, value]) => key !== "environment" && !value);

  if (missing.length > 0) {
    throw new Error(`Missing Stripe configuration: ${missing.map(([key]) => key).join(", ")}`);
  }
}

// Stripe API endpoints
export const STRIPE_ENDPOINTS = {
  CHECKOUT: "/api/stripe/checkout",
  WEBHOOK: "/api/stripe/webhook",
  SUBSCRIPTION: "/api/stripe/subscription",
  PORTAL: "/api/stripe/portal",
} as const;

// Order types for Stripe integration
export type OrderType = "subscription" | "one_time" | "setup_fee";

export interface StripeCheckoutData {
  amount: number;
  currency: string;
  order_reference: string;
  description: string;
  customer_email: string;
  customer_phone?: string;
  order_type: OrderType;
  subscription_id?: string;
  metadata?: Record<string, any>;
}

// Subscription configuration
export const SUBSCRIPTION_CONFIG = {
  INTERVAL: "month",
  TRIAL_PERIOD_DAYS: 0,
  GRACE_PERIOD_DAYS: 3,
  PAYMENT_RETRY_DAYS: 7,
} as const;
