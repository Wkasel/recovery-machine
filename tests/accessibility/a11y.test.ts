import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('homepage should have no accessibility violations', async ({ page }) => {
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check that there's exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // Check heading order
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings[0]).toContain('Recovery When You Need It');
  });

  test('buttons should have accessible names', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const accessibleName = await button.getAttribute('aria-label') || 
                            await button.textContent() ||
                            await button.getAttribute('aria-labelledby');
      
      expect(accessibleName).toBeTruthy();
      expect(accessibleName!.trim().length).toBeGreaterThan(0);
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await checkA11y(page, undefined, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Start from the top of the page
    await page.keyboard.press('Tab');
    
    // Check that focus moves to the first interactive element
    const firstButton = page.getByRole('button', { name: /book now/i });
    await expect(firstButton).toBeFocused();
    
    // Continue tabbing to next element
    await page.keyboard.press('Tab');
    const secondButton = page.getByRole('button', { name: /learn more/i });
    await expect(secondButton).toBeFocused();
  });

  test('should have proper focus indicators', async ({ page }) => {
    const bookButton = page.getByRole('button', { name: /book now/i });
    
    // Focus the button
    await bookButton.focus();
    
    // Check that focus is visible (this would need visual regression testing)
    await expect(bookButton).toBeFocused();
    
    // Verify focus styles are applied
    const focusStyles = await bookButton.evaluate((el) => {
      const styles = window.getComputedStyle(el, ':focus');
      return {
        outline: styles.outline,
        outlineOffset: styles.outlineOffset,
        boxShadow: styles.boxShadow
      };
    });
    
    // At least one focus indicator should be present
    const hasFocusIndicator = focusStyles.outline !== 'none' || 
                             focusStyles.boxShadow !== 'none';
    expect(hasFocusIndicator).toBeTruthy();
  });

  test.describe('Form Accessibility', () => {
    test.skip('should have properly labeled form fields', async ({ page }) => {
      // TODO: Test when booking form is implemented
      await page.goto('/book');
      
      const inputs = page.locator('input');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        
        // Each input should have a label
        const labelId = await input.getAttribute('aria-labelledby');
        const ariaLabel = await input.getAttribute('aria-label');
        const hasLabel = labelId || ariaLabel;
        
        expect(hasLabel).toBeTruthy();
      }
    });

    test.skip('should announce form errors to screen readers', async ({ page }) => {
      // TODO: Test when forms are implemented
      await page.goto('/book');
      
      // Submit empty form to trigger validation
      await page.getByRole('button', { name: /submit/i }).click();
      
      // Check for aria-live region with errors
      const errorRegion = page.getByRole('alert');
      await expect(errorRegion).toBeVisible();
      
      // Verify aria-live attribute
      await expect(errorRegion).toHaveAttribute('aria-live', 'assertive');
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('should be accessible on mobile devices', async ({ page, isMobile }) => {
      if (!isMobile) test.skip();
      
      await checkA11y(page, undefined, {
        rules: {
          'target-size': { enabled: true } // Ensure touch targets are large enough
        }
      });
    });

    test('should have appropriate touch target sizes', async ({ page, isMobile }) => {
      if (!isMobile) test.skip();
      
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const boundingBox = await button.boundingBox();
        
        if (boundingBox) {
          // WCAG recommends minimum 44x44px touch targets
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper landmark regions', async ({ page }) => {
      // Check for main landmark
      const main = page.locator('main, [role="main"]');
      await expect(main).toHaveCount(1);
      
      // Check for navigation if present
      const nav = page.locator('nav, [role="navigation"]');
      if (await nav.count() > 0) {
        // Nav should have accessible name
        const navName = await nav.getAttribute('aria-label') || 
                       await nav.getAttribute('aria-labelledby');
        expect(navName).toBeTruthy();
      }
    });

    test('should use semantic HTML elements', async ({ page }) => {
      // Check that buttons are actual button elements or have button role
      const clickableElements = page.locator('button, [role="button"]');
      const buttonLikeElements = page.locator('[onclick], .btn, .button').not('button');
      
      // All clickable elements should be semantic buttons
      const nonSemanticCount = await buttonLikeElements.count();
      if (nonSemanticCount > 0) {
        // If there are non-semantic clickable elements, they should have button role
        for (let i = 0; i < nonSemanticCount; i++) {
          const element = buttonLikeElements.nth(i);
          const role = await element.getAttribute('role');
          expect(role).toBe('button');
        }
      }
    });

    test('should provide alternative text for images', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // Images should have alt text (can be empty for decorative images)
        expect(alt).not.toBeNull();
      }
    });
  });

  test.describe('Content Accessibility', () => {
    test('should have readable text content', async ({ page }) => {
      // Check that text content is not too small
      const textElements = page.locator('p, span, div').filter({ hasText: /.+/ });
      const count = await textElements.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) { // Sample first 10 elements
        const element = textElements.nth(i);
        const fontSize = await element.evaluate((el) => {
          return window.getComputedStyle(el).fontSize;
        });
        
        const sizeInPx = parseFloat(fontSize);
        expect(sizeInPx).toBeGreaterThanOrEqual(14); // Minimum readable size
      }
    });

    test('should not rely solely on color for information', async ({ page }) => {
      // This test would typically be done manually or with specialized tools
      // For now, we check that important interactive elements have text labels
      const colorOnlyElements = page.locator('[style*="color"], .text-red, .text-green, .text-yellow');
      const count = await colorOnlyElements.count();
      
      for (let i = 0; i < count; i++) {
        const element = colorOnlyElements.nth(i);
        const text = await element.textContent();
        const ariaLabel = await element.getAttribute('aria-label');
        
        // Elements using color should also have text or aria-label
        const hasTextualIndicator = (text && text.trim().length > 0) || ariaLabel;
        if (!hasTextualIndicator) {
          // Check if it's a decorative element
          const role = await element.getAttribute('role');
          expect(role).toBe('presentation');
        }
      }
    });
  });

  test.describe('Dynamic Content Accessibility', () => {
    test.skip('should announce dynamic content changes', async ({ page }) => {
      // TODO: Test when dynamic content is implemented
      await page.goto('/book');
      
      // Trigger a dynamic content change
      await page.getByRole('button', { name: /next step/i }).click();
      
      // Check for aria-live region
      const liveRegion = page.locator('[aria-live]');
      await expect(liveRegion).toBeVisible();
      
      // Verify content is announced appropriately
      const liveValue = await liveRegion.getAttribute('aria-live');
      expect(['polite', 'assertive']).toContain(liveValue);
    });

    test.skip('should handle loading states accessibly', async ({ page }) => {
      // TODO: Test loading states when implemented
      await page.goto('/book');
      
      // Trigger a loading state
      await page.getByRole('button', { name: /submit/i }).click();
      
      // Check for loading indicator with proper ARIA
      const loader = page.getByRole('status');
      await expect(loader).toBeVisible();
      
      // Should have aria-label describing loading state
      const ariaLabel = await loader.getAttribute('aria-label');
      expect(ariaLabel).toContain('loading');
    });
  });

  test('should pass axe accessibility audit with no violations', async ({ page }) => {
    const violations = await getViolations(page);
    expect(violations).toHaveLength(0);
  });
});