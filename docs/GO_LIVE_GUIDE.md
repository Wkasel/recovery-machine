# 🚀 Recovery Machine - Go-Live Deployment Guide

> **Status:** Ready for deployment - No blocking bugs found
> **Last Updated:** January 2025
> **Pricing Updated:** ✅ Site-wide (Memberships: $275/$525/$850, Household sessions: $175-$200)

---

## 📋 Pre-Flight Checklist

- [x] Pricing updated site-wide
- [x] Bolt pricing constants updated
- [x] Supabase configured
- [x] Build passing (0 errors)
- [ ] **Bolt webhook configured**
- [ ] **Vercel environment variables set**
- [ ] **End-to-end booking tested**
- [ ] **Email confirmations verified**

---

## 🔧 Step 1: Configure Bolt Webhook (CRITICAL)

### Why This Matters
Without the webhook, payment confirmations won't update booking status or send confirmation emails. The webhook handler is already coded and ready—it just needs to be registered in Bolt's dashboard.

### Instructions

1. **Log into Bolt Merchant Dashboard**
   - URL: https://merchant.bolt.com
   - Use your merchant credentials

2. **Navigate to Webhooks**
   - Go to: **Developers** → **Webhooks**
   - Click **"Create Webhook"** or **"Add Webhook"**

3. **Configure Webhook Settings**

   | Field | Value |
   |-------|-------|
   | **Webhook URL** | `https://therecoverymachine.co/api/webhooks/bolt` |
   | **Signing Secret** | `6ea6ff27806e0e519942e2b8f8f36562c585bb25c5f4c3c429146f411bdb1bb9` |
   | **Environment** | Start with `Sandbox`, switch to `Production` when ready |

4. **Select Events to Monitor**

   Enable these 3 events:
   - ✅ `checkout.completed` - Triggers booking confirmation
   - ✅ `checkout.failed` - Handles payment failures
   - ✅ `refund.created` - Processes refunds

5. **Save and Test**
   - Click **"Create"** or **"Save Webhook"**
   - Bolt will send a test event to verify the endpoint
   - You should see a `200 OK` response

### Verification
- Check Bolt dashboard shows "Active" status next to webhook
- Note: The webhook handler code is at `app/api/webhooks/bolt/route.ts`

---

## ☁️ Step 2: Set Vercel Environment Variables (CRITICAL)

### Why This Matters
Your local `.env` and `.env.local` files work in development, but Vercel needs these variables set in its dashboard for production deployment.

### Instructions

1. **Open Vercel Dashboard**
   - URL: https://vercel.com/dashboard
   - Navigate to your project: **Recovery Machine** (or whatever it's named)

2. **Go to Environment Variables**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add Each Variable Below**

   For each variable, click **"Add New"**, then:
   - Enter the **Key** (variable name)
   - Enter the **Value** (copy from your local files)
   - Select environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

### Variables to Add

#### Production URLs
```bash
NEXT_PUBLIC_APP_URL=https://therecoverymachine.co
NEXT_PUBLIC_SITE_URL=https://therecoverymachine.co
```

#### Bolt Payment Configuration
```bash
BOLT_API_KEY=eb9654bb07e423b657dddef43bd1c659eaa4662435a4aea1a63f8e58f53de5a8
BOLT_WEBHOOK_SECRET=6ea6ff27806e0e519942e2b8f8f36562c585bb25c5f4c3c429146f411bdb1bb9
BOLT_MERCHANT_ID=DKWGv-jhr-Aa
BOLT_DIVISION_PUBLIC_ID=c1Rc7NBHQbSE
NEXT_PUBLIC_BOLT_PUBLISHABLE_KEY=DKWGv-jhr-Aa.c1Rc7NBHQbSE.9cc06285c6cde09d4d9921b24583c01851553295fad9f85c3f61c1bee40173ea
BOLT_ENVIRONMENT=sandbox
```
> ⚠️ Keep `BOLT_ENVIRONMENT=sandbox` initially. Switch to `production` only when ready for real payments.

#### Supabase Database
```bash
NEXT_PUBLIC_SUPABASE_URL=https://cgtazlhcyhghjlawkirf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndGF6bGhjeWhnaGpsYXdraXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDM2ODIsImV4cCI6MjA3MzgxOTY4Mn0.Oz76PvRpNTTrJMCOKbwWXTIzBePOqbLKLrCVk-qlwac
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNndGF6bGhjeWhnaGpsYXdraXJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI0MzY4MiwiZXhwIjoyMDczODE5NjgyfQ.FBAcBD0iSXiktUhHX8fzBWp5Ac7y4c0HvbSyYOUNYfs
```
> 📝 Copy these from your local `.env` file

#### Google Maps API
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyCdGVbQItM2MJHIlpa_yx3fHaTWk6iBL-M
```

#### Email Service (Resend)
```bash
RESEND_API_KEY=re_2dpc1LRw_G2fEETw66Cfh9eHWuMGogYfo
```

#### Optional - Development Mode
```bash
NEXT_PUBLIC_DEV_MODE=false
```
> Set to `false` for production

### After Adding Variables
- Click **"Redeploy"** in Vercel to apply changes
- Or push a new commit to trigger automatic deployment

---

## 🧪 Step 3: Test Booking Flow (End-to-End)

### Why This Matters
Verifies the entire payment → booking → email confirmation pipeline works in production.

### Test Scenario: Book a Cold Plunge Session

1. **Visit Production Site**
   - URL: https://therecoverymachine.co/booking
   - Or click "Book Now" button on homepage

2. **Select Service**
   - Choose: **"Cold Plunge Session"**
   - Verify price shows: **$175.00**
   - Duration shows: **60 minutes**

3. **Fill Booking Form**
   - **Name:** Your real name
   - **Email:** Use a real email you can check
   - **Phone:** Real phone number
   - **Date:** Tomorrow's date
   - **Time:** Any available slot
   - **Address:** Test address in Orange County
   - **Number of people:** 2

4. **Review Booking Summary**
   - Base price: $175.00
   - Travel fee: $0 (if within 5 miles) or $25 (if 5-15 miles out)
   - Total: Should calculate correctly

5. **Complete Bolt Payment**

   Use Bolt's test card for sandbox:
   ```
   Card Number: 4111 1111 1111 1111
   Expiry: Any future date (e.g., 12/25)
   CVV: 123
   ZIP: 90210
   ```

   > ⚠️ **Important:** Only use test cards when `BOLT_ENVIRONMENT=sandbox`

6. **Verify Redirect**
   - After payment, you should redirect to success page
   - Look for confirmation message

### What to Check After Test Booking

#### In Supabase Dashboard

1. **Check Orders Table**
   - Go to: https://supabase.com/dashboard
   - Select your project → Table Editor → `orders`
   - Find your test order
   - Verify:
     - ✅ `status` = `"paid"`
     - ✅ `bolt_checkout_id` is populated
     - ✅ `metadata.transaction_id` exists
     - ✅ `metadata.paid_at` has timestamp

2. **Check Bookings Table**
   - Table Editor → `bookings`
   - Find your test booking
   - Verify:
     - ✅ `status` = `"confirmed"`
     - ✅ `service_type` = `"cold_plunge"`
     - ✅ `total_amount` = correct total (17500 + travel fees)

#### In Your Email Inbox

3. **Check Confirmation Email**
   - Look for email from Recovery Machine
   - Subject should contain: "Booking Confirmation"
   - Email should include:
     - ✅ Service name (Cold Plunge Session)
     - ✅ Date and time
     - ✅ Location address
     - ✅ Total price paid
     - ✅ Contact information

#### In Vercel Logs (Optional - Advanced)

4. **Check Webhook Processing**
   - Vercel Dashboard → Your project → Logs
   - Filter by `/api/webhooks/bolt`
   - Look for recent POST request
   - Should show `200` status code
   - Check logs for: `"checkout.completed"` event processed

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Payment fails | Verify Bolt environment variables in Vercel |
| Booking status stays "pending" | Check webhook is configured in Bolt dashboard |
| No confirmation email | Check Resend API key and email logs in Vercel |
| Wrong price displayed | Clear browser cache, verify pricing constants updated |

---

## 📧 Step 4: Verify Email System

### Test Email Delivery

1. **Send Test Booking** (from Step 3)
2. **Check Email Inbox** (including spam folder)
3. **Verify Email Content**

   The email should contain:
   - **Header:** Recovery Machine branding
   - **Booking Details:**
     - Service name and price
     - Date and time of appointment
     - Location/address
     - Number of people
   - **Payment Confirmation:**
     - Total amount paid
     - Payment method (Bolt)
   - **Next Steps:**
     - What to expect
     - Preparation instructions
   - **Contact Information:**
     - Phone number
     - Email for questions

### Check Email Logs (If Issues)

1. **Resend Dashboard**
   - URL: https://resend.com/emails
   - Login with your Resend account
   - Check recent emails list

2. **Verify Delivery Status**
   - Look for email to your test address
   - Status should be: **"Delivered"**
   - If "Bounced" or "Failed", check email address validity

### Email Code Location
- Template: `lib/services/email.ts`
- Sent from: `app/api/webhooks/bolt/route.ts` (line 145)
- Trigger: After `checkout.completed` webhook received

---

## 🔄 Step 5: Switch to Production Payments (When Ready)

### ⚠️ ONLY DO THIS WHEN READY FOR REAL MONEY

Currently, you're in **sandbox mode** - all payments are test transactions. When you're ready to accept real payments:

### Instructions

1. **Get Production Bolt Credentials**
   - Log into Bolt Merchant Dashboard
   - Navigate to: **Developers** → **API Keys**
   - Switch to **"Production"** environment
   - Copy your production API keys

2. **Update Vercel Environment Variables**

   Replace these with production values:
   ```bash
   BOLT_API_KEY=<production-api-key>
   BOLT_PUBLISHABLE_KEY=<production-publishable-key>
   BOLT_MERCHANT_ID=<production-merchant-id>
   BOLT_DIVISION_PUBLIC_ID=<production-division-id>
   BOLT_ENVIRONMENT=production  # ← Change this from "sandbox"
   ```

3. **Register Production Webhook**
   - In Bolt Dashboard, switch to **Production** environment
   - Create new webhook (same URL as sandbox):
     - URL: `https://therecoverymachine.co/api/webhooks/bolt`
     - Generate NEW signing secret for production
   - Update Vercel variable:
     ```bash
     BOLT_WEBHOOK_SECRET=<new-production-secret>
     ```

4. **Redeploy Application**
   - Vercel Dashboard → Deployments → Redeploy
   - Or push new commit to trigger deployment

5. **Test with Real Card**
   - Make a small test purchase ($175 minimum)
   - Use a real credit card
   - Verify funds are actually charged
   - **Immediately refund test transaction** using Bolt dashboard

### Production Checklist
- [ ] Production Bolt API keys set
- [ ] Production webhook registered with NEW secret
- [ ] `BOLT_ENVIRONMENT=production` in Vercel
- [ ] Test transaction completed and refunded
- [ ] Monitoring set up for payment failures

---

## 📊 Monitoring & Maintenance

### Daily Checks (First Week)

1. **Check Booking Status**
   - Supabase → `bookings` table
   - Verify all bookings have status: `"confirmed"` or `"completed"`
   - Flag any stuck in `"pending"`

2. **Check Payment Processing**
   - Supabase → `orders` table
   - Verify all orders have status: `"paid"`
   - Investigate any `"failed"` status

3. **Monitor Email Delivery**
   - Resend Dashboard → Email logs
   - Check delivery rate is 95%+
   - Investigate bounces or failures

4. **Review Vercel Logs**
   - Look for webhook errors
   - Check API route performance
   - Monitor error rates

### Weekly Maintenance

- Review Bolt dashboard for transaction volume
- Check Supabase database usage/limits
- Verify Google Maps API quota
- Monitor Resend email quota
- Review customer support requests related to booking/payment

### Error Alerting (Recommended)

Consider setting up alerts for:
- Webhook failures (checkout.completed not received)
- Email delivery failures (confirmation not sent)
- Payment processing errors (orders stuck in pending)
- High refund rate (potential product/service issues)

---

## 🐛 Known Non-Blocking Issues

These warnings/issues exist but **do NOT block launch:**

### Build Warnings
- ✅ **Webpack cache warnings** (ENOSPC) - Non-critical
- ✅ **Browserslist data 6 months old** - Update periodically
- ✅ **OpenTelemetry dependency** - Expected in Next.js 15
- ✅ **Edge runtime static generation** - Expected behavior

### Code Quality
- 41 TODO/FIXME comments found in codebase
- None are blocking functionality
- Consider addressing post-launch for improvements

---

## 📞 Support & Emergency Contacts

### If Something Goes Wrong

1. **Payment Processing Issues**
   - Contact: Bolt Support (merchant dashboard)
   - Emergency: Check webhook logs in Bolt dashboard

2. **Database Issues**
   - Contact: Supabase Support
   - Check: Supabase status page

3. **Email Delivery Issues**
   - Contact: Resend Support
   - Check: Resend status page

4. **Deployment Issues**
   - Contact: Vercel Support
   - Check: Vercel status page

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Bookings not confirming | Check webhook configured, verify signing secret |
| Emails not sending | Check Resend API key in Vercel env vars |
| Wrong prices showing | Hard refresh browser (Cmd+Shift+R), clear cache |
| Payment page broken | Check Bolt publishable key is public (NEXT_PUBLIC_) |

---

## ✅ Launch Checklist (Final)

Print this and check off before going live:

### Pre-Launch
- [ ] Bolt webhook configured in merchant dashboard
- [ ] All environment variables set in Vercel
- [ ] Test booking completed successfully in sandbox
- [ ] Confirmation email received and reviewed
- [ ] Webhook processing verified in logs
- [ ] Pricing verified on all pages ($275/$525/$850 memberships)
- [ ] Domain (therecoverymachine.co) resolves correctly
- [ ] SSL certificate active (HTTPS working)

### Launch Day
- [ ] Final test booking in sandbox mode
- [ ] Monitor first hour of logs closely
- [ ] Check first real booking processes correctly
- [ ] Verify first confirmation email sends
- [ ] Keep Bolt dashboard open for monitoring

### Post-Launch (First 24 Hours)
- [ ] Review all completed bookings
- [ ] Check email delivery rate
- [ ] Monitor Vercel logs for errors
- [ ] Respond to any customer questions
- [ ] Prepare to switch to production payments (if testing successful)

---

## 🎉 You're Ready to Launch!

No major bugs were found during the pre-launch audit. Once you complete:
1. ✅ Bolt webhook setup
2. ✅ Vercel environment variables
3. ✅ End-to-end test booking

**You're cleared for takeoff! 🚀**

---

*Last updated: January 2025*
*Build Status: ✅ Passing (0 errors)*
*Pricing: ✅ Updated site-wide*
