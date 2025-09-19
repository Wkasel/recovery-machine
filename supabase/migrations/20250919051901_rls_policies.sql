-- Recovery Machine Row Level Security (RLS) Policies
-- Migration: Security policies for all tables
-- Created: 2025-09-19

-- ===========================================================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- ===========================================================================
-- HELPER FUNCTIONS FOR POLICIES
-- ===========================================================================

-- Check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================================================
-- PROFILES TABLE POLICIES
-- ===========================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Admins can update user profiles (for support)
CREATE POLICY "Admins can update user profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- ===========================================================================
-- ORDERS TABLE POLICIES
-- ===========================================================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending orders only
CREATE POLICY "Users can update own pending orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.is_admin());

-- Admins can update orders (for refunds, etc.)
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- ===========================================================================
-- BOOKINGS TABLE POLICIES
-- ===========================================================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own bookings
CREATE POLICY "Users can insert own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (reschedule, cancel)
CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND status IN ('scheduled', 'confirmed')
    AND date_time > NOW() + INTERVAL '24 hours' -- 24-hour cancellation policy
  );

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (public.is_admin());

-- Admins can insert bookings (book for customers)
CREATE POLICY "Admins can insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (public.is_admin());

-- Admins can update all bookings
CREATE POLICY "Admins can update bookings" ON public.bookings
  FOR UPDATE USING (public.is_admin());

-- ===========================================================================
-- REFERRALS TABLE POLICIES
-- ===========================================================================

-- Users can view referrals they created
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

-- Users can view referrals where they are the invitee
CREATE POLICY "Users can view referrals as invitee" ON public.referrals
  FOR SELECT USING (auth.uid() = invitee_id);

-- Users can insert their own referrals
CREATE POLICY "Users can insert own referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Admins can view all referrals
CREATE POLICY "Admins can view all referrals" ON public.referrals
  FOR SELECT USING (public.is_admin());

-- Admins can update referrals (for management)
CREATE POLICY "Admins can update referrals" ON public.referrals
  FOR UPDATE USING (public.is_admin());

-- System can update referrals (for automated processing)
CREATE POLICY "System can update referrals" ON public.referrals
  FOR UPDATE USING (true); -- This allows triggers to update

-- ===========================================================================
-- REVIEWS TABLE POLICIES
-- ===========================================================================

-- Users can view their own reviews
CREATE POLICY "Users can view own reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can view featured reviews (for homepage)
CREATE POLICY "Anyone can view featured reviews" ON public.reviews
  FOR SELECT USING (is_featured = true);

-- Users can insert reviews for their own bookings
CREATE POLICY "Users can insert own reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id 
        AND user_id = auth.uid()
        AND status = 'completed'
    )
  );

-- Users can update their own reviews (within 7 days)
CREATE POLICY "Users can update own recent reviews" ON public.reviews
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND created_at > NOW() - INTERVAL '7 days'
  );

-- Admins can view all reviews
CREATE POLICY "Admins can view all reviews" ON public.reviews
  FOR SELECT USING (public.is_admin());

-- Admins can update reviews (moderation)
CREATE POLICY "Admins can update reviews" ON public.reviews
  FOR UPDATE USING (public.is_admin());

-- ===========================================================================
-- ADMINS TABLE POLICIES
-- ===========================================================================

-- Only super admins can view admin records
CREATE POLICY "Super admins can view admins" ON public.admins
  FOR SELECT USING (public.is_super_admin());

-- Only super admins can insert new admins
CREATE POLICY "Super admins can insert admins" ON public.admins
  FOR INSERT WITH CHECK (public.is_super_admin());

-- Only super admins can update admin records
CREATE POLICY "Super admins can update admins" ON public.admins
  FOR UPDATE USING (public.is_super_admin());

-- Only super admins can delete admin records
CREATE POLICY "Super admins can delete admins" ON public.admins
  FOR DELETE USING (public.is_super_admin());

-- ===========================================================================
-- CREDIT TRANSACTIONS TABLE POLICIES
-- ===========================================================================

-- Users can view their own credit transactions
CREATE POLICY "Users can view own credit transactions" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Only admins can insert credit transactions
CREATE POLICY "Admins can insert credit transactions" ON public.credit_transactions
  FOR INSERT WITH CHECK (public.is_admin());

-- System can insert credit transactions (for automated processing)
CREATE POLICY "System can insert credit transactions" ON public.credit_transactions
  FOR INSERT WITH CHECK (true); -- This allows triggers to insert

-- Admins can view all credit transactions
CREATE POLICY "Admins can view all credit transactions" ON public.credit_transactions
  FOR SELECT USING (public.is_admin());

-- ===========================================================================
-- AVAILABILITY SLOTS TABLE POLICIES
-- ===========================================================================

-- Anyone can view available slots (for booking calendar)
CREATE POLICY "Anyone can view availability slots" ON public.availability_slots
  FOR SELECT USING (true);

-- Only admins can manage availability slots
CREATE POLICY "Admins can manage availability slots" ON public.availability_slots
  FOR ALL USING (public.is_admin());

-- ===========================================================================
-- REALTIME SUBSCRIPTIONS
-- ===========================================================================

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.availability_slots;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- ===========================================================================
-- GRANT PERMISSIONS
-- ===========================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;