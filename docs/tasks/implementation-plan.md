# 🎯 Recovery Machine Implementation Plan

## Current State Analysis
✅ **Foundation Complete:**
- Next.js 15.3.0 + TypeScript + Tailwind v4
- Supabase auth & database integration
- Google sign-in working
- Professional navbar with Recovery Machine branding
- Clean auth pages (sign-in/sign-up)
- Development server running smoothly

## Database Schema Implementation

### Phase 1: Core Tables Setup
```sql
-- Already have: users (from Supabase Auth)
-- Need to add these tables:

-- Users Extension (add referral_code, credits)
ALTER TABLE users ADD COLUMN referral_code VARCHAR(10) UNIQUE;
ALTER TABLE users ADD COLUMN credits INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN address JSONB;

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  bolt_checkout_id VARCHAR(255),
  amount INTEGER, -- in cents
  setup_fee_applied INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending', -- pending/paid/refunded
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table  
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES orders(id),
  date_time TIMESTAMPTZ NOT NULL,
  duration INTEGER DEFAULT 30, -- minutes
  add_ons JSONB DEFAULT '{}', -- {extra_visits: 2, family: true}
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled/cancelled/completed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id),
  invitee_email VARCHAR(255) NOT NULL,
  invitee_id UUID REFERENCES auth.users(id), -- null until they sign up
  status VARCHAR(20) DEFAULT 'pending', -- pending/accepted/expired
  reward_credits INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  google_synced BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins table (simple role-based access)
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin', -- super/admin
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Implementation Phases

### 🏗️ Phase 1: Foundation & Home Page (Week 1)
**Priority: HIGH** | **Estimated: 3-4 days**

#### 1.1 Database Setup
- [ ] Create Supabase migration files for all tables
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create database types for TypeScript
- [ ] Test database connections and queries

#### 1.2 Home Page Hero Section
- [ ] Create hero component with video background support
- [ ] Add "Recovery When You Need It" headline
- [ ] Implement dual CTA buttons (Book Now / Learn More)
- [ ] Add trust badges and security indicators
- [ ] Mobile-responsive design with proper breakpoints

#### 1.3 Navigation Updates
- [ ] Update navbar with PRD navigation (Home, How It Works, Pricing, Book Now)
- [ ] Add scroll-to-section functionality
- [ ] Implement sticky behavior with background changes on scroll

**Files to create/modify:**
```
/app/page.tsx (homepage)
/components/sections/Hero.tsx
/components/sections/Navigation.tsx
/supabase/migrations/001_initial_schema.sql
/lib/types/database.ts
```

### 📖 Phase 2: Content Sections (Week 1-2)
**Priority: HIGH** | **Estimated: 4-5 days**

#### 2.1 How It Works Section
- [ ] Create 4-step timeline component
- [ ] Add icons for each step (Calendar, Van, Plunge/Sauna, Repeat)
- [ ] Implement responsive layout (horizontal desktop, stacked mobile)
- [ ] Add "Start Recovering" CTA

#### 2.2 Social Proof Section  
- [ ] Create testimonials carousel component (Swiper.js)
- [ ] Design testimonial cards with photos and ratings
- [ ] Add Instagram integration setup (Basic Display API)
- [ ] Create Instagram photo grid component
- [ ] Add aggregate stats ("Join 500+ Members", "4.8/5 rating")

#### 2.3 Pricing Section
- [ ] Create pricing table component
- [ ] Display membership plans with clear value props
- [ ] Add setup fee calculator based on location
- [ ] Implement "Subscribe Now" CTA with plan pre-filling
- [ ] Mobile-responsive pricing cards

**Files to create:**
```
/components/sections/HowItWorks.tsx
/components/sections/SocialProof.tsx
/components/sections/Pricing.tsx
/components/ui/Testimonials.tsx
/lib/instagram.ts
/components/ui/PricingCard.tsx
```

### 📅 Phase 3: Booking System (Week 2-3)
**Priority: CRITICAL** | **Estimated: 5-6 days**

#### 3.1 Booking Flow Setup
- [ ] Create `/book` page with stepper component
- [ ] Implement 4-step process: Plan Selection → Address/Schedule → Calendar → Payment
- [ ] Add form validation with Zod schemas
- [ ] Create progress indicator component

#### 3.2 Plan & Add-ons Selection
- [ ] Build plan selection component (Weekly Membership, One-time)
- [ ] Add add-ons selection (Extra visits, Family members)
- [ ] Implement dynamic pricing calculation
- [ ] Add setup fee calculator with distance API

#### 3.3 Calendar Integration  
- [ ] Install and configure FullCalendar.js
- [ ] Create availability management system
- [ ] Implement real-time slot updates via Supabase Realtime
- [ ] Add booking conflict prevention
- [ ] Mobile-friendly calendar interface

#### 3.4 Address & Setup Fee
- [ ] Integrate Google Maps API for address validation
- [ ] Implement distance calculation for setup fees
- [ ] Create address form with autocomplete
- [ ] Add delivery area validation

**Files to create:**
```
/app/book/page.tsx
/components/booking/BookingWizard.tsx
/components/booking/PlanSelection.tsx
/components/booking/AddressForm.tsx
/components/booking/Calendar.tsx
/lib/maps.ts
/lib/calendar.ts
/core/schemas/booking.ts
```

### 💳 Phase 4: Payment Integration (Week 3)
**Priority: CRITICAL** | **Estimated: 3-4 days**

#### 4.1 Bolt Integration
- [ ] Set up Bolt merchant account and API keys
- [ ] Create Bolt checkout component
- [ ] Implement subscription handling for recurring payments
- [ ] Add one-time payment support for setup fees
- [ ] Handle payment success/failure states

#### 4.2 Order Management
- [ ] Create order creation logic
- [ ] Implement payment webhook handling
- [ ] Add order status updates
- [ ] Create confirmation emails (Resend integration)
- [ ] Add receipt generation

**Files to create:**
```
/components/payment/BoltCheckout.tsx
/lib/bolt.ts
/core/actions/orders.ts
/app/api/webhooks/bolt/route.ts
/core/email/templates.tsx
```

### 👤 Phase 5: User Dashboard (Week 3-4)
**Priority: HIGH** | **Estimated: 4-5 days**

#### 5.1 Dashboard Layout
- [ ] Create protected `/profile` route with auth middleware
- [ ] Build tabbed dashboard layout
- [ ] Add overview section with quick actions
- [ ] Display credits balance and referral stats

#### 5.2 Bookings Management
- [ ] Create bookings list with edit/cancel functionality
- [ ] Add 30-day cancellation policy enforcement  
- [ ] Implement rescheduling interface
- [ ] Add booking history view

#### 5.3 Referral System
- [ ] Generate unique referral codes
- [ ] Create shareable referral links
- [ ] Track referral status and rewards
- [ ] Implement credit application system
- [ ] Add social sharing buttons

#### 5.4 Reviews System
- [ ] Create post-session review prompts
- [ ] Build review submission form
- [ ] Display user's review history
- [ ] Add Google Reviews integration (optional)

**Files to create:**
```
/app/(protected)/profile/page.tsx
/components/dashboard/Overview.tsx
/components/dashboard/BookingsTab.tsx
/components/dashboard/ReferralsTab.tsx
/components/dashboard/ReviewsTab.tsx
/core/actions/referrals.ts
/core/actions/reviews.ts
```

## Phase 4: Admin Panel & Advanced Features (Week 4)
**Goal: Backend management and polish**

### 4.1 Admin Panel (`/admin`)
- [ ] Role-based access control (super/admin)
- [ ] Dashboard with key metrics
- [ ] User management (search, edit profiles, manage credits)
- [ ] Order management (view, edit, refund via Bolt API)
- [ ] Booking management (calendar view, conflict resolution)
- [ ] Referral analytics and export

### 4.2 Real-time Features
- [ ] Live booking availability updates
- [ ] Real-time notifications for booking changes
- [ ] Admin real-time dashboard updates

### 4.3 Email System
- [ ] Booking confirmation emails
- [ ] Reminder emails (24hrs before session)
- [ ] Cancellation notifications
- [ ] Referral invitation emails
- [ ] Newsletter system

### 4.4 SEO & Performance
- [ ] Dynamic meta tags for all pages
- [ ] Sitemap generation
- [ ] Image optimization
- [ ] Core Web Vitals optimization
- [ ] OpenGraph and Twitter Card setup

## Phase 5: Testing & Launch Preparation (Week 5)
**Goal: Quality assurance and go-live preparation**

### 5.1 Testing
- [ ] Unit tests for critical functions
- [ ] Integration tests for booking flow
- [ ] E2E tests with Cypress
- [ ] Payment flow testing (Bolt sandbox)
- [ ] Mobile responsiveness testing
- [ ] Performance testing

### 5.2 Analytics & Monitoring
- [ ] PostHog or Google Analytics integration
- [ ] Conversion funnel tracking
- [ ] Error monitoring (Sentry already configured)
- [ ] Performance monitoring

### 5.3 Launch Preparation
- [ ] Environment configuration (production)
- [ ] SSL setup
- [ ] Domain configuration
- [ ] Backup strategy
- [ ] Monitoring alerts

## Technical Architecture Decisions

### Keep from Existing Codebase:
- ✅ Next.js 14+ with App Router
- ✅ Supabase (Auth, Database, Real-time)
- ✅ TypeScript + Zod validation
- ✅ Tailwind CSS + Shadcn/ui components
- ✅ Server actions pattern
- ✅ Error handling system
- ✅ Authentication system (OAuth, email, magic link)

### Add for Recovery Machine:
- 🔄 Bolt payment integration
- 🔄 FullCalendar.js for booking calendar
- 🔄 Swiper.js for testimonial carousel
- 🔄 Instagram Basic Display API
- 🔄 Google Maps integration
- 🔄 Resend for transactional emails
- 🔄 Video background support

### Remove/Simplify:
- ❌ Unnecessary starter template branding ✅
- ❌ Storybook (unless needed for component development)
- ❌ Complex authentication forms (keep simple)
- ❌ Generic hero content ✅

## Success Metrics
- Booking conversion rate target: >3%
- Page load time: <2s (LCP)
- Mobile-first: 80% of traffic expected mobile
- User retention: Track monthly active users
- Payment success rate: >95%

## Risk Mitigation
- **Bolt Integration**: Start with sandbox, thorough testing
- **Real-time Updates**: Fallback to polling if WebSocket issues
- **Video Background**: Fallback to static image for slow connections
- **Calendar Conflicts**: Double-booking prevention with database constraints
- **Payment Failures**: Clear error messages and retry mechanisms

This plan maintains the solid technical foundation you've built while systematically implementing the PRD requirements in a logical, testable progression.