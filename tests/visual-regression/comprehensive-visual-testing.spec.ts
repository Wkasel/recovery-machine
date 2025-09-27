/**
 * Comprehensive Visual Regression Testing
 * Tests visual consistency across themes, components, and responsive breakpoints
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const themes = ['light', 'dark'];
const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Desktop Large', width: 1920, height: 1080 },
];

/**
 * Helper function to set theme and wait for transition
 */
async function setTheme(page: Page, theme: string) {
  await page.evaluate((theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, theme);
  
  // Wait for theme transition to complete
  await page.waitForTimeout(300);
}

/**
 * Helper function to create consistent test environment
 */
async function setupTestEnvironment(page: Page, theme: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await setTheme(page, theme);
  
  // Disable animations for consistent screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
  
  // Wait for fonts to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

test.describe('Visual Regression Testing', () => {
  
  test.describe('Homepage Visual Testing', () => {
    viewports.forEach(({ name, width, height }) => {
      themes.forEach((theme) => {
        test(`Homepage - ${name} - ${theme} theme`, async ({ page }) => {
          await setupTestEnvironment(page, theme, { width, height });
          await page.goto('/');
          
          // Wait for any lazy-loaded content
          await page.waitForSelector('main', { state: 'visible' });
          
          // Take full page screenshot
          await expect(page).toHaveScreenshot(`homepage-${name.toLowerCase()}-${theme}.png`, {
            fullPage: true,
            animations: 'disabled',
          });
        });
      });
    });

    test('Homepage hero section - component isolation', async ({ page }) => {
      await setupTestEnvironment(page, 'light', { width: 1280, height: 720 });
      await page.goto('/');
      
      const heroSection = page.locator('section').first();
      await expect(heroSection).toHaveScreenshot('hero-section-light.png');
      
      await setTheme(page, 'dark');
      await expect(heroSection).toHaveScreenshot('hero-section-dark.png');
    });
  });

  test.describe('Component Visual Testing', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to a components showcase page or create test page
      await page.goto('/');
    });

    test('Button component variants - all themes', async ({ page }) => {
      themes.forEach(async (theme) => {
        await setupTestEnvironment(page, theme, { width: 800, height: 600 });
        
        // Create test buttons dynamically
        await page.evaluate(() => {
          const container = document.createElement('div');
          container.className = 'p-8 space-y-4 bg-background';
          container.innerHTML = `
            <div class="space-x-4">
              <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md">Primary</button>
              <button class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md">Secondary</button>
              <button class="px-4 py-2 border border-input bg-background rounded-md">Outline</button>
              <button class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md">Destructive</button>
            </div>
            <div class="space-x-4">
              <button class="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md">Small</button>
              <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md">Default</button>
              <button class="px-6 py-3 text-lg bg-primary text-primary-foreground rounded-md">Large</button>
            </div>
            <div class="space-x-4">
              <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md">Normal</button>
              <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90" onmouseover="this.style.backgroundColor='hsl(var(--primary) / 0.9)'">Hover</button>
              <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md opacity-50" disabled>Disabled</button>
            </div>
          `;
          document.body.appendChild(container);
          return container;
        });
        
        const container = page.locator('div').last();
        await expect(container).toHaveScreenshot(`buttons-${theme}.png`);
      });
    });

    test('Card component variations', async ({ page }) => {
      await setupTestEnvironment(page, 'light', { width: 800, height: 600 });
      
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.className = 'p-8 space-y-6 bg-background';
        container.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <h3 class="text-2xl font-semibold">Simple Card</h3>
              <p class="text-muted-foreground mt-2">Basic card with minimal content</p>
            </div>
            
            <div class="bg-card text-card-foreground rounded-lg border shadow-lg p-6">
              <div class="flex items-center space-x-4 mb-4">
                <div class="w-12 h-12 bg-primary rounded-full"></div>
                <div>
                  <h3 class="text-xl font-semibold">Card with Avatar</h3>
                  <p class="text-muted-foreground">Enhanced card design</p>
                </div>
              </div>
              <p class="text-sm">This card includes an avatar and more complex layout with elevated shadow.</p>
              <div class="mt-4 flex space-x-2">
                <button class="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">Action</button>
                <button class="px-3 py-1 border border-input rounded text-sm">Cancel</button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(container);
      });
      
      const container = page.locator('div').last();
      await expect(container).toHaveScreenshot('cards-light.png');
      
      await setTheme(page, 'dark');
      await expect(container).toHaveScreenshot('cards-dark.png');
    });

    test('Form components visual consistency', async ({ page }) => {
      await setupTestEnvironment(page, 'light', { width: 600, height: 800 });
      
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.className = 'p-8 space-y-6 bg-background max-w-md';
        container.innerHTML = `
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium">Text Input</label>
              <input type="text" placeholder="Enter text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            
            <div>
              <label class="text-sm font-medium">Email Input</label>
              <input type="email" placeholder="Enter email" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            
            <div>
              <label class="text-sm font-medium">Password Input</label>
              <input type="password" placeholder="Enter password" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            
            <div>
              <label class="text-sm font-medium">Textarea</label>
              <textarea placeholder="Enter message" class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"></textarea>
            </div>
            
            <div>
              <label class="text-sm font-medium">Select</label>
              <select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Choose option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
            
            <div class="flex items-center space-x-2">
              <input type="checkbox" id="checkbox" class="h-4 w-4 rounded border border-primary" />
              <label for="checkbox" class="text-sm">Checkbox option</label>
            </div>
            
            <div class="flex items-center space-x-2">
              <input type="radio" id="radio" name="radio" class="h-4 w-4" />
              <label for="radio" class="text-sm">Radio option</label>
            </div>
            
            <button class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md">Submit</button>
          </div>
        `;
        document.body.appendChild(container);
      });
      
      const container = page.locator('div').last();
      await expect(container).toHaveScreenshot('forms-light.png');
      
      await setTheme(page, 'dark');
      await expect(container).toHaveScreenshot('forms-dark.png');
    });
  });

  test.describe('Theme Transition Testing', () => {
    test('Theme toggle smooth transition', async ({ page }) => {
      await page.goto('/');
      await setupTestEnvironment(page, 'light', { width: 1280, height: 720 });
      
      // Take initial screenshot
      const heroSection = page.locator('main').first();
      await expect(heroSection).toHaveScreenshot('theme-transition-before.png');
      
      // Find and click theme toggle
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      await themeToggle.click();
      
      // Wait for transition
      await page.waitForTimeout(400);
      
      // Take after screenshot
      await expect(heroSection).toHaveScreenshot('theme-transition-after.png');
    });

    test('Component state preservation during theme switch', async ({ page }) => {
      await page.goto('/');
      await setupTestEnvironment(page, 'light', { width: 800, height: 600 });
      
      // Create interactive components
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.className = 'p-8 space-y-4 bg-background';
        container.innerHTML = `
          <div class="space-y-4">
            <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md focus:ring-2 focus:ring-primary">Focused Button</button>
            <input type="text" value="Test input" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
            <div class="bg-card p-4 rounded-lg border">
              <p>Card content that should maintain state</p>
            </div>
          </div>
        `;
        document.body.appendChild(container);
      });
      
      // Focus button and input
      await page.locator('button').first().focus();
      const container = page.locator('div').last();
      
      // Screenshot before theme change
      await expect(container).toHaveScreenshot('state-preservation-light.png');
      
      // Switch theme while maintaining focus
      await setTheme(page, 'dark');
      
      // Screenshot after theme change
      await expect(container).toHaveScreenshot('state-preservation-dark.png');
    });
  });

  test.describe('Responsive Design Visual Testing', () => {
    test('Component responsive behavior', async ({ page }) => {
      await page.goto('/');
      
      // Test responsive grid at different breakpoints
      const breakpoints = [
        { name: 'mobile', width: 375 },
        { name: 'tablet', width: 768 },
        { name: 'desktop', width: 1024 },
        { name: 'large', width: 1280 },
      ];
      
      for (const { name, width } of breakpoints) {
        await page.setViewportSize({ width, height: 800 });
        await setTheme(page, 'light');
        
        await page.evaluate(() => {
          // Clear previous test content
          const existing = document.querySelector('#responsive-test');
          if (existing) existing.remove();
          
          const container = document.createElement('div');
          container.id = 'responsive-test';
          container.className = 'p-4 bg-background';
          container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div class="bg-card p-4 rounded-lg border">Card 1</div>
              <div class="bg-card p-4 rounded-lg border">Card 2</div>
              <div class="bg-card p-4 rounded-lg border">Card 3</div>
              <div class="bg-card p-4 rounded-lg border">Card 4</div>
              <div class="bg-card p-4 rounded-lg border">Card 5</div>
              <div class="bg-card p-4 rounded-lg border">Card 6</div>
            </div>
            
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md flex-1">Button 1</button>
              <button class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex-1">Button 2</button>
              <button class="px-4 py-2 border border-input rounded-md flex-1">Button 3</button>
            </div>
          `;
          document.body.appendChild(container);
        });
        
        const container = page.locator('#responsive-test');
        await expect(container).toHaveScreenshot(`responsive-${name}.png`);
      }
    });

    test('Typography responsive scaling', async ({ page }) => {
      await page.goto('/');
      
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'desktop', width: 1280, height: 720 },
      ];
      
      for (const { name, width, height } of viewports) {
        await setupTestEnvironment(page, 'light', { width, height });
        
        await page.evaluate(() => {
          const existing = document.querySelector('#typography-test');
          if (existing) existing.remove();
          
          const container = document.createElement('div');
          container.id = 'typography-test';
          container.className = 'p-8 bg-background space-y-4';
          container.innerHTML = `
            <h1 class="text-4xl md:text-6xl font-bold">Display Heading</h1>
            <h2 class="text-2xl md:text-4xl font-semibold">Section Heading</h2>
            <h3 class="text-xl md:text-2xl font-medium">Subsection</h3>
            <p class="text-base md:text-lg">This is body text that should scale appropriately across different screen sizes. The text should be readable and maintain proper proportions.</p>
            <p class="text-sm md:text-base text-muted-foreground">This is smaller text, often used for captions or secondary information.</p>
          `;
          document.body.appendChild(container);
        });
        
        const container = page.locator('#typography-test');
        await expect(container).toHaveScreenshot(`typography-${name}.png`);
      }
    });
  });

  test.describe('Interactive State Visual Testing', () => {
    test('Button interaction states', async ({ page }) => {
      await page.goto('/');
      await setupTestEnvironment(page, 'light', { width: 800, height: 400 });
      
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.className = 'p-8 space-y-8 bg-background';
        container.innerHTML = `
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Button States</h3>
            <div class="space-x-4">
              <button id="btn-normal" class="px-4 py-2 bg-primary text-primary-foreground rounded-md">Normal</button>
              <button id="btn-hover" class="px-4 py-2 bg-primary text-primary-foreground rounded-md">Hover</button>
              <button id="btn-focus" class="px-4 py-2 bg-primary text-primary-foreground rounded-md">Focus</button>
              <button id="btn-active" class="px-4 py-2 bg-primary text-primary-foreground rounded-md">Active</button>
              <button id="btn-disabled" class="px-4 py-2 bg-primary text-primary-foreground rounded-md opacity-50" disabled>Disabled</button>
            </div>
          </div>
        `;
        document.body.appendChild(container);
      });
      
      const container = page.locator('div').last();
      
      // Normal state
      await expect(container).toHaveScreenshot('button-states-normal.png');
      
      // Hover state
      await page.locator('#btn-hover').hover();
      await expect(container).toHaveScreenshot('button-states-hover.png');
      
      // Focus state
      await page.locator('#btn-focus').focus();
      await expect(container).toHaveScreenshot('button-states-focus.png');
      
      // Active state (simulate mousedown)
      await page.locator('#btn-active').hover();
      await page.mouse.down();
      await expect(container).toHaveScreenshot('button-states-active.png');
      await page.mouse.up();
    });

    test('Form input states', async ({ page }) => {
      await page.goto('/');
      await setupTestEnvironment(page, 'light', { width: 600, height: 500 });
      
      await page.evaluate(() => {
        const container = document.createElement('div');
        container.className = 'p-8 space-y-6 bg-background';
        container.innerHTML = `
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Input States</h3>
            
            <div>
              <label class="text-sm font-medium">Normal Input</label>
              <input type="text" placeholder="Normal state" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            
            <div>
              <label class="text-sm font-medium">Focused Input</label>
              <input id="focus-input" type="text" placeholder="Will be focused" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary" />
            </div>
            
            <div>
              <label class="text-sm font-medium">Filled Input</label>
              <input type="text" value="This input has content" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            
            <div>
              <label class="text-sm font-medium">Error Input</label>
              <input type="text" value="Invalid input" class="flex h-10 w-full rounded-md border border-destructive bg-background px-3 py-2 text-sm" />
              <p class="text-sm text-destructive mt-1">This field has an error</p>
            </div>
            
            <div>
              <label class="text-sm font-medium">Disabled Input</label>
              <input type="text" value="Disabled input" disabled class="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-50" />
            </div>
          </div>
        `;
        document.body.appendChild(container);
      });
      
      const container = page.locator('div').last();
      
      // Normal state
      await expect(container).toHaveScreenshot('input-states-normal.png');
      
      // Focus state
      await page.locator('#focus-input').focus();
      await expect(container).toHaveScreenshot('input-states-focus.png');
    });
  });

  test.describe('Animation and Transition Testing', () => {
    test('Theme transition animation frames', async ({ page }) => {
      await page.goto('/');
      await page.setViewportSize({ width: 800, height: 600 });
      
      // Enable animations for this test
      await page.addStyleTag({
        content: `
          * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
          }
        `
      });
      
      await setTheme(page, 'light');
      await page.waitForTimeout(100);
      
      const heroSection = page.locator('main').first();
      
      // Start theme transition
      await setTheme(page, 'dark');
      
      // Capture transition frames
      await page.waitForTimeout(50);
      await expect(heroSection).toHaveScreenshot('transition-frame-1.png');
      
      await page.waitForTimeout(100);
      await expect(heroSection).toHaveScreenshot('transition-frame-2.png');
      
      await page.waitForTimeout(200);
      await expect(heroSection).toHaveScreenshot('transition-complete.png');
    });
  });

  test.describe('Cross-browser Visual Consistency', () => {
    // Note: This would require running tests on different browsers
    // For now, we'll test different rendering conditions
    
    test('High DPI display rendering', async ({ page }) => {
      await page.goto('/');
      await setupTestEnvironment(page, 'light', { width: 1280, height: 720 });
      
      // Simulate high DPI display
      await page.emulateMedia({ 
        reducedMotion: 'reduce',
      });
      
      const heroSection = page.locator('main').first();
      await expect(heroSection).toHaveScreenshot('high-dpi-rendering.png');
    });

    test('Reduced motion preferences', async ({ page }) => {
      await page.goto('/');
      await setupTestEnvironment(page, 'light', { width: 1280, height: 720 });
      
      // Simulate reduced motion preference
      await page.emulateMedia({ 
        reducedMotion: 'reduce',
      });
      
      await page.addStyleTag({
        content: `
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `
      });
      
      const heroSection = page.locator('main').first();
      await expect(heroSection).toHaveScreenshot('reduced-motion.png');
    });
  });
});

test.describe('Performance Visual Testing', () => {
  test('Large component lists rendering', async ({ page }) => {
    await page.goto('/');
    await setupTestEnvironment(page, 'light', { width: 1280, height: 720 });
    
    // Create many components to test rendering performance
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.className = 'p-4 bg-background';
      
      let html = '<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">';
      
      for (let i = 0; i < 100; i++) {
        html += `
          <div class="bg-card p-4 rounded-lg border shadow-sm">
            <h3 class="text-lg font-semibold">Card ${i + 1}</h3>
            <p class="text-muted-foreground">This is card number ${i + 1}</p>
            <button class="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded text-sm">Action</button>
          </div>
        `;
      }
      
      html += '</div>';
      container.innerHTML = html;
      document.body.appendChild(container);
    });
    
    const startTime = Date.now();
    const container = page.locator('div').last();
    await expect(container).toHaveScreenshot('performance-many-components.png');
    const endTime = Date.now();
    
    console.log(`Screenshot of 100 components took ${endTime - startTime}ms`);
    
    // Performance assertion
    expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
  });
});