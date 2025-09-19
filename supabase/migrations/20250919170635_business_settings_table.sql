-- Business Settings Table Migration
-- Migration: Add comprehensive business configuration system
-- Created: 2025-09-19

-- ===========================================================================
-- BUSINESS SETTINGS TABLE
-- ===========================================================================

-- Create enum for setting categories
CREATE TYPE public.setting_category AS ENUM (
  'business_info',
  'booking_policies',
  'pricing',
  'notifications',
  'integrations',
  'system'
);

-- Create enum for setting data types
CREATE TYPE public.setting_type AS ENUM (
  'string',
  'number',
  'boolean',
  'json',
  'array',
  'time',
  'date'
);

-- Main business settings table
CREATE TABLE public.business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category public.setting_category NOT NULL,
  type public.setting_type NOT NULL DEFAULT 'string',
  label VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Whether setting can be viewed by non-admins
  is_required BOOLEAN DEFAULT false,
  validation_rules JSONB DEFAULT '{}', -- JSON schema for validation
  default_value JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ===========================================================================
-- DEFAULT BUSINESS SETTINGS
-- ===========================================================================

-- Insert default business settings
INSERT INTO public.business_settings (key, value, category, type, label, description, is_public, is_required, validation_rules, default_value, display_order) VALUES

-- BUSINESS INFO SETTINGS
('business_name', '"The Recovery Machine"', 'business_info', 'string', 'Business Name', 'The name of your recovery business', true, true, '{"minLength": 1, "maxLength": 100}', '"The Recovery Machine"', 10),
('business_email', '"info@therecoverymachine.com"', 'business_info', 'string', 'Business Email', 'Primary business contact email', true, true, '{"format": "email"}', '"info@therecoverymachine.com"', 20),
('business_phone', '"+1-555-RECOVER"', 'business_info', 'string', 'Business Phone', 'Primary business phone number', true, true, '{"minLength": 10}', '"+1-555-RECOVER"', 30),
('business_address', '{"street": "123 Recovery Lane", "city": "Wellness City", "state": "CA", "zip": "90210", "country": "USA"}', 'business_info', 'json', 'Business Address', 'Physical business address', true, true, '{"type": "object", "required": ["street", "city", "state", "zip"]}', '{}', 40),
('business_hours', '{"monday": {"open": "09:00", "close": "18:00", "closed": false}, "tuesday": {"open": "09:00", "close": "18:00", "closed": false}, "wednesday": {"open": "09:00", "close": "18:00", "closed": false}, "thursday": {"open": "09:00", "close": "18:00", "closed": false}, "friday": {"open": "09:00", "close": "18:00", "closed": false}, "saturday": {"open": "10:00", "close": "16:00", "closed": false}, "sunday": {"closed": true}}', 'business_info', 'json', 'Business Hours', 'Operating hours for each day of the week', true, true, '{"type": "object"}', '{}', 50),
('timezone', '"America/Los_Angeles"', 'business_info', 'string', 'Business Timezone', 'Business timezone for scheduling', false, true, '{"pattern": "^[A-Za-z_]+/[A-Za-z_]+$"}', '"America/Los_Angeles"', 60),

-- BOOKING POLICIES SETTINGS
('booking_advance_days', '30', 'booking_policies', 'number', 'Booking Advance Days', 'Maximum days in advance customers can book', false, true, '{"minimum": 1, "maximum": 365}', '30', 110),
('booking_cancellation_hours', '24', 'booking_policies', 'number', 'Cancellation Policy (Hours)', 'Minimum hours before appointment to cancel', true, true, '{"minimum": 1, "maximum": 168}', '24', 120),
('booking_reschedule_hours', '24', 'booking_policies', 'number', 'Reschedule Policy (Hours)', 'Minimum hours before appointment to reschedule', true, true, '{"minimum": 1, "maximum": 168}', '24', 130),
('booking_buffer_minutes', '15', 'booking_policies', 'number', 'Buffer Time (Minutes)', 'Buffer time between bookings', false, true, '{"minimum": 0, "maximum": 120}', '15', 140),
('booking_max_per_day', '8', 'booking_policies', 'number', 'Max Bookings Per Day', 'Maximum number of bookings allowed per day', false, true, '{"minimum": 1, "maximum": 50}', '8', 150),
('booking_require_deposit', 'false', 'booking_policies', 'boolean', 'Require Deposit', 'Whether to require a deposit for bookings', true, false, '{}', 'false', 160),
('booking_auto_confirm', 'true', 'booking_policies', 'boolean', 'Auto-Confirm Bookings', 'Automatically confirm bookings or require manual approval', false, false, '{}', 'true', 170),

-- PRICING SETTINGS
('base_session_price', '15000', 'pricing', 'number', 'Base Session Price (cents)', 'Base price for a standard recovery session', true, true, '{"minimum": 0}', '15000', 210),
('setup_fee', '0', 'pricing', 'number', 'Setup Fee (cents)', 'One-time setup fee for new customers', true, false, '{"minimum": 0}', '0', 220),
('travel_fee_per_mile', '200', 'pricing', 'number', 'Travel Fee Per Mile (cents)', 'Fee charged per mile for travel', true, false, '{"minimum": 0}', '200', 230),
('max_travel_distance', '25', 'pricing', 'number', 'Max Travel Distance (miles)', 'Maximum distance willing to travel', true, true, '{"minimum": 1, "maximum": 100}', '25', 240),
('add_on_prices', '{"extra_time_15min": 2500, "family_session": 5000, "sauna_upgrade": 3000, "meditation_guide": 1000}', 'pricing', 'json', 'Add-on Pricing', 'Pricing for additional services and add-ons', true, false, '{"type": "object"}', '{}', 250),
('discount_codes', '{"WELCOME10": {"type": "percentage", "value": 10, "max_uses": 100, "expires_at": null}, "FIRST50": {"type": "fixed", "value": 5000, "max_uses": 50, "expires_at": null}}', 'pricing', 'json', 'Discount Codes', 'Available discount codes and their values', false, false, '{"type": "object"}', '{}', 260),

-- NOTIFICATION SETTINGS
('email_notifications_enabled', 'true', 'notifications', 'boolean', 'Email Notifications', 'Enable email notifications', false, true, '{}', 'true', 310),
('sms_notifications_enabled', 'true', 'notifications', 'boolean', 'SMS Notifications', 'Enable SMS notifications', false, true, '{}', 'true', 320),
('booking_confirmation_email', 'true', 'notifications', 'boolean', 'Booking Confirmation Email', 'Send email when booking is confirmed', false, true, '{}', 'true', 330),
('booking_reminder_hours', '[24, 2]', 'notifications', 'array', 'Booking Reminder Times', 'Hours before appointment to send reminders', false, true, '{"type": "array", "items": {"type": "number"}}', '[24, 2]', 340),
('review_request_delay_hours', '2', 'notifications', 'number', 'Review Request Delay', 'Hours after session to request review', false, false, '{"minimum": 0, "maximum": 168}', '2', 350),
('admin_notification_email', '"admin@therecoverymachine.com"', 'notifications', 'string', 'Admin Notification Email', 'Email for admin notifications', false, true, '{"format": "email"}', '""', 360),

-- INTEGRATION SETTINGS
('bolt_public_key', '""', 'integrations', 'string', 'Bolt Public Key', 'Bolt payment integration public key', false, false, '{}', '""', 410),
('bolt_webhook_secret', '""', 'integrations', 'string', 'Bolt Webhook Secret', 'Bolt webhook verification secret', false, false, '{}', '""', 420),
('google_api_key', '""', 'integrations', 'string', 'Google API Key', 'Google Maps and Calendar API key', false, false, '{}', '""', 430),
('twilio_account_sid', '""', 'integrations', 'string', 'Twilio Account SID', 'Twilio account identifier for SMS', false, false, '{}', '""', 440),
('twilio_auth_token', '""', 'integrations', 'string', 'Twilio Auth Token', 'Twilio authentication token', false, false, '{}', '""', 450),
('instagram_access_token', '""', 'integrations', 'string', 'Instagram Access Token', 'Instagram API access token', false, false, '{}', '""', 460),

-- SYSTEM SETTINGS
('maintenance_mode', 'false', 'system', 'boolean', 'Maintenance Mode', 'Enable maintenance mode to disable bookings', false, false, '{}', 'false', 510),
('debug_mode', 'false', 'system', 'boolean', 'Debug Mode', 'Enable debug logging and features', false, false, '{}', 'false', 520),
('analytics_enabled', 'true', 'system', 'boolean', 'Analytics Enabled', 'Enable analytics tracking', false, false, '{}', 'true', 530),
('backup_frequency_hours', '24', 'system', 'number', 'Backup Frequency', 'Hours between automatic backups', false, false, '{"minimum": 1, "maximum": 168}', '24', 540),
('session_timeout_minutes', '60', 'system', 'number', 'Session Timeout', 'User session timeout in minutes', false, false, '{"minimum": 15, "maximum": 480}', '60', 550);

-- ===========================================================================
-- INDEXES FOR PERFORMANCE
-- ===========================================================================

CREATE INDEX idx_business_settings_key ON public.business_settings(key);
CREATE INDEX idx_business_settings_category ON public.business_settings(category);
CREATE INDEX idx_business_settings_public ON public.business_settings(is_public) WHERE is_public = true;
CREATE INDEX idx_business_settings_display_order ON public.business_settings(category, display_order);

-- ===========================================================================
-- TRIGGERS
-- ===========================================================================

-- Apply updated_at trigger
CREATE TRIGGER trigger_business_settings_updated_at
  BEFORE UPDATE ON public.business_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===========================================================================
-- RLS POLICIES
-- ===========================================================================

-- Enable RLS
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view all settings
CREATE POLICY "Admins can view all business settings" ON public.business_settings
  FOR SELECT USING (public.is_admin());

-- Only super admins can insert settings
CREATE POLICY "Super admins can insert business settings" ON public.business_settings
  FOR INSERT WITH CHECK (public.is_super_admin());

-- Only super admins can update settings
CREATE POLICY "Super admins can update business settings" ON public.business_settings
  FOR UPDATE USING (public.is_super_admin());

-- Only super admins can delete settings
CREATE POLICY "Super admins can delete business settings" ON public.business_settings
  FOR DELETE USING (public.is_super_admin());

-- Allow public to view public settings (for website display)
CREATE POLICY "Public can view public business settings" ON public.business_settings
  FOR SELECT USING (is_public = true);

-- ===========================================================================
-- HELPER FUNCTIONS
-- ===========================================================================

-- Function to get a business setting value by key
CREATE OR REPLACE FUNCTION public.get_business_setting(setting_key TEXT)
RETURNS JSONB AS $$
DECLARE
  setting_value JSONB;
BEGIN
  SELECT value INTO setting_value
  FROM public.business_settings
  WHERE key = setting_key;
  
  RETURN COALESCE(setting_value, 'null'::JSONB);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update a business setting
CREATE OR REPLACE FUNCTION public.update_business_setting(
  setting_key TEXT,
  setting_value JSONB,
  user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  UPDATE public.business_settings
  SET value = setting_value,
      updated_at = NOW(),
      updated_by = user_id
  WHERE key = setting_key;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get business settings by category
CREATE OR REPLACE FUNCTION public.get_business_settings_by_category(setting_category public.setting_category)
RETURNS TABLE(
  key VARCHAR(100),
  value JSONB,
  type public.setting_type,
  label VARCHAR(255),
  description TEXT,
  is_required BOOLEAN,
  validation_rules JSONB,
  display_order INTEGER
) AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT bs.key, bs.value, bs.type, bs.label, bs.description, 
         bs.is_required, bs.validation_rules, bs.display_order
  FROM public.business_settings bs
  WHERE bs.category = setting_category
  ORDER BY bs.display_order ASC, bs.label ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_business_setting(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_business_setting(TEXT, JSONB, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_business_settings_by_category(public.setting_category) TO authenticated;