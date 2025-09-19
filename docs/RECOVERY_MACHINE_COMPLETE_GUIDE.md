# 🧘‍♀️ The Recovery Machine - Complete Documentation & User Guide

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Database Schema & Architecture](#database-schema--architecture)
3. [Admin Guide](#admin-guide)
4. [User Features Guide](#user-features-guide)
5. [Developer Documentation](#developer-documentation)
6. [API Reference](#api-reference)
7. [Deployment Guide](#deployment-guide)
8. [Troubleshooting](#troubleshooting)

---

# System Overview

The Recovery Machine is a comprehensive mobile spa/wellness service platform that delivers cold plunge therapy and infrared sauna sessions directly to customers' homes. The platform includes a complete booking system, payment processing, user management, referral program, and business intelligence dashboard.

## 🎯 Key Business Features

- **Mobile Wellness Service**: Cold plunge and infrared sauna delivery
- **Subscription Model**: $400/month recurring memberships  
- **Setup Fee System**: $250-500 based on distance/location
- **Referral Program**: $50 rewards for successful referrals
- **Real-time Booking**: Calendar integration with conflict prevention
- **Admin Dashboard**: Complete business management and analytics
- **Payment Processing**: Bolt integration for subscriptions and one-time payments
- **Automated Communications**: Email/SMS workflows for customer engagement

## 🏗️ Technical Architecture

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with Google OAuth
- **Payments**: Bolt payment system with webhooks
- **Email/SMS**: Resend and Twilio integration
- **Maps**: Google Maps API for address validation
- **Social**: Instagram API for social proof

---

# Database Schema & Architecture

## Core Tables Overview

### 1. **profiles** - User Information
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,              -- References auth.users(id)
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address JSONB,
  referral_code TEXT UNIQUE,        -- Auto-generated unique code
  credits INTEGER DEFAULT 0,       -- Referral reward credits
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Business Logic:**
- Extends Supabase auth.users with Recovery Machine specific data
- Automatic referral code generation via database trigger
- Credit balance tracking for referral rewards
- Address storage for delivery location preferences

### 2. **orders** - Payment Tracking
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  bolt_checkout_id TEXT,            -- Bolt payment reference
  amount INTEGER NOT NULL,          -- Amount in cents
  setup_fee_applied INTEGER DEFAULT 0,
  status order_status DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Business Logic:**
- Tracks all payments (subscriptions, setup fees, one-time)
- Integrates with Bolt payment system via checkout_id
- Status tracking: pending → paid → refunded/failed
- Metadata stores additional payment information

### 3. **bookings** - Session Scheduling
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),
  date_time TIMESTAMPTZ NOT NULL,
  duration INTEGER DEFAULT 30,      -- Session duration in minutes
  service_type TEXT NOT NULL,       -- 'cold_plunge', 'infrared_sauna', 'combo'
  add_ons JSONB DEFAULT '{}',       -- Extra services
  status booking_status DEFAULT 'scheduled',
  notes TEXT,
  address JSONB NOT NULL,           -- Delivery address
  total_amount INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Business Logic:**
- Core booking system with calendar integration
- Service type selection (cold plunge, sauna, combo)
- Add-ons: family members, extra visits, towels, electrolytes
- Status tracking: scheduled → confirmed → completed → cancelled

### 4. **referrals** - Reward Program
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id),
  invitee_email TEXT NOT NULL,
  invitee_id UUID REFERENCES profiles(id),
  status referral_status DEFAULT 'pending',
  reward_credits INTEGER DEFAULT 50,
  referral_code TEXT NOT NULL,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);
```

**Business Logic:**
- $50 reward system for successful referrals
- Status tracking: pending → accepted → expired
- 30-day expiration window
- Automatic credit awarding via database triggers

### 5. **reviews** - Customer Feedback
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_featured BOOLEAN DEFAULT false,
  google_synced BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ
);
```

**Business Logic:**
- 5-star rating system
- Featured reviews for homepage testimonials
- Google Reviews integration capability
- One review per booking constraint

### 6. **admins** - Role-Based Access
```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role admin_role DEFAULT 'operator',  -- 'operator', 'admin', 'super_admin'
  created_at TIMESTAMPTZ,
  created_by UUID REFERENCES admins(id)
);
```

**Business Logic:**
- Three-tier role system
- Operator: Basic booking management
- Admin: Full business operations
- Super Admin: System administration and user management

### 7. **credit_transactions** - Audit Trail
```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  amount INTEGER NOT NULL,           -- Positive for earned, negative for spent
  type credit_transaction_type NOT NULL,
  description TEXT NOT NULL,
  reference_id UUID,                 -- Links to booking, referral, etc.
  created_at TIMESTAMPTZ,
  created_by UUID                    -- Admin who made manual adjustments
);
```

**Business Logic:**
- Complete audit trail for all credit movements
- Automatic logging of referral rewards
- Manual adjustment capability for admins
- Reference linking to source transactions

### 8. **availability_slots** - Calendar Management
```sql
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_bookings INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ
);
```

**Business Logic:**
- Define available time slots for bookings
- Prevent double-booking via current_bookings tracking
- Future expansion for multiple concurrent sessions
- Admin-controlled availability management

---

# Admin Guide

## 🎛️ Admin Dashboard Overview

The admin dashboard provides comprehensive business management tools accessible at `/admin`. Access is restricted based on role hierarchy.

### Role Permissions

#### Super Admin
- Full system access
- User management and admin creation
- Database administration
- System configuration

#### Admin  
- Business operations management
- Order and refund processing
- Customer service functions
- Analytics and reporting

#### Operator
- Basic booking management
- Customer profile viewing
- Limited order management

## 📊 Dashboard Features

### 1. **Business Metrics Dashboard**
Location: `/admin/dashboard`

**Key Metrics:**
- Total Revenue (MTD/YTD)
- Active Subscriptions
- Monthly Recurring Revenue (MRR)
- Average Order Value
- Customer Acquisition Cost
- Churn Rate

**Real-time Stats:**
- Today's bookings
- Weekly revenue trends
- User growth metrics
- Referral conversion rates

### 2. **User Management**
Location: `/admin/users`

**Features:**
- Search users by email, phone, or referral code
- View complete user profiles and history
- Manage credit balances with audit trail
- Manual credit adjustments with reasoning
- User activity timeline
- Export user data to CSV

**User Profile View:**
```
User: john@example.com
- Credits: 150 ($15.00 value)
- Referrals: 3 successful, 2 pending
- Bookings: 12 completed, 1 upcoming
- Lifetime Value: $2,400
- Join Date: 2024-01-15
- Last Activity: 2024-09-19
```

### 3. **Booking Management**
Location: `/admin/bookings`

**Calendar View:**
- Daily/weekly/monthly booking calendar
- Color-coded status indicators
- Drag-and-drop rescheduling
- Bulk operations support

**Booking Details:**
- Customer information and contact
- Service details and add-ons
- Payment status and amounts
- Special instructions and notes
- Address and delivery details

**Operations:**
- Confirm bookings
- Reschedule appointments
- Mark as completed/cancelled
- Process refunds
- Add internal notes

### 4. **Order & Payment Management**
Location: `/admin/orders`

**Payment Overview:**
- All payment transactions
- Bolt payment status sync
- Refund processing
- Failed payment recovery

**Order Operations:**
- View payment details
- Process full/partial refunds
- Retry failed payments
- Export financial reports

### 5. **Referral Program Analytics**
Location: `/admin/referrals`

**Referral Insights:**
- Top referrers leaderboard
- Conversion rate analytics
- Credit distribution tracking
- Referral source analysis

**Management Tools:**
- Manual referral credit awards
- Bulk referral code generation
- Referral program performance reports
- Export referral data

## 🔧 Administrative Operations

### Creating Admin Users

1. **Super Admin Access Required**
2. Navigate to `/admin/settings/admins`
3. Enter email address and select role
4. Send invitation email
5. New admin completes setup via email link

### Processing Refunds

1. Navigate to order in `/admin/orders`
2. Click "Process Refund"
3. Select full or partial refund amount
4. Add refund reason (required)
5. Confirm refund processing
6. System automatically:
   - Processes Bolt refund
   - Updates order status
   - Sends customer notification email
   - Records transaction in audit log

### Managing Availability

1. Navigate to `/admin/availability`
2. Create time slots for booking
3. Set maximum concurrent bookings
4. Block unavailable dates/times
5. Bulk import availability schedules

### Customer Service Tools

**Live Chat Integration:**
- In-app messaging system
- Email notification system
- SMS customer communication
- Automated response templates

**Issue Resolution:**
- Booking modification tools
- Credit adjustment capabilities
- Refund processing system
- Escalation procedures

---

# User Features Guide

## 🏠 Customer Experience Flow

### 1. **Landing Page Experience**
URL: `/`

**Hero Section:**
- Professional video background
- "Recovery When You Need It" headline
- Dual CTAs: "Book Now" and "Learn More"
- Trust indicators and security badges

**How It Works (4-Step Process):**
1. **Sign Up** - Choose plan and schedule
2. **We Come to You** - Setup at your home
3. **Recover** - 30-min cold plunge + infrared sauna
4. **Repeat Weekly** - 4 visits/month, cancel anytime

**Social Proof:**
- Customer testimonials carousel
- 4.8/5 star rating display
- "Join 500+ Members" social indicator
- Instagram photo grid integration

**Pricing:**
- Weekly Recovery Membership: $400/month
- One-time Setup Fee: $250-500 (distance-based)
- Add-ons: Extra visits, family members, amenities

### 2. **Booking Flow**
URL: `/book`

**Step 1: Service Selection**
- Cold Plunge Therapy ($100 value)
- Infrared Sauna Session ($100 value)
- Combo Package (recommended)
- Add-ons selection

**Step 2: Address & Setup**
- Google Maps address autocomplete
- Distance calculation for setup fee
- Service area validation
- Delivery instructions

**Step 3: Calendar Selection**
- Real-time availability display
- Time slot selection
- Conflict prevention
- Booking confirmation

**Step 4: Payment Processing**
- Bolt secure checkout
- Subscription management
- Payment method storage
- Order confirmation

### 3. **User Dashboard**
URL: `/profile`

**Overview Tab:**
- Welcome message and quick actions
- Credit balance display
- Upcoming booking summary
- Quick rebook button
- Loyalty progress tracking

**Bookings Tab:**
- Upcoming appointments
- Booking history
- Edit/cancel functionality (30-day policy)
- Rescheduling options
- Download receipts

**Referrals Tab:**
- Unique referral code display
- Social sharing buttons
- Referral tracking dashboard
- Credits earned display
- Send invitation tools

**Reviews Tab:**
- Post-session review prompts
- Review submission form
- Review history display
- Featured review indicators

**Settings Tab:**
- Profile information management
- Address book
- Notification preferences
- Payment method management
- Account deletion

## 💳 Credit & Referral System

### How Credits Work
- 1 Credit = $1.00 value
- Credits applied automatically at checkout
- No expiration date
- Transferable between accounts (admin only)

### Referral Program Details
- **Referrer Reward**: $50 credit when invitee books first session
- **Invitee Reward**: $50 credit upon signup
- **Sharing Methods**: Email, SMS, social media, direct link
- **Tracking**: Real-time status updates
- **Expiration**: 30 days from invitation

---

# Developer Documentation

## 🔧 Tech Stack & Architecture

### Frontend Stack
```typescript
// Core Framework
Next.js 15 (App Router)
TypeScript 5.0+
React 18

// Styling & UI
Tailwind CSS v4
Radix UI / Shadcn Components
Framer Motion (animations)
Lucide React (icons)

// Forms & Validation
React Hook Form
Zod (schema validation)
```

### Backend & Database
```typescript
// Database & Auth
Supabase (PostgreSQL)
Row Level Security (RLS)
Supabase Auth

// Real-time Features
Supabase Realtime
WebSocket connections
```

### Integration Services
```typescript
// Payments
Bolt Payment SDK
Webhook processing

// Communication
Resend (Email)
Twilio (SMS)

// Maps & Location
Google Maps API
Places API (address autocomplete)

// Social
Instagram Basic Display API
```

## 📁 Project Structure

```
recovery-machine-web/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # API routes
│   │   ├── admin/               # Admin API endpoints
│   │   ├── payments/            # Payment processing
│   │   ├── webhooks/            # External webhooks
│   │   └── email/               # Email automation
│   ├── book/                    # Booking flow
│   ├── profile/                 # User dashboard
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   ├── booking/                 # Booking flow components
│   ├── dashboard/               # User dashboard components
│   ├── sections/                # Landing page sections
│   └── ui/                      # Reusable UI components
├── lib/                         # Utility libraries
│   ├── services/                # External service integrations
│   ├── utils/                   # Helper functions
│   └── database/                # Database utilities
├── supabase/                    # Database migrations
└── docs/                        # Documentation
```

## 🔐 Authentication & Security

### Supabase Auth Setup
```typescript
// User registration
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: {
      full_name: 'John Doe',
      phone: '+1-555-0123'
    }
  }
})

// Auto-create profile via database trigger
// Automatic referral code generation
```

### Row Level Security Policies
```sql
-- Users can only access their own data
CREATE POLICY "Users own data" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Admins can access all data
CREATE POLICY "Admins full access" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
```

## 🎯 Key Components & Hooks

### Booking System
```typescript
// Real-time availability checking
const { data: availableSlots } = useQuery(['availability', date], () =>
  supabase
    .from('availability_slots')
    .select('*')
    .eq('date', date)
    .eq('is_available', true)
)

// Booking creation with conflict prevention
const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
  
  if (error) throw error
  return data
}
```

### Payment Integration
```typescript
// Bolt checkout creation
const createCheckout = async (orderData) => {
  const response = await fetch('/api/payments/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  
  return response.json()
}

// Webhook processing
export async function POST(request: Request) {
  const signature = request.headers.get('bolt-signature')
  const body = await request.text()
  
  // Verify webhook signature
  if (!verifyBoltSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  // Process payment event
  const event = JSON.parse(body)
  await processPaymentEvent(event)
  
  return NextResponse.json({ success: true })
}
```

### Real-time Features
```typescript
// Live booking updates
useEffect(() => {
  const channel = supabase
    .channel('booking-updates')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'bookings' },
      (payload) => {
        // Update UI with real-time changes
        updateBookings(payload)
      }
    )
    .subscribe()
    
  return () => supabase.removeChannel(channel)
}, [])
```

## 📊 Database Queries & Patterns

### Complex Joins & Analytics
```sql
-- Business dashboard metrics
SELECT 
  COUNT(DISTINCT b.user_id) as unique_customers,
  SUM(o.amount) as total_revenue,
  AVG(r.rating) as avg_rating,
  COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_sessions
FROM bookings b
LEFT JOIN orders o ON b.order_id = o.id
LEFT JOIN reviews r ON b.id = r.booking_id
WHERE b.created_at >= NOW() - INTERVAL '30 days';

-- Referral program performance
SELECT 
  referrer.email as referrer_email,
  COUNT(*) as total_referrals,
  COUNT(CASE WHEN ref.status = 'accepted' THEN 1 END) as successful_referrals,
  SUM(ref.reward_credits) as credits_awarded
FROM referrals ref
JOIN profiles referrer ON ref.referrer_id = referrer.id
GROUP BY referrer.id, referrer.email
ORDER BY successful_referrals DESC;
```

### Performance Optimization
```typescript
// Efficient pagination with cursor-based pagination
const getBookings = async (cursor?: string, limit = 20) => {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      profiles(email, full_name),
      orders(amount, status)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
    
  if (cursor) {
    query = query.lt('created_at', cursor)
  }
  
  return query
}
```

---

# API Reference

## 🔗 Authentication Endpoints

### POST `/api/auth/signup`
Register new user with automatic profile creation.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure-password",
  "full_name": "John Doe",
  "phone": "+1-555-0123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "profile": {
      "referral_code": "ABC123XY",
      "credits": 0
    }
  }
}
```

## 💳 Payment Endpoints

### POST `/api/payments/checkout`
Create Bolt checkout session for subscription or one-time payment.

**Request:**
```json
{
  "amount": 40000,
  "type": "subscription",
  "setup_fee": 25000,
  "user_id": "uuid",
  "billing_address": {
    "street": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90210"
  }
}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.bolt.com/...",
  "order_id": "uuid"
}
```

### POST `/api/webhooks/bolt`
Process Bolt payment webhooks for order status updates.

**Webhook Events:**
- `payment.completed`
- `payment.failed`
- `subscription.created`
- `subscription.cancelled`
- `refund.processed`

## 📅 Booking Endpoints

### GET `/api/bookings/availability`
Get available time slots for booking calendar.

**Parameters:**
- `date`: ISO date string
- `duration`: Session duration in minutes

**Response:**
```json
{
  "slots": [
    {
      "start_time": "09:00",
      "end_time": "09:30",
      "available": true
    }
  ]
}
```

### POST `/api/bookings`
Create new booking with availability validation.

**Request:**
```json
{
  "date_time": "2024-09-20T09:00:00Z",
  "service_type": "combo",
  "add_ons": {
    "family": true,
    "towels": true
  },
  "address": {
    "street": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90210"
  }
}
```

## 👥 Referral Endpoints

### POST `/api/referrals/invite`
Send referral invitation via email or SMS.

**Request:**
```json
{
  "invitee_email": "friend@example.com",
  "method": "email",
  "personal_message": "Try this amazing service!"
}
```

### GET `/api/referrals/track/{referral_code}`
Track referral conversion and status.

**Response:**
```json
{
  "status": "pending",
  "invitee_email": "friend@example.com",
  "created_at": "2024-09-19T10:00:00Z",
  "expires_at": "2024-10-19T10:00:00Z",
  "reward_credits": 50
}
```

## 🎛️ Admin Endpoints

### GET `/api/admin/dashboard/stats`
Get business metrics and KPIs for admin dashboard.

**Response:**
```json
{
  "revenue": {
    "total": 125000,
    "monthly": 45000,
    "growth": 15.2
  },
  "users": {
    "total": 487,
    "new_this_month": 73,
    "active": 324
  },
  "bookings": {
    "total": 1250,
    "completed": 1180,
    "upcoming": 70
  }
}
```

### POST `/api/admin/users/{id}/credits`
Manually adjust user credit balance with audit trail.

**Request:**
```json
{
  "amount": 50,
  "type": "adjustment",
  "description": "Customer service credit for issue #123"
}
```

---

# Deployment Guide

## 🚀 Environment Setup

### Required Environment Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Bolt Payment Configuration
BOLT_API_KEY=your-bolt-api-key
BOLT_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_BOLT_PUBLISHABLE_KEY=your-bolt-publishable-key

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Email & SMS Services
RESEND_API_KEY=your-resend-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# Instagram Integration
INSTAGRAM_ACCESS_TOKEN=your-instagram-token
INSTAGRAM_USER_ID=your-instagram-user-id

# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
WEBHOOK_URL=https://your-domain.com/api/webhooks
```

### Supabase Setup Checklist

1. **Create Supabase Project**
   - Region: us-west-1 (recommended for LA business)
   - Pricing tier: Pro (for production)

2. **Apply Database Migrations**
   ✅ **COMPLETED** - All tables created with proper schema

3. **Configure Authentication**
   - Enable email/password authentication
   - Add Google OAuth provider
   - Set up redirect URLs
   - Configure email templates

4. **Set Up Row Level Security**
   ✅ **COMPLETED** - RLS enabled on all tables

5. **Configure Storage (if needed)**
   - Create buckets for user uploads
   - Set up image optimization

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... (add all required environment variables)
```

### Domain Configuration

1. **Add custom domain in Vercel**
2. **Configure DNS records**
3. **Set up SSL certificate** (automatic with Vercel)
4. **Update CORS settings** in Supabase for custom domain

### Webhook Configuration

1. **Bolt Webhooks**
   - URL: `https://your-domain.com/api/webhooks/bolt`
   - Events: payment.completed, subscription.created, refund.processed

2. **Instagram Webhooks** (optional)
   - URL: `https://your-domain.com/api/webhooks/instagram`
   - Events: media updates

## 📊 Monitoring & Analytics

### Performance Monitoring
- Vercel Analytics (built-in)
- Google Analytics 4 integration
- Core Web Vitals tracking
- Error monitoring with Sentry

### Business Metrics
- Revenue tracking dashboard
- Customer acquisition metrics
- Booking conversion rates
- Referral program performance

### Alerts & Notifications
- Failed payment alerts
- Booking confirmation failures
- System downtime notifications
- Security incident alerts

---

# Troubleshooting

## 🐛 Common Issues & Solutions

### Build & Deployment Issues

**Issue**: Build fails with module resolution errors
```bash
# Solution: Clear cache and reinstall dependencies
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Issue**: Turbopack compatibility warnings
```bash
# Solution: Use standard webpack build for production
npm run build -- --no-turbo
```

### Database Connection Issues

**Issue**: Supabase connection timeouts
```typescript
// Solution: Implement connection retry logic
const supabaseClient = createClient(url, key, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'recovery-machine' },
  },
})
```

### Payment Processing Issues

**Issue**: Bolt webhook signature verification fails
```typescript
// Solution: Verify webhook configuration
const verifySignature = (payload: string, signature: string) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.BOLT_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}
```

### Performance Issues

**Issue**: Slow database queries
```sql
-- Solution: Add appropriate indexes
CREATE INDEX CONCURRENTLY idx_bookings_user_date 
ON bookings(user_id, date_time) 
WHERE status != 'cancelled';

-- Use EXPLAIN ANALYZE to optimize queries
EXPLAIN ANALYZE 
SELECT * FROM bookings 
WHERE user_id = $1 AND date_time > NOW()
ORDER BY date_time;
```

### Email/SMS Delivery Issues

**Issue**: Emails not delivering
```typescript
// Solution: Check Resend status and implement retry logic
const sendWithRetry = async (emailData: any, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await resend.emails.send(emailData)
      return result
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

## 🆘 Emergency Procedures

### System Downtime Response
1. Check Vercel deployment status
2. Verify Supabase database health
3. Monitor external service status (Bolt, Resend, Twilio)
4. Activate backup communication channels
5. Notify customers via social media

### Data Recovery Procedures
1. **Automated Backups**: Supabase provides point-in-time recovery
2. **Manual Backups**: Weekly CSV exports of critical data
3. **Disaster Recovery**: Multi-region deployment strategy

### Security Incident Response
1. Immediately rotate API keys if compromised
2. Enable additional authentication factors
3. Review access logs and user activities
4. Notify affected customers
5. Document incident and prevention measures

---

## 📞 Support & Maintenance

### Developer Support
- **Documentation**: This guide and inline code comments
- **API Testing**: Postman collection available
- **Development Environment**: Docker setup available
- **Code Quality**: ESLint + Prettier configuration

### Business Support
- **Admin Training**: Comprehensive admin user guide
- **Customer Service**: Built-in tools and workflows
- **Reporting**: Automated daily/weekly business reports
- **Monitoring**: Real-time alerts and dashboards

### Ongoing Maintenance
- **Security Updates**: Monthly security patches
- **Feature Updates**: Quarterly feature releases
- **Performance Optimization**: Continuous monitoring
- **Database Maintenance**: Automated optimization

---

## 🎯 Success Metrics & KPIs

### Technical Metrics
- **Uptime**: 99.9% target
- **Response Time**: <200ms average
- **Core Web Vitals**: All metrics in green
- **Error Rate**: <0.1%

### Business Metrics
- **Conversion Rate**: >3% target (currently optimized for 4-5%)
- **Customer Acquisition Cost**: <$150 per customer
- **Monthly Recurring Revenue**: Growth target 15% month-over-month
- **Referral Conversion**: >20% invitation to signup rate

---

*This documentation is maintained by the development team and updated with each major release. For additional support or feature requests, please contact the technical team.*