// Authenticated User Theming Tests
// Tests theming functionality across authenticated user flows

import { expect, test } from "@playwright/test";

test.describe("Authenticated User Theming", () => {
  const testCredentials = {
    email: "william@dsco.co",
    password: "password"
  };

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");
    
    await page.fill('input[type="email"]', testCredentials.email);
    await page.fill('input[type="password"]', testCredentials.password);
    await page.click('button[type="submit"]');
    
    // Wait for successful login and redirect
    await page.waitForURL(/\/(dashboard|profile|book)/);
    await page.waitForLoadState("networkidle");
  });

  test.describe("Dashboard Theming", () => {
    test("should apply theme consistently across dashboard", async ({ page }) => {
      // Navigate to dashboard if not already there
      await page.goto("/profile");
      await page.waitForLoadState("networkidle");
      
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Test both themes
      const themes = ['Light', 'Dark'];
      
      for (const theme of themes) {
        await themeSwitcher.click();
        await page.locator(`text=${theme}`).click();
        await page.waitForTimeout(500);
        
        // Verify dashboard content is visible
        const mainContent = page.locator('main');
        await expect(mainContent).toBeVisible();
        
        // Check for proper contrast on user-specific elements
        const userElements = page.locator('[data-testid="user-info"], .user-profile, .dashboard-card').first();
        if (await userElements.count() > 0) {
          await expect(userElements).toBeVisible();
          
          const styles = await userElements.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              borderColor: computed.borderColor
            };
          });
          
          console.log(`Dashboard ${theme} theme styles:`, styles);
        }
      }
    });

    test("should theme navigation elements correctly when authenticated", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Check for authenticated navigation elements
      const authNav = [
        { selector: 'a:has-text("Profile")', name: "Profile link" },
        { selector: 'a:has-text("Dashboard")', name: "Dashboard link" },
        { selector: 'a:has-text("Settings")', name: "Settings link" },
        { selector: 'button:has-text("Sign out"), a:has-text("Sign out")', name: "Sign out button" }
      ];
      
      for (const theme of ['Light', 'Dark']) {
        await themeSwitcher.click();
        await page.locator(`text=${theme}`).click();
        await page.waitForTimeout(500);
        
        for (const navItem of authNav) {
          const element = page.locator(navItem.selector);
          
          if (await element.count() > 0) {
            await expect(element.first()).toBeVisible();
            
            const styles = await element.first().evaluate((el) => {
              const computed = window.getComputedStyle(el);
              return {
                color: computed.color,
                backgroundColor: computed.backgroundColor
              };
            });
            
            console.log(`${navItem.name} in ${theme} theme:`, styles);
          }
        }
      }
    });
  });

  test.describe("Booking Flow Theming", () => {
    test("should maintain theme consistency throughout booking process", async ({ page }) => {
      await page.goto("/book");
      await page.waitForLoadState("networkidle");
      
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Set dark theme for booking flow
      await themeSwitcher.click();
      await page.locator('text=Dark').click();
      await page.waitForTimeout(500);
      
      // Verify booking form elements are properly themed
      const bookingElements = [
        { selector: '.booking-form, form', name: "Booking form" },
        { selector: 'input[type="date"], input[type="time"]', name: "Date/time inputs" },
        { selector: 'select, .select-wrapper', name: "Select dropdowns" },
        { selector: 'button[type="submit"], .booking-submit', name: "Submit button" }
      ];
      
      for (const element of bookingElements) {
        const selector = page.locator(element.selector);
        
        if (await selector.count() > 0) {
          await expect(selector.first()).toBeVisible();
          
          const styles = await selector.first().evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              backgroundColor: computed.backgroundColor,
              borderColor: computed.borderColor,
              color: computed.color
            };
          });
          
          console.log(`${element.name} dark theme styles:`, styles);
        }
      }
      
      // Switch to light theme and verify consistency
      await themeSwitcher.click();
      await page.locator('text=Light').click();
      await page.waitForTimeout(500);
      
      // Verify all elements are still visible and properly themed
      for (const element of bookingElements) {
        const selector = page.locator(element.selector);
        
        if (await selector.count() > 0) {
          await expect(selector.first()).toBeVisible();
        }
      }
    });

    test("should properly theme booking confirmation elements", async ({ page }) => {
      // This test would check booking confirmation theming
      // For now, we'll test the booking form submission UI
      await page.goto("/book");
      await page.waitForLoadState("networkidle");
      
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Test form validation messages in both themes
      const themes = ['Light', 'Dark'];
      
      for (const theme of themes) {
        await themeSwitcher.click();
        await page.locator(`text=${theme}`).click();
        await page.waitForTimeout(500);
        
        // Try to trigger validation by submitting empty form
        const submitButton = page.locator('button[type="submit"]').first();
        
        if (await submitButton.count() > 0) {
          await submitButton.click();
          
          // Check for error messages
          const errorMessages = page.locator('.error, .text-red, .text-destructive, [role="alert"]');
          
          if (await errorMessages.count() > 0) {
            const errorStyles = await errorMessages.first().evaluate((el) => {
              const computed = window.getComputedStyle(el);
              return {
                color: computed.color,
                backgroundColor: computed.backgroundColor
              };
            });
            
            console.log(`Validation error in ${theme} theme:`, errorStyles);
          }
        }
      }
    });
  });

  test.describe("Admin Panel Theming", () => {
    test("should check admin interface theming (if accessible)", async ({ page }) => {
      // Try to access admin panel
      await page.goto("/admin");
      
      // Check if user has admin access
      const isNotFound = await page.locator('h1:has-text("404"), h1:has-text("Not Found")').count() > 0;
      const isUnauthorized = await page.locator('h1:has-text("403"), h1:has-text("Unauthorized")').count() > 0;
      
      if (!isNotFound && !isUnauthorized) {
        await page.waitForLoadState("networkidle");
        
        const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
        
        // Test admin interface in both themes
        for (const theme of ['Light', 'Dark']) {
          await themeSwitcher.click();
          await page.locator(`text=${theme}`).click();
          await page.waitForTimeout(500);
          
          // Check for admin-specific elements
          const adminElements = [
            { selector: '.admin-panel, .admin-dashboard', name: "Admin panel" },
            { selector: '.admin-nav, .sidebar', name: "Admin navigation" },
            { selector: '.data-table, table', name: "Data tables" },
            { selector: '.admin-card, .stats-card', name: "Admin cards" }
          ];
          
          for (const element of adminElements) {
            const selector = page.locator(element.selector);
            
            if (await selector.count() > 0) {
              await expect(selector.first()).toBeVisible();
              
              const styles = await selector.first().evaluate((el) => {
                const computed = window.getComputedStyle(el);
                return {
                  backgroundColor: computed.backgroundColor,
                  borderColor: computed.borderColor,
                  color: computed.color
                };
              });
              
              console.log(`${element.name} in ${theme} theme:`, styles);
            }
          }
        }
      } else {
        console.log("Admin panel not accessible with current credentials");
      }
    });

    test("should check for duplicate headers in admin sections", async ({ page }) => {
      // Navigate through different admin sections if accessible
      const adminSections = [
        "/admin/users",
        "/admin/bookings", 
        "/admin/orders",
        "/admin/settings"
      ];
      
      for (const section of adminSections) {
        await page.goto(section);
        
        // Check if page loads successfully
        const isNotFound = await page.locator('h1:has-text("404"), h1:has-text("Not Found")').count() > 0;
        
        if (!isNotFound) {
          await page.waitForLoadState("networkidle");
          
          // Check for duplicate headers
          const h1Count = await page.locator('h1').count();
          expect(h1Count).toBeLessThanOrEqual(1);
          
          // Check for duplicate navigation elements
          const navElements = await page.locator('nav').count();
          console.log(`${section} - H1 count: ${h1Count}, Nav count: ${navElements}`);
          
          // Verify no duplicate theme switchers
          const themeSwitchers = await page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ }).count();
          expect(themeSwitchers).toBeLessThanOrEqual(1);
        }
      }
    });
  });

  test.describe("Theme Persistence for Authenticated Users", () => {
    test("should persist theme preference across login sessions", async ({ page, context }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Set a specific theme
      await themeSwitcher.click();
      await page.locator('text=Dark').click();
      await page.waitForTimeout(500);
      
      // Verify dark theme is set
      let htmlClass = await page.locator('html').getAttribute('class');
      expect(htmlClass).toContain('dark');
      
      // Sign out
      const signOutButton = page.locator('button:has-text("Sign out"), a:has-text("Sign out")');
      if (await signOutButton.count() > 0) {
        await signOutButton.click();
        await page.waitForLoadState("networkidle");
      } else {
        // Manual navigation to sign out
        await page.goto("/");
      }
      
      // Sign back in
      await page.goto("/sign-in");
      await page.fill('input[type="email"]', testCredentials.email);
      await page.fill('input[type="password"]', testCredentials.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/(dashboard|profile|book)/);
      await page.waitForLoadState("networkidle");
      
      // Verify theme preference persisted
      htmlClass = await page.locator('html').getAttribute('class');
      expect(htmlClass).toContain('dark');
    });

    test("should handle theme changes during authenticated session", async ({ page }) => {
      const themeSwitcher = page.locator('[role="button"]').filter({ hasText: /Sun|Moon|Laptop/ });
      
      // Start with light theme
      await themeSwitcher.click();
      await page.locator('text=Light').click();
      await page.waitForTimeout(500);
      
      // Navigate through different authenticated pages
      const authPages = ["/profile", "/book"];
      
      for (const pagePath of authPages) {
        await page.goto(pagePath);
        await page.waitForLoadState("networkidle");
        
        // Verify light theme persists
        let htmlClass = await page.locator('html').getAttribute('class');
        expect(htmlClass).not.toContain('dark');
        
        // Switch to dark theme
        await themeSwitcher.click();
        await page.locator('text=Dark').click();
        await page.waitForTimeout(500);
        
        // Verify dark theme is applied
        htmlClass = await page.locator('html').getAttribute('class');
        expect(htmlClass).toContain('dark');
      }
    });
  });
});