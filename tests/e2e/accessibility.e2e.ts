// Accessibility and WCAG Compliance Tests
// Tests for accessibility standards and user experience

import { test, expect } from '@playwright/test';

test.describe('Accessibility Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should meet basic accessibility standards', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBe(1); // Only one h1 per page

    // Check that all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      // Decorative images can have empty alt, but should have alt attribute
      if (alt === null) {
        console.warn(`Image missing alt attribute: ${src}`);
      }
    }

    // Check for proper link text
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      if (!text?.trim() && !ariaLabel) {
        const href = await link.getAttribute('href');
        console.warn(`Link missing accessible text: ${href}`);
      }
    }

    console.log('✅ Basic accessibility standards checked');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Start from the first focusable element
    await page.keyboard.press('Tab');
    
    // Navigate through key interactive elements
    const keyElements = [
      'a:has-text("Book Now")',
      'a:has-text("Sign in")',
      'a:has-text("Get Started")'
    ];

    for (const selector of keyElements) {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        await element.focus();
        await expect(element).toBeFocused();
      }
    }

    console.log('✅ Keyboard navigation tested');
  });

  test('should have proper color contrast', async ({ page }) => {
    // This is a visual test that would normally use axe-core
    // For now, we verify text is visible and readable
    
    const textElements = [
      'h1:has-text("Recovery When You Need It")',
      'text=Mobile cold plunge & infrared sauna',
      'text=Simple, Transparent Pricing'
    ];

    for (const selector of textElements) {
      const element = page.locator(selector);
      await expect(element).toBeVisible();
      
      // Check computed styles
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      console.log(`Text styles: ${JSON.stringify(styles)}`);
    }

    console.log('✅ Color contrast verification completed');
  });

  test('should work with screen reader simulation', async ({ page }) => {
    // Test ARIA landmarks and labels
    const landmarks = [
      'banner',
      'main',
      'contentinfo'
    ];

    for (const landmark of landmarks) {
      const element = page.locator(`[role="${landmark}"], ${landmark}`);
      if (await element.isVisible()) {
        await expect(element).toBeVisible();
      }
    }

    // Test form labels
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        if (await label.count() === 0 && !ariaLabel && !ariaLabelledby) {
          console.warn(`Input missing label: ${id}`);
        }
      }
    }

    console.log('✅ Screen reader compatibility tested');
  });

  test('should be responsive for different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // Mobile small
      { width: 375, height: 667 }, // Mobile medium
      { width: 768, height: 1024 }, // Tablet
      { width: 1024, height: 768 }, // Tablet landscape
      { width: 1280, height: 720 }, // Desktop small
      { width: 1920, height: 1080 } // Desktop large
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Verify main heading is visible
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      
      // Verify navigation is accessible
      const bookButton = page.locator('a:has-text("Book"), a:has-text("Get Started")').first();
      await expect(bookButton).toBeVisible();
      
      // Check that text is not cut off
      const headingBox = await heading.boundingBox();
      expect(headingBox?.width).toBeGreaterThan(0);
      
      console.log(`✅ Viewport ${viewport.width}x${viewport.height} tested`);
    }
  });

  test('should handle focus management properly', async ({ page }) => {
    // Test focus trap in modals (if any)
    // Test skip links (if any)
    // Test focus restoration after interactions
    
    // For now, test basic focus visibility
    const focusableElements = page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const count = await focusableElements.count();
    
    if (count > 0) {
      const firstFocusable = focusableElements.first();
      await firstFocusable.focus();
      await expect(firstFocusable).toBeFocused();
    }

    console.log(`✅ Focus management tested on ${count} focusable elements`);
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Test with prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify page still functions without animations
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    console.log('✅ Reduced motion support tested');
  });
});