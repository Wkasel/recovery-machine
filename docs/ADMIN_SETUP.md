# Admin Panel Setup Guide

## Overview

The Recovery Machine admin panel provides comprehensive management tools for bookings, users, payments, and system configuration. This guide covers initial setup and admin management.

## Admin Roles

The system supports three admin roles with hierarchical permissions:

1. **super_admin** - Full system access including admin management
2. **admin** - Full access to business operations (bookings, users, payments)
3. **operator** - Limited access to bookings and basic user management

## Initial Setup

### Step 1: Run Admin Setup

After deploying the application, create the initial admin users:

```bash
# Method 1: Using curl (if server is running)
curl -X POST http://localhost:3000/api/admin/setup

# Method 2: Visit in browser (requires authentication first)
# Navigate to: http://localhost:3000/api/admin/setup
```

This will create two initial admins:
- `wkasel@gmail.com` - super_admin
- `william@dsco.co` - admin

### Step 2: Sign In

1. Navigate to `/sign-in`
2. Sign in with your admin email (wkasel@gmail.com)
3. You'll be redirected to `/admin` after successful authentication

### Step 3: Verify Admin Access

Check that admin access is working:

1. Visit `/admin` - You should see the admin dashboard
2. Check the sidebar shows "Role: super_admin"
3. Verify you see the "Admin Users" menu item (super_admin only)

## Managing Admin Users

### View All Admins

Navigate to `/admin/admins` to see all admin users.

### Add New Admin

Only **super_admin** users can add new admins:

1. Go to `/admin/admins`
2. Click "Add Admin"
3. Enter email address
4. Select role (admin or operator)
5. Click "Create Admin"

**Note:** Only admins and operators can be created through the UI. super_admin users must be created via database migration or the setup script.

### Deactivate Admin

To temporarily disable an admin without deleting:

1. Go to `/admin/admins`
2. Find the admin user
3. Click "Deactivate"

**Note:** super_admin users cannot be deactivated through the UI.

## Database Schema

### Admins Table

```sql
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'operator')),
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Stripe Integration

The admin panel has been updated to work with Stripe payments:

### Order Fields

- `stripe_session_id` - Stripe Checkout Session ID
- `stripe_subscription_id` - Stripe Subscription ID
- `stripe_payment_intent_id` - Stripe Payment Intent ID
- `bolt_checkout_id` - Legacy field (kept for historical data)

### Payment Manager

The Payment Manager (`/admin/orders`) displays both Stripe and legacy Bolt orders. New orders use Stripe fields.

## Admin Panel Features

### Dashboard (`/admin`)
- Revenue and booking statistics
- Recent activity timeline
- Quick actions

### Users (`/admin/users`)
- User list and search
- Credit management
- Transaction history

### Bookings (`/admin/bookings`)
- Booking calendar view
- Status management
- Details and editing

### Availability (`/admin/availability`)
- Manage booking slots
- Generate bulk availability
- Calendar configuration

### Orders (`/admin/orders`)
- Payment tracking (Stripe + legacy Bolt)
- Order status management
- Refund processing

### Reviews (`/admin/reviews`)
- Review moderation
- Featured testimonials
- Google sync status

### Referrals (`/admin/referrals`)
- Referral program stats
- Top referrers
- Credit awards

### Email Templates (`/admin/email-templates`)
- Template management
- Preview and testing
- Variable substitution

### Settings (`/admin/settings`)
- Business information
- Booking policies
- Pricing configuration
- Integration settings

### Admin Users (`/admin/admins`) - super_admin only
- Admin user management
- Role assignment
- Activity monitoring

## Security

### Authentication

Admin access requires:
1. Valid user authentication (Supabase Auth)
2. Email listed in `admins` table
3. `is_active = true`

### Authorization

Routes check role hierarchy:
- `/api/admin/*` endpoints use `requireAdminAccess()` middleware
- Super admin operations require `super_admin` role
- Most operations require `admin` or `operator` role

### Row Level Security (RLS)

The `admins` table has RLS enabled:
```sql
CREATE POLICY "Admins can read own data" ON admins
  FOR SELECT USING (auth.jwt() ->> 'email' = email);
```

## Troubleshooting

### Cannot Access Admin Panel

1. **Check if user is admin:**
   ```sql
   SELECT * FROM admins WHERE email = 'your@email.com';
   ```

2. **Verify is_active is true:**
   ```sql
   UPDATE admins SET is_active = true WHERE email = 'your@email.com';
   ```

3. **Check authentication:**
   - Sign out and sign in again
   - Clear browser cookies
   - Check Supabase auth logs

### Setup Script Fails

If `/api/admin/setup` fails:

1. Check Supabase connection
2. Verify `admins` table exists
3. Check server logs for specific errors
4. Try manual insertion:
   ```sql
   INSERT INTO admins (email, role, is_active)
   VALUES ('wkasel@gmail.com', 'super_admin', true)
   ON CONFLICT (email) DO UPDATE SET is_active = true;
   ```

### Missing Admin Users Menu

The "Admin Users" menu only appears for super_admin roles. Check your role:

```sql
SELECT role FROM admins WHERE email = 'your@email.com';
```

## Development

### Adding New Admin Features

1. Create component in `/components/admin/`
2. Create page in `/app/admin/[feature]/page.tsx`
3. Create API route in `/app/api/admin/[feature]/route.ts`
4. Add to sidebar in `/components/admin/AdminSidebar.tsx`
5. Implement authorization checks using `requireAdminAccess()`

### Testing Admin Features

Use the setup script to create test admins:

```typescript
// app/api/admin/setup/route.ts
const adminUsers = [
  { email: 'test-super@example.com', role: 'super_admin' },
  { email: 'test-admin@example.com', role: 'admin' },
  { email: 'test-operator@example.com', role: 'operator' },
];
```

## Support

For issues or questions:
- Check server logs: `npm run dev` output
- Review Supabase dashboard logs
- Check browser console for client errors
- Review this documentation for setup steps
