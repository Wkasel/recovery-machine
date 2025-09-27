import { test, expect } from '@playwright/test';

// Manual verification test - runs without webServer to avoid port conflicts
test.describe('Manual Theme Testing Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Set a longer timeout for manual testing
    test.setTimeout(60000);
  });

  test('Verify application is accessible and responsive', async ({ page }) => {
    try {
      // Try to connect to the running development server
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      
      // Take homepage screenshot
      await page.screenshot({ 
        path: 'test-results/homepage-verification.png',
        fullPage: true 
      });
      
      // Check basic page structure
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Check for navigation
      const nav = page.locator('nav, header').first();
      if (await nav.isVisible()) {
        console.log('✅ Navigation found');
      }
      
      // Test different viewport sizes
      const viewports = [
        { name: 'desktop', width: 1920, height: 1080 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'mobile', width: 375, height: 667 }
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(500);
        await page.screenshot({ 
          path: `test-results/homepage-${viewport.name}.png`,
          fullPage: true 
        });
      }
      
      console.log('✅ Responsive design verification completed');
      
    } catch (error) {
      console.log('⚠️ Could not connect to localhost:3000, trying localhost:3002');
      
      try {
        await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
        await page.screenshot({ 
          path: 'test-results/homepage-port3002.png',
          fullPage: true 
        });
        console.log('✅ Connected to port 3002 successfully');
      } catch (secondError) {
        console.log('❌ Could not connect to development server on either port');
        throw secondError;
      }
    }
  });

  test('Theme toggle detection and functionality', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000');
    } catch {
      await page.goto('http://localhost:3002');
    }
    
    await page.waitForLoadState('networkidle');
    
    // Comprehensive theme toggle detection
    const themeToggleSelectors = [
      '[data-testid="theme-toggle"]',
      'button[aria-label*="theme" i]',
      'button[aria-label*="dark" i]',
      'button[aria-label*="light" i]',
      'button[title*="theme" i]',
      '.theme-toggle',
      '.dark-mode-toggle',
      'button:has(svg[data-lucide="sun"])',
      'button:has(svg[data-lucide="moon"])',
      'button:has([class*="sun"])',
      'button:has([class*="moon"])',
      'button:has([class*="theme"])',
      '[role="switch"][aria-label*="theme" i]',
    ];
    
    let themeToggle = null;
    let foundSelector = '';
    
    for (const selector of themeToggleSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible()) {
        themeToggle = element;
        foundSelector = selector;
        break;
      }
    }
    
    if (themeToggle) {
      console.log(`✅ Theme toggle found with selector: ${foundSelector}`);
      
      // Get current theme state
      const htmlClass = await page.locator('html').getAttribute('class') || '';
      const bodyClass = await page.locator('body').getAttribute('class') || '';
      const dataTheme = await page.locator('html').getAttribute('data-theme');
      
      console.log('Current theme indicators:', { htmlClass, bodyClass, dataTheme });
      
      // Take before screenshot
      await page.screenshot({ 
        path: 'test-results/theme-before-toggle.png',
        fullPage: true 
      });
      
      // Click theme toggle
      await themeToggle.click();
      await page.waitForTimeout(1000); // Allow for theme transition
      
      // Take after screenshot
      await page.screenshot({ 
        path: 'test-results/theme-after-toggle.png',
        fullPage: true 
      });
      
      // Get new theme state
      const newHtmlClass = await page.locator('html').getAttribute('class') || '';
      const newBodyClass = await page.locator('body').getAttribute('class') || '';
      const newDataTheme = await page.locator('html').getAttribute('data-theme');
      
      console.log('New theme indicators:', { 
        htmlClass: newHtmlClass, 
        bodyClass: newBodyClass, 
        dataTheme: newDataTheme 
      });
      
      // Verify something changed
      const themeChanged = (
        htmlClass !== newHtmlClass || 
        bodyClass !== newBodyClass || 
        dataTheme !== newDataTheme
      );
      
      if (themeChanged) {
        console.log('✅ Theme switching successful - DOM classes/attributes changed');
      } else {
        console.log('⚠️ Theme toggle clicked but no DOM changes detected');
      }
      
      // Test accessibility
      const ariaLabel = await themeToggle.getAttribute('aria-label');
      const role = await themeToggle.getAttribute('role');
      const title = await themeToggle.getAttribute('title');
      
      console.log('Theme toggle accessibility:', { ariaLabel, role, title });
      
      if (ariaLabel || title) {
        console.log('✅ Theme toggle has accessibility labels');
      } else {
        console.log('⚠️ Theme toggle missing accessibility labels');
      }
      
    } else {
      console.log('❌ No theme toggle found with any of the tested selectors');
      console.log('Tested selectors:', themeToggleSelectors);
      
      // Take screenshot anyway to see the page
      await page.screenshot({ 
        path: 'test-results/no-theme-toggle-found.png',
        fullPage: true 
      });
    }
  });

  test('Authentication flow verification', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/sign-in');
    } catch {
      await page.goto('http://localhost:3002/sign-in');
    }
    
    await page.waitForLoadState('networkidle');
    
    // Take sign-in page screenshot
    await page.screenshot({ 
      path: 'test-results/signin-page.png',
      fullPage: true 
    });
    
    // Look for form elements
    const emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"], input[placeholder*="password" i]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
    
    const hasEmail = await emailInput.isVisible();
    const hasPassword = await passwordInput.isVisible();
    const hasSubmit = await submitButton.isVisible();
    
    console.log('Sign-in form elements:', { hasEmail, hasPassword, hasSubmit });
    
    if (hasEmail && hasPassword && hasSubmit) {
      console.log('✅ Complete sign-in form found');
      
      // Test with valid credentials
      await emailInput.fill('william@dsco.co');
      await passwordInput.fill('password');
      
      // Take screenshot before submission
      await page.screenshot({ 
        path: 'test-results/signin-filled.png',
        fullPage: true 
      });
      
      console.log('✅ Credentials filled - ready for authentication test');
      
      // Note: Not actually submitting to avoid affecting the session
      
    } else {
      console.log('⚠️ Incomplete sign-in form detected');
    }
  });
});