/**
 * @fileoverview WCAG 2.1 AA Compliance Testing Suite
 * @description Comprehensive accessibility testing for the design system
 * @author QA Specialist - Testing and Quality Assurance Agent
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG 2.1 AA Compliance Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Set up consistent testing environment
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.describe('Core Accessibility Standards', () => {
    test('homepage accessibility audit', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('booking flow accessibility', async ({ page }) => {
      await page.goto('/book');
      await page.waitForLoadState('networkidle');
      
      // Test each step of booking flow
      const steps = ['service-selection', 'datetime-selection', 'customer-details', 'payment'];
      
      for (const step of steps) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include(`[data-testid="${step}"]`)
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        
        expect(accessibilityScanResults.violations).toEqual([]);
        
        // Navigate to next step if not the last one
        if (step !== 'payment') {
          const continueButton = page.locator('[data-testid="continue-button"]');
          if (await continueButton.isVisible()) {
            await continueButton.click();
            await page.waitForLoadState('networkidle');
          }
        }
      }
    });

    test('admin dashboard accessibility', async ({ page }) => {
      // Mock admin authentication
      await page.addInitScript(() => {
        window.localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: 'mock-admin-token',
          user: { id: 'admin-user', role: 'admin' }
        }));
      });
      
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('Keyboard Navigation Testing', () => {
    test('main navigation keyboard accessibility', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test tab navigation through main menu
      const mainNav = page.locator('[data-testid="main-navigation"]');
      const navLinks = mainNav.locator('a, button');
      const navLinkCount = await navLinks.count();
      
      // Start from first focusable element
      await page.keyboard.press('Tab');
      
      for (let i = 0; i < navLinkCount; i++) {
        const focusedElement = page.locator(':focus');
        
        // Verify element is visible and focusable
        await expect(focusedElement).toBeVisible();
        await expect(focusedElement).toBeFocused();
        
        // Test activation with Enter and Space
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        if (tagName === 'button') {
          // Test both Enter and Space for buttons
          await page.keyboard.press('Enter');
          await page.waitForTimeout(100);
          
          // Navigate back if needed
          if (page.url() !== 'http://localhost:3000/') {
            await page.goBack();
            await page.waitForLoadState('networkidle');
          }
        }
        
        await page.keyboard.press('Tab');
      }
    });

    test('form keyboard navigation', async ({ page }) => {
      await page.goto('/book');
      await page.waitForLoadState('networkidle');
      
      const form = page.locator('[data-testid="booking-form"]');
      const formFields = form.locator('input, select, textarea, button');
      const fieldCount = await formFields.count();
      
      // Navigate through all form fields
      await page.keyboard.press('Tab');
      
      for (let i = 0; i < fieldCount; i++) {
        const focusedElement = page.locator(':focus');
        
        await expect(focusedElement).toBeVisible();
        await expect(focusedElement).toBeFocused();
        
        // Test field interaction
        const fieldType = await focusedElement.getAttribute('type');
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'input' && fieldType === 'text') {
          await focusedElement.fill('Test input');
        } else if (tagName === 'select') {
          await page.keyboard.press('ArrowDown');
        }
        
        await page.keyboard.press('Tab');
      }
    });

    test('modal dialog keyboard trapping', async ({ page }) => {
      await page.goto('/design-system/modals');
      await page.waitForLoadState('networkidle');
      
      // Open modal
      await page.locator('[data-testid="open-modal"]').click();
      await page.waitForTimeout(300);
      
      const modal = page.locator('[data-testid="modal-dialog"]');
      await expect(modal).toBeVisible();
      
      // Test focus trapping - tab through modal elements
      const modalFocusableElements = modal.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const elementCount = await modalFocusableElements.count();
      
      if (elementCount > 0) {
        // Focus should start on first element
        await page.keyboard.press('Tab');
        let currentFocus = 0;
        
        // Tab through all elements
        for (let i = 0; i < elementCount; i++) {
          const focusedElement = page.locator(':focus');
          await expect(focusedElement).toBeVisible();
          await page.keyboard.press('Tab');
          currentFocus = (currentFocus + 1) % elementCount;
        }
        
        // Focus should wrap back to first element
        const firstElement = modalFocusableElements.first();
        await expect(firstElement).toBeFocused();
      }
      
      // Test Escape key closes modal
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    test('semantic HTML structure', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for proper heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      let previousLevel = 0;
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName);
        const currentLevel = parseInt(tagName.charAt(1));
        
        // Heading levels should not skip (max jump of 1)
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        previousLevel = currentLevel;
      }
      
      // Check for main landmark
      const main = page.locator('main');
      await expect(main).toBeVisible();
      
      // Check for navigation landmark
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('ARIA labels and descriptions', async ({ page }) => {
      await page.goto('/book');
      await page.waitForLoadState('networkidle');
      
      // Check form fields have proper labels
      const inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const inputId = await input.getAttribute('id');
        
        if (inputId) {
          // Check for associated label
          const label = page.locator(`label[for="${inputId}"]`);
          const labelExists = await label.count() > 0;
          
          // Check for aria-label if no associated label
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          
          expect(labelExists || ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    });

    test('interactive elements accessibility', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check buttons have accessible names
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        
        const textContent = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        const ariaLabelledBy = await button.getAttribute('aria-labelledby');
        
        // Button must have accessible name
        expect(textContent || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
      
      // Check links have accessible names
      const links = page.locator('a');
      const linkCount = await links.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = links.nth(i);
        
        const textContent = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        const ariaLabelledBy = await link.getAttribute('aria-labelledby');
        
        // Link must have accessible name
        expect(textContent || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    });
  });

  test.describe('Color Contrast and Visual Accessibility', () => {
    test('color contrast compliance', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test color contrast with axe
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['color-contrast'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('theme switching accessibility', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test light theme accessibility
      await page.locator('[data-testid="theme-toggle"]').click();
      await page.waitForTimeout(500);
      
      let accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['color-contrast'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
      
      // Test dark theme accessibility
      await page.locator('[data-testid="theme-toggle"]').click();
      await page.waitForTimeout(500);
      
      accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['color-contrast'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('reduced motion preferences', async ({ page }) => {
      // Set prefers-reduced-motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check that animations are disabled or reduced
      const animatedElements = page.locator('[class*="animate"], [class*="transition"]');
      const elementCount = await animatedElements.count();
      
      for (let i = 0; i < elementCount; i++) {
        const element = animatedElements.nth(i);
        const computedStyle = await element.evaluate(el => {
          const style = window.getComputedStyle(el);
          return {
            animationDuration: style.animationDuration,
            transitionDuration: style.transitionDuration
          };
        });
        
        // Animations should be disabled or very short
        expect(
          computedStyle.animationDuration === '0s' || 
          computedStyle.animationDuration === 'none' ||
          computedStyle.transitionDuration === '0s'
        ).toBeTruthy();
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('mobile touch target sizing', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check touch targets are at least 44x44px
      const touchTargets = page.locator('button, a, input[type="checkbox"], input[type="radio"]');
      const targetCount = await touchTargets.count();
      
      for (let i = 0; i < targetCount; i++) {
        const target = touchTargets.nth(i);
        const boundingBox = await target.boundingBox();
        
        if (boundingBox) {
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('mobile screen reader navigation', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test mobile navigation accessibility
      const mobileNav = page.locator('[data-testid="mobile-navigation"]');
      
      if (await mobileNav.isVisible()) {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('[data-testid="mobile-navigation"]')
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();
        
        expect(accessibilityScanResults.violations).toEqual([]);
      }
    });
  });

  test.describe('Error Handling Accessibility', () => {
    test('form validation error accessibility', async ({ page }) => {
      await page.goto('/book');
      await page.waitForLoadState('networkidle');
      
      // Submit empty form to trigger validation
      await page.locator('[data-testid="submit-button"]').click();
      await page.waitForTimeout(500);
      
      // Check error messages are properly associated
      const errorMessages = page.locator('[role="alert"], .error-message');
      const errorCount = await errorMessages.count();
      
      for (let i = 0; i < errorCount; i++) {
        const errorMessage = errorMessages.nth(i);
        
        // Error should be visible and have proper role
        await expect(errorMessage).toBeVisible();
        
        const role = await errorMessage.getAttribute('role');
        const ariaLive = await errorMessage.getAttribute('aria-live');
        
        expect(role === 'alert' || ariaLive === 'polite' || ariaLive === 'assertive').toBeTruthy();
      }
    });

    test('404 page accessibility', async ({ page }) => {
      await page.goto('/non-existent-page');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
      
      // Check that page has proper heading structure
      const mainHeading = page.locator('h1');
      await expect(mainHeading).toBeVisible();
      await expect(mainHeading).toContainText('404');
    });
  });

  test.describe('Focus Management', () => {
    test('focus restoration after modal close', async ({ page }) => {
      await page.goto('/design-system/modals');
      await page.waitForLoadState('networkidle');
      
      const openButton = page.locator('[data-testid="open-modal"]');
      await openButton.click();
      
      const modal = page.locator('[data-testid="modal-dialog"]');
      await expect(modal).toBeVisible();
      
      // Close modal
      await page.locator('[data-testid="close-modal"]').click();
      await expect(modal).not.toBeVisible();
      
      // Focus should return to trigger button
      await expect(openButton).toBeFocused();
    });

    test('skip links functionality', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Tab to first element to reveal skip links
      await page.keyboard.press('Tab');
      
      const skipLink = page.locator('[data-testid="skip-to-main"]');
      if (await skipLink.isVisible()) {
        await skipLink.click();
        
        // Focus should move to main content
        const mainContent = page.locator('main');
        await expect(mainContent).toBeFocused();
      }
    });
  });
});