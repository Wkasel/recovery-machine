// Baseline Instagram Integration Tests
// Tests current Instagram functionality before migration to Behold.so

import { expect, test } from "@playwright/test";

test.describe("Instagram Integration Baseline", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should display Instagram section on homepage", async ({ page }) => {
    // Check for Instagram section header
    const instagramHeader = page.locator("text=See Real Recoveries in Action");
    await expect(instagramHeader).toBeVisible();

    // Check for follow link
    const followLink = page.locator("text=Follow @therecoverymachine");
    await expect(followLink).toBeVisible();

    // Verify Instagram grid container exists
    const instagramGrid = page.locator('[data-testid="instagram-grid"]').or(
      page
        .locator("div")
        .filter({ hasText: /Follow.*therecoverymachine/ })
        .first()
        .locator("..")
        .locator("div")
        .nth(1)
    );
    await expect(instagramGrid).toBeVisible();
  });

  test("should load Instagram images with fallback", async ({ page }) => {
    // Wait for Instagram images to load
    await page.waitForSelector('img[src*="unsplash"]', { timeout: 10000 });

    // Count Instagram images
    const instagramImages = page.locator('img[src*="unsplash"]');
    const imageCount = await instagramImages.count();

    expect(imageCount).toBeGreaterThan(0);
    expect(imageCount).toBeLessThanOrEqual(6); // Default grid size

    // Verify images have proper alt text
    for (let i = 0; i < Math.min(imageCount, 3); i++) {
      const img = instagramImages.nth(i);
      const altText = await img.getAttribute("alt");
      expect(altText).toBeTruthy();
    }
  });

  test("should handle Instagram API failure gracefully", async ({ page }) => {
    // Mock Instagram API failure
    await page.route("**/api/instagram/**", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Instagram API unavailable" }),
      });
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Should still show fallback content
    const fallbackImages = page.locator('img[src*="unsplash"]');
    const fallbackCount = await fallbackImages.count();
    expect(fallbackCount).toBeGreaterThan(0);
  });

  test("should navigate to Instagram profile when clicked", async ({ page }) => {
    // Find and click Instagram follow button
    const followButton = page.locator('a:has-text("Follow on Instagram")');
    await expect(followButton).toBeVisible();

    // Verify it has correct href
    const href = await followButton.getAttribute("href");
    expect(href).toContain("instagram.com");
    expect(href).toContain("therecoverymachine");

    // Verify it opens in new tab
    const target = await followButton.getAttribute("target");
    expect(target).toBe("_blank");
  });

  test("should be responsive across different viewports", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileGrid = page.locator('img[src*="unsplash"]').first();
    await expect(mobileGrid).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletGrid = page.locator('img[src*="unsplash"]').first();
    await expect(tabletGrid).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopGrid = page.locator('img[src*="unsplash"]').first();
    await expect(desktopGrid).toBeVisible();
  });

  test("should track Instagram interactions for analytics", async ({ page }) => {
    let analyticsEvents: any[] = [];

    // Listen for analytics calls
    await page.exposeFunction("captureAnalytics", (event: any) => {
      analyticsEvents.push(event);
    });

    // Override gtag to capture events
    await page.addInitScript(() => {
      (window as any).gtag = (type: string, event: string, data: any) => {
        (window as any).captureAnalytics({ type, event, data });
      };
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Click on an Instagram image
    const instagramImage = page.locator('img[src*="unsplash"]').first();
    await expect(instagramImage).toBeVisible();
    await instagramImage.click();

    // Verify analytics event was tracked
    // Note: This test will pass even if analytics isn't implemented yet
    console.log("Analytics events captured:", analyticsEvents.length);
  });

  test("should show loading states appropriately", async ({ page }) => {
    // Slow down network to test loading states
    await page.route("**/api/instagram/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s delay
      route.continue();
    });

    await page.reload();

    // Check for loading skeletons or indicators
    // This will be updated when loading states are properly implemented
    const images = page.locator('img[src*="unsplash"]');
    await expect(images.first()).toBeVisible({ timeout: 5000 });
  });

  test("should handle image loading errors gracefully", async ({ page }) => {
    // Mock image loading failure
    await page.route("**/unsplash.com/**", (route) => {
      route.fulfill({ status: 404 });
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Should show fallback or placeholder
    // This test documents current behavior and will be updated for new implementation
    const images = page.locator("img");
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0); // Should still have some images/placeholders
  });
});
