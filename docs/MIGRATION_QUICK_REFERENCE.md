# V2 Design Migration - Quick Reference Guide

## At a Glance

| Aspect | Current | Migration Action | Effort |
|--------|---------|------------------|--------|
| **Pages** | 30 routes | 11 need styling updates | Low |
| **Components** | 200+ | 80 need visual redesign | Medium |
| **Core Logic** | Proven | Keep 100% | N/A |
| **Database** | Supabase | Keep 100% | N/A |
| **Payment** | Stripe | Keep 100% | N/A |
| **UI Library** | shadcn/ui | Keep 100% | N/A |

## Component Status Quick View

### REPLACE (Delete & Rebuild)
```
7 FILES TOTAL
├── /app/globals.css
└── /components/booking/
    ├── ServiceSelection.tsx
    ├── AddressForm.tsx
    ├── BookingCalendar.tsx
    ├── PaymentStep.tsx
    ├── BookingConfirmation.tsx
    └── BookingStepper.tsx
```

### UPDATE (Visual Refresh Only)
```
~80 FILES
Sections (10):
├── Hero, VideoShowcase, Pricing, HowItWorks, SocialProof
├── BrowseByGoal, TrustBadges, EmailCapture, SeasonalBanner

Admin (23):
├── Dashboard, Sidebar, BookingManager, UserManager
├── All settings managers, PaymentManager, ReferralManager

Dashboard (8):
├── DashboardLayout, Overview, BookingsTab, ProfileSettings
├── HistoryTab, ReviewsTab, ReferralsTab

Layout/Nav (12):
├── Header, Footer, Navigation, MobileNav, Container

And more (forms, auth, typography, etc.)
```

### KEEP (No Changes)
```
~150+ FILES
├── /lib/types/* (17 files) - Type definitions
├── /app/api/* (20+ endpoints) - API routes
├── /lib/supabase/* (10 files) - Database client
├── /lib/hooks/* (12 files) - Custom hooks
├── /lib/utils/* (30+ files) - Utilities
├── /components/ui/* (60+ files) - UI library
└── Config files - next.config.js, tsconfig.json, etc.
```

## Critical Path Checklist

### Phase 1: Foundation (Day 1)
- [ ] Update `/app/globals.css` with new colors
- [ ] Update `/tailwind.config.mjs` brand palette
- [ ] Update fonts (if changing from Geist/Playfair)
- [ ] Commit & test color system

### Phase 2: Booking Flow (Days 2-3)
- [ ] Replace 7 booking components
- [ ] Update payment summary display
- [ ] Test booking end-to-end
- [ ] Mobile testing on calendar

### Phase 3: Admin (Days 4-5)
- [ ] Update all 23 admin components
- [ ] Update data tables
- [ ] Update forms & settings managers
- [ ] Test all admin workflows

### Phase 4: Home & Marketing (Days 6-7)
- [ ] Update all section components
- [ ] Update home page layout
- [ ] Update other marketing pages
- [ ] Mobile responsive testing

### Phase 5: Support & Polish (Days 8-9)
- [ ] Update layout/header/footer
- [ ] Update auth pages
- [ ] Fix responsive issues
- [ ] Final QA pass

## File Location Quick Links

### High Priority Files
```
Home Page: /app/page.tsx
Booking: /app/book/page.tsx
Admin: /app/admin/layout.tsx
Styles: /app/globals.css
Config: /tailwind.config.mjs
```

### Component Directories
```
Sections: /components/sections/
Booking: /components/booking/
Admin: /components/admin/
Dashboard: /components/dashboard/
Layout: /components/layout/
UI: /components/ui/
```

## Color System Migration

### Current Theme
```css
Primary: #A1D4B3 (Sage Green)
Secondary: #FF8C42 (Warm Amber)
Background: #FDFCFA (Cream)
Foreground: #2D2D2D (Charcoal)
```

### CSS Variables Location
- File: `/app/globals.css` (lines 11-73)
- Format: HSL values (e.g., `--primary: 145 36% 73%`)
- Used in: `/tailwind.config.mjs` (lines 14-46)

### To Update Colors
1. Open `/app/globals.css`
2. Update HSL values in `:root` section
3. Update in `.dark` section too
4. Run `npm run build` to test
5. Check all pages visually

## Data Types Reference

### Booking Types (`/lib/types/booking.ts`)
```typescript
- BookingStep: "service" | "address" | "calendar" | "payment" | "confirmation"
- BookingState: Main booking data container
- SetupFeeCalculation: Distance-based pricing
- DatabaseBooking: Database schema
- ServiceType: "cold_plunge" | "infrared_sauna" | "both" | "athletic" | "corporate"
```

### Keep These Intact
- All types in `/lib/types/*`
- All API endpoints in `/app/api/*`
- All hooks in `/lib/hooks/*`
- All utilities in `/lib/utils/*`

## Testing Checklist

### After Each Phase
- [ ] Visual regression testing
- [ ] Mobile responsive check
- [ ] Desktop layout check
- [ ] Form functionality
- [ ] Navigation working

### Full QA Before Merge
- [ ] Home page on desktop & mobile
- [ ] Booking flow (all 5 steps)
- [ ] Admin panel (all 13 pages)
- [ ] Dashboard (all tabs)
- [ ] Auth pages
- [ ] Static pages
- [ ] Payment flow (test mode)

## Git Workflow

### Branch Strategy
```bash
# Current branch: feat/v2-design-integration
git status  # Check current changes
git add .   # Stage changes
git commit -m "chore: update [component] styling for v2"
```

### Commit Pattern
```
chore: update [section name] styling for v2 design
- Updated colors/layout
- Mobile responsive check passed
- No logic changes
```

## Common Pitfalls to Avoid

1. **Don't modify** `/lib/types/*` - Business logic depends on it
2. **Don't touch** `/app/api/*` - Payment/auth endpoints
3. **Don't change** Booking state management - just UI
4. **Do test** responsive design thoroughly
5. **Do keep** consistent spacing/typography scale

## Performance Considerations

### Keep These Optimizations
- Font preconnect/prefetch in layout.tsx
- Image optimization in next.config.js
- Dynamic imports for heavy components
- Lazy loading of sections

### Performance Files
- Do not modify: `/next.config.js`
- Do not modify: Font declarations in `/app/layout.tsx`
- Can update: Component rendering logic (optimize if adding features)

## Command Reference

```bash
# Build & test
npm run build      # Build project
npm run dev        # Dev server
npm run lint       # Check linting
npm test           # Run tests

# Git workflow
git status         # See changes
git add .          # Stage all
git commit -m "..." # Commit
git push           # Push changes
```

## Documentation Links

- **Full Migration Map:** `/docs/V2_DESIGN_MIGRATION_MAP.md`
- **Component Architecture:** `/docs/COMPONENT_ARCHITECTURE.md`
- **This Quick Reference:** `/docs/MIGRATION_QUICK_REFERENCE.md`

## Success Criteria

- [ ] All 30 pages render without errors
- [ ] Booking flow completes end-to-end
- [ ] Admin can manage all functions
- [ ] Mobile responsive on all pages
- [ ] No backend/API changes needed
- [ ] All tests pass
- [ ] Performance metrics maintained

---

**Last Updated:** November 2, 2025
**Total Effort Estimate:** 5-7 days (1 developer)
**Critical Path:** Booking > Admin > Home > Support

