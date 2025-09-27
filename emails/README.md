# Recovery Machine Email Templates

This directory contains HTML email templates for Supabase Auth and custom notifications.

## 📧 Available Templates

### 1. **Welcome Email** (`welcome-email.html`)
- **Purpose**: Sent to new subscribers who join the email list
- **Trigger**: When user subscribes via EmailCollection component
- **Variables**: `{{ .Email }}`, `{{ .SiteURL }}`
- **Features**: Early access benefits, booking CTA, recovery resources

### 2. **Booking Confirmation** (`booking-confirmation.html`)
- **Purpose**: Confirms successful booking with session details
- **Trigger**: After successful booking creation
- **Variables**: `{{ .CustomerName }}`, `{{ .BookingDateTime }}`, `{{ .ServiceType }}`, `{{ .Duration }}`, `{{ .Address }}`, `{{ .BookingID }}`, `{{ .TotalAmount }}`
- **Features**: Session details, preparation checklist, contact info

### 3. **Booking Reminder** (`booking-reminder.html`)
- **Purpose**: 24-hour reminder before scheduled session
- **Trigger**: Automated 24 hours before session
- **Variables**: Same as booking confirmation plus `{{ .SessionTime }}`
- **Features**: Pre-session checklist, what to expect, last-minute changes

### 4. **Payment Confirmation** (`payment-confirmation.html`)
- **Purpose**: Receipt and payment confirmation
- **Trigger**: After successful payment processing
- **Variables**: `{{ .TransactionID }}`, `{{ .PaymentMethod }}`, `{{ .ServiceAmount }}`, `{{ .SetupFee }}`, `{{ .Tax }}`, `{{ .OrderType }}`, `{{ .NextBillingDate }}`
- **Features**: Payment summary, subscription details, security notes

### 5. **Subscription Reminder** (`subscription-reminder.html`)
- **Purpose**: 3-day reminder before monthly billing
- **Trigger**: 3 days before auto-renewal
- **Variables**: `{{ .NextBillingDate }}`, `{{ .Amount }}`, `{{ .PaymentMethod }}`, `{{ .LastFourDigits }}`, `{{ .ExpiryDate }}`, `{{ .TotalSessions }}`, `{{ .TotalSavings }}`
- **Features**: Billing info, membership benefits, stats, payment method management

### 6. **Session Feedback** (`session-feedback.html`)
- **Purpose**: Post-session feedback collection and follow-up
- **Trigger**: 2-4 hours after session completion
- **Variables**: `{{ .SessionDateTime }}`, `{{ .SpecialistName }}`, `{{ .IsSubscriber }}`
- **Features**: Rating buttons, session recap, next booking, referral program

## 🔧 Supabase Setup Instructions

### 1. Custom SMTP Configuration

In your Supabase project dashboard:

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your SMTP provider (recommended: SendGrid, Mailgun, or AWS SES)
3. Add the sender email and name

### 2. Auth Email Templates

In **Authentication** → **Email Templates**, replace the default templates:

#### Confirm Signup
```html
<!-- Use welcome-email.html content -->
```

#### Magic Link
```html
<!-- Use a simplified version of welcome-email.html -->
```

#### Change Email Address
```html
<!-- Create a custom template for email changes -->
```

#### Reset Password
```html
<!-- Create a custom template for password resets -->
```

### 3. Custom Email Triggers

#### Setup Database Functions

```sql
-- Function to send booking confirmation
CREATE OR REPLACE FUNCTION send_booking_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Call external service or use pg_net to send email
  INSERT INTO email_queue (
    template_name,
    recipient_email,
    variables,
    priority
  ) VALUES (
    'booking-confirmation',
    NEW.customer_email,
    json_build_object(
      'CustomerName', NEW.customer_name,
      'BookingDateTime', NEW.date_time,
      'ServiceType', NEW.service_type,
      'BookingID', NEW.id
    ),
    'high'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for booking confirmation
CREATE TRIGGER trigger_booking_confirmation
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION send_booking_confirmation();
```

#### Setup Email Queue Processing

```sql
-- Email queue table
CREATE TABLE email_queue (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  variables JSONB DEFAULT '{}',
  priority VARCHAR(20) DEFAULT 'normal',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  error_message TEXT
);

-- Scheduled function to process email queue
CREATE OR REPLACE FUNCTION process_email_queue()
RETURNS void AS $$
DECLARE
  email_record RECORD;
BEGIN
  FOR email_record IN 
    SELECT * FROM email_queue 
    WHERE status = 'pending' 
    ORDER BY priority DESC, created_at ASC 
    LIMIT 10
  LOOP
    -- Process email (integrate with your email service)
    -- Update status to 'sent' or 'failed'
    UPDATE email_queue 
    SET status = 'sent', sent_at = NOW() 
    WHERE id = email_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### 4. Environment Variables

Add to your `.env.local`:

```env
# Email Service Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
FROM_EMAIL=hello@therecoverymachine.com
FROM_NAME=Recovery Machine

# Template URLs
EMAIL_TEMPLATE_BASE_URL=https://yourdomain.com/emails/templates
```

### 5. Integration with Booking System

Update your booking service to trigger emails:

```typescript
// In booking-service.ts
export async function createBooking(bookingData: BookingFormData) {
  // Create booking in database
  const booking = await supabase.from('bookings').insert(bookingData);
  
  // Send confirmation email (triggered by database function)
  // Or manually trigger email service
  await emailService.sendBookingConfirmation(booking);
  
  return booking;
}
```

## 🎨 Customization

### Brand Colors
- Primary: `#3b82f6` (blue)
- Success: `#10b981` (green)
- Warning: `#f59e0b` (orange)
- Error: `#ef4444` (red)

### Typography
- Font Family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Headers: `28px`, `600` weight
- Body: `16px`, `400` weight
- Small text: `14px`

### Mobile Responsiveness
All templates are designed to be mobile-responsive with:
- Max width: `600px`
- Flexible layouts for mobile screens
- Touch-friendly button sizes (`44px` minimum height)

## 🔐 Security & Compliance

- All templates include unsubscribe links
- Privacy policy links included
- GDPR-compliant data handling
- No sensitive information in email content
- Secure token-based unsubscribe process

## 📊 Analytics & Tracking

Templates include UTM parameters for tracking:
- `utm_source=email_name`
- `utm_medium=email`
- `utm_campaign=campaign_name`

Example: `{{ .SiteURL }}/book?utm_source=booking_confirmation&utm_medium=email&utm_campaign=follow_up`

## 🚀 Production Deployment

1. Upload templates to your email service provider
2. Configure Supabase Auth templates
3. Set up database triggers for automated emails
4. Test all email flows thoroughly
5. Monitor email delivery rates and engagement

## 📞 Support

For questions about email template setup or customization:
- Check Supabase Auth documentation
- Review email service provider docs
- Test templates in email clients before deploying