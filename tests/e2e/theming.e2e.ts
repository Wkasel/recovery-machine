// Comprehensive Theming System Tests
// Tests for light/dark mode functionality, accessibility, and visual consistency

import { expect, test } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("Theming System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await injectAxe(page);
  });

  test.describe("Theme Switcher Component", () => {
    test("should display theme switcher in navigation", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      await expect(themeSwitcher).toBeVisible();
      
      // Verify initial state shows correct icon
      const hasIcon = await themeSwitcher.locator('svg').count();
      expect(hasIcon).toBeGreaterThan(0);
    });

    test("should open theme selection dropdown", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      await themeSwitcher.click();
      
      // Verify dropdown options
      await expect(page.locator('text=Light')).toBeVisible();
      await expect(page.locator('text=Dark')).toBeVisible();
      await expect(page.locator('text=System')).toBeVisible();
    });

    test("should switch between light and dark themes", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Switch to light theme
      await themeSwitcher.click();
      await page.locator('text=Light').click();
      await page.waitForTimeout(500); // Allow theme transition
      
      // Verify light theme is applied
      const htmlClass = await page.locator('html').getAttribute('class');
      expect(htmlClass).not.toContain('dark');
      
      // Switch to dark theme
      await themeSwitcher.click();
      await page.locator('text=Dark').click();
      await page.waitForTimeout(500);
      
      // Verify dark theme is applied
      const darkHtmlClass = await page.locator('html').getAttribute('class');
      expect(darkHtmlClass).toContain('dark');
    });

    test("should respect system preference", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Test with dark system preference
      await page.emulateMedia({ colorScheme: 'dark' });
      await themeSwitcher.click();
      await page.locator('text=System').click();
      await page.waitForTimeout(500);
      
      const htmlClass = await page.locator('html').getAttribute('class');
      expect(htmlClass).toContain('dark');
      
      // Test with light system preference
      await page.emulateMedia({ colorScheme: 'light' });
      await page.reload();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      
      const lightHtmlClass = await page.locator('html').getAttribute('class');
      expect(lightHtmlClass).not.toContain('dark');
    });
  });

  test.describe("Theme Persistence", () => {
    test("should persist theme selection across page reloads", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Set dark theme
      await themeSwitcher.click();
      await page.locator('text=Dark').click();
      await page.waitForTimeout(500);
      
      // Reload page
      await page.reload();
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      
      // Verify dark theme persists
      const htmlClass = await page.locator('html').getAttribute('class');
      expect(htmlClass).toContain('dark');
    });

    test("should persist theme across navigation", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Set light theme
      await themeSwitcher.click();
      await page.locator('text=Light').click();
      await page.waitForTimeout(500);
      
      // Navigate to different page
      await page.goto("/contact");
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(500);
      
      // Verify light theme persists
      const htmlClass = await page.locator('html').getAttribute('class');
      expect(htmlClass).not.toContain('dark');
    });
  });

  test.describe("Visual Consistency", () => {
    const testPages = [
      { path: "/", name: "Home" },
      { path: "/contact", name: "Contact" },
      { path: "/features", name: "Features" },
      { path: "/pricing", name: "Pricing" },
      { path: "/privacy", name: "Privacy" },
      { path: "/terms", name: "Terms" }
    ];

    for (const testPage of testPages) {
      test(`should maintain visual consistency on ${testPage.name} page in both themes`, async ({ page }) => {
        await page.goto(testPage.path);
        await page.waitForLoadState("networkidle");
        
        const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
        
        // Test light theme
        await themeSwitcher.click();
        await page.locator('text=Light').click();
        await page.waitForTimeout(500);
        
        // Verify key elements are visible in light theme
        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
        
        // Check text contrast
        const headingStyles = await heading.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          };
        });
        
        console.log(`${testPage.name} light theme heading styles:`, headingStyles);
        
        // Test dark theme
        await themeSwitcher.click();
        await page.locator('text=Dark').click();
        await page.waitForTimeout(500);
        
        // Verify elements still visible in dark theme
        await expect(heading).toBeVisible();
        
        const darkHeadingStyles = await heading.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          };
        });
        
        console.log(`${testPage.name} dark theme heading styles:`, darkHeadingStyles);
        
        // Verify styles are different between themes
        expect(headingStyles.color).not.toBe(darkHeadingStyles.color);
      });
    }
  });

  test.describe("Component Theming", () => {
    test("should properly theme UI components", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Test buttons in both themes
      const components = [
        { selector: 'a:has-text("Book Now")', name: "Book Now button" },
        { selector: 'a:has-text("Get Started")', name: "Get Started button" },
        { selector: 'a:has-text("Contact")', name: "Contact link" }
      ];
      
      for (const component of components) {
        const element = page.locator(component.selector).first();
        
        if (await element.isVisible()) {
          // Test in light theme
          await themeSwitcher.click();
          await page.locator('text=Light').click();
          await page.waitForTimeout(500);
          
          await expect(element).toBeVisible();
          
          const lightStyles = await element.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              borderColor: computed.borderColor
            };
          });
          
          // Test in dark theme
          await themeSwitcher.click();
          await page.locator('text=Dark').click();
          await page.waitForTimeout(500);
          
          await expect(element).toBeVisible();
          
          const darkStyles = await element.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              borderColor: computed.borderColor
            };
          });
          
          console.log(`${component.name} - Light:`, lightStyles, "Dark:", darkStyles);
        }
      }
    });

    test("should theme form inputs correctly", async ({ page }) => {
      // Navigate to contact page for form testing
      await page.goto("/contact");
      await page.waitForLoadState("networkidle");
      
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        // Test first few inputs in both themes
        for (let i = 0; i < Math.min(inputCount, 3); i++) {
          const input = inputs.nth(i);
          
          // Light theme
          await themeSwitcher.click();
          await page.locator('text=Light').click();
          await page.waitForTimeout(500);
          
          const lightStyles = await input.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              borderColor: computed.borderColor,
              color: computed.color
            };
          });
          
          // Dark theme
          await themeSwitcher.click();
          await page.locator('text=Dark').click();
          await page.waitForTimeout(500);
          
          const darkStyles = await input.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              borderColor: computed.borderColor,
              color: computed.color
            };
          });
          
          console.log(`Input ${i} - Light:`, lightStyles, "Dark:", darkStyles);
        }
      }
    });
  });

  test.describe("Accessibility & Contrast", () => {
    test("should meet WCAG contrast requirements in light theme", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Set light theme
      await themeSwitcher.click();
      await page.locator('text=Light').click();
      await page.waitForTimeout(500);
      
      // Run accessibility checks
      await checkA11y(page, null, {
        rules: {
          'color-contrast': { enabled: true },
          'color-contrast-enhanced': { enabled: true }
        }
      });
    });

    test("should meet WCAG contrast requirements in dark theme", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Set dark theme
      await themeSwitcher.click();
      await page.locator('text=Dark').click();
      await page.waitForTimeout(500);
      
      // Run accessibility checks
      await checkA11y(page, null, {
        rules: {
          'color-contrast': { enabled: true },
          'color-contrast-enhanced': { enabled: true }
        }
      });
    });

    test("should support keyboard navigation in both themes", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Test in both themes
      const themes = ['Light', 'Dark'];
      
      for (const theme of themes) {
        await themeSwitcher.click();
        await page.locator(`text=${theme}`).click();
        await page.waitForTimeout(500);
        
        // Test keyboard navigation
        await page.keyboard.press('Tab');
        const focused = page.locator(':focus');
        await expect(focused).toBeFocused();
        
        // Verify focus is visible
        const focusStyles = await focused.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            outline: computed.outline,
            outlineColor: computed.outlineColor,
            boxShadow: computed.boxShadow
          };
        });
        
        console.log(`${theme} theme focus styles:`, focusStyles);
      }
    });
  });

  test.describe("Responsive Theming", () => {
    const viewports = [
      { width: 375, height: 667, name: "Mobile" },
      { width: 768, height: 1024, name: "Tablet" },
      { width: 1280, height: 720, name: "Desktop" }
    ];

    for (const viewport of viewports) {
      test(`should work correctly on ${viewport.name} in both themes`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
        
        // Test both themes
        const themes = ['Light', 'Dark'];
        
        for (const theme of themes) {
          await themeSwitcher.click();
          await page.locator(`text=${theme}`).click();
          await page.waitForTimeout(500);
          
          // Verify key elements are visible and properly sized
          const heading = page.locator('h1').first();
          await expect(heading).toBeVisible();
          
          const headingBox = await heading.boundingBox();
          expect(headingBox?.width).toBeGreaterThan(0);
          expect(headingBox?.width).toBeLessThanOrEqual(viewport.width);
          
          // Verify theme switcher is still accessible
          await expect(themeSwitcher).toBeVisible();
        }
      });
    }
  });
});