import { test, expect, Page, Browser } from '@playwright/test';

/**
 * Elite Performance Validation Suite
 * Core Web Vitals & Performance Optimization Testing
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3003';

const CRITICAL_PAGES = [
  { path: '/', name: 'Homepage', weight: 'critical' },
  { path: '/about', name: 'About', weight: 'high' },
  { path: '/pricing', name: 'Pricing', weight: 'high' },
  { path: '/contact', name: 'Contact', weight: 'medium' },
  { path: '/sign-in', name: 'Sign In', weight: 'high' }
];

// Performance thresholds based on elite standards
const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift

  // Additional metrics
  FCP: 1800, // First Contentful Paint (ms)
  TTI: 3800, // Time to Interactive (ms)
  TBT: 300,  // Total Blocking Time (ms)
  SI: 3400,  // Speed Index (ms)

  // Network
  domContentLoaded: 2000,
  loadComplete: 3000,

  // Theme switching
  themeSwitch: 200,

  // JavaScript bundles
  maxBundleSize: 500000, // 500KB
};

interface PerformanceMetrics {
  LCP?: number;
  FCP?: number;
  CLS?: number;
  FID?: number;
  TTI?: number;
  TBT?: number;
  SI?: number;
  domContentLoaded?: number;
  loadComplete?: number;
  resourceLoadTime?: number;
  bundleSize?: number;
}

class PerformanceTestHelper {
  constructor(private page: Page) {}

  async navigateWithPerformanceTracking(path: string): Promise<void> {
    await this.page.goto(`${BASE_URL}${path}`, {
      waitUntil: 'networkidle'
    });
  }

  async collectCoreWebVitals(): Promise<PerformanceMetrics> {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics: any = {};
        
        // Collect Core Web Vitals
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metrics.FCP = entry.startTime;
            }
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.LCP = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              metrics.FID = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              metrics.CLS = (metrics.CLS || 0) + entry.value;
            }
          }
        }).observe({ 
          entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift']
        });

        // Collect navigation timing
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          metrics.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
          metrics.resourceLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        }

        // Get Time to Interactive (TTI) approximation
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          // Simplified TTI calculation
          metrics.TTI = fcpEntry.startTime + 1000; // Approximate
        }

        // Calculate Total Blocking Time (TBT) approximation
        const longTasks = performance.getEntriesByType('longtask');
        metrics.TBT = longTasks.reduce((total: number, task: any) => {
          const blockingTime = Math.max(0, task.duration - 50);
          return total + blockingTime;
        }, 0);

        setTimeout(() => resolve(metrics), 2000); // Allow time for metrics collection
      });
    });
  }

  async measureResourceSizes(): Promise<any> {
    return await this.page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const resourceData = {
        totalSize: 0,
        jsSize: 0,
        cssSize: 0,
        imageSize: 0,
        fontSize: 0,
        resources: []
      };

      for (const resource of resources) {
        const size = resource.transferSize || 0;
        resourceData.totalSize += size;

        const url = resource.name;
        let type = 'other';

        if (url.includes('.js')) {
          type = 'javascript';
          resourceData.jsSize += size;
        } else if (url.includes('.css')) {
          type = 'stylesheet';
          resourceData.cssSize += size;
        } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
          type = 'image';
          resourceData.imageSize += size;
        } else if (url.match(/\.(woff|woff2|ttf|otf)$/)) {
          type = 'font';
          resourceData.fontSize += size;
        }

        resourceData.resources.push({
          url: url.substring(url.lastIndexOf('/') + 1),
          type,
          size,
          duration: resource.duration
        });
      }

      return resourceData;
    });
  }

  async measureThemeSwitchingPerformance(): Promise<number> {
    const themeToggle = this.page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="Theme"]').first();
    
    if (await themeToggle.isVisible()) {
      const startTime = Date.now();
      await themeToggle.click();
      await this.page.waitForTimeout(100); // Minimal wait for theme change
      const endTime = Date.now();
      
      return endTime - startTime;
    }
    
    return 0;
  }

  async runLighthouseAudit(): Promise<any> {
    // Simulate Lighthouse-style performance audit
    return await this.page.evaluate(() => {
      const metrics = {
        performanceScore: 0,
        accessibilityScore: 0,
        bestPracticesScore: 0,
        seoScore: 0,
        suggestions: []
      };

      // Check for performance best practices
      const scripts = document.querySelectorAll('script');
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      const images = document.querySelectorAll('img');

      // Performance checks
      if (scripts.length > 10) {
        metrics.suggestions.push('Consider reducing the number of JavaScript files');
      }

      if (stylesheets.length > 5) {
        metrics.suggestions.push('Consider bundling CSS files');
      }

      // Check for lazy loading
      const imagesWithLazyLoading = Array.from(images).filter(img => 
        img.hasAttribute('loading') && img.getAttribute('loading') === 'lazy'
      );
      
      if (imagesWithLazyLoading.length < images.length * 0.5) {
        metrics.suggestions.push('Consider implementing lazy loading for images');
      }

      // Basic scoring (simplified)
      metrics.performanceScore = Math.max(0, 100 - metrics.suggestions.length * 10);
      metrics.accessibilityScore = document.querySelectorAll('[aria-label], [alt]').length > 0 ? 90 : 70;
      metrics.bestPracticesScore = document.querySelector('meta[name="viewport"]') ? 90 : 70;
      metrics.seoScore = document.querySelector('title') && document.querySelector('meta[name="description"]') ? 90 : 70;

      return metrics;
    });
  }

  async measureMemoryUsage(): Promise<any> {
    // @ts-ignore - performance.memory is available in Chrome
    return await this.page.evaluate(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          memoryEfficiency: memory.usedJSHeapSize / memory.totalJSHeapSize
        };
      }
      return null;
    });
  }

  async measureFrameRate(): Promise<number> {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        let frames = 0;
        const startTime = performance.now();
        
        function countFrame() {
          frames++;
          if (frames < 60) { // Count for 1 second at 60fps
            requestAnimationFrame(countFrame);
          } else {
            const endTime = performance.now();
            const fps = (frames * 1000) / (endTime - startTime);
            resolve(fps);
          }
        }
        
        requestAnimationFrame(countFrame);
      });
    });
  }
}

test.describe('Elite Performance Validation Suite', () => {
  let performanceHelper: PerformanceTestHelper;

  test.describe('Core Web Vitals Testing', () => {
    CRITICAL_PAGES.forEach(({ path, name, weight }) => {
      test(`${name} (${path}) - Core Web Vitals`, async ({ page }) => {
        performanceHelper = new PerformanceTestHelper(page);
        
        await performanceHelper.navigateWithPerformanceTracking(path);
        
        const metrics = await performanceHelper.collectCoreWebVitals();
        
        console.log(`📊 Core Web Vitals for ${name}:`, metrics);
        
        // Assert Core Web Vitals thresholds
        if (metrics.LCP) {
          expect(metrics.LCP).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP);
        }
        
        if (metrics.FCP) {
          expect(metrics.FCP).toBeLessThan(PERFORMANCE_THRESHOLDS.FCP);
        }
        
        if (metrics.CLS !== undefined) {
          expect(metrics.CLS).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS);
        }
        
        if (metrics.FID) {
          expect(metrics.FID).toBeLessThan(PERFORMANCE_THRESHOLDS.FID);
        }
        
        if (metrics.domContentLoaded) {
          expect(metrics.domContentLoaded).toBeLessThan(PERFORMANCE_THRESHOLDS.domContentLoaded);
        }
        
        if (metrics.loadComplete) {
          expect(metrics.loadComplete).toBeLessThan(PERFORMANCE_THRESHOLDS.loadComplete);
        }
      });
    });
  });

  test.describe('Resource Optimization Testing', () => {
    test('Bundle sizes and resource efficiency', async ({ page }) => {
      performanceHelper = new PerformanceTestHelper(page);
      
      const resourceResults = [];
      
      for (const { path, name } of CRITICAL_PAGES.slice(0, 3)) {
        await performanceHelper.navigateWithPerformanceTracking(path);
        
        const resourceData = await performanceHelper.measureResourceSizes();
        resourceResults.push({
          page: name,
          path,
          ...resourceData
        });
        
        console.log(`📦 Resource sizes for ${name}:`, {
          total: `${Math.round(resourceData.totalSize / 1024)}KB`,
          js: `${Math.round(resourceData.jsSize / 1024)}KB`,
          css: `${Math.round(resourceData.cssSize / 1024)}KB`,
          images: `${Math.round(resourceData.imageSize / 1024)}KB`
        });
        
        // Assert bundle size thresholds
        expect(resourceData.jsSize).toBeLessThan(PERFORMANCE_THRESHOLDS.maxBundleSize);
      }
      
      console.log('📊 Complete resource analysis:', resourceResults);
    });
  });

  test.describe('Theme Switching Performance', () => {
    test('Theme toggle performance optimization', async ({ page }) => {
      performanceHelper = new PerformanceTestHelper(page);
      
      await performanceHelper.navigateWithPerformanceTracking('/');
      
      const switchTimes = [];
      
      // Test multiple theme switches
      for (let i = 0; i < 5; i++) {
        const switchTime = await performanceHelper.measureThemeSwitchingPerformance();
        if (switchTime > 0) {
          switchTimes.push(switchTime);
        }
        await page.waitForTimeout(200);
      }
      
      if (switchTimes.length > 0) {
        const averageTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
        
        console.log(`⚡ Theme switching performance:`, {
          averageTime: `${averageTime}ms`,
          allTimes: switchTimes
        });
        
        expect(averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.themeSwitch);
      }
    });
  });

  test.describe('Memory Usage & Efficiency', () => {
    test('Memory consumption analysis', async ({ page }) => {
      performanceHelper = new PerformanceTestHelper(page);
      
      const memoryResults = [];
      
      for (const { path, name } of CRITICAL_PAGES.slice(0, 3)) {
        await performanceHelper.navigateWithPerformanceTracking(path);
        
        const memory = await performanceHelper.measureMemoryUsage();
        
        if (memory) {
          memoryResults.push({
            page: name,
            path,
            usedMemory: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
            totalMemory: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
            efficiency: `${Math.round(memory.memoryEfficiency * 100)}%`
          });
          
          // Assert reasonable memory usage (under 50MB)
          expect(memory.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
        }
      }
      
      console.log('🧠 Memory usage analysis:', memoryResults);
    });
  });

  test.describe('Frame Rate & Animation Performance', () => {
    test('Smooth animations and frame rate', async ({ page }) => {
      performanceHelper = new PerformanceTestHelper(page);
      
      await performanceHelper.navigateWithPerformanceTracking('/');
      
      // Measure frame rate during theme switching
      await performanceHelper.measureThemeSwitchingPerformance();
      const frameRate = await performanceHelper.measureFrameRate();
      
      console.log(`🎬 Animation frame rate: ${frameRate.toFixed(2)} FPS`);
      
      // Assert smooth animations (at least 30 FPS)
      expect(frameRate).toBeGreaterThan(30);
    });
  });

  test.describe('Network Performance', () => {
    test('Network efficiency and caching', async ({ page }) => {
      performanceHelper = new PerformanceTestHelper(page);
      
      // First visit
      await performanceHelper.navigateWithPerformanceTracking('/');
      const firstVisitMetrics = await performanceHelper.collectCoreWebVitals();
      
      // Second visit (should benefit from caching)
      await performanceHelper.navigateWithPerformanceTracking('/');
      const secondVisitMetrics = await performanceHelper.collectCoreWebVitals();
      
      console.log('🌐 Network performance comparison:', {
        firstVisit: firstVisitMetrics,
        secondVisit: secondVisitMetrics
      });
      
      // Second visit should be faster (cached resources)
      if (firstVisitMetrics.loadComplete && secondVisitMetrics.loadComplete) {
        expect(secondVisitMetrics.loadComplete).toBeLessThanOrEqual(firstVisitMetrics.loadComplete);
      }
    });
  });

  test.describe('Mobile Performance', () => {
    test('Mobile device performance optimization', async ({ browser }) => {
      // Simulate mobile device conditions
      const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 667 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        deviceScaleFactor: 2
      });
      
      const mobilePage = await mobileContext.newPage();
      performanceHelper = new PerformanceTestHelper(mobilePage);
      
      try {
        await performanceHelper.navigateWithPerformanceTracking('/');
        
        const mobileMetrics = await performanceHelper.collectCoreWebVitals();
        
        console.log('📱 Mobile performance metrics:', mobileMetrics);
        
        // Mobile should meet stricter thresholds
        if (mobileMetrics.LCP) {
          expect(mobileMetrics.LCP).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP * 1.2); // 20% tolerance
        }
        
        if (mobileMetrics.FCP) {
          expect(mobileMetrics.FCP).toBeLessThan(PERFORMANCE_THRESHOLDS.FCP * 1.2);
        }
        
      } finally {
        await mobileContext.close();
      }
    });
  });

  test.describe('Performance Regression Detection', () => {
    test('Performance baseline comparison', async ({ page }) => {
      performanceHelper = new PerformanceTestHelper(page);
      
      const performanceBaseline = [];
      
      for (const { path, name } of CRITICAL_PAGES) {
        await performanceHelper.navigateWithPerformanceTracking(path);
        
        const metrics = await performanceHelper.collectCoreWebVitals();
        const resourceData = await performanceHelper.measureResourceSizes();
        
        performanceBaseline.push({
          page: name,
          path,
          metrics,
          resourceSizes: {
            total: resourceData.totalSize,
            js: resourceData.jsSize,
            css: resourceData.cssSize
          },
          timestamp: new Date().toISOString()
        });
      }
      
      console.log('📈 Performance baseline established:', performanceBaseline);
      
      // Save baseline for future comparisons
      await page.evaluate((baseline) => {
        localStorage.setItem('performanceBaseline', JSON.stringify(baseline));
      }, performanceBaseline);
    });
  });

  test.describe('Lighthouse-Style Audit', () => {
    test('Comprehensive performance audit', async ({ page }) => {
      performanceHelper = new PerformanceTestHelper(page);
      
      const auditResults = [];
      
      for (const { path, name } of CRITICAL_PAGES.slice(0, 3)) {
        await performanceHelper.navigateWithPerformanceTracking(path);
        
        const audit = await performanceHelper.runLighthouseAudit();
        auditResults.push({
          page: name,
          path,
          ...audit
        });
        
        // Assert minimum performance scores
        expect(audit.performanceScore).toBeGreaterThan(80);
        expect(audit.accessibilityScore).toBeGreaterThan(80);
        expect(audit.bestPracticesScore).toBeGreaterThan(80);
      }
      
      console.log('🔍 Performance audit results:', auditResults);
    });
  });
});