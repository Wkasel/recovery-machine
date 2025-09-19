-- Recovery Machine Database Schema
-- Migration: Initial schema setup with all required tables and RLS policies
-- Created: 2025-09-19

-- ===========================================================================
-- EXTENSION SETUP
-- ===========================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================================================
-- USER PROFILE EXTENSIONS
-- ===========================================================================

-- Extend the default auth.users table with Recovery Machine specific fields
-- Note: We'll create a profiles table that references auth.users for additional fields

-- Create profiles table to extend user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address JSONB DEFAULT '{}',
  referral_code VARCHAR(10) UNIQUE,
  credits INTEGER DEFAULT 0 CHECK (credits >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================================================
-- CORE BUSINESS TABLES
-- ===========================================================================

-- Orders table for payment tracking
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bolt_checkout_id VARCHAR(255),
  amount INTEGER NOT NULL CHECK (amount >= 0), -- in cents
  setup_fee_applied INTEGER DEFAULT 0 CHECK (setup_fee_applied >= 0), -- in cents
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'refunded', 'failed')),
  order_type VARCHAR(20) DEFAULT 'subscription' CHECK (order_type IN ('subscription', 'one_time', 'setup_fee')),
  metadata JSONB DEFAULT '{}', -- For additional payment data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table for session scheduling
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  date_time TIMESTAMPTZ NOT NULL,
  duration INTEGER DEFAULT 30 CHECK (duration > 0), -- minutes
  add_ons JSONB DEFAULT '{}', -- {extra_visits: 2, family: true, sauna_time: 15}
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  location_address JSONB DEFAULT '{}', -- Delivery address for session
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure no double bookings (same user can't have overlapping sessions)
  CONSTRAINT no_overlapping_bookings EXCLUDE USING gist (
    user_id WITH =,
    tstzrange(date_time, date_time + (duration || ' minutes')::interval) WITH &&
  ) WHERE (status NOT IN ('cancelled', 'no_show'))
);

-- Referrals table for referral program
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email VARCHAR(255) NOT NULL,
  invitee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- null until they sign up
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'first_booking', 'expired')),
  reward_credits INTEGER DEFAULT 50 CHECK (reward_credits >= 0),
  credits_awarded_at TIMESTAMPTZ NULL,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate referrals for same email
  UNIQUE(referrer_id, invitee_email)
);

-- Reviews table for customer feedback
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  google_synced BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false, -- For homepage testimonials
  reviewer_name VARCHAR(100), -- For public display (optional)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One review per booking
  UNIQUE(booking_id)
);

-- Admins table for role-based access control
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'operator')),
  permissions JSONB DEFAULT '{}', -- Granular permissions
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================================================
-- SUPPORTING TABLES
-- ===========================================================================

-- Credit transactions for audit trail
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES public.referrals(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- Can be negative for deductions
  transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('referral_bonus', 'booking_credit', 'manual_adjustment', 'refund')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability slots for booking calendar
CREATE TABLE public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_bookings INTEGER DEFAULT 1, -- For potential multiple bookings per slot
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure logical time ordering
  CHECK (start_time < end_time),
  
  -- Prevent overlapping slots on same date
  EXCLUDE USING gist (
    date WITH =,
    timerange(start_time, end_time) WITH &&
  )
);

-- ===========================================================================
-- INDEXES FOR PERFORMANCE
-- ===========================================================================

-- Profiles indexes
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code) WHERE referral_code IS NOT NULL;
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_bolt_checkout_id ON public.orders(bolt_checkout_id) WHERE bolt_checkout_id IS NOT NULL;

-- Bookings indexes
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_date_time ON public.bookings(date_time);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_order_id ON public.bookings(order_id) WHERE order_id IS NOT NULL;

-- Referrals indexes
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_invitee_email ON public.referrals(invitee_email);
CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_referrals_expires_at ON public.referrals(expires_at);

-- Reviews indexes
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_featured ON public.reviews(is_featured) WHERE is_featured = true;

-- Credit transactions indexes
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON public.credit_transactions(transaction_type);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);

-- Availability slots indexes
CREATE INDEX idx_availability_slots_date ON public.availability_slots(date);
CREATE INDEX idx_availability_slots_available ON public.availability_slots(is_available) WHERE is_available = true;

-- ===========================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===========================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_availability_slots_updated_at
  BEFORE UPDATE ON public.availability_slots
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===========================================================================
-- REFERRAL CODE GENERATION TRIGGER
-- ===========================================================================

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  code TEXT;
  done BOOLEAN := FALSE;
BEGIN
  -- Only generate if referral_code is NULL
  IF NEW.referral_code IS NULL THEN
    WHILE NOT done LOOP
      -- Generate 8-character alphanumeric code
      code := upper(substring(encode(gen_random_bytes(6), 'base64') from 1 for 8));
      -- Remove problematic characters and ensure alphanumeric
      code := translate(code, '+/=', '');
      
      -- Check if code is unique and of proper length
      IF length(code) >= 6 AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = code) THEN
        NEW.referral_code := code;
        done := TRUE;
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply referral code generation trigger
CREATE TRIGGER trigger_generate_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.generate_referral_code();

-- ===========================================================================
-- CREDIT TRANSACTION TRIGGER
-- ===========================================================================

-- Function to update user credits when credit transactions are inserted
CREATE OR REPLACE FUNCTION public.update_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's credit balance
  UPDATE public.profiles
  SET credits = credits + NEW.amount,
      updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply credit update trigger
CREATE TRIGGER trigger_update_user_credits
  AFTER INSERT ON public.credit_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_user_credits();

-- ===========================================================================
-- REFERRAL COMPLETION TRIGGER
-- ===========================================================================

-- Function to award referral credits when invitee makes first booking
CREATE OR REPLACE FUNCTION public.process_referral_completion()
RETURNS TRIGGER AS $$
DECLARE
  referral_record public.referrals%ROWTYPE;
BEGIN
  -- Only process for new bookings that are confirmed or completed
  IF NEW.status IN ('confirmed', 'completed') AND (OLD IS NULL OR OLD.status NOT IN ('confirmed', 'completed')) THEN
    
    -- Find active referral for this user
    SELECT * INTO referral_record
    FROM public.referrals
    WHERE invitee_id = NEW.user_id
      AND status = 'signed_up'
      AND expires_at > NOW()
    LIMIT 1;
    
    IF FOUND THEN
      -- Update referral status
      UPDATE public.referrals
      SET status = 'first_booking',
          credits_awarded_at = NOW(),
          updated_at = NOW()
      WHERE id = referral_record.id;
      
      -- Award credits to referrer
      INSERT INTO public.credit_transactions (
        user_id,
        referral_id,
        amount,
        transaction_type,
        description
      ) VALUES (
        referral_record.referrer_id,
        referral_record.id,
        referral_record.reward_credits,
        'referral_bonus',
        'Referral bonus for inviting ' || referral_record.invitee_email
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply referral completion trigger
CREATE TRIGGER trigger_process_referral_completion
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.process_referral_completion();