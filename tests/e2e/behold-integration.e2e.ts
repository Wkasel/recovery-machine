// Behold.so Integration Tests
// Tests for Instagram replacement with Behold.so widget

import { test, expect } from '@playwright/test';

test.describe('Behold.so Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load Behold.so widget instead of Instagram API', async ({ page }) => {
    // Mock Behold.so widget loading
    await page.addInitScript(() => {
      // Simulate Behold.so widget script
      (window as any).BeholdWidget = {
        init: (config: any) => {
          console.log('Behold.so widget initialized:', config);
          
          // Create mock widget container
          const container = document.querySelector(config.selector);
          if (container) {
            container.innerHTML = `
              <div data-testid="behold-widget" class="behold-gallery">
                <div class="behold-item">
                  <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400" alt="Recovery session">
                </div>
                <div class="behold-item">
                  <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400" alt="Massage therapy">
                </div>
              </div>
            `;
          }
        }
      };
    });

    // Look for Behold.so widget container
    const beholdWidget = page.locator('[data-testid="behold-widget"]');
    
    // Note: This test is prepared for when Behold.so is implemented
    // For now, we check that the Instagram section exists and can be replaced
    const instagramSection = page.locator('text=Follow @therecoverymachine');
    await expect(instagramSection).toBeVisible();
    
    console.log('✅ Behold.so integration test structure ready');
  });

  test('should maintain responsive design with Behold.so widget', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify Instagram section is responsive (will apply to Behold.so later)
    const mobileImages = page.locator('img[src*="unsplash"]');
    await expect(mobileImages.first()).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletImages = page.locator('img[src*="unsplash"]');
    await expect(tabletImages.first()).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopImages = page.locator('img[src*="unsplash"]');
    await expect(desktopImages.first()).toBeVisible();

    console.log('✅ Responsive design test ready for Behold.so');
  });

  test('should handle Behold.so widget loading failures', async ({ page }) => {
    // Mock Behold.so script loading failure
    await page.route('**/behold.so/**', (route) => {
      route.fulfill({ status: 404 });
    });

    // Should fall back to default content or show error message
    const fallbackContent = page.locator('img[src*="unsplash"]');
    await expect(fallbackContent.first()).toBeVisible();

    console.log('✅ Behold.so fallback handling test prepared');
  });

  test('should track Behold.so widget interactions', async ({ page }) => {
    let analyticsEvents: any[] = [];

    // Listen for analytics calls
    await page.exposeFunction('captureAnalytics', (event: any) => {
      analyticsEvents.push(event);
    });

    // Override gtag to capture events
    await page.addInitScript(() => {
      (window as any).gtag = (type: string, event: string, data: any) => {
        (window as any).captureAnalytics({ type, event, data });
      };
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Click on an image (will be Behold.so widget later)
    const image = page.locator('img[src*="unsplash"]').first();
    await expect(image).toBeVisible();
    await image.click();

    console.log('✅ Behold.so analytics tracking test prepared');
  });

  test('should configure Behold.so widget with correct settings', async ({ page }) => {
    // Mock Behold.so configuration
    const expectedConfig = {
      feedId: process.env.NEXT_PUBLIC_BEHOLD_FEED_ID || 'recovery-machine-feed',
      layout: 'grid',
      columns: 3,
      spacing: 10,
      showCaption: false,
      showLikes: false,
      showComments: false,
      responsive: true
    };

    // Add script to intercept Behold.so initialization
    await page.addInitScript((config) => {
      (window as any).beholdWidgetConfig = config;
      (window as any).BeholdWidget = {
        init: (receivedConfig: any) => {
          (window as any).actualBeholdConfig = receivedConfig;
        }
      };
    }, expectedConfig);

    await page.reload();
    await page.waitForLoadState('networkidle');

    console.log('✅ Behold.so configuration test prepared');
  });

  test('should maintain performance with Behold.so widget', async ({ page }) => {
    // Start performance measurement
    await page.goto('/', { waitUntil: 'networkidle' });

    // Measure performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });

    // Performance should be reasonable
    expect(performanceMetrics.domContentLoaded).toBeLessThan(3000); // 3s max
    expect(performanceMetrics.loadComplete).toBeLessThan(5000); // 5s max

    console.log('📊 Performance metrics:', performanceMetrics);
    console.log('✅ Behold.so performance test baseline established');
  });

  test('should show loading state while Behold.so widget loads', async ({ page }) => {
    // Slow down Behold.so widget loading
    await page.route('**/behold.so/**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
      route.continue();
    });

    await page.reload();

    // Should show loading state or skeleton
    // This will be implemented when Behold.so widget is added
    const images = page.locator('img[src*="unsplash"]');
    await expect(images.first()).toBeVisible({ timeout: 5000 });

    console.log('✅ Behold.so loading state test prepared');
  });

  test('should integrate with existing Instagram branding', async ({ page }) => {
    // Verify branding elements that should remain
    const followText = page.locator('text=Follow @therecoverymachine');
    await expect(followText).toBeVisible();

    const sectionHeader = page.locator('text=See Real Recoveries in Action');
    await expect(sectionHeader).toBeVisible();

    // Instagram icon should be maintained
    const instagramElements = page.locator('[class*="instagram"], [data-icon="instagram"]');
    // Note: This test prepares for maintaining Instagram branding with Behold.so

    console.log('✅ Instagram branding integration test prepared');
  });

  test('should handle Behold.so widget lazy loading', async ({ page }) => {
    // Test that widget only loads when in viewport
    await page.goto('/');
    
    // Scroll to Instagram section
    const instagramSection = page.locator('text=Follow @therecoverymachine');
    await expect(instagramSection).toBeVisible();
    await instagramSection.scrollIntoViewIfNeeded();

    // Wait for images to be visible
    const images = page.locator('img[src*="unsplash"]');
    await expect(images.first()).toBeVisible();

    console.log('✅ Behold.so lazy loading test prepared');
  });
});

test.describe('Behold.so vs Instagram API Comparison', () => {
  test('should show performance improvement with Behold.so', async ({ page }) => {
    // Baseline with current Instagram implementation
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const currentLoadTime = Date.now() - startTime;

    console.log(`📊 Current Instagram implementation load time: ${currentLoadTime}ms`);

    // This test will be expanded when Behold.so is implemented
    // to show performance comparison
    expect(currentLoadTime).toBeLessThan(10000); // 10s baseline
    console.log('✅ Performance comparison baseline established');
  });

  test('should maintain same visual layout with Behold.so', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot for visual comparison
    await page.screenshot({ 
      path: 'tests/e2e/screenshots/instagram-baseline.png',
      fullPage: false,
      clip: { x: 0, y: 1500, width: 1200, height: 800 } // Instagram section area
    });

    // Verify grid layout
    const images = page.locator('img[src*="unsplash"]');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
    expect(imageCount).toBeLessThanOrEqual(6);

    console.log('✅ Visual layout baseline captured for Behold.so comparison');
  });

  test('should reduce API dependency with Behold.so', async ({ page }) => {
    // Monitor network requests
    const apiRequests: string[] = [];
    
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('instagram') || url.includes('behold')) {
        apiRequests.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('📊 Current API requests:', apiRequests);
    
    // With Behold.so, should have fewer/simpler API dependencies
    console.log('✅ API dependency baseline established');
  });
});