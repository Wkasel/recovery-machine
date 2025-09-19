# Website/Web App Specification for The Recovery Machine

This spec outlines a high-converting, mobile-first single-page application (SPA) built with Next.js (App Router for optimal performance), Supabase (for auth, database, and real-time features), and Bolt (for payments, including their PSP for seamless checkout). The design prioritizes conversion through clear CTAs, minimal friction in booking flows, social proof, and urgency (e.g., limited spots via subtle scarcity messaging). Mobile-friendliness is ensured via responsive design (Tailwind CSS), fast loading (Next.js Image optimization, lazy-loading), and touch-friendly interactions.

Key principles:
- **Conversion Focus**: Every page/section funnels toward booking (e.g., floating CTA on scroll, exit-intent modals for email capture).
- **Mobile-First**: Breakpoints start at mobile (320px+), with hamburger nav, swipeable carousels, and thumb-zone CTAs.
- **Performance**: Core Web Vitals targets (LCP <2s, FID <100ms) via static generation, ISR for dynamic content, and image optimization.
- **Sharing Optimization**: Open Graph tags (og:title, og:image, og:description) on all pages; Twitter Cards for X shares. Dynamic meta via Next.js Head.
- **Accessibility**: WCAG 2.1 AA compliance (ARIA labels, keyboard nav, alt text).
- **Analytics**: Integrate PostHog or Google Analytics for funnel tracking (e.g., CTA clicks, drop-offs).

## Tech Stack & Architecture
- **Frontend**: Next.js 14+ (SPA via client-side routing with `next/navigation`). Use TypeScript for type safety.
- **Backend/Database**: Supabase (Postgres for users/orders/bookings/referrals; Auth for JWT sessions; Realtime for live availability).
- **Payments**: Bolt (embedded checkout for subscriptions/one-offs; handle setup fees/add-ons as line items).
- **Styling**: Tailwind CSS + Headless UI/Shadcn for components.
- **Deployment**: Vercel (auto-deploys from GitHub; edge caching).
- **Other**:
  - Email: Supabase Edge Functions + Resend for transactional emails (e.g., booking confirmations).
  - Instagram Integration: Use Instagram Basic Display API to fetch/render recent posts (via Supabase cron job for caching).
  - Reviews: Embed Google Reviews widget; push user reviews to Google My Business via API (if eligible; fallback to in-app feed stored in Supabase).
  - SEO: Next.js Metadata API; sitemap.xml auto-generated.

Database Schema (Supabase Tables):
| Table | Key Fields | Purpose |
|-------|------------|---------|
| users | id, email, phone, address, referral_code, credits | User profiles & referral tracking. |
| orders | id, user_id, bolt_checkout_id, amount, status (pending/paid/refunded), setup_fee_applied | Payment history. |
| bookings | id, user_id, order_id, date_time, duration (30min default), add_ons (JSON: {extra_visits: 2, family: true}), status (scheduled/cancelled) | Scheduling with calendar conflicts. |
| referrals | id, referrer_id, invitee_email, status (pending/accepted), reward_credits | Give/get program (e.g., $50 credit each). |
| reviews | id, user_id, booking_id, rating (1-5), comment, google_synced (bool) | Reviews feed; auto-push to Google via webhook. |
| admins | id, email, role (super/admin) | Basic auth for admin panel. |

## Site Structure & Pages
SPA routing: `/` (home), `/book`, `/profile`, `/admin`. Use Next.js parallel routes for modals (e.g., login overlay).

### 1. Home Page (`/`)
Funnel: Hero → How It Works → Social Proof → Pricing → Email Capture → Footer CTA.
- **Layout**: Full-width, vertical scroll with sticky nav. Parallax video in hero for immersion.
- **Navigation Bar** (Sticky, top:0; collapses to hamburger on mobile):
  - Logo: "The Recovery Machine" (links to `/`).
  - Links: Home, How It Works, Pricing, Book Now (highlights on scroll).
  - Right: Login/Sign Up (Bolt-integrated for guest checkout fallback).
- **Hero Section** (100vh, overlay text/video):
  - Background: Autoplay muted promo video (MP4/WebM, 10-15s loop) showing van exterior/interior, cold plunge demo, sauna setup, client testimonials. Fallback: Static hero image.
  - Headline: "Recovery When You Need It" (H1, bold, 4-6rem on desktop, 2.5rem mobile).
  - Subheadline: "Mobile cold plunge & infrared sauna delivered to your door. Weekly sessions for peak performance." (Centered, fade-in animation).
  - CTAs: Two stacked buttons (primary: "Book Now" → `/book`; secondary: "Learn More" → #how-it-works). Mobile: Stacked vertically.
  - Conversion Tip: Add trust badges below CTAs (e.g., "Secure Payments via Bolt", "30-Day Flexibility").
- **How It Works Section** (ID: how-it-works; 3-4 step timeline):
  - Steps (horizontal on desktop, stacked on mobile):
    1. "Sign Up" – Icon: Calendar. "Choose your plan and schedule."
    2. "We Come to You" – Icon: Van. "Setup at your home (one-time fee)."
    3. "Recover" – Icon: Plunge/Sauna. "30-min session: Cold plunge + IR sauna."
    4. "Repeat Weekly" – Icon: Repeat. "4 visits/month, cancel anytime."
  - CTA: "Start Recovering" button → `/book`.
- **Social Proof / Testimonials Section**:
  - Carousel (Swiper.js): 5-7 rotating testimonials (pull from Supabase; format: quote, name, photo).
    - Example: "Transformed my routine – feel unstoppable!" – Athlete X.
  - Instagram Render Block: Embed grid of 6 recent IG photos (fetched via API; lazy-load). Caption: "See real recoveries in action. Follow @therecoverymachine."
  - Conversion Tip: Include star ratings (avg 4.8/5) and "Join 500+ Members" stat.
- **Pricing Section** (From attachment; table for clarity):
  | Plan | Details | Price |
  |------|---------|-------|
  | Weekly Recovery Membership | 4 home visits (1/week), 30 min/person, $100/session value | $400/month |
  | One-Time Setup Fee | Onboarding, setup, travel calibration, supplies (varies by distance/customization) | $250–$500 |
  | Optional Add-Ons | Extra visit: $150/session<br>Additional family member: $75/session<br>Complimentary branded towels & electrolytes | Varies |
  - How It Works Bullet: Monthly auto-renew, cancel with 30 days' notice, flexible scheduling, doorstep delivery.
  - CTA: "Subscribe Now" → `/book` (pre-fills plan).
  - Conversion Tip: Highlight "Just $100/session – Save 75% vs. single bookings."
- **Email Collection Section** (Footer-like, before CTA):
  - Form: Email input + "Get Recovery Tips & Exclusive Offers" (Supabase insert; double-opt-in via Resend).
  - Incentive: "Unlock 10% off first month."
  - Conversion Tip: Exit-intent popup on mobile (e.g., after 30s scroll).
- **Footer**: Links (Privacy, Terms), Social Icons (IG, X), Copyright. Final CTA: "Book Today" button.

### 2. Booking Page (`/book`)
- Flow: Form → Availability Calendar → Payment → Confirmation.
- Components:
  - Stepper: 1. Select Plan/Add-Ons (dropdowns: Membership/Extra Visits/Family). 2. Address/Schedule (Google Maps integration for distance calc → auto-setup fee). 3. Calendar (FullCalendar.js; real-time slots from Supabase). 4. Bolt Checkout (embedded iframe; handles sub/recurring).
  - Guest/Logged-In: Auto-fill from session.
  - Post-Booking: Email confirmation + referral share prompt ("Share for $50 credit").
- Conversion Tip: Progress bar, "Only 2 spots left this week" dynamic messaging.

### 3. User Dashboard (`/profile`) – Web App Core
Protected route (Supabase Auth).
- Tabs: Overview, Bookings, History, Referrals, Reviews.
  - **Overview**: Welcome + quick rebook CTA. Credits balance (from referrals).
  - **Bookings**: List view (table on desktop, cards on mobile) with edit/cancel (30-day notice check).
  - **History**: Orders table (date, amount, status; Bolt receipt links).
  - **Referrals (Give/Get Program)**: Shareable link (unique code). Track invites/accepted (Supabase query). Reward: Auto-apply $50 credit on acceptance.
  - **Reviews Feed**: Post-session prompt modal. List user reviews + aggregate rating. Button: "Share to Google" (API push if integrated).
- Conversion Tip: Upsell banners (e.g., "Add family for $75?").

### 4. Admin Panel (`/admin`) – Basic CRUD
Protected (role-based Supabase RLS).
- Dashboard: Metrics (total users, revenue via Bolt webhook, top referrers table).
- Tabs: Users (search/edit profile/credits), Orders (view/edit/refund via Bolt API), Bookings (calendar view, conflict resolution), Referrals (export CSV of top referrers).
- Implementation: TanStack Table for data grids; Supabase queries with infinite scroll.

## Development Roadmap
1. **Week 1**: Setup Next.js + Supabase + Bolt integration. Build hero + nav.
2. **Week 2**: Core pages (How It Works, Pricing, Social Proof). Instagram fetch.
3. **Week 3**: Booking flow + user dashboard. Referral logic.
4. **Week 4**: Admin panel, reviews integration, testing (Cypress for e2e).
5. **Launch**: A/B test CTAs (e.g., via Vercel Analytics). Monitor conversions.

This structure keeps it lean (under 10 components reusable) while driving bookings. Total est. build: 4-6 weeks for MVP. If tweaks needed (e.g., reorder sections), prioritize A/B testing post-launch.
