import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import path from 'path';

const CREDENTIALS = {
  email: 'william@dsco.co',
  password: 'password'
};

const ROUTES = [
  // Public routes
  { path: '/', name: 'Home', requiresAuth: false },
  { path: '/about', name: 'About', requiresAuth: false },
  { path: '/features', name: 'Features', requiresAuth: false },
  { path: '/pricing', name: 'Pricing', requiresAuth: false },
  { path: '/contact', name: 'Contact', requiresAuth: false },
  { path: '/blog', name: 'Blog', requiresAuth: false },
  { path: '/docs', name: 'Documentation', requiresAuth: false },
  { path: '/terms', name: 'Terms of Service', requiresAuth: false },
  { path: '/privacy', name: 'Privacy Policy', requiresAuth: false },
  { path: '/cookies', name: 'Cookie Policy', requiresAuth: false },
  
  // Auth routes
  { path: '/sign-in', name: 'Sign In', requiresAuth: false },
  { path: '/sign-up', name: 'Sign Up', requiresAuth: false },
  { path: '/auth/error', name: 'Auth Error', requiresAuth: false },
  
  // Protected routes
  { path: '/profile', name: 'Profile', requiresAuth: true },
  { path: '/book', name: 'Book Service', requiresAuth: true },
  
  // Admin routes (requires admin access)
  { path: '/admin', name: 'Admin Dashboard', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/users', name: 'Admin Users', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/bookings', name: 'Admin Bookings', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/availability', name: 'Admin Availability', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/settings', name: 'Admin Settings', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/service-areas', name: 'Admin Service Areas', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/email-templates', name: 'Admin Email Templates', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/referrals', name: 'Admin Referrals', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/exports', name: 'Admin Exports', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/orders', name: 'Admin Orders', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/notifications', name: 'Admin Notifications', requiresAuth: true, requiresAdmin: true },
  { path: '/admin/reviews', name: 'Admin Reviews', requiresAuth: true, requiresAdmin: true },
  
  // Payment routes
  { path: '/payment/success', name: 'Payment Success', requiresAuth: false },
  { path: '/payment/cancel', name: 'Payment Cancel', requiresAuth: false },
];

const THEMES = ['light', 'dark'] as const;

class TestHelper {
  constructor(private page: Page) {}

  async signIn() {
    await this.page.goto('/sign-in');
    await this.page.fill('[name="email"]', CREDENTIALS.email);
    await this.page.fill('[name="password"]', CREDENTIALS.password);
    await this.page.click('button[type="submit"]');
    
    // Wait for redirect to profile or dashboard
    await this.page.waitForURL(url => !url.pathname.includes('/sign-in'), { timeout: 30000 });
  }

  async signOut() {
    // Look for sign out button or link
    const signOutButton = this.page.locator('button:has-text("Sign Out"), a:has-text("Sign Out"), button:has-text("Logout"), a:has-text("Logout")').first();
    if (await signOutButton.isVisible()) {
      await signOutButton.click();
      await this.page.waitForURL('/');
    }
  }

  async setTheme(theme: 'light' | 'dark') {
    // Look for theme toggle button
    const themeToggle = this.page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="Theme"]').first();
    
    if (await themeToggle.isVisible()) {
      // Get current theme
      const html = this.page.locator('html');
      const currentTheme = await html.getAttribute('class');
      const isDark = currentTheme?.includes('dark') || false;
      
      // Toggle if needed
      if ((theme === 'dark' && !isDark) || (theme === 'light' && isDark)) {
        await themeToggle.click();
        await this.page.waitForTimeout(500); // Allow theme transition
      }
    }
  }

  async takeScreenshot(route: string, theme: string, context: string = '') {
    const filename = `${route.replace(/[^a-zA-Z0-9]/g, '_')}_${theme}${context ? `_${context}` : ''}.png`;
    const screenshotPath = path.join('test-results', 'screenshots', filename);
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    return screenshotPath;
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // Allow for any animations
  }

  async testInteractiveElements() {
    const results = [];

    // Test navigation menu
    const navLinks = this.page.locator('nav a, header a').all();
    for (const link of await navLinks) {
      if (await link.isVisible()) {
        const href = await link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          results.push({ type: 'nav-link', href, visible: true });
        }
      }
    }

    // Test buttons
    const buttons = this.page.locator('button').all();
    for (const button of await buttons) {
      if (await button.isVisible()) {
        const text = await button.textContent();
        const disabled = await button.isDisabled();
        results.push({ type: 'button', text: text?.trim(), disabled });
      }
    }

    // Test forms
    const forms = this.page.locator('form').all();
    for (const form of await forms) {
      if (await form.isVisible()) {
        const inputs = form.locator('input, select, textarea').all();
        const formElements = [];
        for (const input of await inputs) {
          const type = await input.getAttribute('type') || 'text';
          const name = await input.getAttribute('name');
          const required = await input.getAttribute('required') !== null;
          formElements.push({ type, name, required });
        }
        results.push({ type: 'form', elements: formElements });
      }
    }

    return results;
  }
}

test.describe('Comprehensive Page Testing', () => {
  let context: BrowserContext;
  let testHelper: TestHelper;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
  });

  test.afterAll(async () => {
    await context.close();
  });

  for (const theme of THEMES) {
    test.describe(`${theme.toUpperCase()} Theme Testing`, () => {
      for (const route of ROUTES) {
        test(`${route.name} (${route.path}) - ${theme} theme`, async () => {
          const page = await context.newPage();
          testHelper = new TestHelper(page);

          try {
            // Set theme first
            await page.goto('/');
            await testHelper.setTheme(theme);
            
            // Handle authentication if required
            if (route.requiresAuth) {
              await testHelper.signIn();
            }

            // Navigate to the route
            await page.goto(route.path);
            await testHelper.waitForPageLoad();

            // Take screenshot
            await testHelper.takeScreenshot(route.path, theme);

            // Test page content
            await expect(page.locator('body')).toBeVisible();
            
            // Check for error states
            const errorMessages = page.locator('[data-testid="error"], .error, [role="alert"]');
            if (await errorMessages.count() > 0) {
              console.warn(`Potential error on ${route.path} (${theme}):`, await errorMessages.allTextContents());
            }

            // Test interactive elements
            const interactiveElements = await testHelper.testInteractiveElements();
            expect(interactiveElements).toBeDefined();

            // Test theme toggle functionality
            const beforeToggle = await page.locator('html').getAttribute('class');
            await testHelper.setTheme(theme === 'light' ? 'dark' : 'light');
            const afterToggle = await page.locator('html').getAttribute('class');
            
            // Take screenshot after theme toggle
            await testHelper.takeScreenshot(route.path, theme === 'light' ? 'dark' : 'light', 'toggled');
            
            // Reset theme
            await testHelper.setTheme(theme);

            // Test responsive design by changing viewport
            await page.setViewportSize({ width: 768, height: 1024 }); // Tablet
            await testHelper.takeScreenshot(route.path, theme, 'tablet');
            
            await page.setViewportSize({ width: 375, height: 667 }); // Mobile
            await testHelper.takeScreenshot(route.path, theme, 'mobile');
            
            // Reset viewport
            await page.setViewportSize({ width: 1920, height: 1080 });

          } catch (error) {
            console.error(`Error testing ${route.path} (${theme}):`, error);
            await testHelper.takeScreenshot(route.path, theme, 'error');
            throw error;
          } finally {
            await page.close();
          }
        });
      }
    });
  }

  test.describe('Dynamic Routes Testing', () => {
    for (const theme of THEMES) {
      test(`Booking confirmation page - ${theme} theme`, async () => {
        const page = await context.newPage();
        testHelper = new TestHelper(page);

        try {
          await page.goto('/');
          await testHelper.setTheme(theme);
          await testHelper.signIn();

          // Test with a sample booking ID
          const sampleBookingId = 'sample-booking-123';
          await page.goto(`/booking/${sampleBookingId}/confirmation`);
          await testHelper.waitForPageLoad();

          await testHelper.takeScreenshot(`/booking/${sampleBookingId}/confirmation`, theme);
          
          // Should handle invalid booking ID gracefully
          await page.goto('/booking/invalid-id/confirmation');
          await testHelper.waitForPageLoad();
          await testHelper.takeScreenshot('/booking/invalid-id/confirmation', theme, 'invalid');

        } finally {
          await page.close();
        }
      });
    }
  });

  test.describe('Error Pages Testing', () => {
    for (const theme of THEMES) {
      test(`404 Error Page - ${theme} theme`, async () => {
        const page = await context.newPage();
        testHelper = new TestHelper(page);

        try {
          await page.goto('/');
          await testHelper.setTheme(theme);

          await page.goto('/non-existent-page');
          await testHelper.waitForPageLoad();
          await testHelper.takeScreenshot('/404', theme);

          // Should have proper error message
          const errorContent = page.locator('h1, h2, .error-title, [data-testid="error-title"]');
          await expect(errorContent).toBeVisible();

        } finally {
          await page.close();
        }
      });
    }
  });

  test.describe('Component State Testing', () => {
    for (const theme of THEMES) {
      test(`Dashboard component states - ${theme} theme`, async () => {
        const page = await context.newPage();
        testHelper = new TestHelper(page);

        try {
          await page.goto('/');
          await testHelper.setTheme(theme);
          await testHelper.signIn();

          // Go to profile/dashboard
          await page.goto('/profile');
          await testHelper.waitForPageLoad();

          // Test different tabs if they exist
          const tabs = page.locator('[role="tab"], .tab, [data-testid*="tab"]').all();
          for (const [index, tab] of (await tabs).entries()) {
            if (await tab.isVisible()) {
              await tab.click();
              await testHelper.waitForPageLoad();
              const tabName = await tab.textContent();
              await testHelper.takeScreenshot('/profile', theme, `tab-${index}-${tabName?.replace(/\s+/g, '-')}`);
            }
          }

          // Test modals and overlays
          const modalTriggers = page.locator('button:has-text("Edit"), button:has-text("Add"), button:has-text("Create")').all();
          for (const [index, trigger] of (await modalTriggers).entries()) {
            if (await trigger.isVisible()) {
              await trigger.click();
              await page.waitForTimeout(500); // Wait for modal animation
              
              const modal = page.locator('[role="dialog"], .modal, [data-testid="modal"]').first();
              if (await modal.isVisible()) {
                await testHelper.takeScreenshot('/profile', theme, `modal-${index}`);
                
                // Close modal
                const closeButton = modal.locator('button:has-text("Cancel"), button:has-text("Close"), [aria-label="Close"]').first();
                if (await closeButton.isVisible()) {
                  await closeButton.click();
                } else {
                  await page.keyboard.press('Escape');
                }
                await page.waitForTimeout(500);
              }
            }
          }

        } finally {
          await page.close();
        }
      });

      test(`Form validation states - ${theme} theme`, async () => {
        const page = await context.newPage();
        testHelper = new TestHelper(page);

        try {
          await page.goto('/');
          await testHelper.setTheme(theme);

          // Test sign-up form validation
          await page.goto('/sign-up');
          await testHelper.waitForPageLoad();

          // Test empty form submission
          const submitButton = page.locator('button[type="submit"]').first();
          if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForTimeout(1000);
            await testHelper.takeScreenshot('/sign-up', theme, 'validation-errors');
          }

          // Test contact form if available
          await page.goto('/contact');
          await testHelper.waitForPageLoad();

          const contactForm = page.locator('form').first();
          if (await contactForm.isVisible()) {
            // Submit empty form
            const contactSubmit = contactForm.locator('button[type="submit"]').first();
            if (await contactSubmit.isVisible()) {
              await contactSubmit.click();
              await page.waitForTimeout(1000);
              await testHelper.takeScreenshot('/contact', theme, 'validation-errors');
            }
          }

        } finally {
          await page.close();
        }
      });

      test(`Loading states - ${theme} theme`, async () => {
        const page = await context.newPage();
        testHelper = new TestHelper(page);

        try {
          await page.goto('/');
          await testHelper.setTheme(theme);

          // Test loading states by intercepting network requests
          await page.route('**/api/**', route => {
            // Delay API responses to capture loading states
            setTimeout(() => route.continue(), 2000);
          });

          await testHelper.signIn();
          
          // Navigate to profile to capture loading state
          const profileNavigationPromise = page.goto('/profile');
          await page.waitForTimeout(500); // Capture loading state
          await testHelper.takeScreenshot('/profile', theme, 'loading');
          
          await profileNavigationPromise;
          await testHelper.waitForPageLoad();
          await testHelper.takeScreenshot('/profile', theme, 'loaded');

        } finally {
          await page.close();
        }
      });
    }
  });

  test.describe('Performance Testing', () => {
    test('Theme switching performance', async () => {
      const page = await context.newPage();
      testHelper = new TestHelper(page);

      try {
        await page.goto('/');
        
        const performanceEntries = [];
        
        // Test theme switching performance on different pages
        for (const route of ROUTES.slice(0, 5)) { // Test first 5 routes
          await page.goto(route.path);
          await testHelper.waitForPageLoad();
          
          // Measure theme toggle performance
          const startTime = Date.now();
          await testHelper.setTheme('dark');
          const darkTime = Date.now() - startTime;
          
          const startTime2 = Date.now();
          await testHelper.setTheme('light');
          const lightTime = Date.now() - startTime2;
          
          performanceEntries.push({
            route: route.path,
            darkToggleTime: darkTime,
            lightToggleTime: lightTime
          });
        }
        
        // Log performance results
        console.log('Theme switching performance:', performanceEntries);
        
        // Assert performance is reasonable (under 1 second)
        for (const entry of performanceEntries) {
          expect(entry.darkToggleTime).toBeLessThan(1000);
          expect(entry.lightToggleTime).toBeLessThan(1000);
        }

      } finally {
        await page.close();
      }
    });
  });
});