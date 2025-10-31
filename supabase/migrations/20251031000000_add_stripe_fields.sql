-- Add Stripe fields to orders and profiles tables
-- This migration adds support for Stripe payment processing while keeping Bolt fields for historical data

-- Add Stripe session ID to orders table
ALTER TABLE IF EXISTS orders
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Add Stripe customer ID to profiles table
ALTER TABLE IF EXISTS profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_subscription_id ON orders(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Add comments for documentation
COMMENT ON COLUMN orders.stripe_session_id IS 'Stripe Checkout Session ID for payment tracking';
COMMENT ON COLUMN orders.stripe_subscription_id IS 'Stripe Subscription ID for recurring payments';
COMMENT ON COLUMN orders.stripe_payment_intent_id IS 'Stripe Payment Intent ID for one-time payments';
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe Customer ID for user payment management';
