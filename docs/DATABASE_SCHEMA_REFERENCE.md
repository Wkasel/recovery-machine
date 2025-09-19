# 🗄️ Recovery Machine Database Schema Reference

## 📋 Schema Overview

The Recovery Machine database is built on PostgreSQL via Supabase, designed for a mobile spa/wellness service. It includes 8 core tables with complete referential integrity, Row Level Security (RLS), and automated business logic triggers.

**Database**: PostgreSQL 17.6.1  
**Host**: db.cgtazlhcyhghjlawkirf.supabase.co  
**Project ID**: cgtazlhcyhghjlawkirf  
**Region**: us-west-1  

---

## 📊 Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   auth.users│    │  profiles   │    │   orders    │
│  (Supabase) │───▶│             │◀───│             │
│             │    │ - referral  │    │ - bolt_id   │
│             │    │ - credits   │    │ - amount    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                  │                   │
       │                  │                   │
       ▼                  ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  bookings   │    │ referrals   │    │   reviews   │
│             │    │             │    │             │
│ - date_time │    │ - invitee   │    │ - rating    │
│ - service   │    │ - status    │    │ - comment   │
│ - address   │    │ - rewards   │    │ - featured  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                                     │
       │            ┌─────────────┐         │
       │            │availability │         │
       │            │   _slots    │         │
       │            │             │         │
       │            │ - date      │         │
       │            │ - time      │         │
       │            │ - available │         │
       │            └─────────────┘         │
       │                                     │
       ▼                                     ▼
┌─────────────┐                    ┌─────────────┐
│   admins    │                    │credit_trans │
│             │                    │  actions    │
│ - role      │                    │             │
│ - email     │                    │ - amount    │
│ - perms     │                    │ - type      │
└─────────────┘                    └─────────────┘
```

---

## 🧑‍💼 Table Definitions

### 1. **profiles** - Extended User Information

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address JSONB,
  referral_code TEXT UNIQUE,
  credits INTEGER DEFAULT 0 CHECK (credits >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Extends Supabase auth.users with Recovery Machine specific data  
**Key Features**:
- Automatic referral code generation via trigger
- Credit balance tracking
- Address storage for delivery preferences
- Phone number for SMS notifications

**Business Rules**:
- Credits cannot be negative
- Referral codes are unique and auto-generated
- Profile created automatically on user signup

**Indexes**:
```sql
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX idx_profiles_email ON profiles(email);
```

**Sample Data**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "sarah@example.com",
  "full_name": "Sarah Johnson",
  "phone": "+1-555-0123",
  "address": {
    "street": "123 Main St",
    "city": "Los Angeles", 
    "state": "CA",
    "zip": "90210"
  },
  "referral_code": "SARAH123",
  "credits": 150,
  "created_at": "2024-09-19T10:00:00Z"
}
```

---

### 2. **orders** - Payment Tracking

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bolt_checkout_id TEXT,
  amount INTEGER NOT NULL CHECK (amount > 0),
  setup_fee_applied INTEGER DEFAULT 0,
  status order_status DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Tracks all payments and financial transactions  
**Key Features**:
- Bolt payment system integration via checkout_id
- Amount stored in cents for precision
- Setup fee tracking for new customers
- Metadata for additional payment information

**Status Values**:
- `pending`: Payment initiated but not completed
- `paid`: Payment successful and confirmed
- `failed`: Payment failed or declined
- `refunded`: Payment refunded to customer

**Business Rules**:
- Amount must be positive (stored in cents)
- Setup fee applied once per customer
- Bolt checkout ID links to external payment

**Indexes**:
```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

**Sample Data**:
```json
{
  "id": "ord_123456",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "bolt_checkout_id": "bolt_checkout_789",
  "amount": 40000,
  "setup_fee_applied": 25000,
  "status": "paid",
  "metadata": {
    "subscription_id": "sub_456",
    "payment_method": "card_ending_1234"
  }
}
```

---

### 3. **bookings** - Session Scheduling

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  date_time TIMESTAMPTZ NOT NULL,
  duration INTEGER DEFAULT 30 CHECK (duration > 0),
  service_type TEXT NOT NULL,
  add_ons JSONB DEFAULT '{}',
  status booking_status DEFAULT 'scheduled',
  notes TEXT,
  address JSONB NOT NULL,
  total_amount INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT future_booking CHECK (date_time > NOW())
);
```

**Purpose**: Core booking system for wellness sessions  
**Key Features**:
- Service type selection (cold_plunge, infrared_sauna, combo)
- Add-ons for upselling (family, towels, electrolytes)
- Delivery address per booking
- Prevent past booking constraint

**Service Types**:
- `cold_plunge`: Cold plunge therapy session
- `infrared_sauna`: Infrared sauna session
- `combo`: Combined cold plunge + sauna session

**Status Values**:
- `scheduled`: Booking created, awaiting confirmation
- `confirmed`: Booking confirmed, team notified
- `completed`: Session completed successfully
- `cancelled`: Booking cancelled by customer/admin

**Add-ons Structure**:
```json
{
  "family": true,           // Additional family members
  "extra_visits": 2,        // Extra sessions this month
  "towels": true,           // Branded recovery towels
  "electrolytes": true      // Post-session electrolyte drinks
}
```

**Business Rules**:
- Must be scheduled in the future
- Duration in minutes (30 min default)
- Address required for mobile service
- One booking per time slot per customer

**Indexes**:
```sql
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_date_time ON bookings(date_time);
CREATE INDEX idx_bookings_status ON bookings(status);
```

---

### 4. **referrals** - Reward Program

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  invitee_email TEXT NOT NULL,
  invitee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status referral_status DEFAULT 'pending',
  reward_credits INTEGER DEFAULT 50,
  referral_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  UNIQUE(referrer_id, invitee_email)
);
```

**Purpose**: Manages referral program and reward distribution  
**Key Features**:
- $50 default reward for successful referrals
- 30-day expiration window
- Email-based invitation system
- Automatic credit distribution

**Status Values**:
- `pending`: Invitation sent, awaiting signup
- `accepted`: Invitee signed up and credited
- `expired`: 30-day window expired

**Business Rules**:
- One referral per email per referrer
- Credits awarded automatically on successful signup
- Referrals expire after 30 days
- Both referrer and invitee receive credits

**Reward Flow**:
1. User sends referral invitation
2. Friend receives email with signup link
3. Friend signs up using referral code
4. System awards $50 to both users
5. Credits applied automatically

**Indexes**:
```sql
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_invitee_email ON referrals(invitee_email);
CREATE INDEX idx_referrals_status ON referrals(status);
```

---

### 5. **reviews** - Customer Feedback

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_featured BOOLEAN DEFAULT false,
  google_synced BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, booking_id)
);
```

**Purpose**: Collects and manages customer feedback and ratings  
**Key Features**:
- 5-star rating system
- Featured reviews for homepage
- Google Reviews integration
- One review per booking

**Business Rules**:
- Rating must be 1-5 stars
- One review per booking per user
- Featured reviews displayed on homepage
- Reviews can be synced to Google

**Review Request Flow**:
1. Session completed
2. Automated email sent 2 hours later
3. Customer clicks review link
4. Review submitted and stored
5. High ratings marked for featuring

**Indexes**:
```sql
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_featured ON reviews(is_featured) WHERE is_featured = true;
```

---

### 6. **admins** - Role-Based Access

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role admin_role DEFAULT 'operator',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES admins(id)
);
```

**Purpose**: Manages administrative access and permissions  
**Key Features**:
- Three-tier role hierarchy
- Email-based admin identification
- Creation audit trail

**Role Hierarchy**:
- `operator`: Basic booking management
  - View bookings and customers
  - Confirm/cancel appointments
  - Basic customer service

- `admin`: Full business operations
  - All operator permissions
  - Payment processing and refunds
  - Analytics and reporting
  - User credit management

- `super_admin`: System administration
  - All admin permissions
  - Create/manage other admins
  - System configuration
  - Database access

**Business Rules**:
- Email must match auth.users email
- Role determines access permissions
- Super admins can create other admins
- Creation audit trail maintained

---

### 7. **credit_transactions** - Audit Trail

```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type credit_transaction_type NOT NULL,
  description TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);
```

**Purpose**: Complete audit trail for all credit movements  
**Key Features**:
- Positive/negative amount tracking
- Transaction type categorization
- Reference linking to source
- Admin attribution

**Transaction Types**:
- `earned`: Credits earned from referrals
- `spent`: Credits used for payments
- `refunded`: Credits from refunds
- `adjustment`: Manual admin adjustments

**Business Rules**:
- Amount can be positive (earned) or negative (spent)
- Description required for all transactions
- Reference ID links to source (booking, referral, etc.)
- Admin attribution for manual adjustments

**Automatic Triggers**:
- Referral completion awards credits
- Profile credits updated on insert
- Audit trail maintained automatically

---

### 8. **availability_slots** - Calendar Management

```sql
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_bookings INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_booking_count CHECK (current_bookings <= max_bookings)
);
```

**Purpose**: Manages available time slots for booking calendar  
**Key Features**:
- Daily time slot definition
- Multi-booking support per slot
- Availability toggle
- Booking count tracking

**Business Rules**:
- End time must be after start time
- Current bookings cannot exceed maximum
- Admin-controlled availability
- Prevents double-booking

**Usage Pattern**:
1. Admin creates availability slots
2. Customers see available times
3. Booking increments current_bookings
4. Slot becomes unavailable when max reached

---

## 🔐 Row Level Security (RLS) Policies

### User Data Access
```sql
-- Users can only access their own profiles
CREATE POLICY "Users own profile data" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Users can view their own orders
CREATE POLICY "Users own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own bookings
CREATE POLICY "Users own bookings" ON bookings
  FOR ALL USING (auth.uid() = user_id);
```

### Admin Access
```sql
-- Admins can access all data
CREATE POLICY "Admins full access" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
```

### Public Data
```sql
-- Anyone can view availability slots
CREATE POLICY "Public availability viewing" ON availability_slots
  FOR SELECT TO authenticated USING (true);

-- Anyone can view public reviews
CREATE POLICY "Public reviews viewing" ON reviews
  FOR SELECT TO authenticated USING (true);
```

---

## ⚡ Database Triggers & Functions

### 1. Automatic Referral Code Generation
```sql
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(LEFT(MD5(RANDOM()::TEXT), 8));
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_referral_code();
```

### 2. Credit Award System
```sql
CREATE OR REPLACE FUNCTION award_referral_credits()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Award credits to both referrer and invitee
    UPDATE profiles SET credits = credits + NEW.reward_credits 
    WHERE id = NEW.referrer_id;
    
    UPDATE profiles SET credits = credits + NEW.reward_credits 
    WHERE id = NEW.invitee_id;
    
    -- Record transactions
    INSERT INTO credit_transactions (user_id, amount, type, description, reference_id)
    VALUES (NEW.referrer_id, NEW.reward_credits, 'earned', 'Referral reward', NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3. Updated Timestamp Maintenance
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applied to all tables with updated_at column
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 📊 Common Queries & Analytics

### Business Metrics
```sql
-- Monthly revenue calculation
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(amount) / 100.0 as revenue_dollars,
  COUNT(*) as order_count,
  AVG(amount) / 100.0 as avg_order_value
FROM orders 
WHERE status = 'paid'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Customer lifetime value
SELECT 
  p.email,
  COUNT(DISTINCT b.id) as total_bookings,
  SUM(o.amount) / 100.0 as lifetime_value,
  MAX(b.date_time) as last_booking
FROM profiles p
LEFT JOIN bookings b ON p.id = b.user_id
LEFT JOIN orders o ON b.order_id = o.id
WHERE o.status = 'paid'
GROUP BY p.id, p.email
ORDER BY lifetime_value DESC;
```

### Referral Program Analytics
```sql
-- Top referrers leaderboard
SELECT 
  p.email as referrer_email,
  p.full_name as referrer_name,
  COUNT(*) as total_referrals,
  COUNT(CASE WHEN r.status = 'accepted' THEN 1 END) as successful_referrals,
  SUM(CASE WHEN r.status = 'accepted' THEN r.reward_credits ELSE 0 END) as credits_earned
FROM referrals r
JOIN profiles p ON r.referrer_id = p.id
GROUP BY p.id, p.email, p.full_name
HAVING COUNT(CASE WHEN r.status = 'accepted' THEN 1 END) > 0
ORDER BY successful_referrals DESC, total_referrals DESC;

-- Referral conversion rates
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as invitations_sent,
  COUNT(CASE WHEN status = 'accepted' THEN 1 END) as successful_signups,
  ROUND(
    COUNT(CASE WHEN status = 'accepted' THEN 1 END) * 100.0 / COUNT(*), 
    2
  ) as conversion_rate_percent
FROM referrals
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

### Booking Analytics
```sql
-- Popular service types
SELECT 
  service_type,
  COUNT(*) as booking_count,
  AVG(duration) as avg_duration,
  SUM(total_amount) / 100.0 as total_revenue
FROM bookings
WHERE status = 'completed'
GROUP BY service_type
ORDER BY booking_count DESC;

-- Peak booking times
SELECT 
  EXTRACT(hour FROM date_time) as hour_of_day,
  COUNT(*) as booking_count
FROM bookings
WHERE status IN ('completed', 'confirmed')
GROUP BY EXTRACT(hour FROM date_time)
ORDER BY hour_of_day;
```

---

## 🛠️ Database Maintenance

### Performance Optimization
```sql
-- Analyze table statistics
ANALYZE profiles, orders, bookings, referrals, reviews;

-- Reindex for performance
REINDEX INDEX idx_bookings_date_time;
REINDEX INDEX idx_orders_user_id;

-- Vacuum for cleanup
VACUUM ANALYZE bookings;
```

### Data Cleanup
```sql
-- Clean up expired referrals (older than 60 days)
DELETE FROM referrals 
WHERE status = 'pending' 
AND expires_at < NOW() - INTERVAL '30 days';

-- Archive old completed bookings (optional)
CREATE TABLE bookings_archive AS 
SELECT * FROM bookings 
WHERE status = 'completed' 
AND date_time < NOW() - INTERVAL '1 year';
```

### Backup & Recovery
```sql
-- Export critical business data
COPY (
  SELECT 
    p.email,
    p.full_name,
    p.credits,
    COUNT(b.id) as total_bookings,
    SUM(o.amount) as total_spent
  FROM profiles p
  LEFT JOIN bookings b ON p.id = b.user_id
  LEFT JOIN orders o ON b.order_id = o.id
  GROUP BY p.id, p.email, p.full_name, p.credits
) TO '/backup/customer_summary.csv' WITH CSV HEADER;
```

---

## 🔍 Troubleshooting Common Issues

### Data Integrity Checks
```sql
-- Find bookings without valid orders
SELECT b.id, b.user_id, b.order_id
FROM bookings b
LEFT JOIN orders o ON b.order_id = o.id
WHERE b.order_id IS NOT NULL AND o.id IS NULL;

-- Find credit imbalances
SELECT 
  p.id,
  p.email,
  p.credits as current_credits,
  COALESCE(SUM(ct.amount), 0) as transaction_total
FROM profiles p
LEFT JOIN credit_transactions ct ON p.id = ct.user_id
GROUP BY p.id, p.email, p.credits
HAVING p.credits != COALESCE(SUM(ct.amount), 0);
```

### Performance Issues
```sql
-- Find slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
WHERE mean_time > 1000
ORDER BY mean_time DESC;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE tablename IN ('profiles', 'orders', 'bookings', 'referrals');
```

---

## 📋 Migration History

### Applied Migrations
1. ✅ **20250919051900_initial_recovery_machine_schema** - Core tables creation
2. ✅ **20250919051901_rls_policies** - Row Level Security policies
3. ✅ **RLS Enabled** - Security activated on all tables

### Future Migration Planning
- Email preferences table
- Advanced booking rules
- Multi-location support
- Team/staff management
- Inventory tracking

---

*This schema reference is maintained by the development team and updated with each database migration. For schema changes or additions, please follow the migration process outlined in the developer documentation.*