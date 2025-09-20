/**
 * CRITICAL BUSINESS SCENARIOS TEST SUITE
 * Tests that protect revenue and prevent business-critical failures
 *
 * Focus: Real-world failure modes that cost money and customer trust
 */

import { expect, test } from "@playwright/test";

test.describe("CRITICAL: Revenue-Impacting Scenarios", () => {
  test.describe("🚨 Payment & Booking Integrity", () => {
    test("CRITICAL: Payment succeeds but booking creation fails", async ({ page }) => {
      // Mock Bolt payment success but database failure
      await page.route("**/api/payments/checkout", async (route) => {
        // Simulate Bolt payment success
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            success: true,
            checkout_id: "test_checkout_123",
            checkout_url: "https://checkout-sandbox.bolt.com/test_checkout_123",
          }),
        });
      });

      await page.route("**/api/bookings", async (route) => {
        // Simulate booking creation failure
        await route.fulfill({
          status: 500,
          body: JSON.stringify({ error: "Database connection failed" }),
        });
      });

      await page.goto("/book");

      // Complete booking flow
      await page.getByTestId("service-cold-plunge").click();
      await page.getByTestId("address-input").fill("123 Main St, Anytown, CA 90210");
      await page.getByTestId("date-picker").click();
      await page.getByTestId("available-slot").first().click();

      // Attempt payment
      await page.getByRole("button", { name: /complete booking/i }).click();

      // CRITICAL: System should detect and handle this scenario
      await expect(page.getByTestId("payment-booking-mismatch-error")).toBeVisible();
      await expect(page.getByText(/payment successful but booking failed/i)).toBeVisible();

      // Should provide recovery options
      await expect(page.getByRole("button", { name: /contact support/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /retry booking/i })).toBeVisible();
    });

    test("CRITICAL: Concurrent bookings for same time slot", async ({ page, context }) => {
      // Create two browser contexts to simulate concurrent users
      const page2 = await context.newPage();

      const timeSlot = "2024-12-01T15:00:00Z";

      // Both users start booking same slot
      await Promise.all([page.goto("/book"), page2.goto("/book")]);

      // Both select same service and time
      await Promise.all([
        page.getByTestId("service-cold-plunge").click(),
        page2.getByTestId("service-cold-plunge").click(),
      ]);

      await Promise.all([
        page.getByTestId(`time-slot-${timeSlot}`).click(),
        page2.getByTestId(`time-slot-${timeSlot}`).click(),
      ]);

      // Both try to complete booking simultaneously
      await Promise.all([
        page.getByRole("button", { name: /complete booking/i }).click(),
        page2.getByRole("button", { name: /complete booking/i }).click(),
      ]);

      // CRITICAL: Only one should succeed, other should get error
      const page1Success = await page
        .getByTestId("booking-success")
        .isVisible()
        .catch(() => false);
      const page2Success = await page2
        .getByTestId("booking-success")
        .isVisible()
        .catch(() => false);

      // Exactly one should succeed
      expect(page1Success !== page2Success).toBe(true);

      // The failing page should show appropriate error
      const failedPage = page1Success ? page2 : page;
      await expect(failedPage.getByText(/time slot no longer available/i)).toBeVisible();
      await expect(
        failedPage.getByRole("button", { name: /choose different time/i })
      ).toBeVisible();
    });

    test("CRITICAL: Session expires during checkout flow", async ({ page }) => {
      await page.goto("/book");

      // Start booking process
      await page.getByTestId("service-cold-plunge").click();
      await page.getByTestId("address-input").fill("123 Main St, Anytown, CA 90210");

      // Simulate session expiration
      await page.evaluate(() => {
        // Clear auth cookies/localStorage
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "";
      });

      // Try to continue booking
      await page.getByTestId("date-picker").click();

      // CRITICAL: Should detect expired session and handle gracefully
      await expect(page.getByTestId("session-expired-modal")).toBeVisible();
      await expect(page.getByText(/your session has expired/i)).toBeVisible();

      // Should preserve booking state for after re-authentication
      await page.getByRole("button", { name: /sign in to continue/i }).click();

      // After re-auth, should restore booking state
      // Mock successful re-authentication
      await page.goto("/book?restored=true");
      await expect(page.getByDisplayValue("123 Main St, Anytown, CA 90210")).toBeVisible();
      await expect(page.getByTestId("service-cold-plunge")).toHaveClass(/selected/);
    });
  });

  test.describe("🚨 External Service Failures", () => {
    test("CRITICAL: Bolt payment gateway timeout", async ({ page }) => {
      // Mock slow Bolt API response
      await page.route("**/api/payments/checkout", async (route) => {
        // Simulate timeout
        await new Promise((resolve) => setTimeout(resolve, 31000)); // 31 second delay
        await route.abort();
      });

      await page.goto("/book");

      // Complete booking flow quickly
      await page.getByTestId("service-cold-plunge").click();
      await page.getByTestId("quick-booking-form").fill({
        address: "123 Main St, Anytown, CA 90210",
        date: "2024-12-01",
        time: "15:00",
      });

      // Attempt payment
      await page.getByRole("button", { name: /complete booking/i }).click();

      // CRITICAL: Should handle timeout gracefully
      await expect(page.getByTestId("payment-timeout-error")).toBeVisible({ timeout: 35000 });
      await expect(page.getByText(/payment processing timed out/i)).toBeVisible();

      // Should offer retry options
      await expect(page.getByRole("button", { name: /try payment again/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /save booking for later/i })).toBeVisible();
    });

    test("CRITICAL: Supabase database connection lost", async ({ page }) => {
      // Start booking process
      await page.goto("/book");
      await page.getByTestId("service-cold-plunge").click();

      // Mock database connection failure
      await page.route("**/rest/v1/**", async (route) => {
        await route.fulfill({
          status: 503,
          body: JSON.stringify({ error: "Database connection failed" }),
        });
      });

      // Try to continue booking
      await page.getByTestId("address-input").fill("123 Main St");
      await page.getByRole("button", { name: /continue/i }).click();

      // CRITICAL: Should detect database issues
      await expect(page.getByTestId("service-unavailable-error")).toBeVisible();
      await expect(page.getByText(/service temporarily unavailable/i)).toBeVisible();

      // Should provide alternatives
      await expect(page.getByRole("button", { name: /try again/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /contact us directly/i })).toBeVisible();
    });

    test("CRITICAL: Google Maps API failure during address validation", async ({ page }) => {
      // Mock Google Maps API failure
      await page.route("**/maps/api/**", async (route) => {
        await route.fulfill({
          status: 403,
          body: JSON.stringify({ error: "API quota exceeded" }),
        });
      });

      await page.goto("/book");
      await page.getByTestId("service-cold-plunge").click();

      // Try to enter address
      await page.getByTestId("address-input").fill("123 Main St, Anytown, CA");

      // CRITICAL: Should handle missing address validation
      await expect(page.getByTestId("address-validation-unavailable")).toBeVisible();
      await expect(page.getByText(/address validation temporarily unavailable/i)).toBeVisible();

      // Should allow manual address entry with warning
      await expect(page.getByRole("button", { name: /continue with manual entry/i })).toBeVisible();
      await expect(page.getByText(/please ensure address is accurate/i)).toBeVisible();
    });
  });

  test.describe("🚨 Mobile & Cross-Device Critical Issues", () => {
    test("CRITICAL: iOS Safari payment popup blocked", async ({ page, isMobile }) => {
      if (!isMobile) test.skip();

      // Mock Safari popup blocking behavior
      await page.addInitScript(() => {
        window.open = () => null; // Simulate blocked popup
      });

      await page.goto("/book");

      // Complete booking flow
      await page.getByTestId("service-cold-plunge").click();
      await page.getByTestId("mobile-quick-book").click();

      // Try to open payment
      await page.getByRole("button", { name: /pay now/i }).click();

      // CRITICAL: Should detect popup failure and provide alternative
      await expect(page.getByTestId("popup-blocked-warning")).toBeVisible();
      await expect(page.getByText(/popup blocked by browser/i)).toBeVisible();

      // Should offer inline payment option
      await expect(page.getByRole("button", { name: /pay in current window/i })).toBeVisible();
    });

    test("CRITICAL: Android keyboard overlaps payment form", async ({ page, isMobile }) => {
      if (!isMobile) test.skip();

      // Simulate mobile viewport with keyboard
      await page.setViewportSize({ width: 375, height: 400 }); // Reduced height simulates keyboard

      await page.goto("/book");
      await page.getByTestId("service-cold-plunge").click();

      // Navigate to payment step
      await page.getByTestId("address-input").fill("123 Main St, Anytown, CA 90210");
      await page.getByTestId("date-picker").click();
      await page.getByTestId("available-slot").first().click();

      // Focus on payment form fields (triggers keyboard)
      await page.getByTestId("credit-card-input").click();

      // CRITICAL: Submit button should remain accessible
      const submitButton = page.getByRole("button", { name: /complete booking/i });
      await expect(submitButton).toBeInViewport();

      // Should auto-scroll to keep form usable
      await page.getByTestId("expiry-input").click();
      await expect(submitButton).toBeInViewport();
    });
  });

  test.describe("🚨 Business Logic Edge Cases", () => {
    test("CRITICAL: Referral credit exceeds booking cost", async ({ page }) => {
      // Mock user with high credit balance
      await page.addInitScript(() => {
        window.mockUserData = {
          credits: 20000, // $200 in credits
          hasActiveCredits: true,
        };
      });

      await page.goto("/book");

      // Select cheaper service
      await page.getByTestId("service-cold-plunge").click(); // $80 service

      // Complete booking details
      await page.getByTestId("address-input").fill("123 Main St, Anytown, CA 90210");
      await page.getByTestId("date-picker").click();
      await page.getByTestId("available-slot").first().click();

      // CRITICAL: Should handle credit excess properly
      await expect(page.getByTestId("credit-balance-display")).toContainText("$200.00");
      await expect(page.getByTestId("service-cost-display")).toContainText("$80.00");

      // Should show remaining credit after booking
      await expect(page.getByTestId("remaining-credit-display")).toContainText("$120.00");

      // Should not charge payment method
      await expect(page.getByTestId("payment-amount-display")).toContainText("$0.00");
      await expect(page.getByText(/this booking is covered by your credits/i)).toBeVisible();
    });

    test("CRITICAL: Booking scheduled during business closure", async ({ page }) => {
      // Mock admin setting business hours
      await page.route("**/api/admin/settings", async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            businessHours: {
              monday: { closed: true },
              sunday: { closed: true },
            },
            holidays: ["2024-12-25", "2024-01-01"],
          }),
        });
      });

      await page.goto("/book");
      await page.getByTestId("service-cold-plunge").click();

      // Try to select closed day
      await page.getByTestId("date-picker").click();
      await page.getByTestId("calendar-date-2024-12-25").click(); // Christmas

      // CRITICAL: Should prevent booking on closed days
      await expect(page.getByTestId("holiday-closure-warning")).toBeVisible();
      await expect(page.getByText(/we are closed on this date/i)).toBeVisible();

      // Should not show available time slots
      await expect(page.getByTestId("time-slots-container")).not.toBeVisible();

      // Should suggest alternative dates
      await expect(page.getByTestId("suggested-dates")).toBeVisible();
    });

    test("CRITICAL: Price changes during booking session", async ({ page }) => {
      await page.goto("/book");

      // Start with initial pricing
      await page.getByTestId("service-cold-plunge").click();
      await expect(page.getByTestId("price-display")).toContainText("$80.00");

      // Simulate price change in background
      await page.route("**/api/pricing", async (route) => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            cold_plunge: 9000, // Price increased to $90
            updated_at: new Date().toISOString(),
          }),
        });
      });

      // Complete booking details
      await page.getByTestId("address-input").fill("123 Main St, Anytown, CA 90210");
      await page.getByTestId("date-picker").click();
      await page.getByTestId("available-slot").first().click();

      // Proceed to payment
      await page.getByRole("button", { name: /continue to payment/i }).click();

      // CRITICAL: Should detect price change and alert user
      await expect(page.getByTestId("price-change-modal")).toBeVisible();
      await expect(page.getByText(/price has been updated/i)).toBeVisible();
      await expect(page.getByText(/new price: \$90\.00/i)).toBeVisible();

      // Should require user confirmation
      await expect(page.getByRole("button", { name: /accept new price/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /cancel booking/i })).toBeVisible();
    });
  });

  test.describe("🚨 Data Integrity & Security", () => {
    test("CRITICAL: User attempts to access other user bookings", async ({ page }) => {
      await page.goto("/book");

      // Try to manipulate user_id in requests
      await page.route("**/api/bookings", async (route) => {
        const request = route.request();
        const body = await request.postData();

        if (body?.includes('"user_id":"different_user_123"')) {
          // CRITICAL: Should reject unauthorized user_id
          await route.fulfill({
            status: 403,
            body: JSON.stringify({ error: "Unauthorized access" }),
          });
        } else {
          await route.continue();
        }
      });

      // Simulate malicious request injection
      await page.evaluate(() => {
        fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: "different_user_123", // Attempt to book for different user
            service: "cold_plunge",
          }),
        });
      });

      // Should be blocked by RLS policies
      await expect(page.getByTestId("unauthorized-error")).toBeVisible();
    });

    test("CRITICAL: SQL injection attempt in booking form", async ({ page }) => {
      await page.goto("/book");
      await page.getByTestId("service-cold-plunge").click();

      // Attempt SQL injection in special instructions
      const maliciousInput = "'; DROP TABLE bookings; --";
      await page.getByTestId("special-instructions").fill(maliciousInput);

      // Complete booking
      await page.getByTestId("address-input").fill("123 Main St, Anytown, CA 90210");
      await page.getByTestId("date-picker").click();
      await page.getByTestId("available-slot").first().click();
      await page.getByRole("button", { name: /complete booking/i }).click();

      // CRITICAL: Should be safely escaped, not executed
      // If successful, verify data was escaped
      await expect(page.getByTestId("booking-success")).toBeVisible();

      // Verify instructions were stored as literal string
      await page.goto("/dashboard");
      await expect(page.getByText(maliciousInput)).toBeVisible(); // Should be displayed as-is
    });
  });
});

test.describe("CRITICAL: Error Recovery & Monitoring", () => {
  test("CRITICAL: Webhook delivery failures from Bolt", async ({ page }) => {
    // Mock successful payment but webhook failure
    await page.route("**/api/webhooks/bolt", async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Webhook processing failed" }),
      });
    });

    await page.goto("/book");

    // Complete booking flow
    await page.getByTestId("service-cold-plunge").click();
    await page.getByTestId("address-input").fill("123 Main St, Anytown, CA 90210");
    await page.getByTestId("date-picker").click();
    await page.getByTestId("available-slot").first().click();
    await page.getByRole("button", { name: /complete booking/i }).click();

    // Payment completes but webhook fails
    await page.goto("/payment/success?checkout_id=test_123");

    // CRITICAL: Should detect webhook failure and provide recovery
    await expect(page.getByTestId("payment-verification-pending")).toBeVisible();
    await expect(page.getByText(/verifying your payment/i)).toBeVisible();

    // Should provide contact information for manual resolution
    await expect(page.getByTestId("manual-verification-contact")).toBeVisible();
  });

  test("CRITICAL: High load performance degradation", async ({ page }) => {
    // Simulate slow responses
    await page.route("**/*", async (route) => {
      // Add random delays to simulate high load
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000));
      await route.continue();
    });

    const startTime = Date.now();

    await page.goto("/book");
    await page.getByTestId("service-cold-plunge").click();

    const loadTime = Date.now() - startTime;

    // CRITICAL: Should handle slow performance gracefully
    if (loadTime > 5000) {
      // Should show loading states for slow operations
      await expect(page.getByTestId("loading-indicator")).toBeVisible();

      // Should provide option to continue or retry
      await expect(page.getByRole("button", { name: /page loading slowly/i })).toBeVisible();
    }

    // Should eventually complete or provide error message
    const bookingForm = page.getByTestId("booking-form");
    const errorMessage = page.getByTestId("performance-error");

    await expect(bookingForm.or(errorMessage)).toBeVisible({ timeout: 30000 });
  });
});
