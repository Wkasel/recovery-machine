# Stripe Migration Guide

## Overview

This document describes the migration from Bolt payment processing to Stripe. The migration was completed on October 31, 2025, and replaces all Bolt-specific code with Stripe equivalents while maintaining the same booking flow and user experience.

## Changes Made

### 1. Dependencies

**Installed:**
- `stripe` - Server-side Stripe SDK
- `@stripe/stripe-js` - Client-side Stripe SDK

**Removed:**
- All Bolt-related dependencies

### 2. File Structure Changes

#### New Files Created:
- `lib/stripe/config.ts` - Stripe configuration and pricing constants
- `lib/stripe/client.ts` - Stripe API client wrapper
- `components/payments/StripeCheckout.tsx` - Stripe checkout component
- `app/api/stripe/checkout/route.ts` - Stripe checkout API endpoint
- `app/api/stripe/webhook/route.ts` - Stripe webhook handler
- `app/stripe/success/page.tsx` - Payment success page
- `app/stripe/cancel/page.tsx` - Payment cancellation page
- `supabase/migrations/20251031000000_add_stripe_fields.sql` - Database migration

#### Files Removed:
- `lib/bolt/config.ts`
- `lib/bolt/client.ts`
- `components/payments/BoltCheckout.tsx`
- `app/api/payments/checkout/route.ts`
- `app/api/webhooks/bolt/route.ts`
- `app/api/payments/subscription/route.ts`
- `app/api/payments/refund/route.ts`

#### Files Modified:
- `components/payments/index.ts` - Export StripeCheckout instead of BoltCheckout
- `components/booking/PaymentStep.tsx` - Updated branding to Stripe
- `core/actions/booking.ts` - Use Stripe API endpoint
- `app/book/page.tsx` - Use StripeCheckout component
- `components/booking/BookingPageRefactored.tsx` - Use StripeCheckout component
- `app/api/bookings/route.ts` - Removed Bolt client import
- `.env.example` - Updated environment variables

### 3. Database Schema Changes

Added new columns to support Stripe:
- `orders.stripe_session_id` - Stripe Checkout Session ID
- `orders.stripe_subscription_id` - Stripe Subscription ID
- `orders.stripe_payment_intent_id` - Stripe Payment Intent ID
- `profiles.stripe_customer_id` - Stripe Customer ID

**Note:** Existing `bolt_checkout_id` columns were preserved for historical data.

### 4. API Changes

**Old Endpoints (Removed):**
- `POST /api/payments/checkout` - Bolt checkout
- `POST /api/webhooks/bolt` - Bolt webhooks
- `POST /api/payments/subscription` - Bolt subscriptions
- `POST /api/payments/refund` - Bolt refunds

**New Endpoints:**
- `POST /api/stripe/checkout` - Create Stripe Checkout Session
- `POST /api/stripe/webhook` - Handle Stripe webhook events
- `GET /api/stripe/checkout?session_id=xxx` - Get checkout session status

**Success/Cancel Pages:**
- `/stripe/success?session_id=xxx` - Payment success confirmation
- `/stripe/cancel` - Payment cancellation page

### 5. Environment Variables

**Required (Previously Bolt, now Stripe):**
```bash
# Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Removed:**
```bash
NEXT_PUBLIC_BOLT_PUBLISHABLE_KEY
BOLT_SECRET_KEY
BOLT_WEBHOOK_SECRET
BOLT_MERCHANT_ID
BOLT_ENVIRONMENT
```

## Deployment Steps

### 1. Database Migration

Run the Stripe fields migration:
```bash
# Push migrations to Supabase
supabase db push
```

Or run manually in Supabase SQL Editor:
```sql
-- See: supabase/migrations/20251031000000_add_stripe_fields.sql
```

### 2. Stripe Account Setup

1. **Create or access Stripe account** at https://dashboard.stripe.com
2. **Get API keys:**
   - Go to Developers → API keys
   - Copy Publishable key (starts with `pk_test_` or `pk_live_`)
   - Copy Secret key (starts with `sk_test_` or `sk_live_`)

3. **Configure webhook endpoint:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events to listen for:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the webhook signing secret (starts with `whsec_`)

### 3. Environment Variables

Update your production environment variables:

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
```

Or via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add the three Stripe variables
3. Redeploy the application

**Local Development:**
Update your `.env.local`:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Testing

#### Test Mode (Development)
1. Use Stripe test keys (starting with `pk_test_` and `sk_test_`)
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date
4. Any 3-digit CVC

#### Webhook Testing (Local)
```bash
# Install Stripe CLI
brew install stripe/stripe-brew/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will output a webhook signing secret starting with whsec_
# Use this in your .env.local
```

#### Production Testing
1. Create a test booking with test card
2. Verify payment success page displays correctly
3. Check Supabase database:
   - `orders` table has `stripe_session_id` populated
   - `bookings` table status is `confirmed`
4. Verify confirmation email is sent

### 5. Go Live Checklist

- [ ] Database migration completed
- [ ] Stripe account verified and activated
- [ ] Production API keys added to environment
- [ ] Webhook endpoint configured and tested
- [ ] Test booking completed successfully
- [ ] Confirmation emails working
- [ ] Success/cancel pages displaying correctly
- [ ] Old Bolt environment variables removed

## Key Differences: Bolt vs Stripe

### Payment Flow

**Bolt (Old):**
1. Create checkout session
2. Display payment form in iframe
3. Handle postMessage events
4. Process payment in iframe

**Stripe (New):**
1. Create checkout session
2. Redirect to Stripe-hosted checkout page
3. Customer completes payment on Stripe
4. Redirect back to success/cancel page

**Advantage:** Stripe's redirect flow is simpler and more secure. No iframe complexity.

### Webhook Events

**Bolt:**
- `checkout.completed`
- `checkout.failed`
- `refund.created`

**Stripe:**
- `checkout.session.completed` (replaces checkout.completed)
- `checkout.session.expired` (new)
- `payment_intent.succeeded` (additional confirmation)
- `payment_intent.payment_failed` (replaces checkout.failed)
- Full subscription lifecycle events

### Developer Experience

**Stripe Advantages:**
- Better documentation
- More comprehensive dashboard
- Superior testing tools (Stripe CLI)
- Wider payment method support
- Better fraud protection
- More reliable webhook delivery
- Industry standard (easier for team members)

## Troubleshooting

### Build Errors

If you see "Module not found: Can't resolve '@/lib/bolt/client'":
- Ensure all Bolt imports have been replaced with Stripe equivalents
- Check: `core/actions/booking.ts`, `app/api/bookings/route.ts`

### Webhook Signature Verification Fails

- Verify `STRIPE_WEBHOOK_SECRET` is correctly set
- Check that the webhook endpoint URL matches Stripe dashboard configuration
- Ensure webhook events are being sent to the correct environment

### Payment Not Confirming Booking

- Check webhook is being received: Look at Stripe Dashboard → Webhooks
- Verify `checkout.session.completed` event is subscribed
- Check application logs for webhook processing errors
- Ensure `stripe_session_id` is being saved to orders table

### Database Errors

- Run the migration: `supabase/migrations/20251031000000_add_stripe_fields.sql`
- Verify columns exist: `orders.stripe_session_id`, `profiles.stripe_customer_id`

## Rollback Plan

If you need to rollback to Bolt:

1. **DO NOT REMOVE** Stripe files yet - they're needed for any payments already processed
2. Reinstall Bolt packages: `npm install bolt-sdk` (hypothetical)
3. Restore Bolt files from git history
4. Update environment variables back to Bolt
5. Redeploy application

**Note:** This is not recommended as Stripe is more reliable and feature-rich.

## Support

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **Stripe Status:** https://status.stripe.com

## Pricing Constants

All pricing constants remain unchanged and are now in `lib/stripe/config.ts`:

```typescript
export const PRICING = {
  SUBSCRIPTIONS: {
    RECOVERY_LITE: 27500,      // $275.00 (2 visits/month)
    FULL_SPECTRUM: 52500,      // $525.00 (4 visits/month)
    ELITE_PERFORMANCE: 85000,  // $850.00 (8 visits/month)
  },
  SINGLE_SESSIONS: {
    HOUSEHOLD_MIN: 17500,      // $175.00 (up to 4 people, 60 min)
    HOUSEHOLD_MAX: 20000,      // $200.00 (up to 4 people, 60 min)
    GROUP_TEAM_MIN: 25000,     // $250.00 (5+ people, 90 min)
    GROUP_TEAM_MAX: 30000,     // $300.00 (5+ people, 90 min)
  },
  CORPORATE: {
    EVENT_MIN: 100000,         // $1,000.00 (4+ hours)
    EVENT_MAX: 120000,         // $1,200.00 (4+ hours)
    GYM_1DAY: 150000,          // $1,500.00 (1 day/month, 8 hours)
    GYM_2DAY: 125000,          // $1,250.00 per day (2 days/month)
    HALF_DAY: 75000,           // $750.00 (4 hours)
  },
  TRAVEL: {
    BASE_RADIUS_MILES: 5,      // Free within 5 miles of Costa Mesa
    PER_10_MILES: 2500,        // $25.00 per 10 additional miles
  },
};
```

## Migration Completion

✅ **Migration Status:** Complete
✅ **Build Status:** Passing
✅ **Breaking Changes:** None (same user experience)
✅ **Data Migration:** Not required (historical Bolt data preserved)

The site is now ready to accept payments through Stripe once environment variables are configured and the database migration is applied.
