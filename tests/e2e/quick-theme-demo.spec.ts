import { test, expect } from '@playwright/test';

test.describe('Quick Theme Testing Demo', () => {
  test('Homepage theme switching demonstration', async ({ page }) => {
    // Go to homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/demo-homepage-initial.png',
      fullPage: true 
    });
    
    // Look for theme toggle button
    const themeToggleSelectors = [
      '[data-testid="theme-toggle"]',
      'button[aria-label*="theme" i]',
      'button[aria-label*="Theme" i]',
      'button[title*="theme" i]',
      '.theme-toggle',
      'button:has([data-lucide="sun"])',
      'button:has([data-lucide="moon"])',
    ];
    
    let themeToggle = null;
    for (const selector of themeToggleSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible()) {
        themeToggle = element;
        break;
      }
    }
    
    if (themeToggle) {
      console.log('✅ Theme toggle found - testing theme switching');
      
      // Get initial theme
      const initialTheme = await page.locator('html').getAttribute('class');
      console.log('Initial theme classes:', initialTheme);
      
      // Click theme toggle
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Take screenshot after toggle
      await page.screenshot({ 
        path: 'test-results/demo-homepage-toggled.png',
        fullPage: true 
      });
      
      // Get new theme
      const newTheme = await page.locator('html').getAttribute('class');
      console.log('New theme classes:', newTheme);
      
      // Verify theme changed
      expect(initialTheme).not.toBe(newTheme);
      console.log('✅ Theme switching successful');
      
    } else {
      console.log('⚠️ No theme toggle found - taking screenshot anyway');
      await page.screenshot({ 
        path: 'test-results/demo-homepage-no-toggle.png',
        fullPage: true 
      });
    }
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'test-results/demo-homepage-mobile.png',
      fullPage: true 
    });
    
    console.log('✅ Demo test completed - check test-results/ for screenshots');
  });
  
  test('Sign-in page test', async ({ page }) => {
    await page.goto('http://localhost:3000/sign-in');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/demo-signin-page.png',
      fullPage: true 
    });
    
    // Check for form elements
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible() && await passwordInput.isVisible() && await submitButton.isVisible()) {
      console.log('✅ Sign-in form elements found');
      
      // Test form validation
      await submitButton.click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ 
        path: 'test-results/demo-signin-validation.png',
        fullPage: true 
      });
      
      console.log('✅ Form validation test completed');
    } else {
      console.log('⚠️ Sign-in form not found or incomplete');
    }
  });
});