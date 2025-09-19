# The Recovery Machine Implementation Plan

Based on the PRD analysis, here's a structured approach to building out the application:

## Phase 1: Foundation & Core Setup (Week 1)
**Goal: Establish the technical foundation**

### 1.1 Database Schema Setup
- [ ] Create Supabase tables per PRD schema:
  - `users` (id, email, phone, address, referral_code, credits)
  - `orders` (id, user_id, bolt_checkout_id, amount, status, setup_fee_applied)
  - `bookings` (id, user_id, order_id, date_time, duration, add_ons, status)
  - `referrals` (id, referrer_id, invitee_email, status, reward_credits)
  - `reviews` (id, user_id, booking_id, rating, comment, google_synced)
  - `admins` (id, email, role)

### 1.2 Authentication Enhancement
- [ ] Keep existing auth system (already solid)
- [ ] Add user profile fields (phone, address, referral_code, credits)
- [ ] Add role-based access control for admin panel

### 1.3 Bolt Payment Integration
- [ ] Set up Bolt SDK
- [ ] Create payment components
- [ ] Handle subscription and one-time payments
- [ ] Webhook handling for payment status

### 1.4 Basic Navigation
- [ ] Create navigation component with Recovery Machine branding
- [ ] Set up routing: `/` (home), `/book`, `/profile`, `/admin`
- [ ] Implement mobile-responsive hamburger menu

## Phase 2: Home Page & Landing Experience (Week 2)
**Goal: Complete the conversion-focused landing page**

### 2.1 Hero Section Enhancement
- [x] Basic hero with Recovery Machine branding ✅
- [ ] Add background video support (autoplay, muted, loop)
- [ ] Implement scroll-triggered animations
- [ ] Add "Learn More" scroll-to functionality

### 2.2 How It Works Section
- [ ] Create 4-step timeline component
- [ ] Add icons for each step (Calendar, Van, Plunge/Sauna, Repeat)
- [ ] Mobile-responsive layout (horizontal → stacked)
- [ ] Animation on scroll

### 2.3 Social Proof Section
- [ ] Testimonials carousel with Swiper.js
- [ ] Instagram integration (Basic Display API)
- [ ] Star ratings display
- [ ] "Join 500+ Members" counter

### 2.4 Pricing Section
- [ ] Create pricing table component
- [ ] Display membership plans, setup fees, add-ons
- [ ] Highlight value propositions
- [ ] CTA buttons linking to booking flow

### 2.5 Email Collection
- [ ] Newsletter signup form
- [ ] Integration with Resend for email handling
- [ ] Exit-intent popup on mobile
- [ ] Double opt-in flow

## Phase 3: Booking Flow & User Dashboard (Week 3)
**Goal: Core booking functionality and user management**

### 3.1 Booking Page (`/book`)
- [ ] Multi-step booking form with progress indicator
- [ ] Plan selection (Membership/One-time/Add-ons)
- [ ] Address input with Google Maps integration for distance calculation
- [ ] Calendar component (FullCalendar.js) with real-time availability
- [ ] Bolt checkout integration (embedded iframe)
- [ ] Confirmation page with email trigger

### 3.2 User Dashboard (`/profile`)
- [ ] Dashboard overview with quick actions
- [ ] Bookings management (view, edit, cancel with 30-day notice)
- [ ] Order history with Bolt receipt links
- [ ] Credits balance display
- [ ] Profile management

### 3.3 Referral System
- [ ] Generate unique referral codes
- [ ] Shareable referral links
- [ ] Track referral status and rewards
- [ ] Auto-apply $50 credits on successful referrals
- [ ] Referral dashboard section

### 3.4 Reviews System
- [ ] Post-session review prompts
- [ ] Review submission form
- [ ] Review display in user dashboard
- [ ] Google My Business API integration (if available)

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