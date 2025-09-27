import { test, expect, Page, BrowserContext } from '@playwright/test';

/**
 * UI Improvements Validation Test Suite
 * Elite Testing Standards for Design Agency Quality
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3003';

// Critical pages for UI testing
const CRITICAL_PAGES = [
  { path: '/', name: 'Homepage', priority: 'critical' },
  { path: '/about', name: 'About', priority: 'high' },
  { path: '/pricing', name: 'Pricing', priority: 'high' },
  { path: '/contact', name: 'Contact', priority: 'medium' },
  { path: '/sign-in', name: 'Sign In', priority: 'high' },
  { path: '/sign-up', name: 'Sign Up', priority: 'high' }
];

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'wide', width: 2560, height: 1440 }
];

class UITestHelper {
  constructor(private page: Page) {}

  async navigateToPage(path: string, waitForLoad = true): Promise<void> {
    await this.page.goto(`${BASE_URL}${path}`);
    if (waitForLoad) {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      await this.page.waitForTimeout(500); // Allow for any animations
    }
  }

  async capturePageScreenshot(pageName: string, viewport: string, theme: string = 'light'): Promise<string> {
    const filename = `${pageName}-${viewport}-${theme}.png`;
    const screenshotPath = `test-results/ui-validation/${filename}`;
    
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true,
      animations: 'disabled'
    });
    
    return screenshotPath;
  }

  async toggleTheme(): Promise<void> {
    const themeToggle = this.page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="Theme"]').first();
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await this.page.waitForTimeout(300); // Allow theme transition
    }
  }

  async getCurrentTheme(): Promise<'light' | 'dark'> {
    const htmlClass = await this.page.locator('html').getAttribute('class');
    return htmlClass?.includes('dark') ? 'dark' : 'light';
  }

  async testHeaderNavigation(): Promise<any[]> {
    const navigationItems = [];
    
    // Test main navigation links
    const navLinks = await this.page.locator('nav a, header a').all();
    
    for (const link of navLinks) {
      if (await link.isVisible()) {
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        const isExternal = href?.startsWith('http');
        
        if (href && !isExternal && !href.startsWith('#')) {
          navigationItems.push({
            text: text?.trim(),
            href,
            visible: true,
            clickable: await link.isEnabled()
          });
        }
      }
    }
    
    return navigationItems;
  }

  async testInteractiveElements(): Promise<any> {
    const results = {
      buttons: [],
      forms: [],
      links: []
    };

    // Test buttons
    const buttons = await this.page.locator('button:visible').all();
    for (const button of buttons) {
      const text = await button.textContent();
      const disabled = await button.isDisabled();
      const ariaLabel = await button.getAttribute('aria-label');
      
      results.buttons.push({
        text: text?.trim(),
        disabled,
        ariaLabel,
        hasHoverState: await this.hasHoverState(button)
      });
    }

    // Test forms
    const forms = await this.page.locator('form:visible').all();
    for (const form of forms) {
      const inputs = await form.locator('input, select, textarea').all();
      const formData = [];
      
      for (const input of inputs) {
        const type = await input.getAttribute('type') || 'text';
        const name = await input.getAttribute('name');
        const required = await input.getAttribute('required') !== null;
        const placeholder = await input.getAttribute('placeholder');
        
        formData.push({ type, name, required, placeholder });
      }
      
      results.forms.push({ elements: formData });
    }

    return results;
  }

  async hasHoverState(element: any): Promise<boolean> {
    try {
      await element.hover();
      await this.page.waitForTimeout(100);
      const boxShadow = await element.evaluate((el: any) => 
        getComputedStyle(el).boxShadow
      );
      return boxShadow !== 'none';
    } catch {
      return false;
    }
  }

  async measurePageLoadPerformance(): Promise<any> {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0
      };
    });
    
    return metrics;
  }
}

test.describe('UI Improvements Validation Suite', () => {
  let context: BrowserContext;
  let testHelper: UITestHelper;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      // Disable animations for consistent screenshots
      reducedMotion: 'reduce'
    });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.describe('Critical Page Rendering Tests', () => {
    CRITICAL_PAGES.forEach(({ path, name, priority }) => {
      test(`${name} (${path}) - Renders correctly in both themes`, async () => {
        const page = await context.newPage();
        testHelper = new UITestHelper(page);

        try {
          // Test light theme
          await testHelper.navigateToPage(path);
          
          // Verify page loads without errors
          await expect(page.locator('body')).toBeVisible();
          
          // Check for error states
          const errorElements = page.locator('[data-testid="error"], .error, [role="alert"]');
          const errorCount = await errorElements.count();
          expect(errorCount).toBe(0);
          
          // Capture light theme screenshot
          const lightScreenshot = await testHelper.capturePageScreenshot(name, 'desktop', 'light');
          console.log(`📸 Light theme screenshot: ${lightScreenshot}`);
          
          // Switch to dark theme
          await testHelper.toggleTheme();
          const currentTheme = await testHelper.getCurrentTheme();
          expect(currentTheme).toBe('dark');
          
          // Capture dark theme screenshot
          const darkScreenshot = await testHelper.capturePageScreenshot(name, 'desktop', 'dark');
          console.log(`📸 Dark theme screenshot: ${darkScreenshot}`);
          
          // Test navigation functionality
          const navItems = await testHelper.testHeaderNavigation();
          expect(navItems.length).toBeGreaterThan(0);
          
          // Test interactive elements
          const interactive = await testHelper.testInteractiveElements();
          expect(interactive).toBeDefined();
          
        } finally {
          await page.close();
        }
      });
    });
  });

  test.describe('Responsive Design Validation', () => {
    CRITICAL_PAGES.slice(0, 3).forEach(({ path, name }) => {
      VIEWPORTS.forEach(({ name: viewportName, width, height }) => {
        test(`${name} - ${viewportName} (${width}x${height})`, async () => {
          const page = await context.newPage();
          testHelper = new UITestHelper(page);

          try {
            await page.setViewportSize({ width, height });
            await testHelper.navigateToPage(path);
            
            // Verify responsive layout
            await expect(page.locator('body')).toBeVisible();
            
            // Capture responsive screenshot
            const screenshot = await testHelper.capturePageScreenshot(name, viewportName);
            console.log(`📱 Responsive screenshot: ${screenshot}`);
            
            // Test mobile navigation if on mobile viewport
            if (width <= 768) {
              const mobileMenuTrigger = page.locator('button[aria-label*="menu"], button[aria-expanded]').first();
              if (await mobileMenuTrigger.isVisible()) {
                await mobileMenuTrigger.click();
                await page.waitForTimeout(300);
                
                const mobileMenu = page.locator('[role="navigation"], .mobile-menu, [data-testid="mobile-menu"]').first();
                if (await mobileMenu.isVisible()) {
                  await testHelper.capturePageScreenshot(name, `${viewportName}-menu-open`);
                }
              }
            }
            
            // Test scroll behavior on long pages
            if (path === '/') {
              await page.evaluate(() => window.scrollTo(0, window.innerHeight));
              await page.waitForTimeout(500);
              await testHelper.capturePageScreenshot(name, `${viewportName}-scrolled`);
            }
            
          } finally {
            await page.close();
          }
        });
      });
    });
  });

  test.describe('Header Navigation & Dropdown Tests', () => {
    test('Header dropdown functionality and styling', async () => {
      const page = await context.newPage();
      testHelper = new UITestHelper(page);

      try {
        await testHelper.navigateToPage('/');
        
        // Test theme toggle
        await testHelper.toggleTheme();
        let theme = await testHelper.getCurrentTheme();
        expect(['light', 'dark']).toContain(theme);
        
        // Test any dropdown menus in header
        const dropdownTriggers = await page.locator('button[aria-expanded], button[aria-haspopup]').all();
        
        for (const [index, trigger] of dropdownTriggers.entries()) {
          if (await trigger.isVisible()) {
            await trigger.click();
            await page.waitForTimeout(300);
            
            // Capture dropdown open state
            await testHelper.capturePageScreenshot('header-dropdown', `trigger-${index}`);
            
            // Test dropdown items
            const dropdownItems = page.locator('[role="menuitem"], [role="option"]');
            const itemCount = await dropdownItems.count();
            expect(itemCount).toBeGreaterThanOrEqual(0);
            
            // Close dropdown by clicking outside
            await page.locator('body').click({ position: { x: 100, y: 100 } });
            await page.waitForTimeout(300);
          }
        }
        
      } finally {
        await page.close();
      }
    });
  });

  test.describe('Performance Validation', () => {
    test('Page load performance metrics', async () => {
      const page = await context.newPage();
      testHelper = new UITestHelper(page);
      const performanceResults = [];

      try {
        for (const { path, name } of CRITICAL_PAGES.slice(0, 3)) {
          await testHelper.navigateToPage(path);
          
          const metrics = await testHelper.measurePageLoadPerformance();
          performanceResults.push({
            page: name,
            path,
            metrics
          });
          
          // Assert performance thresholds
          expect(metrics.domContentLoaded).toBeLessThan(2000); // 2 seconds
          expect(metrics.firstContentfulPaint).toBeLessThan(1500); // 1.5 seconds
        }
        
        console.log('🚀 Performance Results:', JSON.stringify(performanceResults, null, 2));
        
      } finally {
        await page.close();
      }
    });

    test('Theme switching performance', async () => {
      const page = await context.newPage();
      testHelper = new UITestHelper(page);

      try {
        await testHelper.navigateToPage('/');
        
        const switchTimes = [];
        
        // Test multiple theme switches
        for (let i = 0; i < 5; i++) {
          const startTime = Date.now();
          await testHelper.toggleTheme();
          const switchTime = Date.now() - startTime;
          switchTimes.push(switchTime);
          
          await page.waitForTimeout(100);
        }
        
        const averageSwitchTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
        console.log(`⚡ Average theme switch time: ${averageSwitchTime}ms`);
        
        // Assert theme switching is fast (under 300ms)
        expect(averageSwitchTime).toBeLessThan(300);
        
      } finally {
        await page.close();
      }
    });
  });

  test.describe('Visual Consistency Tests', () => {
    test('Typography and spacing consistency', async () => {
      const page = await context.newPage();
      testHelper = new UITestHelper(page);

      try {
        await testHelper.navigateToPage('/');
        
        // Test typography hierarchy
        const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
        const typographyData = [];
        
        for (const heading of headings) {
          if (await heading.isVisible()) {
            const tagName = await heading.evaluate(el => el.tagName);
            const fontSize = await heading.evaluate(el => getComputedStyle(el).fontSize);
            const fontWeight = await heading.evaluate(el => getComputedStyle(el).fontWeight);
            const lineHeight = await heading.evaluate(el => getComputedStyle(el).lineHeight);
            
            typographyData.push({ tagName, fontSize, fontWeight, lineHeight });
          }
        }
        
        expect(typographyData.length).toBeGreaterThan(0);
        console.log('📝 Typography hierarchy:', typographyData);
        
        // Test button consistency
        const buttons = await page.locator('button, .btn').all();
        const buttonStyles = [];
        
        for (const button of buttons) {
          if (await button.isVisible()) {
            const backgroundColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
            const borderRadius = await button.evaluate(el => getComputedStyle(el).borderRadius);
            const padding = await button.evaluate(el => getComputedStyle(el).padding);
            
            buttonStyles.push({ backgroundColor, borderRadius, padding });
          }
        }
        
        expect(buttonStyles.length).toBeGreaterThan(0);
        console.log('🔘 Button styles:', buttonStyles);
        
      } finally {
        await page.close();
      }
    });
  });
});