import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('\n=== TESTING SIGN-IN PAGE ===\n');
    await page.goto('http://localhost:3000/sign-in');
    await page.waitForLoadState('networkidle');

    // Take screenshot of sign-in page
    await page.screenshot({ path: join(__dirname, 'screenshots/sign-in.png'), fullPage: true });
    console.log('✓ Sign-in page loaded successfully');
    console.log('✓ Screenshot saved to screenshots/sign-in.png');

    // Fill in login credentials
    console.log('\n=== LOGGING IN ===\n');
    await page.fill('input[name="email"]', 'wkasel@gmail.com');
    await page.fill('input[name="password"]', 'may81988');

    // Click sign in button
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForURL(/\/profile|\/dashboard/, { timeout: 10000 });
    console.log('✓ Successfully logged in');
    console.log('✓ Current URL:', page.url());

    // Take screenshot after login
    await page.screenshot({ path: join(__dirname, 'screenshots/after-login.png'), fullPage: true });
    console.log('✓ Screenshot saved to screenshots/after-login.png');

    console.log('\n=== TESTING USER DASHBOARD ===\n');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: join(__dirname, 'screenshots/user-dashboard.png'), fullPage: true });
    console.log('✓ User dashboard loaded');
    console.log('✓ Screenshot saved to screenshots/user-dashboard.png');

    // Get page title
    const dashboardTitle = await page.title();
    console.log('✓ Dashboard title:', dashboardTitle);

    // Check for any visible errors
    const errors = await page.locator('text=/error|Error|failed|Failed/i').count();
    console.log(`✓ Error messages found: ${errors}`);

    console.log('\n=== TESTING ADMIN DASHBOARD ===\n');
    await page.goto('http://localhost:3000/admin');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: join(__dirname, 'screenshots/admin-dashboard.png'), fullPage: true });
    console.log('✓ Admin dashboard loaded');
    console.log('✓ Screenshot saved to screenshots/admin-dashboard.png');

    // Get admin page title
    const adminTitle = await page.title();
    console.log('✓ Admin title:', adminTitle);

    // Check admin page content
    const adminErrors = await page.locator('text=/error|Error|failed|Failed/i').count();
    console.log(`✓ Error messages found: ${adminErrors}`);

    // Check for admin-specific elements
    const hasAdminSidebar = await page.locator('[class*="sidebar"]').count() > 0;
    console.log('✓ Admin sidebar present:', hasAdminSidebar);

    console.log('\n=== TEST COMPLETE ===\n');
    console.log('All screenshots saved to screenshots/ directory');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: join(__dirname, 'screenshots/error.png'), fullPage: true });
  } finally {
    await browser.close();
  }
})();
