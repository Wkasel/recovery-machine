# Recovery Machine - Component Architecture Overview

## High-Level Structure

```
App/
├── Root Layout (RootLayout)
│   ├── AppProvider (Context Setup)
│   ├── Header (Site Navigation)
│   ├── Main Content
│   └── Footer (Site Footer)
└── Pages (30 routes)
```

## Component Hierarchy

### 1. MARKETING/PUBLIC PAGES

```
Home Page (/)
├── Hero.tsx
├── VideoShowcase.tsx
├── SeasonalBanner.tsx
├── Pricing.tsx
├── TrustBadges.tsx
├── HowItWorks.tsx
├── BrowseByGoal.tsx
├── SocialProof.tsx
└── EmailCapture.tsx

/about, /services, /features, /pricing, /contact, /blog
├── Static page layouts
├── Reusable section components
└── Form components
```

### 2. BOOKING FLOW (CRITICAL)

```
/book/ - Main Booking Wizard
├── BookingStepper.tsx (Progress indicator)
│   ├── MobileBookingStepper (Mobile version)
│   └── BookingStepper (Desktop version)
│
├── ServiceSelection.tsx
│   └── Shows service options with pricing
│
├── AddressForm.tsx
│   ├── Address input fields
│   ├── Distance validation
│   └── Setup fee calculator
│
├── BookingCalendar.tsx
│   ├── FullCalendar integration
│   ├── Available time slots
│   └── Add-ons selector
│       ├── Extra visits
│       ├── Family members
│       └── Extended time
│
├── PaymentStep.tsx
│   ├── Order summary
│   ├── Payment method selection
│   ├── Price breakdown
│   └── Coupon/discount input
│
└── BookingConfirmation.tsx
    ├── Order confirmation
    ├── Booking details
    └── Call-to-action (new booking)

/booking/[id]/confirmation/
├── BookingConfirmation.tsx (detailed view)
```

### 3. USER DASHBOARD (SECONDARY PRIORITY)

```
/profile/dashboard
├── DashboardLayout.tsx
│   ├── Sidebar (Navigation)
│   └── Main content area
│
├── Overview.tsx (Home tab)
│   ├── Welcome message
│   ├── Next booking card
│   └── Quick stats
│
├── BookingsTab.tsx
│   ├── Bookings table
│   ├── Booking filters
│   └── Booking details modal
│
├── HistoryTab.tsx
│   ├── Historical bookings
│   ├── Analytics/stats
│   └── Charts
│
├── ProfileSettings.tsx
│   ├── Personal info form
│   ├── Address management
│   ├── Preferences
│   └── Notification settings
│
├── ReviewsTab.tsx
│   ├── Submitted reviews
│   ├── Review management
│   └── Create new review
│
└── ReferralsTab.tsx
    ├── Referral links
    ├── Rewards tracking
    └── Earnings summary
```

### 4. ADMIN PANEL (HIGH PRIORITY)

```
/admin/
├── AdminLayout.tsx (Auth + Sidebar)
│   ├── AdminHeader.tsx (Top bar)
│   └── AdminSidebar.tsx (Navigation)
│
├── AdminDashboard.tsx (/admin)
│   ├── Overview cards
│   ├── Charts
│   └── Quick actions
│
├── BookingManager.tsx (/admin/bookings)
│   ├── Bookings table
│   ├── Filters
│   ├── Bulk actions
│   └── Booking detail modal
│
├── UserManager.tsx (/admin/users)
│   ├── Users table
│   ├── User search
│   ├── User details
│   └── Bulk operations
│
├── PaymentManager.tsx (via /admin/orders)
│   ├── Orders table
│   ├── Payment status
│   └── Refund management
│
├── AvailabilityManager.tsx (/admin/availability)
│   ├── Calendar view
│   ├── Availability rules
│   └── Blackout dates
│
├── ServiceAreaManager.tsx (/admin/service-areas)
│   ├── Service areas map
│   ├── Zone management
│   └── Pricing rules
│
├── SettingsManager.tsx (/admin/settings)
│   ├── BusinessSettingsManager
│   │   ├── Business info
│   │   ├── Contact details
│   │   └── Branding
│   ├── BusinessHoursEditor
│   │   └── Operating hours by day
│   ├── BookingPolicySettings
│   │   ├── Cancellation policy
│   │   └── Booking rules
│   ├── IntegrationSettings
│   │   ├── Stripe setup
│   │   ├── Email config
│   │   └── SMS config
│   └── NotificationSettings
│       ├── Email templates
│       └── Notification rules
│
├── EmailTemplateManager.tsx (/admin/email-templates)
│   ├── Template list
│   ├── Template editor
│   └── Preview
│
├── ReviewsManager.tsx (/admin/reviews)
│   ├── Reviews table
│   ├── Moderation tools
│   └── Response management
│
├── ReferralManager.tsx (/admin/referrals)
│   ├── Referral program tracking
│   └── Payouts
│
├── AdminManagement.tsx (/admin/admins)
│   ├── Admin users table
│   ├── Role management
│   └── Permissions
│
├── NotificationsManager.tsx (/admin/notifications)
│   ├── Notification log
│   ├── Send notification UI
│   └── Templates
│
└── ExportsManager.tsx (/admin/exports)
    ├── Export options
    ├── Format selection
    └── Download management
```

### 5. AUTHENTICATION

```
/auth/
├── LoginForm.tsx (/sign-in)
│   ├── Email/password input
│   ├── Social login buttons
│   └── Forgot password link
│
├── SignUpForm.tsx (/sign-up)
│   ├── Registration fields
│   ├── Email verification
│   └── Terms acceptance
│
├── PasswordResetForm.tsx
│   ├── Reset request
│   └── New password form
│
└── AuthCallback.tsx (/auth/callback)
    └── OAuth provider redirect handler
```

## Shared Component Groups

### Layout System (`/components/layout/`)
- **Header.tsx** - Site header with navigation
- **Footer.tsx** - Site footer with links
- **Container.tsx** - Content containers
- **Spacing.tsx** - Layout utilities (Stack, Inline, Spacer)
- **Navbar.tsx** - Navigation bar

### Navigation (`/components/nav/`)
- **Navigation.tsx** - Main navigation menu
- **MobileNav.tsx** - Mobile-optimized nav
- **UserNav.tsx** - User account menu
- **AdminNav.tsx** - Admin navigation

### UI Library (`/components/ui/`)
**60+ shadcn/ui Components:**

**Forms & Input:**
- Input, Button, Checkbox, Radio, Select
- Textarea, Combobox, DatePicker, TimePicker
- Form (react-hook-form wrapper)

**Display:**
- Card, Alert, Badge, Avatar, Progress
- Tabs, Accordion, Collapsible, Drawer

**Modals & Overlays:**
- Dialog, AlertDialog, Popover, ContextMenu
- DropdownMenu, Sheet

**Lists & Tables:**
- DataTable, Carousel, ScrollArea, VirtualList

**Feedback:**
- Toast, Tooltip, Skeleton

**Navigation:**
- Breadcrumb, Pagination, Command

**Data Visualization:**
- Chart, LineChart, BarChart, etc.

### Typography (`/components/typography/`)
- **Heading** - Heading variants
- **Body** - Body text variants
- **Label** - Label text
- **Code** - Code/mono text

### Forms (`/components/form/`)
- **FormField** - Wrapper component
- **FormInput** - Input fields with validation
- **FormSelect** - Select inputs
- **FormCheckbox** - Checkbox groups
- **FormRadio** - Radio button groups
- **FormTextarea** - Textarea fields

### SEO & Analytics (`/components/seo/`, `/components/analytics/`)
- **SearchEngineVerifications** - Meta tags
- **OrganizationJsonLd** - Structured data
- **WebsiteJsonLd** - Schema markup
- **GoogleAnalytics** - GA tracking
- **WebVitalsTracker** - Core Web Vitals

### Payment (`/components/payments/`)
- **StripeCheckout** - Stripe Bolt checkout
- **PaymentForm** - Payment method selection
- **PriceDisplay** - Price formatting

## Data Flow Architecture

```
User Action
    ↓
React Component (Client)
    ↓
Hook (useAuth, useToast, custom hooks)
    ↓
API Route (/app/api/*) - Server Action
    ↓
Supabase / Stripe / External Service
    ↓
Database / Payment Provider
    ↓
Response
    ↓
State Update
    ↓
Component Re-render
```

## State Management Pattern

```
Global State:
├── Auth Context (User, loading)
├── Toast Context (Toast messages)
└── Theme Context (Light/dark mode)

Component State:
├── useState for local UI state
├── useReducer for complex flows (e.g., booking)
└── Custom hooks for shared logic

Server State:
├── React Query / SWR for API data
└── Supabase real-time subscriptions
```

## Styling Architecture

```
Global Styles: /app/globals.css
├── Tailwind imports
├── CSS variable definitions (--primary, --secondary, etc.)
├── Layer utilities (section-header, heading-condensed, etc.)
└── Mobile optimizations

Tailwind Config: /tailwind.config.mjs
├── Color extend (brand palette)
├── Custom animations
├── Custom radius tokens
└── Font family definitions

Component Styles:
├── Tailwind utility classes (primary method)
├── CSS modules (when needed)
└── Inline styles (minimal use)

Design Tokens: /lib/design-tokens.ts
├── Color constants
├── Spacing values
├── Typography scales
└── Animation configs
```

## File Organization Summary

```
/components (Main)
├── /sections (10) - Landing page sections
├── /booking (7) - Booking flow components
├── /dashboard (8) - User dashboard
├── /admin (23) - Admin panel components
├── /layout (5) - Layout components
├── /nav (5) - Navigation components
├── /auth (5) - Auth components
├── /payments (2) - Payment components
├── /ui (60+) - shadcn/ui base components
├── /seo (6) - SEO/schema components
├── /analytics (3) - Analytics components
├── /form (5) - Form utilities
├── /typography (3) - Typography components
└── /[other] (30+) - Misc categories

/app (Pages & Routes)
├── /page.tsx (Home)
├── /book/page.tsx (Booking)
├── /admin/* (13 admin pages)
├── /auth/* (Auth pages)
├── /api/* (API routes)
└── /[static pages]/ (11 static pages)

/lib (Business Logic)
├── /types/ (Type definitions)
├── /supabase/ (Database client)
├── /stripe/ (Payment integration)
├── /hooks/ (Custom React hooks)
├── /utils/ (Utility functions)
└── /services/ (API services)

/config (Configuration)
├── metadata.ts (SEO metadata)
├── navigation.ts (Navigation config)
└── eslint.config.js, etc.

/public (Static Assets)
├── /images
├── /icons
└── /fonts
```

## Update Impact Matrix

| Component Type | Visual Changes | Logic Changes | Data Changes |
|---|---|---|---|
| Section components | HIGH | LOW | NONE |
| Booking flow | HIGH | MEDIUM | LOW |
| Admin panel | MEDIUM | LOW | NONE |
| Dashboard | MEDIUM | LOW | NONE |
| Layout/Nav | MEDIUM | LOW | NONE |
| Auth pages | MEDIUM | NONE | NONE |
| UI library | NONE | NONE | NONE |
| API routes | NONE | NONE | MEDIUM |
| Types/hooks | NONE | NONE | LOW |

---

**Document Generated:** November 2, 2025
**Current Structure State:** Production
**Next Step:** V2 Design System Integration

