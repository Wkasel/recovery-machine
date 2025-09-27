/**
 * Development Payment Bypass System
 * 
 * SECURITY WARNING: This file should NEVER be included in production builds.
 * It provides a way to bypass payment processing during development only.
 */

// Development-only promo codes
const DEV_PROMO_CODES = {
  'DEV100': { discount: 100, description: 'Dev bypass - 100% off' },
  'DEVTEST': { discount: 100, description: 'Dev testing - 100% off' },
  'SKIPBOLT': { discount: 100, description: 'Skip Bolt payment - 100% off' },
} as const;

export type DevPromoCode = keyof typeof DEV_PROMO_CODES;

export interface DevPaymentBypassResult {
  isValid: boolean;
  discount: number;
  description: string;
  orderId: string;
  shouldBypassPayment: boolean;
}

/**
 * Check if we're in development environment
 * 
 * 🚨 TEMPORARY: Currently allows production use for testing/demo purposes
 * SECURITY: This dev bypass system must be completely removed before production deployment
 * SECURITY RISK: This enables free bookings in production - must be disabled for live business
 */
export function isDevelopmentEnvironment(): boolean {
  return true; // TEMPORARY: Allow everywhere for testing/demo
  // Original code (restore for production):
  // return process.env.NODE_ENV === 'development' || 
  //        process.env.VERCEL_ENV === 'preview' ||
  //        process.env.NEXT_PUBLIC_DEV_MODE === 'true';
}

/**
 * Validate a development promo code
 * Only works in development environment
 */
export function validateDevPromoCode(code: string): DevPaymentBypassResult {
  // CRITICAL: Only allow in development
  if (!isDevelopmentEnvironment()) {
    console.warn('🚨 Dev promo code attempted in production environment');
    return {
      isValid: false,
      discount: 0,
      description: 'Invalid code',
      orderId: '',
      shouldBypassPayment: false
    };
  }

  const normalizedCode = code.toUpperCase().trim();
  const promoData = DEV_PROMO_CODES[normalizedCode as DevPromoCode];

  if (!promoData) {
    return {
      isValid: false,
      discount: 0,
      description: 'Invalid code',
      orderId: '',
      shouldBypassPayment: false
    };
  }

  // Generate a fake order ID for development
  const orderId = `dev_order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  console.log('🔧 DEV MODE: Payment bypass activated with code:', normalizedCode);

  return {
    isValid: true,
    discount: promoData.discount,
    description: promoData.description,
    orderId,
    shouldBypassPayment: promoData.discount === 100
  };
}

/**
 * Create a fake successful payment record for development
 * This simulates what would happen after a successful Bolt payment
 */
export function createDevPaymentRecord(
  userId: string,
  amount: number,
  setupFee: number = 0
) {
  if (!isDevelopmentEnvironment()) {
    throw new Error('Dev payment records can only be created in development');
  }

  return {
    user_id: userId,
    bolt_checkout_id: `dev_checkout_${Date.now()}`,
    amount: amount,
    setup_fee_applied: setupFee,
    status: 'paid' as const,
    metadata: {
      dev_bypass: true,
      created_with: 'dev-bypass-system',
      note: 'This is a development payment record - not a real payment'
    }
  };
}

/**
 * List available dev promo codes (for development UI)
 */
export function getAvailableDevPromoCodes(): Array<{
  code: string;
  discount: number;
  description: string;
}> {
  if (!isDevelopmentEnvironment()) {
    return [];
  }

  return Object.entries(DEV_PROMO_CODES).map(([code, data]) => ({
    code,
    discount: data.discount,
    description: data.description
  }));
}

/**
 * Safety check to ensure this never runs in production
 */
if (typeof window !== 'undefined' && !isDevelopmentEnvironment()) {
  console.error('🚨 SECURITY ALERT: Dev payment bypass loaded in production!');
}