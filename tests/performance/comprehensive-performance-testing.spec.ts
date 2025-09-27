/**
 * Comprehensive Performance Testing Suite
 * Tests Core Web Vitals, theme switching performance, and component rendering benchmarks
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Helper function to measure Web Vitals
 */
async function measureWebVitals(page: Page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals: any = {};
      
      // Measure FCP (First Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            vitals.FCP = entry.startTime;
          }
        }
      }).observe({ entryTypes: ['paint'] });
      
      // Measure LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.LCP = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Measure CLS (Cumulative Layout Shift)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        vitals.CLS = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
      
      // Measure FID (First Input Delay) - approximated
      let fidReported = false;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!fidReported) {
            vitals.FID = entry.processingStart - entry.startTime;
            fidReported = true;
          }
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
      
      // Return vitals after a delay to allow measurements
      setTimeout(() => {
        resolve(vitals);
      }, 3000);
    });
  });
}

/**
 * Helper function to measure theme switching performance
 */
async function measureThemeSwitch(page: Page) {
  return await page.evaluate(() => {
    const startTime = performance.now();
    
    // Toggle theme
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    
    // Force reflow to ensure style recalculation
    document.body.offsetHeight;
    
    const endTime = performance.now();
    return endTime - startTime;
  });
}

/**
 * Helper function to measure component rendering performance
 */
async function measureComponentRendering(page: Page, componentCount: number) {
  return await page.evaluate((count) => {
    const startTime = performance.now();
    
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4';
    
    for (let i = 0; i < count; i++) {
      const card = document.createElement('div');
      card.className = 'bg-card text-card-foreground rounded-lg border shadow-sm p-4';
      card.innerHTML = `
        <h3 class="text-lg font-semibold">Card ${i + 1}</h3>
        <p class="text-muted-foreground mt-2">This is test card number ${i + 1}</p>
        <button class="mt-4 px-3 py-1 bg-primary text-primary-foreground rounded text-sm">Action</button>
      `;
      container.appendChild(card);
    }
    
    document.body.appendChild(container);
    
    // Force layout recalculation
    container.offsetHeight;
    
    const endTime = performance.now();
    return endTime - startTime;
  }, componentCount);
}

test.describe('Core Web Vitals Performance', () => {
  
  test('Homepage Core Web Vitals - Desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Measure Core Web Vitals
    const vitals = await measureWebVitals(page);
    
    console.log('Desktop Core Web Vitals:', vitals);
    console.log('Page Load Time:', loadTime, 'ms');
    
    // Core Web Vitals thresholds for good performance
    if (vitals.FCP) expect(vitals.FCP).toBeLessThan(1800); // FCP < 1.8s
    if (vitals.LCP) expect(vitals.LCP).toBeLessThan(2500); // LCP < 2.5s
    if (vitals.CLS !== undefined) expect(vitals.CLS).toBeLessThan(0.1); // CLS < 0.1
    if (vitals.FID) expect(vitals.FID).toBeLessThan(100); // FID < 100ms
    
    // Page load time should be reasonable
    expect(loadTime).toBeLessThan(5000); // < 5 seconds
  });

  test('Homepage Core Web Vitals - Mobile', async ({ page }) => {
    // Simulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });
    await page.emulateNetworkConditions({
      downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
      uploadThroughput: 750 * 1024 / 8, // 750 Kbps
      latency: 150, // 150ms
    });
    
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    const vitals = await measureWebVitals(page);
    
    console.log('Mobile Core Web Vitals:', vitals);
    console.log('Mobile Page Load Time:', loadTime, 'ms');
    
    // More lenient thresholds for mobile
    if (vitals.FCP) expect(vitals.FCP).toBeLessThan(3000); // FCP < 3s
    if (vitals.LCP) expect(vitals.LCP).toBeLessThan(4000); // LCP < 4s
    if (vitals.CLS !== undefined) expect(vitals.CLS).toBeLessThan(0.1); // CLS < 0.1
    if (vitals.FID) expect(vitals.FID).toBeLessThan(300); // FID < 300ms
    
    expect(loadTime).toBeLessThan(10000); // < 10 seconds on slow mobile
  });

  test('Interactive elements performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Measure button click responsiveness
    const buttonResponseTimes: number[] = [];
    
    const buttons = await page.locator('button, [role="button"], a').all();
    const testButtons = buttons.slice(0, 5); // Test first 5 interactive elements
    
    for (const button of testButtons) {
      const isVisible = await button.isVisible();
      if (isVisible) {
        const startTime = performance.now();
        await button.click({ timeout: 1000 });
        const endTime = performance.now();
        buttonResponseTimes.push(endTime - startTime);
        
        // Wait between clicks
        await page.waitForTimeout(100);
      }
    }
    
    // All button interactions should be under 100ms
    buttonResponseTimes.forEach(time => {
      expect(time).toBeLessThan(100);
    });
    
    const averageResponseTime = buttonResponseTimes.reduce((a, b) => a + b, 0) / buttonResponseTimes.length;
    console.log('Average button response time:', averageResponseTime, 'ms');
    expect(averageResponseTime).toBeLessThan(50); // Average should be under 50ms
  });
});

test.describe('Theme Switching Performance', () => {
  
  test('Theme toggle performance benchmark', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
    
    // Measure multiple theme switches
    const switchTimes: number[] = [];
    
    for (let i = 0; i < 10; i++) {
      const switchTime = await measureThemeSwitch(page);
      switchTimes.push(switchTime);
      
      await themeToggle.click();
      await page.waitForTimeout(100); // Brief pause between switches
    }
    
    const averageSwitchTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
    const maxSwitchTime = Math.max(...switchTimes);
    
    console.log('Theme switch times:', switchTimes);
    console.log('Average theme switch time:', averageSwitchTime, 'ms');
    console.log('Maximum theme switch time:', maxSwitchTime, 'ms');
    
    // Performance assertions
    expect(averageSwitchTime).toBeLessThan(50); // Average < 50ms
    expect(maxSwitchTime).toBeLessThan(100); // No switch > 100ms
    
    // All switches should be under threshold
    switchTimes.forEach(time => {
      expect(time).toBeLessThan(100);
    });
  });

  test('Theme switching with complex content', async ({ page }) => {
    await page.goto('/');
    
    // Add complex content to test theme switching performance
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.className = 'performance-test-content';
      container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          ${Array.from({ length: 50 }, (_, i) => `
            <div class="bg-card text-card-foreground rounded-lg border shadow-sm p-4">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-primary rounded-full"></div>
                <div>
                  <h3 class="text-lg font-semibold">Card ${i + 1}</h3>
                  <p class="text-muted-foreground text-sm">Subtitle ${i + 1}</p>
                </div>
              </div>
              <p class="text-sm mb-4">This is test content for performance testing with multiple themed elements.</p>
              <div class="flex space-x-2">
                <button class="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">Primary</button>
                <button class="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm">Secondary</button>
                <button class="px-3 py-1 border border-input rounded text-sm">Outline</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      document.body.appendChild(container);
    });
    
    // Wait for content to render
    await page.waitForTimeout(500);
    
    // Measure theme switching with complex content
    const complexSwitchTime = await measureThemeSwitch(page);
    
    console.log('Theme switch time with complex content:', complexSwitchTime, 'ms');
    
    // Should still be performant with complex content
    expect(complexSwitchTime).toBeLessThan(200); // < 200ms with complex content
  });

  test('CSS custom properties performance', async ({ page }) => {
    await page.goto('/');
    
    // Measure CSS custom property updates
    const cssUpdateTime = await page.evaluate(() => {
      const startTime = performance.now();
      
      // Update multiple CSS custom properties
      const root = document.documentElement;
      root.style.setProperty('--primary', '200 100% 50%');
      root.style.setProperty('--secondary', '300 100% 50%');
      root.style.setProperty('--background', '0 0% 95%');
      root.style.setProperty('--foreground', '0 0% 10%');
      root.style.setProperty('--card', '0 0% 98%');
      root.style.setProperty('--border', '200 20% 80%');
      
      // Force style recalculation
      document.body.offsetHeight;
      
      const endTime = performance.now();
      return endTime - startTime;
    });
    
    console.log('CSS custom property update time:', cssUpdateTime, 'ms');
    expect(cssUpdateTime).toBeLessThan(50); // < 50ms for CSS updates
  });
});

test.describe('Component Rendering Performance', () => {
  
  test('Button component rendering performance', async ({ page }) => {
    await page.goto('/');
    
    const componentCounts = [10, 25, 50, 100];
    
    for (const count of componentCounts) {
      const renderTime = await page.evaluate((count) => {
        const startTime = performance.now();
        
        const container = document.createElement('div');
        container.className = 'performance-test-buttons flex flex-wrap gap-2 p-4';
        
        for (let i = 0; i < count; i++) {
          const button = document.createElement('button');
          button.className = 'px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:ring-2 focus:ring-primary transition-colors';
          button.textContent = `Button ${i + 1}`;
          container.appendChild(button);
        }
        
        document.body.appendChild(container);
        
        // Force layout
        container.offsetHeight;
        
        const endTime = performance.now();
        
        // Clean up
        container.remove();
        
        return endTime - startTime;
      }, count);
      
      console.log(`Rendering ${count} buttons took ${renderTime}ms`);
      
      // Performance expectations based on component count
      const expectedTime = count * 0.5; // 0.5ms per button
      expect(renderTime).toBeLessThan(Math.max(expectedTime, 100)); // At least 100ms buffer
    }
  });

  test('Card component rendering performance', async ({ page }) => {
    await page.goto('/');
    
    const cardCounts = [10, 25, 50];
    
    for (const count of cardCounts) {
      const renderTime = await measureComponentRendering(page, count);
      
      console.log(`Rendering ${count} cards took ${renderTime}ms`);
      
      // Cards are more complex, allow more time
      const expectedTime = count * 2; // 2ms per card
      expect(renderTime).toBeLessThan(Math.max(expectedTime, 200));
    }
  });

  test('Form component rendering performance', async ({ page }) => {
    await page.goto('/');
    
    const renderTime = await page.evaluate(() => {
      const startTime = performance.now();
      
      const container = document.createElement('div');
      container.className = 'performance-test-form space-y-6 p-8 max-w-md';
      
      for (let i = 0; i < 20; i++) {
        const formGroup = document.createElement('div');
        formGroup.className = 'space-y-2';
        formGroup.innerHTML = `
          <label class="text-sm font-medium" for="input-${i}">Field ${i + 1}</label>
          <input 
            id="input-${i}"
            type="text" 
            placeholder="Enter value ${i + 1}" 
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <p class="text-xs text-muted-foreground">Help text for field ${i + 1}</p>
        `;
        container.appendChild(formGroup);
      }
      
      document.body.appendChild(container);
      
      // Force layout
      container.offsetHeight;
      
      const endTime = performance.now();
      
      // Clean up
      container.remove();
      
      return endTime - startTime;
    });
    
    console.log(`Rendering complex form took ${renderTime}ms`);
    expect(renderTime).toBeLessThan(300); // < 300ms for 20 form fields
  });
});

test.describe('Memory Performance', () => {
  
  test('Theme switching memory usage', async ({ page }) => {
    await page.goto('/');
    
    // Measure memory usage during theme switching
    const memoryMetrics = await page.evaluate(async () => {
      // @ts-ignore - performance.memory is not in all browsers
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      const themeToggle = document.querySelector('[data-testid="theme-toggle"]') as HTMLElement;
      
      // Perform multiple theme switches
      for (let i = 0; i < 20; i++) {
        themeToggle?.click();
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Force garbage collection if available
      // @ts-ignore
      if (window.gc) window.gc();
      
      // @ts-ignore
      const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      return {
        initial: initialMemory,
        final: finalMemory,
        increase: finalMemory - initialMemory
      };
    });
    
    console.log('Memory metrics:', memoryMetrics);
    
    if (memoryMetrics.initial > 0) {
      // Memory increase should be minimal
      const memoryIncreasePercent = (memoryMetrics.increase / memoryMetrics.initial) * 100;
      expect(memoryIncreasePercent).toBeLessThan(50); // < 50% memory increase
    }
  });

  test('Component cleanup performance', async ({ page }) => {
    await page.goto('/');
    
    // Test creating and destroying many components
    const cleanupTime = await page.evaluate(() => {
      const containers: HTMLElement[] = [];
      
      // Create many components
      for (let i = 0; i < 100; i++) {
        const container = document.createElement('div');
        container.className = 'test-container';
        container.innerHTML = `
          <div class="bg-card p-4 rounded-lg border">
            <h3>Component ${i}</h3>
            <button class="px-4 py-2 bg-primary text-primary-foreground rounded">Button</button>
          </div>
        `;
        document.body.appendChild(container);
        containers.push(container);
      }
      
      // Measure cleanup time
      const startTime = performance.now();
      
      containers.forEach(container => {
        container.remove();
      });
      
      const endTime = performance.now();
      return endTime - startTime;
    });
    
    console.log(`Component cleanup took ${cleanupTime}ms`);
    expect(cleanupTime).toBeLessThan(100); // < 100ms to clean up 100 components
  });
});

test.describe('Network Performance', () => {
  
  test('Font loading performance', async ({ page }) => {
    await page.goto('/');
    
    // Measure font loading time
    const fontMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const startTime = performance.now();
        let fontsLoaded = 0;
        let totalFonts = 0;
        
        // Check if Font Loading API is available
        if ('fonts' in document) {
          document.fonts.ready.then(() => {
            const endTime = performance.now();
            resolve({
              loadTime: endTime - startTime,
              fontsLoaded: document.fonts.size
            });
          });
        } else {
          // Fallback for browsers without Font Loading API
          setTimeout(() => {
            resolve({
              loadTime: performance.now() - startTime,
              fontsLoaded: 'unknown'
            });
          }, 3000);
        }
      });
    });
    
    console.log('Font loading metrics:', fontMetrics);
    
    // Font loading should complete within reasonable time
    expect((fontMetrics as any).loadTime).toBeLessThan(5000); // < 5 seconds
  });

  test('Critical CSS performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    // Measure time to first meaningful paint
    const firstPaintTime = await page.evaluate(() => {
      const entries = performance.getEntriesByType('paint');
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
      return fcp?.startTime || 0;
    });
    
    const loadTime = Date.now() - startTime;
    
    console.log('First Contentful Paint:', firstPaintTime, 'ms');
    console.log('Total Load Time:', loadTime, 'ms');
    
    // Critical CSS should enable fast first paint
    expect(firstPaintTime).toBeLessThan(2000); // FCP < 2 seconds
    expect(loadTime).toBeLessThan(5000); // Total load < 5 seconds
  });
});

test.describe('Animation Performance', () => {
  
  test('CSS transition performance', async ({ page }) => {
    await page.goto('/');
    
    // Test button hover transitions
    const transitionTime = await page.evaluate(() => {
      const button = document.createElement('button');
      button.className = 'px-4 py-2 bg-primary text-primary-foreground rounded transition-all duration-200 hover:bg-primary/90';
      button.textContent = 'Test Button';
      document.body.appendChild(button);
      
      const startTime = performance.now();
      
      // Trigger hover state
      button.style.backgroundColor = 'hsl(var(--primary) / 0.9)';
      
      // Force style recalculation
      button.offsetHeight;
      
      const endTime = performance.now();
      
      button.remove();
      
      return endTime - startTime;
    });
    
    console.log('CSS transition time:', transitionTime, 'ms');
    expect(transitionTime).toBeLessThan(50); // Transition should be smooth
  });

  test('Theme transition smoothness', async ({ page }) => {
    await page.goto('/');
    
    // Enable smooth transitions
    await page.addStyleTag({
      content: `
        * {
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease !important;
        }
      `
    });
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    
    // Measure frame rate during theme transition
    const frameRateData = await page.evaluate(async () => {
      const frames: number[] = [];
      let lastTime = performance.now();
      
      const measureFrame = () => {
        const currentTime = performance.now();
        frames.push(currentTime - lastTime);
        lastTime = currentTime;
        
        if (frames.length < 30) { // Measure for ~30 frames
          requestAnimationFrame(measureFrame);
        }
      };
      
      // Start measuring
      requestAnimationFrame(measureFrame);
      
      // Trigger theme change
      const toggle = document.querySelector('[data-testid="theme-toggle"]') as HTMLElement;
      toggle?.click();
      
      // Wait for transition to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return frames;
    });
    
    const averageFrameTime = frameRateData.reduce((a, b) => a + b, 0) / frameRateData.length;
    const fps = 1000 / averageFrameTime;
    
    console.log('Theme transition FPS:', fps);
    console.log('Average frame time:', averageFrameTime, 'ms');
    
    // Should maintain reasonable frame rate during transition
    expect(fps).toBeGreaterThan(30); // > 30 FPS
    expect(averageFrameTime).toBeLessThan(33); // < 33ms per frame
  });
});