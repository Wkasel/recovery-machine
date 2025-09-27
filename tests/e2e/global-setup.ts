import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting comprehensive testing setup...');
  
  // Create screenshots directory
  const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  // Warm up the application
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Visit the home page to ensure the app is ready
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    console.log('✅ Application is ready for testing');
  } catch (error) {
    console.error('❌ Failed to warm up application:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('🎯 Setup complete - ready for comprehensive testing');
}

export default globalSetup;