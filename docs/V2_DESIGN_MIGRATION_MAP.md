# Recovery Machine V2 Design Integration - Complete Migration Map

## Executive Summary

This document provides a comprehensive map of the current Recovery Machine Next.js application structure for V2 design integration. The current application is a mature, feature-rich platform with 30+ pages, 32+ component directories, and sophisticated booking/admin functionality.

**Key Metrics:**
- Total Pages: 30 (29 route-based pages)
- Component Categories: 32+ subdirectories
- Styling: Tailwind CSS with custom theme system (CSS variables)
- UI Library: shadcn/ui (60+ pre-built components)
- Architecture: App Router (Next.js 13+)
- State Management: React hooks + Context API
- Database: Supabase (PostgreSQL)
- Payment: Stripe integration

---

## 1. HOME PAGE STRUCTURE (`/`)

### Current Implementation: `/Users/williamkasel/Dev/reco-machine/recovery-machine-web/app/page.tsx`

**Composition:**
- Hero banner
- VideoShowcase
- SeasonalBanner
- Pricing section
- TrustBadges
- HowItWorks
- BrowseByGoal
- SocialProof
- EmailCapture

**Migration Strategy: UPDATE**
- The page structure is modular and section-based
- Each section component can be updated independently
- No file replacement needed, just component updates in `/components/sections/`

**Components to Update:**
- `/components/sections/Pricing.tsx`
- `/components/sections/HowItWorks.tsx`
- `/components/sections/SocialProof.tsx`
- `/components/sections/BrowseByGoal.tsx`
- `/components/sections/TrustBadges.tsx`
- `/components/sections/VideoShowcase.tsx`
- `/components/sections/EmailCapture.tsx`
- `/components/hero.tsx`

**Styling Touch Points:**
- `/app/globals.css` - Global theme variables
- `/tailwind.config.mjs` - Tailwind configuration with brand colors

---

## 2. ROOT LAYOUT & GLOBAL STYLING

### Root Layout: `/app/layout.tsx`
**Status: UPDATE (Minimal changes)**
- Geist font configuration
- Playfair Display for serif font
- AppProvider setup
- Header, main, Footer structure

### Global Styles: `/app/globals.css`
**Status: REPLACE/UPDATE**

**Current Theme (HSL-based CSS variables):**
```
Light Theme:
- --background: 48 40% 98% (Warm cream)
- --foreground: 0 0% 18% (Charcoal)
- --primary: 145 36% 73% (Sage Green)
- --secondary: 22 100% 63% (Warm Amber)
- --accent: 145 36% 73% (Sage Green)
- Brand color palette: Green 50-900 variants
```

### Tailwind Configuration: `/tailwind.config.mjs`
**Status: UPDATE**
- 116 lines of configuration
- Custom brand color palette
- Custom animations
- Custom border radius
- Font family definitions

---

## 3. BOOKING FLOW (HIGH PRIORITY)

### Pages:
- `/app/book/page.tsx` - Main booking wizard
- `/app/booking/[id]/confirmation/page.tsx` - Confirmation page

**Status: REPLACE (Complete redesign needed)**

### Multi-Step Flow (5 Steps):
1. **Service Selection** - Choose service type
2. **Address Form** - Delivery address input
3. **Calendar** - Date/time selection with FullCalendar
4. **Payment** - Payment details & amount review
5. **Confirmation** - Order confirmation display

### Booking Components to REPLACE:
- `/components/booking/ServiceSelection.tsx`
- `/components/booking/AddressForm.tsx`
- `/components/booking/BookingCalendar.tsx`
- `/components/booking/PaymentStep.tsx`
- `/components/booking/BookingConfirmation.tsx`
- `/components/booking/BookingStepper.tsx` (progress indicator)
- `/components/booking/ConfirmationStep.tsx` (alt confirmation)

**Keep Intact:**
- Business logic & state management
- Data types (`/lib/types/booking.ts`)
- API endpoints (`POST /api/bookings`)
- Validation logic

---

## 4. DASHBOARD (USER PROFILE)

**Location:** Dashboard section (separate app structure)

### Dashboard Components (`/components/dashboard/`):
- `DashboardLayout.tsx` - Main wrapper
- `Overview.tsx` - Stats/dashboard home
- `BookingsTab.tsx` - Booking history
- `ProfileSettings.tsx` - User profile
- `HistoryTab.tsx` - Booking history & analytics
- `ReviewsTab.tsx` - User reviews
- `ReferralsTab.tsx` - Referral tracking

**Status: UPDATE**
- Visual design refresh
- Keep layout structure
- Maintain all data logic

---

## 5. ADMIN SECTION (HIGH PRIORITY)

### Location: `/app/admin/` + `/components/admin/`

**Admin Layout:** `/app/admin/layout.tsx`
- Server-side auth check
- Admin role verification

### Admin Pages (13 total):
1. `/admin/` - Main dashboard
2. `/admin/bookings` - Booking management
3. `/admin/users` - User management
4. `/admin/orders` - Order tracking
5. `/admin/availability` - Availability rules
6. `/admin/settings` - Business settings
7. `/admin/reviews` - Review management
8. `/admin/referrals` - Referral tracking
9. `/admin/admins` - Admin management
10. `/admin/service-areas` - Service areas
11. `/admin/email-templates` - Email template editor
12. `/admin/exports` - Data export
13. `/admin/notifications` - Notification settings

### Admin Components (23 major files):
- `AdminDashboard.tsx` - Main dashboard view
- `AdminSidebar.tsx` - Navigation
- `AdminHeader.tsx` - Top bar
- `BookingManager.tsx` - Booking CRUD
- `UserManager.tsx` - User management
- `PaymentManager.tsx` - Payment tracking
- `AvailabilityManager.tsx` - Availability
- `ServiceAreaManager.tsx` - Service areas
- `EmailTemplateManager.tsx` - Email templates
- `AdminManagement.tsx` - Admin users
- Settings components (Business, Hours, Policies, Integration, Notification, System, Pricing)

**Status: COMPREHENSIVE UPDATE**
- Update visual design across all admin pages
- Keep all data structures
- Update table layouts and forms

---

## 6. AUTHENTICATION PAGES

### Location: `/app/auth/` + `/components/auth/`

**Auth Pages:**
- `/auth/callback/` - OAuth callback
- `/auth/error/` - Error handling

**Status: UPDATE**
- Update form styling
- Keep authentication flow intact

---

## 7. SHARED COMPONENTS

### Layout Components (`/components/layout/`):
- `Header.tsx` - Site navigation
- `Footer.tsx` - Site footer
- `Container.tsx` - Container wrappers
- `Spacing.tsx` - Stack, Inline, Spacer
- `Navbar.tsx` - Navbar

**Status: UPDATE**

### Navigation Components (`/components/nav/`):
- `Navigation.tsx` - Main nav
- `MobileNav.tsx` - Mobile nav
- `UserNav.tsx` - User menu

**Status: UPDATE**

### UI Components (`/components/ui/`):
- **60+ shadcn/ui pre-built components**
- Button, Input, Dialog, Card, Tabs, etc.
- Charts, Carousels, Data Tables, etc.

**Status: KEEP AS-IS**
- These are un-themed base components
- Work with CSS variable updates

---

## 8. LANDING PAGE SECTIONS

### Sections Components (`/components/sections/`):
- `Hero.tsx` - Hero banner
- `VideoShowcase.tsx` - Product video
- `Pricing.tsx` - Pricing cards
- `HowItWorks.tsx` - Process steps
- `SocialProof.tsx` - Testimonials
- `BrowseByGoal.tsx` - Goal browser
- `TrustBadges.tsx` - Trust indicators
- `EmailCapture.tsx` - Newsletter signup
- `TestimonialCarousel.tsx` - Review carousel
- `SeasonalBanner.tsx` - Promotional banner

**Status: UPDATE (All)**
- Complete visual redesign
- Keep content structure

---

## 9. STATIC PAGES (MINIMAL UPDATES)

- `/about` - About page
- `/services` - Services listing
- `/pricing` - Pricing page
- `/features` - Features page
- `/blog` - Blog listing
- `/contact` - Contact form
- `/docs` - Documentation
- `/health-disclaimer` - Disclaimer
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/cookies` - Cookie policy

**Status: MINIMAL UPDATE**
- Keep existing content
- Update styling as needed

---

## 10. SEO & METADATA

### Config Files:
- `/config/metadata.ts` - Site metadata (KEEP)
- `/config/navigation.ts` - Navigation config (KEEP)

### SEO Components (`/components/seo/`):
- `SearchEngineVerifications.tsx`
- `OrganizationJsonLd.tsx`
- `WebsiteJsonLd.tsx`
- `WellnessBusinessSchema.tsx`

**Status: KEEP**
- No visual changes needed

---

## 11. PAYMENT INTEGRATION

### Components (`/components/payments/`):
- `StripeCheckout.tsx` - Stripe checkout form

### Backend (`/lib/stripe/`):
- Stripe integration
- Webhook handling

**Status: KEEP (Backend) / UPDATE (UI)**
- Keep payment logic
- Update UI if needed

---

## 12. ANALYTICS & TRACKING

### Components (`/components/analytics/`):
- `GoogleAnalytics.tsx`
- `WebVitalsTracker.tsx`

**Status: KEEP**
- No visual changes

---

## 13. INFRASTRUCTURE (KEEP ALL)

### Type Definitions (`/lib/types/`):
- booking.ts, supabase.ts, auth.ts, api.ts, nav.ts, etc. (17 files)

### API Routes (`/app/api/`):
- Bookings, payments, stripe, admin, auth, email, etc. (20+ endpoints)

### Database (`/lib/supabase/`):
- Supabase client, queries, migrations

### Utils & Hooks (`/lib/utils/`, `/lib/hooks/`):
- Custom hooks, utility functions

### Config Files:
- next.config.js, tsconfig.json, jest.config.js

---

## MIGRATION SUMMARY TABLE

| Category | Status | Count | Details |
|----------|--------|-------|---------|
| **REPLACE** | Complete redesign | 7 | Booking components, global styles |
| **UPDATE** | Visual refresh | ~80 | Sections, admin, dashboard, layout |
| **KEEP** | No changes | 150+ | Types, API, utils, hooks, UI lib |

---

## PRIORITY ORDER FOR IMPLEMENTATION

### Phase 1: Foundation (Week 1)
1. Update `/app/globals.css` with new color system
2. Update `/tailwind.config.mjs` with brand colors
3. Update root layout fonts/metadata if needed

### Phase 2: Critical Customer Paths (Week 2)
1. **Booking Flow:** Replace all `/components/booking/*` components
2. Update `/app/book/page.tsx` layout

### Phase 3: Admin & Dashboard (Week 3)
1. Update all `/components/admin/*` components
2. Update `/components/dashboard/*` components

### Phase 4: Marketing Pages (Week 4)
1. Update `/components/sections/*` components
2. Update home page styling

### Phase 5: Support Pages (Week 4+)
1. Update layout components (`/components/layout/*`)
2. Update navigation (`/components/nav/*`)
3. Update auth pages if needed

### Phase 6: Polish & Testing
1. Responsive design testing
2. Cross-browser testing
3. Mobile optimization

---

## DETAILED FILE LISTING

### Files to REPLACE (7 files):
```
/app/globals.css
/components/booking/ServiceSelection.tsx
/components/booking/AddressForm.tsx
/components/booking/BookingCalendar.tsx
/components/booking/PaymentStep.tsx
/components/booking/BookingConfirmation.tsx
/components/booking/BookingStepper.tsx
```

### Files to UPDATE (~80 files):
```
Sections (10):
- Pricing.tsx, HowItWorks.tsx, SocialProof.tsx, etc.

Admin (23):
- AdminDashboard.tsx, BookingManager.tsx, UserManager.tsx, etc.

Dashboard (8):
- DashboardLayout.tsx, Overview.tsx, BookingsTab.tsx, etc.

Layout/Nav (12):
- Header.tsx, Footer.tsx, Navigation.tsx, etc.

Auth (5):
- Login, signup, password reset components

Payment UI (2):
- StripeCheckout UI updates

Other (20):
- Hero.tsx, Theme components, etc.

Config (2):
- tailwind.config.mjs, partial globals.css
```

### Files to KEEP (~150+ files):
```
Types (17 files)
API Routes (20+ files)
Database/Supabase (10 files)
Utils/Hooks (40+ files)
UI Components (60+ files)
SEO/Analytics (10+ files)
Config files (core config)
```

---

## KEY CONSIDERATIONS

1. **Component Structure:** Most components are well-organized and isolated - update each independently
2. **Data Flow:** Business logic is separate from presentation - minimal backend changes needed
3. **Responsive Design:** Mobile optimizations are critical (calendar, forms, admin tables)
4. **Accessibility:** Maintain WCAG compliance during redesign
5. **Testing:** All booking flows need end-to-end testing after redesign
6. **Performance:** Keep current optimizations (fonts, images, lazy loading)

---

**Document Generated:** November 2, 2025
**Project:** Recovery Machine - V2 Design Integration
**Current Branch:** feat/v2-design-integration
**Repository:** /Users/williamkasel/Dev/reco-machine/recovery-machine-web

