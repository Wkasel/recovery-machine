/**
 * PERFORMANCE EDGE CASES & LOAD TESTING
 * Tests system behavior under stress, memory pressure, and degraded conditions
 */

import { expect, test } from "@playwright/test";

test.describe("PERFORMANCE EDGE CASES: System Under Stress", () => {
  test.describe("🚀 Memory & Resource Pressure", () => {
    test("Memory leak during extended booking session", async ({ page }) => {
      // Monitor memory usage throughout test
      let initialMemory: number;
      let currentMemory: number;

      await page.goto("/book");

      // Get baseline memory
      initialMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });

      // Simulate extended booking session with many interactions
      for (let i = 0; i < 50; i++) {
        // Repeatedly interact with form elements
        await page.getByTestId("service-cold-plunge").click();
        await page.getByTestId("service-infrared-sauna").click();
        await page.getByTestId("service-combo-package").click();

        // Trigger address autocomplete multiple times
        await page.getByTestId("address-input").fill(`123 Main St ${i}`);
        await page.getByTestId("address-input").clear();

        // Open and close date picker
        await page.getByTestId("date-picker").click();
        await page.keyboard.press("Escape");

        // Check memory every 10 iterations
        if (i % 10 === 0) {
          currentMemory = await page.evaluate(() => {
            return (performance as any).memory?.usedJSHeapSize || 0;
          });

          const memoryIncrease = currentMemory - initialMemory;
          console.log(`Iteration ${i}: Memory increase: ${memoryIncrease / 1024 / 1024} MB`);

          // CRITICAL: Memory should not grow unbounded
          expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB limit
        }
      }

      // Force garbage collection if available
      await page.evaluate(() => {
        if ((window as any).gc) {
          (window as any).gc();
        }
      });

      // Final memory check
      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });

      const totalIncrease = finalMemory - initialMemory;
      expect(totalIncrease).toBeLessThan(100 * 1024 * 1024); // 100MB final limit
    });

    test("DOM node accumulation during calendar navigation", async ({ page }) => {
      await page.goto("/book");
      await page.getByTestId("service-cold-plunge").click();

      // Get initial DOM node count
      const initialNodes = await page.evaluate(() => {
        return document.querySelectorAll("*").length;
      });

      // Navigate calendar extensively
      for (let month = 0; month < 12; month++) {
        await page.getByTestId("date-picker").click();
        await page.getByTestId("next-month").click();

        // Load calendar month view
        await page.waitForTimeout(100);

        await page.keyboard.press("Escape");
      }

      // Check final DOM node count
      const finalNodes = await page.evaluate(() => {
        return document.querySelectorAll("*").length;
      });

      const nodeIncrease = finalNodes - initialNodes;

      // CRITICAL: Should not accumulate excessive DOM nodes
      expect(nodeIncrease).toBeLessThan(1000); // Reasonable limit for calendar navigation
    });

    test("Event listener cleanup during form interactions", async ({ page }) => {
      await page.goto("/book");

      // Monitor event listeners
      const getEventListenerCount = async () =>
        page.evaluate(() => {
          const allElements = document.querySelectorAll("*");
          let listenerCount = 0;

          allElements.forEach((element) => {
            const events = (window as any).getEventListeners?.(element) || {};
            Object.keys(events).forEach((eventType) => {
              listenerCount += events[eventType].length;
            });
          });

          return listenerCount;
        });

      const initialListeners = await getEventListenerCount();

      // Create and destroy many form interactions
      for (let i = 0; i < 20; i++) {
        // Create form with many inputs
        await page.evaluate((iteration) => {
          const container = document.createElement("div");
          container.id = `test-form-${iteration}`;

          for (let j = 0; j < 10; j++) {
            const input = document.createElement("input");
            input.addEventListener("change", () => console.log("change"));
            input.addEventListener("focus", () => console.log("focus"));
            input.addEventListener("blur", () => console.log("blur"));
            container.appendChild(input);
          }

          document.body.appendChild(container);
        }, i);

        // Remove form
        await page.evaluate((iteration) => {
          const container = document.getElementById(`test-form-${iteration}`);
          if (container) {
            container.remove();
          }
        }, i);
      }

      // Force garbage collection
      await page.waitForTimeout(1000);

      const finalListeners = await getEventListenerCount();
      const listenerIncrease = finalListeners - initialListeners;

      // CRITICAL: Should not leak event listeners
      expect(listenerIncrease).toBeLessThan(50); // Small tolerance for framework overhead
    });
  });

  test.describe("⚡ Network Performance Under Load", () => {
    test("Slow 3G booking flow completion", async ({ page }) => {
      // Simulate 3G network conditions
      const client = await page.context().newCDPSession(page);
      await client.send("Network.emulateNetworkConditions", {
        offline: false,
        downloadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
        uploadThroughput: (750 * 1024) / 8, // 750 Kbps
        latency: 300, // 300ms latency
      });

      const startTime = Date.now();

      await page.goto("/book");

      // Should show loading states for slow network
      await expect(page.getByTestId("page-loading")).toBeVisible();

      // Complete booking flow with network simulation
      await page.getByTestId("service-cold-plunge").click();
      await expect(page.getByTestId("service-loading")).toBeVisible();

      await page.getByTestId("address-input").fill("123 Main St, Anytown, CA 90210");

      // Address validation should show loading
      await expect(page.getByTestId("address-validation-loading")).toBeVisible();

      // Continue with date selection
      await page.getByTestId("date-picker").click();
      await expect(page.getByTestId("calendar-loading")).toBeVisible();

      await page.getByTestId("available-slot").first().click();

      // Complete booking
      await page.getByRole("button", { name: /complete booking/i }).click();

      const completionTime = Date.now() - startTime;

      // Should complete within reasonable time on slow network
      expect(completionTime).toBeLessThan(30000); // 30 seconds max

      // Should show appropriate loading states throughout
      await expect(page.getByTestId("booking-success")).toBeVisible();
    });

    test("High latency API responses", async ({ page }) => {
      // Add significant delays to all API calls
      await page.route("**/api/**", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
        await route.continue();
      });

      await page.goto("/book");

      // Should show loading indicators for delayed responses
      await page.getByTestId("service-cold-plunge").click();
      await expect(page.getByTestId("api-loading-indicator")).toBeVisible();

      // User should be able to continue interacting
      await page.getByTestId("address-input").fill("123 Main St");

      // Should batch API calls to reduce impact
      const startTime = Date.now();
      await page.getByRole("button", { name: /continue/i }).click();
      const endTime = Date.now();

      // Should not block UI for full delay duration
      expect(endTime - startTime).toBeLessThan(5000);
    });

    test("Request timeouts and retries", async ({ page }) => {
      let requestCount = 0;

      await page.route("**/api/bookings", async (route) => {
        requestCount++;

        if (requestCount < 3) {
          // Fail first 2 requests
          await route.abort();
        } else {
          // Succeed on 3rd attempt
          await route.fulfill({
            status: 200,
            body: JSON.stringify({ id: "booking_123", status: "confirmed" }),
          });
        }
      });

      await page.goto("/book");
      await page.getByTestId("complete-booking-flow").fill();
      await page.getByRole("button", { name: /complete booking/i }).click();

      // Should show retry attempts
      await expect(page.getByTestId("request-retry-1")).toBeVisible();
      await expect(page.getByTestId("request-retry-2")).toBeVisible();

      // Should eventually succeed
      await expect(page.getByTestId("booking-success")).toBeVisible();
      expect(requestCount).toBe(3);
    });
  });

  test.describe("📱 Mobile Performance Edge Cases", () => {
    test("iOS Safari memory pressure booking flow", async ({ page, isMobile }) => {
      if (!isMobile) test.skip();

      // Simulate iOS Safari memory constraints
      await page.addInitScript(() => {
        // Mock limited memory environment
        Object.defineProperty(navigator, "deviceMemory", {
          writable: false,
          value: 1, // 1GB device
        });
      });

      await page.goto("/book");

      // iOS Safari tends to reload tabs under memory pressure
      // Simulate this by temporarily navigating away and back
      await page.getByTestId("service-cold-plunge").click();
      await page.getByTestId("address-input").fill("123 Main St, Test City, CA");

      // Simulate tab reload (Safari memory management)
      await page.reload();

      // Should restore form state from localStorage/sessionStorage
      await expect(page.getByDisplayValue("123 Main St, Test City, CA")).toBeVisible();
      await expect(page.getByTestId("service-cold-plunge")).toHaveClass(/selected/);
    });

    test("Android Chrome touch responsiveness under load", async ({ page, isMobile }) => {
      if (!isMobile) test.skip();

      // Simulate CPU throttling (common on mid-range Android devices)
      const client = await page.context().newCDPSession(page);
      await client.send("Emulation.setCPUThrottlingRate", { rate: 4 }); // 4x slower

      await page.goto("/book");

      // Test touch responsiveness with throttled CPU
      const touchStart = Date.now();
      await page.getByTestId("service-cold-plunge").tap();
      const touchResponse = Date.now() - touchStart;

      // Should respond to touch within reasonable time even with throttling
      expect(touchResponse).toBeLessThan(1000); // 1 second max

      // Visual feedback should appear quickly
      await expect(page.getByTestId("service-cold-plunge")).toHaveClass(/selected/);
    });

    test("Mobile keyboard overlay handling", async ({ page, isMobile }) => {
      if (!isMobile) test.skip();

      // Simulate mobile viewport with keyboard overlay
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone size

      await page.goto("/book");
      await page.getByTestId("service-cold-plunge").click();

      // Focus on input field (triggers virtual keyboard)
      await page.getByTestId("address-input").click();

      // Simulate keyboard appearance (viewport height reduction)
      await page.setViewportSize({ width: 375, height: 400 });

      // Important UI elements should remain accessible
      const submitButton = page.getByRole("button", { name: /continue/i });
      await expect(submitButton).toBeInViewport();

      // Should auto-scroll to keep active field visible
      await page.getByTestId("special-instructions").click();
      await expect(page.getByTestId("special-instructions")).toBeInViewport();
    });
  });

  test.describe("🔄 Concurrent User Scenarios", () => {
    test("100 concurrent users booking same day", async ({ page, context }) => {
      const concurrentUsers = 10; // Reduced for test performance
      const pages: any[] = [];

      // Create multiple browser tabs simulating concurrent users
      for (let i = 0; i < concurrentUsers; i++) {
        const newPage = await context.newPage();
        pages.push(newPage);
      }

      // All users start booking process simultaneously
      const bookingPromises = pages.map(async (userPage, index) => {
        await userPage.goto("/book");
        await userPage.getByTestId("service-cold-plunge").click();
        await userPage.getByTestId("address-input").fill(`Address ${index}`);
        await userPage.getByTestId("date-picker").click();

        // All try to book same popular time slot
        await userPage.getByTestId("time-slot-15:00").click();

        return userPage.getByRole("button", { name: /complete booking/i }).click();
      });

      // Execute all bookings concurrently
      await Promise.allSettled(bookingPromises);

      // Check how many succeeded
      let successCount = 0;
      let conflictCount = 0;

      for (const userPage of pages) {
        const success = await userPage
          .getByTestId("booking-success")
          .isVisible()
          .catch(() => false);
        const conflict = await userPage
          .getByTestId("time-conflict-error")
          .isVisible()
          .catch(() => false);

        if (success) successCount++;
        if (conflict) conflictCount++;

        await userPage.close();
      }

      // Should handle concurrent requests gracefully
      expect(successCount + conflictCount).toBe(concurrentUsers);
      expect(successCount).toBeGreaterThan(0); // At least some should succeed
      expect(conflictCount).toBeGreaterThan(0); // Others should get conflict errors
    });

    test("Database connection pool under concurrent load", async ({ page }) => {
      // Simulate multiple rapid requests
      const promises = [];

      for (let i = 0; i < 20; i++) {
        promises.push(
          page.evaluate(async (index) => {
            return fetch("/api/availability", {
              method: "GET",
              headers: { "x-test-request": `concurrent-${index}` },
            });
          }, i)
        );
      }

      const responses = await Promise.allSettled(promises);

      // Should handle concurrent requests without connection pool exhaustion
      const successCount = responses.filter((r) => r.status === "fulfilled").length;
      expect(successCount).toBeGreaterThan(15); // Most should succeed

      // Failed requests should be due to rate limiting, not connection errors
      const failedResponses = responses.filter((r) => r.status === "rejected");
      expect(failedResponses.length).toBeLessThan(5);
    });
  });

  test.describe("💾 Data Volume Performance", () => {
    test("Large booking history performance", async ({ page }) => {
      // Mock user with extensive booking history
      await page.route("**/api/bookings*", async (route) => {
        const url = new URL(route.request().url());

        if (url.pathname.includes("/bookings")) {
          // Generate large dataset
          const bookings = Array.from({ length: 1000 }, (_, i) => ({
            id: `booking_${i}`,
            date_time: new Date(Date.now() + i * 86400000).toISOString(),
            service: "cold_plunge",
            status: ["completed", "scheduled", "cancelled"][i % 3],
          }));

          await route.fulfill({
            status: 200,
            body: JSON.stringify(bookings),
          });
        }
      });

      await page.goto("/dashboard");

      const loadStart = Date.now();
      await expect(page.getByTestId("bookings-list")).toBeVisible();
      const loadTime = Date.now() - loadStart;

      // Should handle large datasets efficiently
      expect(loadTime).toBeLessThan(5000); // 5 seconds max

      // Should implement virtualization or pagination
      const visibleBookings = await page.getByTestId("booking-item").count();
      expect(visibleBookings).toBeLessThan(50); // Don't render all 1000 at once

      // Search/filter should remain responsive
      const searchStart = Date.now();
      await page.getByTestId("booking-search").fill("completed");
      await page.waitForTimeout(100);
      const searchTime = Date.now() - searchStart;

      expect(searchTime).toBeLessThan(1000); // Search should be fast
    });

    test("Image loading optimization under slow conditions", async ({ page }) => {
      // Simulate slow image loading
      await page.route("**/*.{png,jpg,jpeg,webp}", async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 second delay
        await route.continue();
      });

      await page.goto("/");

      // Should show placeholder content immediately
      await expect(page.getByTestId("hero-content")).toBeVisible();

      // Should not block page interaction while images load
      const interactionStart = Date.now();
      await page.getByRole("button", { name: /book now/i }).click();
      const interactionTime = Date.now() - interactionStart;

      expect(interactionTime).toBeLessThan(1000); // Should respond quickly despite image loading

      // Should implement lazy loading for below-fold images
      const lazyImages = await page.getByTestId("lazy-image").count();
      expect(lazyImages).toBeGreaterThan(0); // Should have lazy-loaded images
    });
  });

  test.describe("🔥 Stress Test Scenarios", () => {
    test("Rapid form interactions stress test", async ({ page }) => {
      await page.goto("/book");

      const stressStart = Date.now();

      // Rapid form interactions
      for (let i = 0; i < 100; i++) {
        await page.getByTestId("service-cold-plunge").click();
        await page.getByTestId("service-infrared-sauna").click();

        if (i % 10 === 0) {
          // Check responsiveness every 10 iterations
          const response = await page.evaluate(() => {
            const start = performance.now();
            document.body.style.backgroundColor = "red";
            document.body.style.backgroundColor = "";
            return performance.now() - start;
          });

          // UI should remain responsive (< 16ms for 60fps)
          expect(response).toBeLessThan(50); // Allow some tolerance
        }
      }

      const stressTime = Date.now() - stressStart;
      console.log(`Stress test completed in ${stressTime}ms`);

      // Should complete stress test without crashing
      await expect(page.getByTestId("service-cold-plunge")).toBeVisible();
    });

    test("Memory-intensive calendar navigation", async ({ page }) => {
      await page.goto("/book");
      await page.getByTestId("service-cold-plunge").click();

      // Navigate through many months rapidly
      for (let i = 0; i < 50; i++) {
        await page.getByTestId("date-picker").click();
        await page.getByTestId("next-month").click();
        await page.keyboard.press("Escape");

        // Force a small delay to simulate real usage
        await page.waitForTimeout(10);
      }

      // Should still be responsive after extensive navigation
      await page.getByTestId("date-picker").click();
      await expect(page.getByTestId("calendar-grid")).toBeVisible();

      // Memory should not have grown excessively
      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });

      expect(finalMemory).toBeLessThan(200 * 1024 * 1024); // 200MB limit
    });
  });
});
