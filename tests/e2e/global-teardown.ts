import { FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting test cleanup...');
  
  // Generate test summary report
  const resultsDir = path.join(process.cwd(), 'test-results');
  const screenshotDir = path.join(resultsDir, 'screenshots');
  
  if (fs.existsSync(screenshotDir)) {
    const screenshots = fs.readdirSync(screenshotDir);
    const summary = {
      timestamp: new Date().toISOString(),
      totalScreenshots: screenshots.length,
      screenshotsByTheme: {
        light: screenshots.filter(f => f.includes('_light')).length,
        dark: screenshots.filter(f => f.includes('_dark')).length
      },
      screenshotsByDevice: {
        desktop: screenshots.filter(f => !f.includes('_tablet') && !f.includes('_mobile')).length,
        tablet: screenshots.filter(f => f.includes('_tablet')).length,
        mobile: screenshots.filter(f => f.includes('_mobile')).length
      },
      screenshots: screenshots.sort()
    };
    
    fs.writeFileSync(
      path.join(resultsDir, 'test-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log(`📊 Test Summary:`);
    console.log(`   Total Screenshots: ${summary.totalScreenshots}`);
    console.log(`   Light Theme: ${summary.screenshotsByTheme.light}`);
    console.log(`   Dark Theme: ${summary.screenshotsByTheme.dark}`);
    console.log(`   Desktop: ${summary.screenshotsByDevice.desktop}`);
    console.log(`   Tablet: ${summary.screenshotsByDevice.tablet}`);
    console.log(`   Mobile: ${summary.screenshotsByDevice.mobile}`);
  }
  
  console.log('✅ Cleanup complete');
}

export default globalTeardown;
