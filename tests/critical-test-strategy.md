# CRITICAL TESTING STRATEGY - Recovery Machine
**Priority: Revenue-Impacting Scenarios & Real-World Failures**

## 🚨 CRITICAL BUSINESS PATHS

### 1. REVENUE-CRITICAL USER JOURNEYS
**Test beyond "happy path" - focus on money-losing failures**

#### Booking → Payment Flow
```typescript
// CRITICAL: What happens when payment fails DURING processing?
test('partial payment failure during booking creation', async () => {
  // Scenario: Bolt payment succeeds but database booking fails
  // Result: Customer charged, no booking record
  // Impact: Lost revenue + customer service nightmare
});

// CRITICAL: Race conditions in high-demand slots
test('concurrent booking same time slot', async () => {
  // Scenario: 2 customers book last available slot simultaneously
  // Result: Double-booking or lost sale
  // Impact: Service delivery failure
});

// CRITICAL: Pricing discrepancies
test('price changes between selection and payment', async () => {
  // Scenario: Service price updated while customer in checkout
  // Result: Customer pays wrong amount
  // Impact: Revenue loss or legal issues
});
```

#### User Authentication Edge Cases
```typescript
// CRITICAL: Session hijacking during payment
test('auth session expires during checkout', async () => {
  // Scenario: User session expires between service selection and payment
  // Result: Lost booking state, payment without user context
});

// CRITICAL: Multi-device booking conflicts
test('user starts booking on mobile, completes on desktop', async () => {
  // Scenario: Session state not synchronized
  // Result: Lost form data, abandoned booking
});
```

### 2. INTEGRATION FAILURE SCENARIOS

#### Supabase Database Failures
```typescript
// CRITICAL: Database connection loss during booking
test('supabase connection fails mid-transaction', async () => {
  // Test: Mock connection timeout
  // Scenario: Payment processed but booking not saved
  // Recovery: Webhook reconciliation process
});

// CRITICAL: RLS policy failures
test('row_level_security_bypass_attempt', async () => {
  // Test: User tries to access other user's bookings
  // Scenario: Authorization bypass
  // Impact: Data breach
});

// CRITICAL: Migration rollback scenarios
test('database_schema_rollback_data_integrity', async () => {
  // Test: Schema changes break existing bookings
  // Scenario: New booking format incompatible with old data
});
```

#### Bolt Payment Gateway Failures
```typescript
// CRITICAL: Webhook delivery failures
test('bolt_webhook_fails_multiple_times', async () => {
  // Scenario: Webhook URL down, payment status not updated
  // Result: Customer charged, booking shows as pending forever
  // Recovery: Manual reconciliation process needed
});

// CRITICAL: Refund processing failures
test('refund_initiated_but_bolt_api_down', async () => {
  // Scenario: Customer cancels, refund API fails
  // Result: Booking cancelled but customer not refunded
});

// CRITICAL: Currency/amount mismatches
test('bolt_currency_conversion_edge_cases', async () => {
  // Scenario: Cent-to-dollar conversion errors
  // Result: Customer charged wrong amount
});
```

#### Google Maps API Failures
```typescript
// CRITICAL: Address validation during outage
test('google_maps_api_down_during_booking', async () => {
  // Scenario: Cannot validate service address
  // Result: Service scheduled to invalid location
});

// CRITICAL: Pricing calculation without distance
test('setup_fee_calculation_without_maps_api', async () => {
  // Scenario: Cannot calculate travel distance for setup fee
  // Result: Wrong pricing quoted to customer
});
```

### 3. MOBILE & CROSS-DEVICE CRITICAL TESTS

#### Mobile Performance Under Stress
```typescript
// CRITICAL: Booking flow on slow networks
test('3g_network_booking_flow_completion', async () => {
  // Test: 3G network simulation
  // Scenario: Form timeout during address input
  // Result: Lost booking data
});

// CRITICAL: iOS Safari payment failures
test('ios_safari_bolt_checkout_redirect', async () => {
  // Scenario: Safari blocks payment popup
  // Result: Payment fails silently
});

// CRITICAL: Android keyboard issues
test('android_keyboard_overlaps_payment_form', async () => {
  // Scenario: Virtual keyboard hides submit button
  // Result: Cannot complete payment
});
```

#### Cross-Device Session Management
```typescript
// CRITICAL: QR code booking handoff
test('qr_code_booking_mobile_to_desktop', async () => {
  // Scenario: Customer scans QR on mobile, completes on desktop
  // Result: Session state lost, restart booking process
});
```

### 4. BUSINESS LOGIC EDGE CASES

#### Availability & Scheduling
```typescript
// CRITICAL: Time zone handling
test('booking_across_timezone_boundaries', async () => {
  // Scenario: Customer books for "3 PM" but timezone unclear
  // Result: Wrong service time scheduled
});

// CRITICAL: Holiday scheduling
test('booking_on_business_holidays', async () => {
  // Scenario: System allows booking on closed days
  // Result: Service promised but cannot be delivered
});

// CRITICAL: Double-booking prevention
test('admin_override_creates_double_booking', async () => {
  // Scenario: Admin manually schedules over existing booking
  // Result: Two customers same time slot
});
```

#### Pricing & Credits System
```typescript
// CRITICAL: Referral credit edge cases
test('referral_credit_exceeds_booking_cost', async () => {
  // Scenario: Customer has $200 credit, books $80 service
  // Result: Negative payment amount or system error
});

// CRITICAL: Subscription billing failures
test('recurring_payment_fails_with_active_bookings', async () => {
  // Scenario: Card expired, subscription fails, but bookings scheduled
  // Result: Service promised but payment failed
});

// CRITICAL: Bulk booking discounts
test('bulk_booking_pricing_calculation_errors', async () => {
  // Scenario: Multiple services, complex discount logic
  // Result: Wrong total calculated
});
```

### 5. REAL-WORLD FAILURE SCENARIOS

#### External Service Dependencies
```typescript
// CRITICAL: SMS notification failures
test('twilio_sms_fails_booking_confirmation', async () => {
  // Scenario: SMS service down, customer not notified
  // Result: Customer misses appointment
});

// CRITICAL: Email service outages
test('resend_email_service_down_during_booking', async () => {
  // Scenario: Cannot send booking confirmation email
  // Result: Customer has no booking record
});

// CRITICAL: Third-party calendar integration
test('google_calendar_sync_fails_during_booking', async () => {
  // Scenario: Cannot add to customer's calendar
  // Result: Customer forgets appointment
});
```

#### High Load Scenarios
```typescript
// CRITICAL: Black Friday booking rush
test('1000_concurrent_users_booking_same_day', async () => {
  // Load test: Database performance under load
  // Scenario: System slows down, customers abandon bookings
});

// CRITICAL: Memory leaks during peak usage
test('memory_usage_during_extended_booking_sessions', async () => {
  // Test: Long-running booking sessions
  // Scenario: Browser crashes, lost booking data
});
```

### 6. SECURITY & DATA PROTECTION

#### Payment Security
```typescript
// CRITICAL: PCI compliance validation
test('no_card_data_stored_locally', async () => {
  // Test: Verify no sensitive payment data in browser/database
  // Scenario: Data breach investigation
});

// CRITICAL: Session security
test('session_hijacking_during_payment', async () => {
  // Test: CSRF protection during checkout
  // Scenario: Malicious actor intercepts payment session
});
```

#### Data Privacy
```typescript
// CRITICAL: GDPR data deletion
test('user_data_deletion_while_bookings_exist', async () => {
  // Scenario: User requests data deletion with future bookings
  // Result: Legal compliance vs business operations conflict
});

// CRITICAL: Location data handling
test('address_data_storage_and_retention', async () => {
  // Test: Customer addresses stored securely and deleted properly
  // Scenario: Privacy audit
});
```

## 🔧 TESTING INFRASTRUCTURE REQUIREMENTS

### Error Recovery Testing
```typescript
// CRITICAL: Disaster recovery procedures
test('database_backup_restore_with_active_bookings', async () => {
  // Test: System recovery maintains booking integrity
  // Scenario: Database corruption during business hours
});

// CRITICAL: Rollback procedures
test('failed_deployment_rollback_preserves_bookings', async () => {
  // Test: Deployment failure doesn't break existing bookings
  // Scenario: Bad deploy during business hours
});
```

### Monitoring & Alerting
```typescript
// CRITICAL: Revenue monitoring
test('payment_failure_rate_alerting', async () => {
  // Test: Automatic alerts when payment failures spike
  // Scenario: Silent payment processor issues
});

// CRITICAL: Booking completion rate monitoring
test('booking_abandonment_rate_tracking', async () => {
  // Test: Alert when bookings drop below threshold
  // Scenario: UX issue causing customer loss
});
```

## 📊 BUSINESS IMPACT METRICS TO TEST

### Revenue Protection
- Payment failure rate < 2%
- Booking completion rate > 85%
- Double-booking incidents = 0
- Refund processing time < 24h

### Customer Experience
- Mobile booking completion rate > 80%
- Page load time < 3s on 3G
- Form data persistence during errors
- Multi-device session continuity

### Operational Efficiency
- Admin override safety checks
- Automated conflict resolution
- Error recovery without manual intervention
- Scalability under 10x normal load

## 🚨 HIGHEST PRIORITY TEST SCENARIOS

1. **Payment succeeds but booking creation fails**
2. **Concurrent bookings for same time slot**
3. **Session expires during checkout flow**
4. **Mobile payment failures on iOS Safari**
5. **Database connection loss during peak hours**
6. **Webhook delivery failures from Bolt**
7. **Address validation when Google Maps is down**
8. **Timezone confusion in booking times**
9. **Referral credit calculation edge cases**
10. **SMS/Email notification failures**

---

**Remember**: These tests protect revenue and customer trust. A single payment failure costs more than running these tests 1000 times.