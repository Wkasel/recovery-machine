import { test, expect } from '@playwright/test';

test.describe('Core Web Vitals Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cache and start fresh
    await page.goto('about:blank');
    await page.evaluate(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => registration.unregister());
        });
      }
    });
  });

  test('should meet Core Web Vitals thresholds on homepage', async ({ page }) => {
    // Navigate to homepage and wait for load
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const navigationTime = Date.now() - startTime;
    
    // Measure First Contentful Paint (FCP)
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            resolve(fcpEntry.startTime);
          }
        }).observe({ entryTypes: ['paint'] });
      });
    });
    
    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcpEntry = entries[entries.length - 1];
          resolve(lcpEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    // Measure Cumulative Layout Shift (CLS)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Resolve after 5 seconds if no layout shifts
        setTimeout(() => resolve(clsValue), 5000);
      });
    });
    
    // Assertions based on Core Web Vitals thresholds
    console.log(`Performance Metrics:
      - Navigation Time: ${navigationTime}ms
      - First Contentful Paint: ${fcp}ms
      - Largest Contentful Paint: ${lcp}ms
      - Cumulative Layout Shift: ${cls}`);
    
    // Core Web Vitals thresholds (Good rating)
    expect(fcp).toBeLessThan(1800); // FCP < 1.8s
    expect(lcp).toBeLessThan(2500); // LCP < 2.5s
    expect(cls).toBeLessThan(0.1);  // CLS < 0.1
    expect(navigationTime).toBeLessThan(3000); // Total navigation < 3s
  });

  test('should have fast Time to Interactive (TTI)', async ({ page }) => {
    const startTime = performance.now();
    await page.goto('/');
    
    // Wait for page to be interactive
    await page.waitForLoadState('networkidle');
    
    // Measure TTI by checking when main thread is stable
    const tti = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          // Simplified TTI calculation
          const interactiveTime = entries.reduce((latest, entry) => {
            return Math.max(latest, entry.startTime + entry.duration);
          }, 0);
          resolve(interactiveTime);
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation'] });
        
        // Fallback timeout
        setTimeout(() => resolve(Date.now() - startTime), 5000);
      });
    });
    
    console.log(`Time to Interactive: ${tti}ms`);
    expect(tti).toBeLessThan(3800); // TTI < 3.8s for good rating
  });

  test('should have minimal Total Blocking Time (TBT)', async ({ page }) => {
    await page.goto('/');
    
    // Measure long tasks that block the main thread
    const tbt = await page.evaluate(() => {
      return new Promise((resolve) => {
        let totalBlockingTime = 0;
        
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            // Tasks longer than 50ms contribute to TBT
            if (entry.duration > 50) {
              totalBlockingTime += entry.duration - 50;
            }
          });
          resolve(totalBlockingTime);
        }).observe({ entryTypes: ['longtask'] });
        
        // Resolve after measuring for 5 seconds
        setTimeout(() => resolve(totalBlockingTime), 5000);
      });
    });
    
    console.log(`Total Blocking Time: ${tbt}ms`);
    expect(tbt).toBeLessThan(200); // TBT < 200ms for good rating
  });

  test('should load critical resources quickly', async ({ page }) => {
    await page.goto('/');
    
    // Check resource loading performance
    const resourceTimings = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        transferSize: resource.transferSize,
        type: resource.initiatorType
      }));
    });
    
    // Critical resources should load quickly
    const criticalResources = resourceTimings.filter(resource => 
      resource.type === 'script' || 
      resource.type === 'css' ||
      resource.name.includes('font')
    );
    
    criticalResources.forEach(resource => {
      console.log(`${resource.name}: ${resource.duration}ms (${resource.transferSize} bytes)`);
      expect(resource.duration).toBeLessThan(1000); // Critical resources < 1s
    });
  });

  test('should be responsive on mobile devices', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    
    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for first meaningful paint
    await page.waitForSelector('h1');
    const loadTime = Date.now() - startTime;
    
    // Mobile should be responsive despite potentially slower networks
    expect(loadTime).toBeLessThan(5000); // Mobile load time < 5s
    
    // Check that viewport is properly set
    const viewport = await page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    }));
    
    expect(viewport.width).toBeGreaterThan(0);
    expect(viewport.height).toBeGreaterThan(0);
  });

  test('should handle slow 3G network conditions', async ({ page }) => {
    // Simulate slow 3G
    await page.route('**/*', async route => {
      // Add network delay simulation
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForSelector('h1');
    const loadTime = Date.now() - startTime;
    
    // Should still be usable on slow networks
    expect(loadTime).toBeLessThan(10000); // Under 10s on slow 3G
    
    // Critical content should be visible
    await expect(page.getByRole('heading', { name: /recovery when you need it/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /book now/i })).toBeVisible();
  });

  test('should efficiently use browser cache', async ({ page }) => {
    // First visit
    await page.goto('/');
    const firstLoadResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').length;
    });
    
    // Second visit (should use cache)
    await page.reload();
    const secondLoadResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').filter(
        resource => resource.transferSize === 0 // Cached resources
      ).length;
    });
    
    // Should have cached resources on second load
    expect(secondLoadResources).toBeGreaterThan(0);
    console.log(`Cached resources: ${secondLoadResources}/${firstLoadResources}`);
  });

  test.describe('Bundle Size Performance', () => {
    test('should have reasonable JavaScript bundle size', async ({ page }) => {
      await page.goto('/');
      
      const bundleInfo = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        return Promise.all(
          scripts.map(async (script) => {
            const response = await fetch(script.src);
            const size = parseInt(response.headers.get('content-length') || '0');
            return {
              url: script.src,
              size: size
            };
          })
        );
      });
      
      const totalBundleSize = bundleInfo.reduce((total, bundle) => total + bundle.size, 0);
      const totalSizeKB = totalBundleSize / 1024;
      
      console.log(`Total JavaScript bundle size: ${totalSizeKB.toFixed(2)} KB`);
      
      // JavaScript bundles should be reasonable size
      expect(totalSizeKB).toBeLessThan(500); // < 500KB total JS
      
      // Individual bundles shouldn't be too large
      bundleInfo.forEach(bundle => {
        const sizeKB = bundle.size / 1024;
        expect(sizeKB).toBeLessThan(200); // Individual bundles < 200KB
      });
    });

    test('should load above-the-fold content quickly', async ({ page }) => {
      await page.goto('/');
      
      // Measure when above-the-fold content is visible
      const aboveFoldTime = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new MutationObserver(() => {
            const heading = document.querySelector('h1');
            const button = document.querySelector('button');
            
            if (heading && button) {
              observer.disconnect();
              resolve(performance.now());
            }
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        });
      });
      
      expect(aboveFoldTime).toBeLessThan(1500); // Above fold content < 1.5s
    });
  });
});