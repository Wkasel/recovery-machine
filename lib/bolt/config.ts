// Bolt payment configuration
// Recovery Machine - Bolt Integration

export interface BoltConfig {
  apiKey: string;
  publishableKey: string;
  webhookSecret: string;
  environment: 'sandbox' | 'production';
  merchantId: string;
}

// Pricing constants (in cents)
export const PRICING = {
  MONTHLY_SUBSCRIPTION: 40000, // $400.00
  SETUP_FEES: {
    BASIC: 25000,     // $250.00
    PREMIUM: 35000,   // $350.00
    DELUXE: 50000,    // $500.00
  },
  ADD_ONS: {
    EXTRA_VISIT: 5000,      // $50.00
    FAMILY_PACKAGE: 10000,  // $100.00
    EXTENDED_SAUNA: 2500,   // $25.00
  }
} as const;

// Get Bolt configuration from environment
export function getBoltConfig(): BoltConfig {
  const config = {
    apiKey: process.env.BOLT_API_KEY || '',
    publishableKey: process.env.NEXT_PUBLIC_BOLT_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.BOLT_WEBHOOK_SECRET || '',
    environment: (process.env.BOLT_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    merchantId: process.env.BOLT_MERCHANT_ID || '',
  };

  // Validate required config in production
  if (process.env.NODE_ENV === 'production') {
    const missing = Object.entries(config).filter(([key, value]) => !value);
    if (missing.length > 0) {
      throw new Error(`Missing Bolt configuration: ${missing.map(([key]) => key).join(', ')}`);
    }
  }

  return config;
}

// Bolt API endpoints
export const BOLT_ENDPOINTS = {
  CHECKOUT: '/api/payments/checkout',
  WEBHOOK: '/api/webhooks/bolt',
  REFUND: '/api/payments/refund',
  SUBSCRIPTION: '/api/payments/subscription',
  ORDER_STATUS: '/api/payments/status',
} as const;

// Order types for Bolt integration
export type OrderType = 'subscription' | 'one_time' | 'setup_fee';

export interface BoltOrderData {
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
  INTERVAL: 'monthly',
  TRIAL_PERIOD_DAYS: 0,
  GRACE_PERIOD_DAYS: 3,
  PAYMENT_RETRY_DAYS: 7,
} as const;