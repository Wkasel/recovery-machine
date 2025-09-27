// Quick theme validation test
import { chromium } from 'playwright';

async function testThemeToggle() {
  console.log('🧪 Testing theme toggle functionality...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the homepage
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Wait for theme toggle to be available
    await page.waitForSelector('[data-testid="theme-toggle"]', { timeout: 10000 });
    
    // Check initial theme (should be system or light)
    const initialHtmlClass = await page.getAttribute('html', 'class');
    console.log('✅ Initial theme class:', initialHtmlClass || 'none');
    
    // Check if CSS variables are loaded
    const backgroundVar = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--background');
    });
    console.log('✅ CSS variable --background:', backgroundVar.trim());
    
    // Check if semantic classes are working
    const bodyBackgroundColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    console.log('✅ Body background color:', bodyBackgroundColor);
    
    // Click the theme toggle (force click to bypass potential intercepts)
    await page.locator('[data-testid="theme-toggle"]').click({ force: true });
    await page.waitForTimeout(500); // Wait for theme transition
    
    // Check if theme changed
    const newHtmlClass = await page.getAttribute('html', 'class');
    console.log('✅ New theme class after toggle:', newHtmlClass || 'none');
    
    // Check if background color changed
    const newBodyBackgroundColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    console.log('✅ New body background color:', newBodyBackgroundColor);
    
    // Verify the theme actually changed
    if (bodyBackgroundColor !== newBodyBackgroundColor) {
      console.log('🎉 SUCCESS: Theme toggle is working! Colors changed from', bodyBackgroundColor, 'to', newBodyBackgroundColor);
    } else {
      console.log('❌ ISSUE: Theme toggle may not be working - colors remained the same');
    }
    
    // Toggle back
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(500);
    
    const finalBodyBackgroundColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });
    console.log('✅ Final body background color:', finalBodyBackgroundColor);
    
    if (bodyBackgroundColor === finalBodyBackgroundColor) {
      console.log('🎉 SUCCESS: Theme toggle works both ways!');
    } else {
      console.log('❌ ISSUE: Theme may not be toggling back properly');
    }
    
  } catch (error) {
    console.error('❌ Error during theme test:', error.message);
  } finally {
    await browser.close();
  }
}

testThemeToggle().catch(console.error);