# Recovery Machine Database Schema Documentation

## Overview

This document describes the complete database schema for the Recovery Machine application. The database is built on Supabase PostgreSQL with Row Level Security (RLS) enabled for all tables.

## 🗄️ Database Architecture

### Core Design Principles

- **Security First**: RLS policies protect all user data
- **Audit Trail**: All credit transactions are logged
- **Referential Integrity**: Foreign keys maintain data consistency
- **Performance**: Strategic indexing for common query patterns
- **Scalability**: JSONB fields for flexible data storage

### Schema Overview

```
auth.users (Supabase Auth)
    ↓
profiles (Extended user data)
    ↓
orders → bookings → reviews
    ↓        ↓
referrals    availability_slots
    ↓
credit_transactions
```

## 📊 Tables Documentation

### 1. Profiles Table

**Purpose**: Extends Supabase auth.users with Recovery Machine specific data

```sql
public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address JSONB DEFAULT '{}',
  referral_code VARCHAR(10) UNIQUE,    -- Auto-generated
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Key Features**:
- Auto-generates unique referral codes on insert
- Address stored as JSONB for flexibility
- Credits updated via triggers from credit_transactions

### 2. Orders Table

**Purpose**: Tracks all payments through Bolt checkout

```sql
public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  bolt_checkout_id VARCHAR(255),
  amount INTEGER NOT NULL,              -- in cents
  setup_fee_applied INTEGER DEFAULT 0,  -- in cents
  status VARCHAR(20) DEFAULT 'pending',
  order_type VARCHAR(20) DEFAULT 'subscription',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Status Values**: `pending`, `processing`, `paid`, `refunded`, `failed`
**Order Types**: `subscription`, `one_time`, `setup_fee`

### 3. Bookings Table

**Purpose**: Manages recovery session scheduling

```sql
public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  order_id UUID REFERENCES public.orders(id),
  date_time TIMESTAMPTZ NOT NULL,
  duration INTEGER DEFAULT 30,          -- minutes
  add_ons JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'scheduled',
  location_address JSONB DEFAULT '{}',
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Status Values**: `scheduled`, `confirmed`, `in_progress`, `completed`, `cancelled`, `no_show`
**Add-ons Example**: `{extra_visits: 2, family: true, sauna_time: 15}`

**Constraints**:
- Prevents overlapping bookings for same user
- 24-hour cancellation policy enforced by RLS

### 4. Referrals Table

**Purpose**: Manages the referral program

```sql
public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  invitee_email VARCHAR(255) NOT NULL,
  invitee_id UUID REFERENCES auth.users(id),  -- null until signup
  status VARCHAR(20) DEFAULT 'pending',
  reward_credits INTEGER DEFAULT 50,
  credits_awarded_at TIMESTAMPTZ NULL,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Status Flow**: `pending` → `signed_up` → `first_booking`
**Auto-Credit**: Triggers award credits when invitee makes first booking

### 5. Reviews Table

**Purpose**: Customer feedback and testimonials

```sql
public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  booking_id UUID NOT NULL REFERENCES public.bookings(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  google_synced BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  reviewer_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Constraints**:
- One review per booking
- Only for completed bookings
- Featured reviews shown on homepage

### 6. Admins Table

**Purpose**: Role-based access control

```sql
public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Roles**: `super_admin`, `admin`, `operator`

### 7. Credit Transactions Table

**Purpose**: Audit trail for all credit changes

```sql
public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  referral_id UUID REFERENCES public.referrals(id),
  amount INTEGER NOT NULL,              -- Can be negative
  transaction_type VARCHAR(30) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Transaction Types**: `referral_bonus`, `booking_credit`, `manual_adjustment`, `refund`
**Auto-Updates**: User credits updated via trigger

### 8. Availability Slots Table

**Purpose**: Calendar availability management

```sql
public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_bookings INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Schedule**:
- Monday-Friday: 9 AM - 5 PM
- Saturday: 8 AM - 6 PM  
- Sunday: 10 AM - 4 PM
- 30-minute slots

## 🔒 Security (RLS Policies)

### Profile Policies
- Users can view/edit own profile
- Admins can view/edit all profiles

### Order Policies
- Users can view own orders
- Users can only update pending orders
- Admins have full access

### Booking Policies
- Users can view/edit own bookings
- 24-hour cancellation policy enforced
- Admins have full access

### Referral Policies
- Users see referrals they created or were invited to
- System can update for automated processing

### Review Policies
- Users can review their own completed bookings
- Featured reviews are publicly viewable
- 7-day edit window for reviews

## 🚀 Database Operations

### Connection

```typescript
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

// Server-side
const supabase = createServerSupabaseClient();

// Client-side
const supabase = createBrowserSupabaseClient();
```

### Common Operations

```typescript
import { 
  createUserProfile, 
  getUserProfile, 
  createBooking, 
  getUserBookings,
  createReferral 
} from "@/lib/database";

// Create user profile
const result = await createUserProfile(userId, {
  email: "user@example.com",
  phone: "555-0123",
  address: { street: "123 Main St", city: "Seattle" }
});

// Create booking
const booking = await createBooking({
  user_id: userId,
  order_id: orderId,
  date_time: "2025-09-20T14:00:00Z",
  duration: 30,
  add_ons: { family: true },
  location_address: { street: "456 Oak Ave" }
});
```

## 🧪 Testing

### Run Database Tests

```bash
# Import test functions
import { runDatabaseTests } from "@/lib/database/test";

# Run all tests
const results = await runDatabaseTests();

# Individual tests
import { testTableAccess, testRLSPolicies } from "@/lib/database/test";
await testTableAccess();
await testRLSPolicies();
```

### Test Coverage

- ✅ Database connection
- ✅ Table access permissions
- ✅ CRUD operations for all tables
- ✅ RLS policy enforcement
- ✅ Trigger functionality (credits, referrals)

## 📈 Performance Considerations

### Indexes

Strategic indexes on frequently queried columns:
- `profiles.referral_code` (sparse index)
- `orders.user_id`, `orders.status`, `orders.created_at`
- `bookings.user_id`, `bookings.date_time`, `bookings.status`
- `referrals.referrer_id`, `referrals.invitee_email`
- `availability_slots.date`, `availability_slots.is_available`

### Query Optimization

- Use `select()` to limit returned columns
- Leverage RLS for automatic filtering
- Batch operations where possible
- Use JSONB operators for address/metadata queries

## 🔄 Realtime Features

Enabled for live updates:
- `bookings` - Real-time booking changes
- `availability_slots` - Live calendar updates  
- `orders` - Payment status updates

```typescript
// Subscribe to booking changes
supabase
  .channel('bookings')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'bookings' },
    (payload) => console.log('Booking changed:', payload)
  )
  .subscribe();
```

## 🚀 Deployment

### Migrations

1. Apply migrations in order:
   ```bash
   # 20250919051900_initial_recovery_machine_schema.sql
   # 20250919051901_rls_policies.sql
   ```

2. Seed initial data:
   ```bash
   # supabase/seed.sql (availability slots)
   ```

3. Configure environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

### Production Checklist

- [ ] Migrations applied successfully
- [ ] RLS policies enabled and tested
- [ ] Indexes created for performance
- [ ] Backup strategy configured
- [ ] Monitoring alerts set up
- [ ] Service role key secured
- [ ] Connection pooling configured

## 🆘 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check policy conditions match query
   - Verify admin status for admin operations

2. **Migration Failures**
   - Check for existing table conflicts
   - Verify foreign key references
   - Ensure proper permissions

3. **Performance Issues**
   - Check query execution plans
   - Verify indexes are being used
   - Consider query optimization

### Support

- Check Supabase Dashboard for errors
- Review server logs for SQL errors
- Test with direct SQL queries first
- Verify RLS policies with auth context

---

**Last Updated**: 2025-09-19
**Database Version**: PostgreSQL 15
**Supabase Version**: Latest
**Schema Version**: 1.0.0