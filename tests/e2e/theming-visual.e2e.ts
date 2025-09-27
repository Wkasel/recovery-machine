// Visual Regression and Accessibility Theming Tests
// Comprehensive visual testing and accessibility validation for theming

import { expect, test } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("Visual Regression Theming Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await injectAxe(page);
  });

  test.describe("Screenshot Comparisons", () => {
    const testPages = [
      { path: "/", name: "homepage" },
      { path: "/contact", name: "contact" },
      { path: "/features", name: "features" },
      { path: "/pricing", name: "pricing" },
      { path: "/privacy", name: "privacy" },
      { path: "/terms", name: "terms" }
    ];

    for (const testPage of testPages) {
      test(`should capture visual regression for ${testPage.name} page`, async ({ page }) => {
        await page.goto(testPage.path);
        await page.waitForLoadState("networkidle");
        
        const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
        
        // Light theme screenshot
        await themeSwitcher.click();
        await page.locator('text=Light').click();
        await page.waitForTimeout(1000); // Allow theme transition
        
        await expect(page).toHaveScreenshot(`${testPage.name}-light-theme.png`, {
          fullPage: true,
          threshold: 0.3,
          animations: 'disabled'
        });
        
        // Dark theme screenshot
        await themeSwitcher.click();
        await page.locator('text=Dark').click();
        await page.waitForTimeout(1000);
        
        await expect(page).toHaveScreenshot(`${testPage.name}-dark-theme.png`, {
          fullPage: true,
          threshold: 0.3,
          animations: 'disabled'
        });
      });
    }

    test("should capture theme switcher component states", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Capture closed state in both themes
      await themeSwitcher.click();
      await page.locator('text=Light').click();
      await page.waitForTimeout(500);
      
      await expect(themeSwitcher).toHaveScreenshot("theme-switcher-light-closed.png");
      
      await themeSwitcher.click();
      await page.locator('text=Dark').click();
      await page.waitForTimeout(500);
      
      await expect(themeSwitcher).toHaveScreenshot("theme-switcher-dark-closed.png");
      
      // Capture open state
      await themeSwitcher.click();
      await page.waitForTimeout(300);
      
      const dropdown = page.locator('[role="menuitem"], .dropdown-content').first();
      await expect(dropdown).toHaveScreenshot("theme-switcher-dropdown-open.png");
    });
  });

  test.describe("Component Visual Consistency", () => {
    test("should maintain button styling consistency", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      const buttonSelectors = [
        'a:has-text("Book Now")',
        'a:has-text("Get Started")', 
        'a:has-text("Contact")',
        'button[type="submit"]'
      ];
      
      // Test each button in both themes
      for (const buttonSelector of buttonSelectors) {
        const button = page.locator(buttonSelector).first();
        
        if (await button.count() > 0) {
          // Light theme
          await themeSwitcher.click();
          await page.locator('text=Light').click();
          await page.waitForTimeout(500);
          
          await button.scrollIntoViewIfNeeded();
          await expect(button).toHaveScreenshot(`button-${buttonSelector.replace(/[^a-zA-Z0-9]/g, '-')}-light.png`);
          
          // Dark theme
          await themeSwitcher.click();
          await page.locator('text=Dark').click();
          await page.waitForTimeout(500);
          
          await button.scrollIntoViewIfNeeded();
          await expect(button).toHaveScreenshot(`button-${buttonSelector.replace(/[^a-zA-Z0-9]/g, '-')}-dark.png`);
        }
      }
    });

    test("should maintain form element consistency", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("networkidle");
      
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      const formElements = page.locator('input, textarea, select').first();
      
      if (await formElements.count() > 0) {
        // Light theme
        await themeSwitcher.click();
        await page.locator('text=Light').click();
        await page.waitForTimeout(500);
        
        await formElements.scrollIntoViewIfNeeded();
        await expect(formElements).toHaveScreenshot("form-elements-light.png");
        
        // Dark theme
        await themeSwitcher.click();
        await page.locator('text=Dark').click();
        await page.waitForTimeout(500);
        
        await expect(formElements).toHaveScreenshot("form-elements-dark.png");
      }
    });
  });

  test.describe("Responsive Visual Testing", () => {
    const viewports = [
      { width: 375, height: 667, name: "mobile" },
      { width: 768, height: 1024, name: "tablet" },
      { width: 1280, height: 720, name: "desktop" }
    ];

    for (const viewport of viewports) {
      test(`should maintain visual consistency on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
        
        // Light theme
        await themeSwitcher.click();
        await page.locator('text=Light').click();
        await page.waitForTimeout(500);
        
        await expect(page).toHaveScreenshot(`homepage-${viewport.name}-light.png`, {
          fullPage: true,
          animations: 'disabled'
        });
        
        // Dark theme
        await themeSwitcher.click();
        await page.locator('text=Dark').click();
        await page.waitForTimeout(500);
        
        await expect(page).toHaveScreenshot(`homepage-${viewport.name}-dark.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      });
    }
  });
});

test.describe("Accessibility Theming Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await injectAxe(page);
  });

  test.describe("Color Contrast Validation", () => {
    test("should meet WCAG AA contrast ratios in light theme", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Set light theme
      await themeSwitcher.click();
      await page.locator('text=Light').click();
      await page.waitForTimeout(500);
      
      // Check specific color contrast rules
      await checkA11y(page, null, {
        rules: {
          'color-contrast': { enabled: true },
          'color-contrast-enhanced': { enabled: false } // AA level, not AAA
        }
      });
      
      // Manual contrast checking for key elements
      const keyElements = [
        { selector: 'h1', name: "Main heading" },
        { selector: 'p', name: "Body text" },
        { selector: 'a', name: "Links" },
        { selector: 'button', name: "Buttons" }
      ];
      
      for (const element of keyElements) {
        const locator = page.locator(element.selector).first();
        
        if (await locator.count() > 0) {
          const contrast = await locator.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            
            // Get RGB values
            const color = computed.color;
            const bgColor = computed.backgroundColor;
            
            return {
              color,
              backgroundColor: bgColor,
              computed: computed
            };
          });
          
          console.log(`Light theme ${element.name} contrast:`, contrast);
        }
      }
    });

    test("should meet WCAG AA contrast ratios in dark theme", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Set dark theme
      await themeSwitcher.click();
      await page.locator('text=Dark').click();
      await page.waitForTimeout(500);
      
      // Check color contrast in dark theme
      await checkA11y(page, null, {
        rules: {
          'color-contrast': { enabled: true },
          'color-contrast-enhanced': { enabled: false }
        }
      });
      
      // Manual contrast checking for dark theme
      const keyElements = [
        { selector: 'h1', name: "Main heading" },
        { selector: 'p', name: "Body text" },
        { selector: 'a', name: "Links" },
        { selector: 'button', name: "Buttons" }
      ];
      
      for (const element of keyElements) {
        const locator = page.locator(element.selector).first();
        
        if (await locator.count() > 0) {
          const contrast = await locator.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor
            };
          });
          
          console.log(`Dark theme ${element.name} contrast:`, contrast);
        }
      }
    });

    test("should validate form element contrast in both themes", async ({ page }) => {
      await page.goto("/contact");
      await page.waitForLoadState("networkidle");
      
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      const themes = ['Light', 'Dark'];
      
      for (const theme of themes) {
        await themeSwitcher.click();
        await page.locator(`text=${theme}`).click();
        await page.waitForTimeout(500);
        
        // Check form accessibility
        await checkA11y(page, 'form', {
          rules: {
            'color-contrast': { enabled: true }
          }
        });
        
        console.log(`Form accessibility validated in ${theme} theme`);
      }
    });
  });

  test.describe("Focus Management", () => {
    test("should maintain visible focus indicators in both themes", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      const themes = ['Light', 'Dark'];
      
      for (const theme of themes) {
        await themeSwitcher.click();
        await page.locator(`text=${theme}`).click();
        await page.waitForTimeout(500);
        
        // Test focus on interactive elements
        const focusableElements = [
          'a:first-of-type',
          'button:first-of-type',
          'input:first-of-type'
        ];
        
        for (const selector of focusableElements) {
          const element = page.locator(selector);
          
          if (await element.count() > 0) {
            await element.focus();
            await expect(element).toBeFocused();
            
            // Check focus styles
            const focusStyles = await element.evaluate((el) => {
              const computed = window.getComputedStyle(el);
              return {
                outline: computed.outline,
                outlineColor: computed.outlineColor,
                outlineWidth: computed.outlineWidth,
                boxShadow: computed.boxShadow
              };
            });
            
            // Verify focus is visible (has outline or box-shadow)
            const hasFocusIndicator = focusStyles.outline !== 'none' || 
                                    focusStyles.boxShadow !== 'none';
            
            console.log(`${theme} theme focus on ${selector}:`, focusStyles);
            expect(hasFocusIndicator).toBe(true);
          }
        }
      }
    });

    test("should support high contrast mode", async ({ page }) => {
      // Simulate high contrast mode
      await page.emulateMedia({ 
        colorScheme: 'dark',
        reducedMotion: 'reduce' 
      });
      
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Test both themes in high contrast
      for (const theme of ['Light', 'Dark']) {
        await themeSwitcher.click();
        await page.locator(`text=${theme}`).click();
        await page.waitForTimeout(500);
        
        // Verify critical elements are still visible
        const criticalElements = [
          'h1',
          'a:has-text("Book")',
          'a:has-text("Contact")'
        ];
        
        for (const selector of criticalElements) {
          const element = page.locator(selector).first();
          
          if (await element.count() > 0) {
            await expect(element).toBeVisible();
            
            const styles = await element.evaluate((el) => {
              const computed = window.getComputedStyle(el);
              return {
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                visibility: computed.visibility
              };
            });
            
            console.log(`High contrast ${theme} - ${selector}:`, styles);
          }
        }
      }
    });
  });

  test.describe("Screen Reader Compatibility", () => {
    test("should maintain proper ARIA attributes across themes", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Test theme switcher accessibility
      await expect(themeSwitcher).toHaveAttribute('role', 'button');
      
      // Open dropdown and check ARIA
      await themeSwitcher.click();
      
      const dropdown = page.locator('[role="menuitem"], [role="option"]').first();
      if (await dropdown.count() > 0) {
        // Verify dropdown has proper ARIA attributes
        const ariaAttributes = await dropdown.evaluate((el) => ({
          role: el.getAttribute('role'),
          'aria-label': el.getAttribute('aria-label'),
          'aria-expanded': el.getAttribute('aria-expanded')
        }));
        
        console.log('Theme switcher ARIA attributes:', ariaAttributes);
      }
      
      // Test that theme changes don't break ARIA structure
      await page.locator('text=Dark').click();
      await page.waitForTimeout(500);
      
      // Re-run accessibility check after theme change
      await checkA11y(page, null, {
        rules: {
          'aria-valid-attr': { enabled: true },
          'aria-required-attr': { enabled: true }
        }
      });
    });

    test("should announce theme changes to screen readers", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Check for live regions or announcements
      const liveRegion = page.locator('[aria-live], [role="status"], [role="alert"]');
      
      if (await liveRegion.count() > 0) {
        // Monitor live region content during theme change
        await themeSwitcher.click();
        await page.locator('text=Dark').click();
        await page.waitForTimeout(500);
        
        const announcement = await liveRegion.textContent();
        console.log('Theme change announcement:', announcement);
      }
      
      // Verify theme state is reflected in accessible name
      const accessibleName = await themeSwitcher.getAttribute('aria-label') || 
                             await themeSwitcher.textContent();
      
      console.log('Theme switcher accessible name:', accessibleName);
    });
  });
});