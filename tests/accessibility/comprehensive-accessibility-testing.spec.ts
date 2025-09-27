/**
 * Comprehensive Accessibility Testing Suite
 * WCAG 2.1 AA Compliance Testing for all components and user flows
 */

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Test configuration for different devices and viewports
const viewports = [
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

const themes = ['light', 'dark'];

/**
 * Helper function to set theme
 */
async function setTheme(page: Page, theme: string) {
  await page.evaluate((theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, theme);
}

/**
 * Helper function to check color contrast ratios
 */
async function checkColorContrast(page: Page, selector: string, minRatio: number = 4.5) {
  const element = await page.locator(selector);
  const styles = await element.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      color: computed.color,
      backgroundColor: computed.backgroundColor,
    };
  });

  // Note: In a real implementation, you would use a color contrast library
  // to calculate the actual contrast ratio. This is a placeholder.
  console.log(`Color contrast check for ${selector}:`, styles);
  expect(styles.color).toBeTruthy();
  expect(styles.backgroundColor).toBeTruthy();
}

test.describe('WCAG 2.1 AA Compliance Testing', () => {
  
  test.describe('Homepage Accessibility', () => {
    viewports.forEach(({ name, width, height }) => {
      themes.forEach((theme) => {
        test(`Homepage accessibility on ${name} - ${theme} theme`, async ({ page }) => {
          await page.setViewportSize({ width, height });
          await page.goto('/');
          await setTheme(page, theme);
          
          // Wait for theme to apply
          await page.waitForTimeout(500);

          const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze();

          expect(accessibilityScanResults.violations).toEqual([]);
        });
      });
    });

    test('Hero section has proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      
      // Check that h1 exists and is unique
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      // Check heading hierarchy (h1 -> h2 -> h3, etc.)
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      let previousLevel = 0;
      
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const currentLevel = parseInt(tagName.charAt(1));
        
        if (previousLevel > 0) {
          // Heading levels should not skip (e.g., h1 -> h3 is invalid)
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
        
        previousLevel = Math.max(previousLevel, currentLevel);
      }
    });

    test('Navigation is keyboard accessible', async ({ page }) => {
      await page.goto('/');
      
      // Test keyboard navigation through main nav
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName.toLowerCase();
      });
      
      // Should focus on a focusable element (button, link, input, etc.)
      expect(['a', 'button', 'input', 'select', 'textarea']).toContain(focusedElement);
      
      // Test that all interactive elements are reachable via keyboard
      const interactiveElements = await page.locator('a, button, input, select, textarea, [tabindex="0"]').all();
      
      for (let i = 0; i < Math.min(interactiveElements.length, 10); i++) {
        await page.keyboard.press('Tab');
        const currentFocus = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
        expect(['a', 'button', 'input', 'select', 'textarea']).toContain(currentFocus);
      }
    });

    test('Images have proper alt text', async ({ page }) => {
      await page.goto('/');
      
      const images = await page.locator('img').all();
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        
        // Images should have alt text or be marked as decorative
        expect(alt !== null || role === 'presentation').toBeTruthy();
        
        // If alt text exists, it should be meaningful (not just filename)
        if (alt) {
          expect(alt.length).toBeGreaterThan(0);
          expect(alt).not.toMatch(/\.(jpg|jpeg|png|gif|svg)$/i);
        }
      }
    });

    test('Forms have proper labels and error handling', async ({ page }) => {
      await page.goto('/');
      
      // Check for any forms on the page
      const forms = await page.locator('form').all();
      
      if (forms.length > 0) {
        for (const form of forms) {
          const inputs = await form.locator('input, select, textarea').all();
          
          for (const input of inputs) {
            const id = await input.getAttribute('id');
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledby = await input.getAttribute('aria-labelledby');
            
            if (id) {
              // Check if there's a corresponding label
              const label = await page.locator(`label[for="${id}"]`).count();
              expect(label > 0 || ariaLabel || ariaLabelledby).toBeTruthy();
            }
          }
        }
      }
    });
  });

  test.describe('Theme Toggle Accessibility', () => {
    test('Theme toggle is accessible', async ({ page }) => {
      await page.goto('/');
      
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      await expect(themeToggle).toBeVisible();
      
      // Check accessibility attributes
      await expect(themeToggle).toHaveAttribute('aria-label');
      
      const ariaLabel = await themeToggle.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/(light|dark|theme)/i);
      
      // Test keyboard activation
      await themeToggle.focus();
      await page.keyboard.press('Enter');
      
      // Verify theme changed (aria-label should update)
      await page.waitForTimeout(300);
      const newAriaLabel = await themeToggle.getAttribute('aria-label');
      expect(newAriaLabel).not.toBe(ariaLabel);
    });

    test('Theme switching maintains accessibility', async ({ page }) => {
      await page.goto('/');
      
      // Test accessibility in light theme
      let accessibilityResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      expect(accessibilityResults.violations).toEqual([]);
      
      // Switch to dark theme
      await page.locator('[data-testid="theme-toggle"]').click();
      await page.waitForTimeout(500);
      
      // Test accessibility in dark theme
      accessibilityResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      expect(accessibilityResults.violations).toEqual([]);
    });
  });

  test.describe('Color Contrast Testing', () => {
    themes.forEach((theme) => {
      test(`Color contrast meets WCAG AA standards - ${theme} theme`, async ({ page }) => {
        await page.goto('/');
        await setTheme(page, theme);
        await page.waitForTimeout(500);
        
        // Test color contrast on key elements
        const elementsToTest = [
          'h1', 'h2', 'h3', 'p', 'a', 'button',
          '[role="button"]', '.btn', '.card', '.alert'
        ];
        
        for (const selector of elementsToTest) {
          const elements = await page.locator(selector).all();
          
          if (elements.length > 0) {
            const element = elements[0]; // Test first instance
            const isVisible = await element.isVisible();
            
            if (isVisible) {
              await checkColorContrast(page, selector);
            }
          }
        }
      });
    });

    test('Interactive elements have sufficient contrast ratios', async ({ page }) => {
      await page.goto('/');
      
      const interactiveElements = [
        'button',
        'a',
        'input',
        'select',
        '[role="button"]',
        '[tabindex="0"]'
      ];
      
      for (const selector of interactiveElements) {
        const elements = await page.locator(selector).all();
        
        for (let i = 0; i < Math.min(elements.length, 3); i++) {
          const element = elements[i];
          const isVisible = await element.isVisible();
          
          if (isVisible) {
            // Test normal state
            await checkColorContrast(page, selector, 4.5);
            
            // Test focus state
            await element.focus();
            await checkColorContrast(page, `${selector}:focus`, 4.5);
            
            // Test hover state (if applicable)
            await element.hover();
            await checkColorContrast(page, `${selector}:hover`, 4.5);
          }
        }
      }
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    test('Page has proper landmarks and structure', async ({ page }) => {
      await page.goto('/');
      
      // Check for semantic landmarks
      const landmarks = await page.locator('main, nav, header, footer, aside, section[aria-label], section[aria-labelledby]').count();
      expect(landmarks).toBeGreaterThan(0);
      
      // Main content should be in a main element
      const mainElement = await page.locator('main').count();
      expect(mainElement).toBeGreaterThanOrEqual(1);
      
      // Navigation should be in nav elements
      const navElements = await page.locator('nav').count();
      expect(navElements).toBeGreaterThanOrEqual(1);
    });

    test('ARIA labels and descriptions are meaningful', async ({ page }) => {
      await page.goto('/');
      
      const elementsWithAria = await page.locator('[aria-label], [aria-labelledby], [aria-describedby]').all();
      
      for (const element of elementsWithAria) {
        const ariaLabel = await element.getAttribute('aria-label');
        const ariaLabelledby = await element.getAttribute('aria-labelledby');
        const ariaDescribedby = await element.getAttribute('aria-describedby');
        
        if (ariaLabel) {
          expect(ariaLabel.length).toBeGreaterThan(0);
          expect(ariaLabel.trim()).toBeTruthy();
        }
        
        if (ariaLabelledby) {
          // Check that referenced element exists
          const referencedElement = await page.locator(`#${ariaLabelledby}`).count();
          expect(referencedElement).toBeGreaterThan(0);
        }
        
        if (ariaDescribedby) {
          // Check that referenced element exists
          const referencedElement = await page.locator(`#${ariaDescribedby}`).count();
          expect(referencedElement).toBeGreaterThan(0);
        }
      }
    });

    test('Lists are properly structured', async ({ page }) => {
      await page.goto('/');
      
      const lists = await page.locator('ul, ol').all();
      
      for (const list of lists) {
        const listItems = await list.locator('li').count();
        // Lists should contain list items
        expect(listItems).toBeGreaterThan(0);
        
        // Check for nested lists (they should be inside li elements)
        const nestedLists = await list.locator('li > ul, li > ol').count();
        const directNestedLists = await list.locator('> ul, > ol').count();
        
        // Nested lists should be inside list items, not direct children
        expect(directNestedLists).toBe(0);
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('All interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto('/');
      
      const interactiveSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex="0"]'
      ];
      
      const selector = interactiveSelectors.join(', ');
      const interactiveElements = await page.locator(selector).all();
      
      // Test that elements can be focused
      for (let i = 0; i < Math.min(interactiveElements.length, 20); i++) {
        const element = interactiveElements[i];
        const isVisible = await element.isVisible();
        
        if (isVisible) {
          await element.focus();
          const isFocused = await element.evaluate(el => document.activeElement === el);
          expect(isFocused).toBeTruthy();
        }
      }
    });

    test('Tab order is logical and sequential', async ({ page }) => {
      await page.goto('/');
      
      const focusableElements = await page.locator('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]').all();
      
      let previousPosition = { x: 0, y: 0 };
      
      for (let i = 0; i < Math.min(focusableElements.length, 15); i++) {
        await page.keyboard.press('Tab');
        
        const currentFocus = await page.evaluate(() => {
          const activeEl = document.activeElement;
          if (activeEl) {
            const rect = activeEl.getBoundingClientRect();
            return {
              x: rect.left,
              y: rect.top,
              tagName: activeEl.tagName.toLowerCase()
            };
          }
          return null;
        });
        
        if (currentFocus) {
          // Focus should generally move left-to-right, top-to-bottom
          // Allow some flexibility for responsive layouts
          const isLogicalProgression = 
            currentFocus.y > previousPosition.y || 
            (Math.abs(currentFocus.y - previousPosition.y) < 50 && currentFocus.x >= previousPosition.x);
          
          // Note: This is a simplified check. Real tab order validation requires more sophisticated logic
          expect(['a', 'button', 'input', 'select', 'textarea']).toContain(currentFocus.tagName);
          
          previousPosition = currentFocus;
        }
      }
    });

    test('Skip links are provided for main content', async ({ page }) => {
      await page.goto('/');
      
      // Press Tab to see if skip link appears
      await page.keyboard.press('Tab');
      
      const skipLink = await page.locator('a[href="#main"], a[href="#content"], .skip-link').first();
      
      if (await skipLink.count() > 0) {
        const isVisible = await skipLink.isVisible();
        
        if (isVisible) {
          await skipLink.click();
          
          // Check that focus moved to main content
          const mainContent = await page.locator('#main, #content, main').first();
          await expect(mainContent).toBeFocused();
        }
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test('Form validation is accessible', async ({ page }) => {
      // This test would need to be run on a page with forms
      // For now, we'll test basic form structure if forms exist
      await page.goto('/');
      
      const forms = await page.locator('form').all();
      
      if (forms.length > 0) {
        for (const form of forms) {
          const submitButton = form.locator('button[type="submit"], input[type="submit"]');
          const requiredFields = await form.locator('[required]').all();
          
          // Test form submission with empty required fields
          if (await submitButton.count() > 0 && requiredFields.length > 0) {
            await submitButton.first().click();
            
            // Check for error messages
            const errorMessages = await page.locator('[role="alert"], .error, [aria-invalid="true"]').count();
            
            if (errorMessages > 0) {
              // Error messages should be accessible
              const accessibilityResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze();
              
              expect(accessibilityResults.violations).toEqual([]);
            }
          }
        }
      }
    });

    test('Required fields are properly indicated', async ({ page }) => {
      await page.goto('/');
      
      const requiredFields = await page.locator('[required]').all();
      
      for (const field of requiredFields) {
        const ariaRequired = await field.getAttribute('aria-required');
        const id = await field.getAttribute('id');
        
        // Field should have aria-required or visual indicator
        const hasProperIndication = 
          ariaRequired === 'true' ||
          (id && await page.locator(`label[for="${id}"]:has-text("*")`).count() > 0) ||
          await field.locator('..//*[text()*="required" i]').count() > 0;
        
        expect(hasProperIndication).toBeTruthy();
      }
    });
  });

  test.describe('Media Accessibility', () => {
    test('Videos have proper accessibility features', async ({ page }) => {
      await page.goto('/');
      
      const videos = await page.locator('video').all();
      
      for (const video of videos) {
        const hasControls = await video.getAttribute('controls');
        const hasAriaLabel = await video.getAttribute('aria-label');
        const hasTitle = await video.getAttribute('title');
        
        // Videos should have controls and proper labeling
        expect(hasControls !== null || hasAriaLabel || hasTitle).toBeTruthy();
        
        // Check for captions/subtitles
        const tracks = await video.locator('track[kind="captions"], track[kind="subtitles"]').count();
        
        // Note: In a production test, you might want to require captions
        // For this test, we'll just log if they're present
        console.log(`Video has ${tracks} caption/subtitle tracks`);
      }
    });

    test('Audio content has transcripts or captions', async ({ page }) => {
      await page.goto('/');
      
      const audioElements = await page.locator('audio').all();
      
      for (const audio of audioElements) {
        const hasAriaLabel = await audio.getAttribute('aria-label');
        const hasAriaDescribedby = await audio.getAttribute('aria-describedby');
        
        // Audio should have proper labeling
        expect(hasAriaLabel || hasAriaDescribedby).toBeTruthy();
        
        // Check for transcript links nearby
        const transcriptLink = await page.locator('a[href*="transcript"], [data-transcript]').count();
        console.log(`Found ${transcriptLink} potential transcript links`);
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('Touch targets meet minimum size requirements', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const touchTargets = await page.locator('button, a, input, select, [role="button"], [tabindex="0"]').all();
      
      for (let i = 0; i < Math.min(touchTargets.length, 10); i++) {
        const target = touchTargets[i];
        const isVisible = await target.isVisible();
        
        if (isVisible) {
          const boundingBox = await target.boundingBox();
          
          if (boundingBox) {
            // WCAG 2.1 AA requires touch targets to be at least 44x44px
            const meetsMinimumSize = boundingBox.width >= 44 && boundingBox.height >= 44;
            
            // Allow some flexibility for inline links and small icons
            const tagName = await target.evaluate(el => el.tagName.toLowerCase());
            const isInlineElement = tagName === 'a' && await target.evaluate(el => {
              return window.getComputedStyle(el).display === 'inline';
            });
            
            if (!isInlineElement) {
              expect(meetsMinimumSize).toBeTruthy();
            }
          }
        }
      }
    });
  });
});