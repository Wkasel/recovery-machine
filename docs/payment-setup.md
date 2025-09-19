# Bolt Payment Integration Setup Guide

## Overview

This guide covers the complete Bolt payment integration for the Recovery Machine platform, including subscriptions, one-time payments, setup fees, and admin management.

## Environment Configuration

### Required Environment Variables

Add these variables to your `.env` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Bolt Payment Configuration
BOLT_API_KEY=your_bolt_api_key_here
NEXT_PUBLIC_BOLT_PUBLISHABLE_KEY=your_bolt_publishable_key_here
BOLT_WEBHOOK_SECRET=your_bolt_webhook_secret_here
BOLT_ENVIRONMENT=sandbox
BOLT_MERCHANT_ID=your_bolt_merchant_id_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_FROM=noreply@recoverymachine.com
```

## Bolt Merchant Setup

### 1. Create Bolt Merchant Account

1. Sign up at [Bolt Merchant Dashboard](https://merchant.bolt.com)
2. Complete merchant verification
3. Obtain API credentials from the dashboard

### 2. Configure Webhook Endpoints

Set up webhook URL in Bolt dashboard:
- **URL**: `https://yourdomain.com/api/webhooks/bolt`
- **Events**: All payment events
- **Secret**: Generate and save as `BOLT_WEBHOOK_SECRET`

### 3. API Keys Configuration

Get from Bolt dashboard:
- **API Key**: For server-side operations
- **Publishable Key**: For client-side checkout
- **Merchant ID**: Your merchant identifier

## Pricing Structure

The system is configured with these pricing tiers:

### Monthly Subscription
- **Amount**: $400.00 (40000 cents)
- **Billing**: Monthly recurring
- **Description**: Recovery Machine Monthly Subscription

### Setup Fees (One-time)
- **Basic**: $250.00 (25000 cents)
- **Premium**: $350.00 (35000 cents)
- **Deluxe**: $500.00 (50000 cents)

### Add-ons (Per session)
- **Extra Visit**: $50.00 (5000 cents)
- **Family Package**: $100.00 (10000 cents)
- **Extended Sauna**: $25.00 (2500 cents)

## API Endpoints

### Payment Endpoints

#### Create Checkout Session
```http
POST /api/payments/checkout
Content-Type: application/json

{
  "amount": 40000,
  "currency": "USD",
  "order_reference": "order_123",
  "description": "Recovery Machine Subscription",
  "customer_email": "user@example.com",
  "customer_phone": "+1234567890",
  "order_type": "subscription",
  "metadata": {}
}
```

#### Create Subscription
```http
POST /api/payments/subscription
Content-Type: application/json

{
  "plan": "monthly",
  "setup_fee_type": "basic"
}
```

#### Process Refund
```http
POST /api/payments/refund
Content-Type: application/json

{
  "order_id": "uuid",
  "amount": 40000,
  "reason": "customer_request"
}
```

### Admin Endpoints

#### Get Orders
```http
GET /api/admin/payments/orders?limit=50&offset=0&status=all&order_type=all
```

#### Get Payment Statistics
```http
GET /api/admin/payments/stats?days=30
```

#### Export Payments
```http
GET /api/admin/payments/export?start_date=2025-01-01&end_date=2025-12-31&status=all
```

## Webhook Events

The system handles these Bolt webhook events:

### Payment Events
- `checkout.completed` - Payment successful
- `checkout.failed` - Payment failed
- `refund.created` - Refund processed

### Subscription Events
- `subscription.created` - New subscription
- `subscription.payment_succeeded` - Recurring payment success
- `subscription.payment_failed` - Recurring payment failed
- `subscription.cancelled` - Subscription cancelled

## Components Usage

### BoltCheckout Component

```tsx
import { BoltCheckout } from '@/components/payments/BoltCheckout';

function PaymentPage() {
  return (
    <BoltCheckout
      amount={40000}
      orderType="subscription"
      description="Recovery Machine Monthly Subscription"
      customerEmail="user@example.com"
      customerPhone="+1234567890"
      onSuccess={(result) => {
        console.log('Payment successful:', result);
        // Redirect to success page
      }}
      onError={(error) => {
        console.error('Payment failed:', error);
        // Handle error
      }}
      onCancel={() => {
        console.log('Payment cancelled');
        // Handle cancellation
      }}
    />
  );
}
```

### Payment Success Page

```tsx
import { PaymentSuccess } from '@/components/payments/PaymentSuccess';

function SuccessPage() {
  return <PaymentSuccess />;
}
```

### Admin Payment Manager

```tsx
import { PaymentManager } from '@/components/admin/PaymentManager';

function AdminDashboard() {
  return (
    <div>
      <h1>Payment Management</h1>
      <PaymentManager />
    </div>
  );
}
```

## Database Schema

The integration uses these database tables:

### Orders Table
```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bolt_checkout_id VARCHAR(255),
  amount INTEGER NOT NULL CHECK (amount >= 0),
  setup_fee_applied INTEGER DEFAULT 0 CHECK (setup_fee_applied >= 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'refunded', 'failed')),
  order_type VARCHAR(20) DEFAULT 'subscription' CHECK (order_type IN ('subscription', 'one_time', 'setup_fee')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Testing

### Running Tests

```bash
# Run payment integration tests
npm test tests/payments/bolt-integration.test.ts

# Run all tests
npm test
```

### Sandbox Testing

1. Use Bolt sandbox environment
2. Test card numbers:
   - **Success**: 4111111111111111
   - **Decline**: 4000000000000002
   - **Insufficient Funds**: 4000000000009995

### Test Scenarios

1. **Subscription Payment**
   - Create new subscription with setup fee
   - Verify order creation
   - Test webhook processing
   - Check email notifications

2. **One-time Payment**
   - Process setup fee payment
   - Verify payment completion
   - Test refund processing

3. **Failed Payment**
   - Test card decline handling
   - Verify error states
   - Check retry mechanisms

## Security Considerations

### PCI Compliance
- All payment data handled by Bolt (PCI Level 1)
- No sensitive payment data stored locally
- Webhook signature verification required

### API Security
- Authentication required for all endpoints
- Admin endpoints require role verification
- Rate limiting on payment endpoints

### Data Protection
- Customer emails encrypted in transit
- Payment metadata sanitized
- Audit trail for all transactions

## Monitoring and Logging

### Payment Tracking
- All transactions logged to database
- Real-time status updates via webhooks
- Failed payment notifications

### Error Handling
- Comprehensive error logging
- Automatic retry mechanisms
- Customer notification system

### Analytics
- Revenue tracking
- Subscription metrics
- Refund rate analysis

## Troubleshooting

### Common Issues

1. **Webhook Verification Failures**
   - Check webhook secret configuration
   - Verify endpoint accessibility
   - Review signature generation

2. **Payment Processing Errors**
   - Validate API key configuration
   - Check merchant account status
   - Review payment amounts

3. **Email Delivery Issues**
   - Verify SMTP configuration
   - Check email template formatting
   - Review spam filter settings

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
DEBUG=bolt:*
```

## Support and Resources

- [Bolt Documentation](https://docs.bolt.com)
- [Payment Integration Guide](https://docs.bolt.com/payments)
- [Webhook Documentation](https://docs.bolt.com/webhooks)
- [Testing Guide](https://docs.bolt.com/testing)

## Deployment Checklist

### Pre-deployment
- [ ] Configure production Bolt credentials
- [ ] Set up production webhook endpoints
- [ ] Configure email service (SMTP)
- [ ] Set up monitoring and alerting
- [ ] Run comprehensive tests

### Post-deployment
- [ ] Verify webhook endpoint accessibility
- [ ] Test payment flow end-to-end
- [ ] Monitor payment processing
- [ ] Check email notifications
- [ ] Validate admin interfaces

### Production Environment
- [ ] Use production Bolt environment
- [ ] Enable SSL/TLS for all endpoints
- [ ] Set up backup and recovery
- [ ] Configure error tracking (Sentry)
- [ ] Set up performance monitoring