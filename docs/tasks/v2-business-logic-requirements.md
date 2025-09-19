# 🏢 Recovery Machine V2: Business Logic & Configuration Requirements

## Executive Summary

Based on audit of current implementation, we need to establish admin-configurable business logic and replace custom Instagram scraping with off-the-shelf solutions. Current implementation has all core functionality but lacks business rule configuration and proper third-party integrations.

## 🔍 Current State Analysis

### ✅ **What's Already Implemented**
- Complete booking system with calendar integration
- Full admin panel with user/booking/payment management 
- Email service with Resend integration
- SMS service with Twilio integration
- Custom Instagram API scraping (❌ needs replacement)
- Basic analytics tracking structure
- Payment processing via Bolt
- Referral system with credit management

### ❌ **Critical Missing Components**

## 1. 🎯 Third-Party Integration Replacements

### **Instagram Integration**
**Current Issue**: Custom Instagram Basic Display API scraping implementation
**Solution**: Replace with [Behold.so](https://behold.so/)
- **Why**: Behold provides Instagram widget with React component, no API limits
- **Implementation**: Remove `/lib/services/instagram.ts` and `/api/instagram/posts` route
- **Files to Update**:
  - `components/instagram/instagram-grid.tsx` → Replace with Behold React component
  - `components/sections/SocialProof.tsx` → Update Instagram integration
  - Remove: `lib/services/instagram.ts`, `app/api/instagram/posts/route.ts`

### **Google Reviews Integration**  
**Current State**: No Google Reviews integration found
**Solution**: Use Google My Business API + Google Reviews widget
- **Options**: 
  - Google Reviews widget embed (simplest)
  - Reviews.io or similar service (more features)
  - Direct Google My Business API (most control)
- **Implementation**: New admin section for review management

### **Analytics Upgrade**
**Current State**: Basic analytics structure, some Google Analytics mentions
**Solution**: Implement Segment + Google Analytics 4
- **Why**: Segment allows easy multi-platform tracking, GA4 for core metrics
- **Files to Update**:
  - `components/analytics/GoogleAnalytics.tsx` → Add Segment tracking
  - `lib/types/analytics.ts` → Update for Segment events
  - Add conversion funnel tracking for booking flow

## 2. 🏗️ Business Logic Configuration System

### **Core Business Settings Table Needed**
```sql
CREATE TABLE business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL, -- 'booking', 'email', 'sms', 'policies'
  key VARCHAR(100) NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, key)
);
```

### **Admin Settings Management Component Needed**
**Location**: `app/admin/settings/page.tsx`
**Components**:
- `components/admin/settings/BookingSettings.tsx`
- `components/admin/settings/EmailSettings.tsx`
- `components/admin/settings/PoliciesSettings.tsx`

## 3. 📅 Booking & Scheduling Business Logic

### **Missing Configuration Options**

#### **Session Management**
```typescript
interface SessionSettings {
  defaultDuration: number; // 30, 45, 60 minutes
  bufferTimeBefore: number; // 15 min setup time
  bufferTimeAfter: number; // 15 min cleanup time
  maxCapacity: number; // How many people per session
  allowMultipleSessions: boolean; // Can same user book multiple slots same day
}
```

#### **Booking Policies**
```typescript
interface BookingPolicies {
  cancellationPolicy: {
    advanceNoticeRequired: number; // 30 days
    refundPolicy: 'full' | 'partial' | 'none';
    reschedulingAllowed: boolean;
    reschedulingDeadline: number; // days before session
  };
  
  availabilityRules: {
    bookingWindow: number; // How far in advance can book (days)
    minimumAdvanceBooking: number; // Must book at least X hours ahead
    operatingHours: {
      start: string; // "09:00"
      end: string; // "18:00"
      daysOfWeek: number[]; // [1,2,3,4,5] = Monday-Friday
    };
  };
  
  restrictionRules: {
    ageRestriction: number; // Minimum age
    waiverRequired: boolean;
    healthQuestionnaire: boolean;
    contractAddress: boolean; // Must use same address as contract
    separateBookingAddress: boolean; // Allow different delivery address
  };
}
```

#### **Service Customization**
```typescript
interface ServiceOptions {
  sessionTypes: {
    coldPlungeOnly: boolean;
    saunaOnly: boolean;
    combined: boolean; // Default PRD option
  };
  
  addOnOptions: {
    extraVisits: {
      enabled: boolean;
      pricePerVisit: number; // cents
      maxPerMonth: number;
    };
    familyMembers: {
      enabled: boolean;
      pricePerPerson: number; // cents
      maxAdditional: number;
    };
    extendedTime: {
      enabled: boolean;
      pricePerIncrement: number; // cents per 15min
      maxExtension: number; // minutes
    };
  };
}
```

## 4. 📧 Email & SMS Marketing Configuration

### **Current State**
- Email service exists but no admin configuration
- SMS service exists but no admin configuration
- No template management system for admins

### **Required Admin Features**

#### **Email Campaign Management**
**Location**: `app/admin/marketing/email/page.tsx`
```typescript
interface EmailCampaignSettings {
  templates: {
    welcomeSeries: EmailTemplate[];
    bookingReminders: EmailTemplate[];
    postSessionFollowup: EmailTemplate[];
    winbackCampaigns: EmailTemplate[];
  };
  
  automationRules: {
    welcomeSeriesDelay: number; // hours after signup
    reminderTiming: number[]; // [24, 2] = 24hrs and 2hrs before
    reviewRequestDelay: number; // hours after session completion
    winbackTrigger: number; // days of inactivity
  };
  
  segmentation: {
    newCustomers: boolean;
    regularCustomers: boolean; // 3+ bookings
    lapsingCustomers: boolean; // No booking in X days
    highValueCustomers: boolean; // Spent over $X
  };
}
```

#### **SMS Campaign Management** 
**Location**: `app/admin/marketing/sms/page.tsx`
```typescript
interface SMSCampaignSettings {
  templates: {
    bookingConfirmation: string;
    appointmentReminder: string;
    arrivalNotification: string; // "We're 10 minutes away"
    sessionComplete: string;
    reviewRequest: string;
  };
  
  timing: {
    confirmationDelay: number; // minutes after booking
    reminderAdvance: number; // hours before session
    arrivalNotification: number; // minutes before arrival
    reviewRequestDelay: number; // hours after completion
  };
  
  optInRequired: boolean;
  optOutInstructions: string;
}
```

## 5. 📋 Legal & Compliance Requirements

### **Waiver Management System**
**Location**: `app/admin/legal/waivers/page.tsx`
```typescript
interface WaiverSettings {
  required: boolean;
  waiverText: string;
  digitalSignatureRequired: boolean;
  parentalConsentAge: number; // Under 18 needs parent signature
  renewalPeriod: number; // Days until waiver expires
  
  questions: {
    healthConditions: boolean;
    medications: boolean;
    pregnancyDisclosure: boolean;
    emergencyContact: boolean;
  };
}
```

### **Health Questionnaire**
```typescript
interface HealthQuestions {
  enabled: boolean;
  questions: {
    id: string;
    question: string;
    type: 'yes_no' | 'text' | 'multiple_choice';
    required: boolean;
    disqualifyingAnswers?: string[]; // Answers that prevent booking
  }[];
}
```

## 6. 🎨 UI/UX Configuration

### **Booking Flow Customization**
**Location**: `app/admin/settings/booking-flow/page.tsx`
```typescript
interface BookingFlowSettings {
  steps: {
    collectContactInfo: boolean; // Before or after service selection
    requireAddressUpfront: boolean;
    showPricingEarly: boolean;
    collectSpecialInstructions: boolean;
  };
  
  addressCollection: {
    separateFromContact: boolean; // Different billing vs service address
    requireVerification: boolean; // Google Maps validation
    deliveryAreaRestriction: boolean;
    maxDeliveryDistance: number; // miles
  };
  
  paymentFlow: {
    collectPaymentUpfront: boolean; // vs pay on completion
    allowPartialPayments: boolean;
    requireCardOnFile: boolean;
    setupFeeCollection: 'upfront' | 'at_service' | 'first_bill';
  };
}
```

## 7. 🔧 Implementation Priority

### **Phase 1 (Critical - Week 1)**
1. Replace Instagram integration with Behold.so
2. Add Segment + GA4 analytics tracking
3. Create basic business settings table and admin interface

### **Phase 2 (High Priority - Week 2)**  
4. Implement booking policies configuration
5. Add session management settings
6. Create waiver management system

### **Phase 3 (Medium Priority - Week 3)**
7. Build email campaign management for admins
8. Add SMS template management
9. Implement health questionnaire system

### **Phase 4 (Enhancement - Week 4)**
10. Google Reviews integration
11. Advanced booking flow customization
12. Performance optimization and testing

## 📁 File Structure for New Components

```
app/admin/
  ├── settings/
  │   ├── page.tsx (Settings dashboard)
  │   ├── booking/page.tsx (Booking policies)
  │   ├── email/page.tsx (Email settings)
  │   ├── sms/page.tsx (SMS settings)
  │   └── legal/page.tsx (Waivers, health questions)
  ├── marketing/
  │   ├── email/page.tsx (Email campaigns)
  │   ├── sms/page.tsx (SMS campaigns)
  │   └── analytics/page.tsx (Marketing analytics)

components/admin/settings/
  ├── SettingsLayout.tsx
  ├── BookingPolicySettings.tsx
  ├── SessionSettings.tsx
  ├── EmailSettings.tsx
  ├── SMSSettings.tsx
  ├── WaiverSettings.tsx
  └── HealthQuestionnaireSettings.tsx

lib/services/
  ├── settings.ts (Business settings CRUD)
  ├── waiver.ts (Waiver management)
  └── analytics.ts (Segment integration)
```

## 🎯 Success Metrics

- **Admin Autonomy**: Business team can modify all policies without developer intervention
- **Compliance**: All legal requirements configurable and trackable
- **Marketing Efficiency**: Automated email/SMS campaigns reduce manual work by 80%
- **Analytics Coverage**: 100% conversion funnel tracking from landing to booking completion
- **Integration Reliability**: 99.9% uptime for third-party services (Behold, Segment)

## 🚨 Risk Mitigation

- **Behold Integration**: Test thoroughly, maintain fallback for Instagram display
- **Settings Validation**: Prevent admins from setting conflicting business rules
- **Data Migration**: Preserve existing user preferences during SMS/email opt-in migration
- **Waiver Legal Review**: All waiver changes must be legally reviewed before activation
- **Analytics Testing**: Validate conversion tracking in staging before production

This document provides the roadmap for making Recovery Machine truly admin-configurable while maintaining the excellent technical foundation already built.