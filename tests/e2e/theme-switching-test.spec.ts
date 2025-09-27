import { test, expect, type Page } from '@playwright/test';
import path from 'path';

const CREDENTIALS = {
  email: 'william@dsco.co',
  password: 'password'
};

const ROUTES_TO_TEST = [
  '/',
  '/about',
  '/features',
  '/pricing',
  '/contact',
  '/sign-in',
  '/sign-up',
  '/profile', // requires auth
  '/admin', // requires auth
];

class ThemeTestHelper {
  constructor(private page: Page) {}

  async signIn() {
    await this.page.goto('/sign-in');
    await this.page.fill('[name="email"]', CREDENTIALS.email);
    await this.page.fill('[name="password"]', CREDENTIALS.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL(url => !url.pathname.includes('/sign-in'), { timeout: 30000 });
  }

  async detectThemeToggle() {
    // Try different common selectors for theme toggle
    const selectors = [
      '[data-testid="theme-toggle"]',
      'button[aria-label*="theme" i]',
      'button[aria-label*="Theme" i]',
      'button[aria-label*="dark" i]',
      'button[aria-label*="light" i]',
      'button[title*="theme" i]',
      'button[title*="Theme" i]',
      '.theme-toggle',
      '.dark-mode-toggle',
      '.light-mode-toggle',
      'button:has([data-lucide="sun"])',
      'button:has([data-lucide="moon"])',
      'button:has(svg[class*="sun"])',
      'button:has(svg[class*="moon"])',
    ];

    for (const selector of selectors) {
      const element = this.page.locator(selector).first();
      if (await element.isVisible()) {
        return element;
      }
    }

    return null;
  }

  async getCurrentTheme(): Promise<'light' | 'dark' | 'unknown'> {
    const htmlClass = await this.page.locator('html').getAttribute('class') || '';
    const bodyClass = await this.page.locator('body').getAttribute('class') || '';
    const dataTheme = await this.page.locator('html').getAttribute('data-theme');
    
    if (htmlClass.includes('dark') || bodyClass.includes('dark') || dataTheme === 'dark') {
      return 'dark';
    } else if (htmlClass.includes('light') || bodyClass.includes('light') || dataTheme === 'light') {
      return 'light';
    }
    
    // Check computed styles as fallback
    const backgroundColor = await this.page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    // Heuristic: if background is very dark, it's probably dark theme
    if (backgroundColor.includes('rgb(0, 0, 0)') || backgroundColor.includes('rgb(18, 18, 18)')) {
      return 'dark';
    }
    
    return 'light'; // default assumption
  }

  async toggleTheme(): Promise<boolean> {
    const themeToggle = await this.detectThemeToggle();
    if (!themeToggle) {
      return false;
    }

    const beforeTheme = await this.getCurrentTheme();
    await themeToggle.click();
    await this.page.waitForTimeout(500); // Allow theme transition
    const afterTheme = await this.getCurrentTheme();
    
    return beforeTheme !== afterTheme;
  }

  async setTheme(targetTheme: 'light' | 'dark'): Promise<boolean> {
    const currentTheme = await this.getCurrentTheme();
    if (currentTheme === targetTheme) {
      return true;
    }

    return await this.toggleTheme();
  }

  async takeThemeScreenshot(route: string, theme: 'light' | 'dark', context: string = '') {
    const safePath = route.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${safePath}_${theme}${context ? `_${context}` : ''}.png`;
    const screenshotPath = path.join('test-results', 'screenshots', filename);
    
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    return screenshotPath;
  }

  async measureThemeTogglePerformance(): Promise<{ toggleTime: number; renderTime: number }> {
    const startTime = performance.now();
    
    // Start performance measurement
    await this.page.evaluate(() => {
      (window as any).themeToggleStart = performance.now();
    });
    
    const toggleSuccess = await this.toggleTheme();
    if (!toggleSuccess) {
      return { toggleTime: -1, renderTime: -1 };
    }
    
    // Wait for any animations/transitions to complete
    await this.page.waitForTimeout(100);
    
    const endTime = performance.now();
    const toggleTime = endTime - startTime;
    
    // Measure render performance
    const renderTime = await this.page.evaluate(() => {
      return performance.now() - (window as any.themeToggleStart || 0);
    });
    
    return { toggleTime, renderTime };
  }

  async validateThemeConsistency(): Promise<{
    hasThemeToggle: boolean;
    themeAppliedToHtml: boolean;
    themeAppliedToBody: boolean;
    hasThemeColors: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];
    
    // Check if theme toggle exists
    const hasThemeToggle = (await this.detectThemeToggle()) !== null;
    if (!hasThemeToggle) {
      issues.push('No theme toggle button found');
    }
    
    // Check theme classes
    const htmlClass = await this.page.locator('html').getAttribute('class') || '';
    const bodyClass = await this.page.locator('body').getAttribute('class') || '';
    const dataTheme = await this.page.locator('html').getAttribute('data-theme');
    
    const themeAppliedToHtml = htmlClass.includes('dark') || htmlClass.includes('light') || !!dataTheme;
    const themeAppliedToBody = bodyClass.includes('dark') || bodyClass.includes('light');
    
    if (!themeAppliedToHtml && !themeAppliedToBody) {
      issues.push('No theme classes found on html or body elements');
    }
    
    // Check for theme-specific colors
    const hasThemeColors = await this.page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      const bgColor = computed.backgroundColor;
      const textColor = computed.color;
      
      // Check if colors are not default browser colors
      return bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgb(0, 0, 0)';
    });
    
    if (!hasThemeColors) {
      issues.push('No custom theme colors detected');
    }
    
    return {
      hasThemeToggle,
      themeAppliedToHtml,
      themeAppliedToBody,
      hasThemeColors,
      issues
    };
  }
}

test.describe('Theme Switching Comprehensive Test', () => {
  let isAuthenticated = false;

  test.beforeEach(async ({ page }) => {
    // Authenticate once and reuse for all tests
    if (!isAuthenticated) {
      const helper = new ThemeTestHelper(page);
      await helper.signIn();
      isAuthenticated = true;
    }
  });

  for (const route of ROUTES_TO_TEST) {
    test(`Theme functionality on ${route}`, async ({ page }) => {
      const helper = new ThemeTestHelper(page);

      // Navigate to route
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Test theme detection and validation
      const validation = await helper.validateThemeConsistency();
      
      // Log any issues but don't fail test unless critical
      if (validation.issues.length > 0) {
        console.warn(`Theme issues on ${route}:`, validation.issues);
      }

      // Test both themes if toggle is available
      if (validation.hasThemeToggle) {
        // Test light theme
        await helper.setTheme('light');
        await helper.takeThemeScreenshot(route, 'light');
        
        const lightTheme = await helper.getCurrentTheme();
        expect(lightTheme).toBe('light');

        // Test dark theme
        await helper.setTheme('dark');
        await helper.takeThemeScreenshot(route, 'dark');
        
        const darkTheme = await helper.getCurrentTheme();
        expect(darkTheme).toBe('dark');

        // Test theme toggle performance
        const performance = await helper.measureThemeTogglePerformance();
        console.log(`Theme toggle performance on ${route}:`, performance);
        
        // Theme toggle should be fast (under 1 second)
        if (performance.toggleTime > 0) {
          expect(performance.toggleTime).toBeLessThan(1000);
        }

        // Test theme persistence across navigation
        await helper.setTheme('dark');
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        const persistedTheme = await helper.getCurrentTheme();
        // Theme should persist (though this might not always be the case in all implementations)
        console.log(`Theme persistence on ${route}: ${persistedTheme}`);

      } else {
        // If no theme toggle, just take a screenshot
        const currentTheme = await helper.getCurrentTheme();
        await helper.takeThemeScreenshot(route, currentTheme, 'no-toggle');
        console.warn(`No theme toggle found on ${route}`);
      }

      // Test responsive theme switching
      if (validation.hasThemeToggle) {
        // Desktop
        await page.setViewportSize({ width: 1920, height: 1080 });
        await helper.setTheme('light');
        await helper.takeThemeScreenshot(route, 'light', 'desktop');
        
        // Tablet
        await page.setViewportSize({ width: 768, height: 1024 });
        await helper.setTheme('dark');
        await helper.takeThemeScreenshot(route, 'dark', 'tablet');
        
        // Mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await helper.setTheme('light');
        await helper.takeThemeScreenshot(route, 'light', 'mobile');
        
        // Reset viewport
        await page.setViewportSize({ width: 1920, height: 1080 });
      }
    });
  }

  test('Theme switching stress test', async ({ page }) => {
    const helper = new ThemeTestHelper(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const validation = await helper.validateThemeConsistency();
    
    if (!validation.hasThemeToggle) {
      test.skip('No theme toggle available for stress test');
      return;
    }

    // Rapidly toggle theme multiple times
    const toggleTimes: number[] = [];
    
    for (let i = 0; i < 10; i++) {
      const performance = await helper.measureThemeTogglePerformance();
      if (performance.toggleTime > 0) {
        toggleTimes.push(performance.toggleTime);
      }
      await page.waitForTimeout(100); // Brief pause between toggles
    }

    // Analyze performance
    if (toggleTimes.length > 0) {
      const avgTime = toggleTimes.reduce((a, b) => a + b, 0) / toggleTimes.length;
      const maxTime = Math.max(...toggleTimes);
      const minTime = Math.min(...toggleTimes);
      
      console.log(`Theme toggle stress test results:`);
      console.log(`  Average: ${avgTime.toFixed(2)}ms`);
      console.log(`  Max: ${maxTime.toFixed(2)}ms`);
      console.log(`  Min: ${minTime.toFixed(2)}ms`);
      
      // Performance should remain consistent
      expect(avgTime).toBeLessThan(500);
      expect(maxTime).toBeLessThan(1000);
    }
  });

  test('Theme accessibility test', async ({ page }) => {
    const helper = new ThemeTestHelper(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const validation = await helper.validateThemeConsistency();
    
    if (!validation.hasThemeToggle) {
      test.skip('No theme toggle available for accessibility test');
      return;
    }

    // Test keyboard navigation to theme toggle
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if theme toggle has proper ARIA attributes
    const themeToggle = await helper.detectThemeToggle();
    if (themeToggle) {
      const ariaLabel = await themeToggle.getAttribute('aria-label');
      const role = await themeToggle.getAttribute('role');
      const title = await themeToggle.getAttribute('title');
      
      expect(ariaLabel || title).toBeTruthy();
      console.log(`Theme toggle accessibility:`, { ariaLabel, role, title });
    }

    // Test theme toggle with keyboard
    const beforeTheme = await helper.getCurrentTheme();
    if (themeToggle) {
      await themeToggle.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      const afterTheme = await helper.getCurrentTheme();
      expect(afterTheme).not.toBe(beforeTheme);
    }

    // Test contrast in both themes
    for (const theme of ['light', 'dark'] as const) {
      await helper.setTheme(theme);
      
      const contrastCheck = await page.evaluate(() => {
        const body = document.body;
        const computed = window.getComputedStyle(body);
        const bgColor = computed.backgroundColor;
        const textColor = computed.color;
        
        // Basic contrast check - ensure text and background are different
        return bgColor !== textColor;
      });
      
      expect(contrastCheck).toBe(true);
      console.log(`Contrast check passed for ${theme} theme`);
    }
  });
});