/**
 * @fileoverview Visual Regression Testing Suite
 * @description Automated visual testing for design system consistency
 * @author QA Specialist - Testing and Quality Assurance Agent
 */

import { test, expect } from '@playwright/test';

test.describe('Visual Regression Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure consistent visual testing environment
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
  });

  test.describe('Component Visual Consistency', () => {
    test('button variants visual comparison', async ({ page }) => {
      await page.goto('/design-system/buttons');
      await page.waitForLoadState('networkidle');
      
      // Test all button variants in light theme
      await page.locator('[data-theme="light"]').click();
      await page.waitForTimeout(500);
      
      const buttonSection = page.locator('[data-testid="button-variants"]');
      await expect(buttonSection).toHaveScreenshot('button-variants-light.png');
      
      // Test dark theme
      await page.locator('[data-theme="dark"]').click();
      await page.waitForTimeout(500);
      
      await expect(buttonSection).toHaveScreenshot('button-variants-dark.png');
    });

    test('form components visual consistency', async ({ page }) => {
      await page.goto('/design-system/forms');
      await page.waitForLoadState('networkidle');
      
      const formSection = page.locator('[data-testid="form-components"]');
      
      // Light theme forms
      await page.locator('[data-theme="light"]').click();
      await expect(formSection).toHaveScreenshot('form-components-light.png');
      
      // Dark theme forms
      await page.locator('[data-theme="dark"]').click();
      await expect(formSection).toHaveScreenshot('form-components-dark.png');
      
      // Form states (focus, error, disabled)
      await page.locator('input[type="text"]').first().focus();
      await expect(formSection).toHaveScreenshot('form-components-focus.png');
      
      await page.locator('[data-testid="error-input"]').focus();
      await expect(formSection).toHaveScreenshot('form-components-error.png');
    });

    test('card layouts visual validation', async ({ page }) => {
      await page.goto('/design-system/cards');
      await page.waitForLoadState('networkidle');
      
      const cardGrid = page.locator('[data-testid="card-grid"]');
      
      // Test responsive layouts
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(cardGrid).toHaveScreenshot('card-layouts-desktop.png');
      
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(cardGrid).toHaveScreenshot('card-layouts-tablet.png');
      
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(cardGrid).toHaveScreenshot('card-layouts-mobile.png');
    });
  });

  test.describe('Page-Level Visual Testing', () => {
    test('homepage visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Wait for any lazy-loaded content
      await page.waitForTimeout(2000);
      
      // Full page screenshot
      await expect(page).toHaveScreenshot('homepage-full.png', { fullPage: true });
      
      // Above-the-fold section
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toHaveScreenshot('homepage-hero.png');
      
      // Test dark theme
      await page.locator('[data-testid="theme-toggle"]').click();
      await page.waitForTimeout(500);
      await expect(heroSection).toHaveScreenshot('homepage-hero-dark.png');
    });

    test('booking flow visual validation', async ({ page }) => {
      await page.goto('/book');
      await page.waitForLoadState('networkidle');
      
      // Step 1: Service selection
      await expect(page.locator('[data-testid="service-selection"]')).toHaveScreenshot('booking-step1.png');
      
      // Step 2: Date/time selection
      await page.locator('[data-testid="service-card"]').first().click();
      await page.locator('[data-testid="continue-button"]').click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid="datetime-selection"]')).toHaveScreenshot('booking-step2.png');
      
      // Step 3: Customer details
      await page.locator('[data-testid="available-slot"]').first().click();
      await page.locator('[data-testid="continue-button"]').click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid="customer-details"]')).toHaveScreenshot('booking-step3.png');
    });

    test('admin dashboard visual consistency', async ({ page }) => {
      // Mock authentication
      await page.addInitScript(() => {
        window.localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: 'mock-token',
          user: { id: 'admin-user', role: 'admin' }
        }));
      });
      
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      
      // Dashboard overview
      await expect(page.locator('[data-testid="admin-dashboard"]')).toHaveScreenshot('admin-dashboard.png');
      
      // Booking management
      await page.locator('[data-testid="bookings-tab"]').click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid="bookings-panel"]')).toHaveScreenshot('admin-bookings.png');
      
      // User management
      await page.locator('[data-testid="users-tab"]').click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-testid="users-panel"]')).toHaveScreenshot('admin-users.png');
    });
  });

  test.describe('Component State Visual Testing', () => {
    test('interactive component states', async ({ page }) => {
      await page.goto('/design-system/interactive');
      await page.waitForLoadState('networkidle');
      
      // Button hover states
      const primaryButton = page.locator('[data-testid="primary-button"]');
      await expect(primaryButton).toHaveScreenshot('button-default.png');
      
      await primaryButton.hover();
      await expect(primaryButton).toHaveScreenshot('button-hover.png');
      
      await primaryButton.focus();
      await expect(primaryButton).toHaveScreenshot('button-focus.png');
      
      // Dropdown menu states
      const dropdown = page.locator('[data-testid="dropdown-trigger"]');
      await dropdown.click();
      await page.waitForTimeout(300);
      await expect(page.locator('[data-testid="dropdown-content"]')).toHaveScreenshot('dropdown-open.png');
      
      // Modal states
      await page.locator('[data-testid="modal-trigger"]').click();
      await page.waitForTimeout(300);
      await expect(page.locator('[data-testid="modal-overlay"]')).toHaveScreenshot('modal-open.png');
    });

    test('form validation visual states', async ({ page }) => {
      await page.goto('/design-system/forms');
      await page.waitForLoadState('networkidle');
      
      const form = page.locator('[data-testid="validation-form"]');
      
      // Empty form state
      await expect(form).toHaveScreenshot('form-empty.png');
      
      // Trigger validation errors
      await page.locator('[data-testid="submit-button"]').click();
      await page.waitForTimeout(300);
      await expect(form).toHaveScreenshot('form-errors.png');
      
      // Valid form state
      await page.locator('[name="email"]').fill('test@example.com');
      await page.locator('[name="password"]').fill('password123');
      await expect(form).toHaveScreenshot('form-valid.png');
    });
  });

  test.describe('Cross-Browser Visual Consistency', () => {
    ['chromium', 'firefox', 'webkit'].forEach(browserName => {
      test(`homepage consistency in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
        test.skip(currentBrowser !== browserName, `Skipping ${browserName} test`);
        
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const heroSection = page.locator('[data-testid="hero-section"]');
        await expect(heroSection).toHaveScreenshot(`homepage-${browserName}.png`);
      });
    });
  });

  test.describe('Mobile Visual Testing', () => {
    test('mobile responsive design', async ({ page }) => {
      const mobileViewports = [
        { name: 'iPhone SE', width: 375, height: 667 },
        { name: 'iPhone 12', width: 390, height: 844 },
        { name: 'Pixel 5', width: 393, height: 851 },
        { name: 'Samsung Galaxy S21', width: 384, height: 854 }
      ];
      
      for (const viewport of mobileViewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Test mobile navigation
        const mobileNav = page.locator('[data-testid="mobile-nav"]');
        await expect(mobileNav).toHaveScreenshot(`mobile-nav-${viewport.name}.png`);
        
        // Test mobile hero section
        const heroSection = page.locator('[data-testid="hero-section"]');
        await expect(heroSection).toHaveScreenshot(`mobile-hero-${viewport.name}.png`);
        
        // Test mobile booking form
        await page.goto('/book');
        await page.waitForLoadState('networkidle');
        const bookingForm = page.locator('[data-testid="booking-form"]');
        await expect(bookingForm).toHaveScreenshot(`mobile-booking-${viewport.name}.png`);
      }
    });
  });

  test.describe('Theme Switching Visual Validation', () => {
    test('seamless theme transitions', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Capture light theme
      await page.locator('[data-theme="light"]').click();
      await page.waitForTimeout(500);
      const mainContent = page.locator('main');
      await expect(mainContent).toHaveScreenshot('theme-light.png');
      
      // Capture dark theme
      await page.locator('[data-theme="dark"]').click();
      await page.waitForTimeout(500);
      await expect(mainContent).toHaveScreenshot('theme-dark.png');
      
      // Capture system theme
      await page.locator('[data-theme="system"]').click();
      await page.waitForTimeout(500);
      await expect(mainContent).toHaveScreenshot('theme-system.png');
    });

    test('theme consistency across components', async ({ page }) => {
      const pages = ['/', '/about', '/pricing', '/book'];
      
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        // Test both themes on each page
        await page.locator('[data-theme="light"]').click();
        await page.waitForTimeout(300);
        await expect(page).toHaveScreenshot(`${pagePath.replace('/', '') || 'home'}-light.png`);
        
        await page.locator('[data-theme="dark"]').click();
        await page.waitForTimeout(300);
        await expect(page).toHaveScreenshot(`${pagePath.replace('/', '') || 'home'}-dark.png`);
      }
    });
  });

  test.describe('Performance Visual Indicators', () => {
    test('loading states visual validation', async ({ page }) => {
      await page.goto('/design-system/loading');
      await page.waitForLoadState('networkidle');
      
      // Spinner loading states
      const spinnerContainer = page.locator('[data-testid="spinner-examples"]');
      await expect(spinnerContainer).toHaveScreenshot('loading-spinners.png');
      
      // Skeleton loading states
      const skeletonContainer = page.locator('[data-testid="skeleton-examples"]');
      await expect(skeletonContainer).toHaveScreenshot('loading-skeletons.png');
      
      // Progress indicators
      const progressContainer = page.locator('[data-testid="progress-examples"]');
      await expect(progressContainer).toHaveScreenshot('loading-progress.png');
    });

    test('error states visual validation', async ({ page }) => {
      await page.goto('/design-system/errors');
      await page.waitForLoadState('networkidle');
      
      // 404 error page
      await page.goto('/non-existent-page');
      await expect(page.locator('[data-testid="error-404"]')).toHaveScreenshot('error-404.png');
      
      // 500 error page simulation
      await page.goto('/design-system/errors/500');
      await expect(page.locator('[data-testid="error-500"]')).toHaveScreenshot('error-500.png');
      
      // Form validation errors
      await page.goto('/design-system/errors/form');
      await expect(page.locator('[data-testid="form-errors"]')).toHaveScreenshot('error-form-validation.png');
    });
  });
});