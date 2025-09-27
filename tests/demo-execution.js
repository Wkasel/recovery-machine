#!/usr/bin/env node

/**
 * Demo Test Execution Script
 * Demonstrates the comprehensive testing capabilities
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function demoTest() {
  console.log('🚀 Starting Demo Test Execution');
  console.log('================================');
  
  // Create results directory
  const resultsDir = path.join(__dirname, '..', 'test-results');
  const screenshotsDir = path.join(resultsDir, 'screenshots');
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Test application connectivity
    console.log('📡 Testing application connectivity...');
    
    let baseUrl = 'http://localhost:3000';
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 10000 });
      console.log('✅ Connected to localhost:3000');
    } catch (error) {
      console.log('⚠️ Port 3000 unavailable, trying 3002...');
      baseUrl = 'http://localhost:3002';
      await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 10000 });
      console.log('✅ Connected to localhost:3002');
    }
    
    // Homepage Testing
    console.log('🏠 Testing Homepage...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'demo-homepage-desktop.png'),
      fullPage: true 
    });
    
    // Theme Toggle Detection
    console.log('🌗 Testing Theme Functionality...');
    const themeToggleSelectors = [
      '[data-testid="theme-toggle"]',
      'button[aria-label*="theme" i]',
      'button[aria-label*="dark" i]',
      'button[aria-label*="light" i]',
      'button[title*="theme" i]',
      '.theme-toggle',
      'button:has(svg[data-lucide="sun"])',
      'button:has(svg[data-lucide="moon"])',
      'button:has([class*="sun"])',
      'button:has([class*="moon"])',
    ];
    
    let themeToggle = null;
    let foundSelector = '';
    
    for (const selector of themeToggleSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible()) {
          themeToggle = element;
          foundSelector = selector;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (themeToggle) {
      console.log(`✅ Theme toggle found: ${foundSelector}`);
      
      // Get current theme
      const beforeClasses = await page.locator('html').getAttribute('class') || '';
      console.log(`Current theme classes: ${beforeClasses}`);
      
      // Click theme toggle
      await themeToggle.click();
      await page.waitForTimeout(1000);
      
      // Take screenshot after toggle
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'demo-homepage-theme-toggled.png'),
        fullPage: true 
      });
      
      const afterClasses = await page.locator('html').getAttribute('class') || '';
      console.log(`New theme classes: ${afterClasses}`);
      
      if (beforeClasses !== afterClasses) {
        console.log('✅ Theme switching successful!');
      } else {
        console.log('⚠️ Theme classes unchanged');
      }
    } else {
      console.log('⚠️ No theme toggle found');
    }
    
    // Responsive Testing
    console.log('📱 Testing Responsive Design...');
    
    const viewports = [
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: path.join(screenshotsDir, `demo-homepage-${viewport.name}.png`),
        fullPage: true 
      });
      console.log(`✅ ${viewport.name} screenshot captured`);
    }
    
    // Reset viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Test Sign-in Page
    console.log('🔐 Testing Authentication Page...');
    await page.goto(`${baseUrl}/sign-in`);
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'demo-signin-page.png'),
      fullPage: true 
    });
    
    // Check for form elements
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    const hasEmail = await emailInput.isVisible().catch(() => false);
    const hasPassword = await passwordInput.isVisible().catch(() => false);
    const hasSubmit = await submitButton.isVisible().catch(() => false);
    
    if (hasEmail && hasPassword && hasSubmit) {
      console.log('✅ Complete sign-in form detected');
    } else {
      console.log('⚠️ Sign-in form incomplete or missing');
    }
    
    // Test Additional Routes
    console.log('🗺️ Testing Additional Routes...');
    const routesToTest = ['/about', '/features', '/pricing', '/contact'];
    
    for (const route of routesToTest) {
      try {
        await page.goto(`${baseUrl}${route}`);
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        
        const routeName = route.substring(1) || 'root';
        await page.screenshot({ 
          path: path.join(screenshotsDir, `demo-${routeName}-page.png`),
          fullPage: true 
        });
        console.log(`✅ ${route} page captured`);
      } catch (error) {
        console.log(`⚠️ Could not access ${route}: ${error.message}`);
      }
    }
    
    console.log('✅ Demo test execution completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo test failed:', error.message);
  } finally {
    await browser.close();
  }
  
  // Generate summary
  console.log('\n📊 Demo Test Summary');
  console.log('====================');
  
  const screenshots = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
  console.log(`Screenshots generated: ${screenshots.length}`);
  screenshots.forEach(screenshot => {
    console.log(`  📸 ${screenshot}`);
  });
  
  console.log('\n🎯 What This Demonstrates:');
  console.log('- ✅ Automated page navigation and testing');
  console.log('- ✅ Theme toggle detection and functionality');
  console.log('- ✅ Responsive design validation');
  console.log('- ✅ Form element detection');
  console.log('- ✅ Screenshot generation for visual regression');
  console.log('- ✅ Comprehensive error handling');
  
  console.log('\n📁 Results saved to: test-results/screenshots/');
  console.log('\n🚀 Ready for full test suite execution!');
}

// Run the demo
demoTest().catch(console.error);