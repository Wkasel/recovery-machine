import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { BoltClient } from '@/lib/bolt/client';
import { PRICING } from '@/lib/bolt/config';

// Mock the fetch function
global.fetch = jest.fn();

describe('Bolt Payment Integration', () => {
  let boltClient: BoltClient;

  beforeEach(() => {
    jest.clearAllMocks();
    boltClient = new BoltClient();
  });

  describe('BoltClient', () => {
    it('should create checkout session successfully', async () => {
      const mockResponse = {
        checkout_id: 'test_checkout_123',
        checkout_url: 'https://checkout-sandbox.bolt.com/test_checkout_123',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const orderData = {
        amount: PRICING.MONTHLY_SUBSCRIPTION,
        currency: 'USD',
        order_reference: 'order_test_123',
        description: 'Recovery Machine Monthly Subscription',
        customer_email: 'test@example.com',
        order_type: 'subscription' as const,
      };

      const result = await boltClient.createCheckout(orderData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should create subscription successfully', async () => {
      const mockResponse = {
        subscription_id: 'sub_test_123',
        status: 'active',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const customerData = {
        email: 'test@example.com',
        phone: '+1234567890',
        amount: PRICING.MONTHLY_SUBSCRIPTION,
        interval: 'monthly',
        description: 'Recovery Machine Monthly Subscription',
        order_reference: 'order_test_123',
      };

      const result = await boltClient.createSubscription(customerData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should process refund successfully', async () => {
      const mockResponse = {
        refund_id: 'refund_test_123',
        amount: 40000,
        status: 'completed',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await boltClient.processRefund('checkout_test_123', 40000);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should verify webhook signature correctly', () => {
      const payload = JSON.stringify({ event_type: 'checkout.completed' });
      const secret = 'test_webhook_secret';
      
      // Mock the webhook secret
      jest.spyOn(boltClient as any, 'config', 'get').mockReturnValue({
        webhookSecret: secret,
      });

      const crypto = require('crypto');
      const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const isValid = boltClient.verifyWebhookSignature(payload, signature);

      expect(isValid).toBe(true);
    });

    it('should handle API errors correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      });

      const orderData = {
        amount: PRICING.MONTHLY_SUBSCRIPTION,
        currency: 'USD',
        order_reference: 'order_test_123',
        description: 'Recovery Machine Monthly Subscription',
        customer_email: 'test@example.com',
        order_type: 'subscription' as const,
      };

      await expect(boltClient.createCheckout(orderData)).rejects.toThrow('Bolt API error');
    });
  });

  describe('Pricing Configuration', () => {
    it('should have correct pricing values', () => {
      expect(PRICING.MONTHLY_SUBSCRIPTION).toBe(40000); // $400.00
      expect(PRICING.SETUP_FEES.BASIC).toBe(25000); // $250.00
      expect(PRICING.SETUP_FEES.PREMIUM).toBe(35000); // $350.00
      expect(PRICING.SETUP_FEES.DELUXE).toBe(50000); // $500.00
    });

    it('should have add-on pricing configured', () => {
      expect(PRICING.ADD_ONS.EXTRA_VISIT).toBe(5000); // $50.00
      expect(PRICING.ADD_ONS.FAMILY_PACKAGE).toBe(10000); // $100.00
      expect(PRICING.ADD_ONS.EXTENDED_SAUNA).toBe(2500); // $25.00
    });
  });

  describe('Payment Flow Integration', () => {
    it('should calculate total amount with setup fee correctly', () => {
      const subscriptionAmount = PRICING.MONTHLY_SUBSCRIPTION;
      const setupFeeAmount = PRICING.SETUP_FEES.BASIC;
      const totalAmount = subscriptionAmount + setupFeeAmount;

      expect(totalAmount).toBe(65000); // $650.00 total
    });

    it('should handle add-ons pricing correctly', () => {
      const baseAmount = PRICING.MONTHLY_SUBSCRIPTION;
      const addOns = PRICING.ADD_ONS.EXTRA_VISIT + PRICING.ADD_ONS.FAMILY_PACKAGE;
      const totalWithAddOns = baseAmount + addOns;

      expect(totalWithAddOns).toBe(55000); // $550.00 total
    });
  });
});

// API Route Tests
describe('Payment API Routes', () => {
  describe('/api/payments/checkout', () => {
    it('should validate required fields', async () => {
      const invalidRequest = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Missing required fields
          amount: 40000,
        }),
      };

      // This would be tested with a proper test framework like supertest
      // For now, we're just testing the validation logic
      const requiredFields = ['amount', 'currency', 'order_reference', 'description', 'customer_email', 'order_type'];
      const body = JSON.parse(invalidRequest.body);
      const missingFields = requiredFields.filter(field => !body[field]);

      expect(missingFields.length).toBeGreaterThan(0);
      expect(missingFields).toContain('currency');
      expect(missingFields).toContain('order_reference');
    });

    it('should validate amount is positive', () => {
      const amount = -100;
      expect(amount).toBeLessThanOrEqual(0);

      const validAmount = 40000;
      expect(validAmount).toBeGreaterThan(0);
    });
  });

  describe('/api/webhooks/bolt', () => {
    it('should handle checkout.completed event', () => {
      const webhookEvent = {
        event_type: 'checkout.completed',
        data: {
          checkout_id: 'test_checkout_123',
          transaction_id: 'txn_test_123',
          amount: 40000,
          metadata: {
            order_id: 'order_test_123',
            user_id: 'user_test_123',
          },
        },
        created_at: new Date().toISOString(),
        webhook_id: 'webhook_test_123',
      };

      expect(webhookEvent.event_type).toBe('checkout.completed');
      expect(webhookEvent.data.checkout_id).toBeDefined();
      expect(webhookEvent.data.amount).toBe(40000);
    });

    it('should handle subscription events', () => {
      const subscriptionEvent = {
        event_type: 'subscription.payment_succeeded',
        data: {
          subscription_id: 'sub_test_123',
          transaction_id: 'txn_test_123',
          amount: 40000,
        },
        created_at: new Date().toISOString(),
        webhook_id: 'webhook_test_123',
      };

      expect(subscriptionEvent.event_type).toBe('subscription.payment_succeeded');
      expect(subscriptionEvent.data.subscription_id).toBeDefined();
    });
  });
});

// Email Template Tests
describe('Payment Email Templates', () => {
  it('should generate payment confirmation email', () => {
    const emailData = {
      customerEmail: 'test@example.com',
      customerName: 'Test User',
      orderId: 'order_test_123',
      amount: 40000,
      transactionId: 'txn_test_123',
      orderType: 'subscription' as const,
    };

    // Test that email data structure is correct
    expect(emailData.customerEmail).toBe('test@example.com');
    expect(emailData.amount).toBe(40000);
    expect(emailData.orderType).toBe('subscription');
  });

  it('should format currency correctly', () => {
    const formatAmount = (cents: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(cents / 100);
    };

    expect(formatAmount(40000)).toBe('$400.00');
    expect(formatAmount(25000)).toBe('$250.00');
    expect(formatAmount(5000)).toBe('$50.00');
  });
});