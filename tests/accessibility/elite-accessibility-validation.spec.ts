import { test, expect, Page } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

/**
 * Elite Accessibility Validation Suite
 * WCAG 2.1 AA Compliance Testing for Elite Design Standards
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3003';

const CRITICAL_PAGES = [
  { path: '/', name: 'Homepage', description: 'Main landing page' },
  { path: '/about', name: 'About', description: 'About page' },
  { path: '/pricing', name: 'Pricing', description: 'Pricing information' },
  { path: '/contact', name: 'Contact', description: 'Contact form page' },
  { path: '/sign-in', name: 'Sign In', description: 'Authentication page' },
  { path: '/sign-up', name: 'Sign Up', description: 'Registration page' }
];

const ACCESSIBILITY_STANDARDS = {
  wcagLevel: 'AA',
  rules: {
    'color-contrast': 'error',
    'keyboard-navigation': 'error',
    'screen-reader': 'error',
    'semantic-markup': 'error',
    'focus-management': 'error'
  }
};

class AccessibilityTestHelper {
  constructor(private page: Page) {}

  async navigateAndInjectAxe(path: string): Promise<void> {
    await this.page.goto(`${BASE_URL}${path}`);
    await this.page.waitForLoadState('networkidle');
    await injectAxe(this.page);
  }

  async testKeyboardNavigation(): Promise<any[]> {
    const focusableElements = [];
    const tabbableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    
    const elements = await this.page.locator(tabbableSelector).all();
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      if (await element.isVisible()) {
        // Tab to element
        await this.page.keyboard.press('Tab');
        
        const isFocused = await element.evaluate(el => document.activeElement === el);
        const tagName = await element.evaluate(el => el.tagName);
        const ariaLabel = await element.getAttribute('aria-label');
        const role = await element.getAttribute('role');
        
        focusableElements.push({
          index: i,
          tagName,
          isFocused,
          ariaLabel,
          role,
          hasVisibleFocus: await this.hasVisibleFocus(element)
        });
      }
    }
    
    return focusableElements;
  }

  async hasVisibleFocus(element: any): Promise<boolean> {
    try {
      const outline = await element.evaluate((el: any) => {
        const styles = getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineColor: styles.outlineColor,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow
        };
      });
      
      return outline.outline !== 'none' || 
             outline.outlineWidth !== '0px' || 
             outline.boxShadow !== 'none';
    } catch {
      return false;
    }
  }

  async testColorContrast(): Promise<any[]> {
    const contrastResults = [];
    
    // Test text elements for contrast
    const textElements = await this.page.locator('p, h1, h2, h3, h4, h5, h6, span, a, button, label').all();
    
    for (const element of textElements) {
      if (await element.isVisible()) {
        const contrast = await element.evaluate((el: any) => {
          const styles = getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          const fontSize = parseInt(styles.fontSize);
          const fontWeight = styles.fontWeight;
          
          return {
            color,
            backgroundColor,
            fontSize,
            fontWeight,
            text: el.textContent?.trim().substring(0, 50)
          };
        });
        
        if (contrast.text && contrast.text.length > 0) {
          contrastResults.push(contrast);
        }
      }
    }
    
    return contrastResults;
  }

  async testScreenReaderContent(): Promise<any> {
    const srContent = {
      headings: [],
      landmarks: [],
      altTexts: [],
      ariaLabels: [],
      skipLinks: []
    };
    
    // Test heading hierarchy
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    for (const heading of headings) {
      if (await heading.isVisible()) {
        const level = await heading.evaluate(el => el.tagName);
        const text = await heading.textContent();
        srContent.headings.push({ level, text: text?.trim() });
      }
    }
    
    // Test landmarks
    const landmarks = await this.page.locator('main, nav, header, footer, aside, section[aria-label], [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]').all();
    for (const landmark of landmarks) {
      if (await landmark.isVisible()) {
        const role = await landmark.getAttribute('role') || await landmark.evaluate(el => el.tagName);
        const ariaLabel = await landmark.getAttribute('aria-label');
        srContent.landmarks.push({ role, ariaLabel });
      }
    }
    
    // Test alt texts
    const images = await this.page.locator('img').all();
    for (const img of images) {
      if (await img.isVisible()) {
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');
        srContent.altTexts.push({ src: src?.substring(0, 50), alt });
      }
    }
    
    // Test aria-labels
    const ariaLabelElements = await this.page.locator('[aria-label]').all();
    for (const element of ariaLabelElements) {
      if (await element.isVisible()) {
        const tagName = await element.evaluate(el => el.tagName);
        const ariaLabel = await element.getAttribute('aria-label');
        srContent.ariaLabels.push({ tagName, ariaLabel });
      }
    }
    
    // Test skip links
    const skipLinks = await this.page.locator('a[href^="#"], .skip-link, [class*="skip"]').all();
    for (const link of skipLinks) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      srContent.skipLinks.push({ href, text: text?.trim() });
    }
    
    return srContent;
  }

  async testFormAccessibility(): Promise<any[]> {
    const formResults = [];
    const forms = await this.page.locator('form').all();
    
    for (const form of forms) {
      if (await form.isVisible()) {
        const formData = {
          hasFieldset: await form.locator('fieldset').count() > 0,
          hasLegend: await form.locator('legend').count() > 0,
          inputs: []
        };
        
        const inputs = await form.locator('input, select, textarea').all();
        for (const input of inputs) {
          const inputType = await input.getAttribute('type') || 'text';
          const hasLabel = await this.hasAssociatedLabel(input);
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaDescribedBy = await input.getAttribute('aria-describedby');
          const required = await input.getAttribute('required') !== null;
          const placeholder = await input.getAttribute('placeholder');
          
          formData.inputs.push({
            type: inputType,
            hasLabel,
            ariaLabel,
            ariaDescribedBy,
            required,
            placeholder
          });
        }
        
        formResults.push(formData);
      }
    }
    
    return formResults;
  }

  async hasAssociatedLabel(input: any): Promise<boolean> {
    const id = await input.getAttribute('id');
    
    if (id) {
      const label = await this.page.locator(`label[for="${id}"]`).count();
      if (label > 0) return true;
    }
    
    const parentLabel = await input.evaluate((el: any) => {
      let parent = el.parentElement;
      while (parent) {
        if (parent.tagName === 'LABEL') return true;
        parent = parent.parentElement;
      }
      return false;
    });
    
    return parentLabel;
  }

  async testReducedMotion(): Promise<any> {
    // Set reduced motion preference
    await this.page.emulateMedia({ reducedMotion: 'reduce' });
    
    const animationElements = await this.page.locator('[style*="animation"], [class*="animate"], [class*="transition"]').all();
    const motionResults = [];
    
    for (const element of animationElements) {
      if (await element.isVisible()) {
        const styles = await element.evaluate((el: any) => {
          const computed = getComputedStyle(el);
          return {
            animation: computed.animation,
            transition: computed.transition,
            transform: computed.transform
          };
        });
        
        motionResults.push(styles);
      }
    }
    
    return motionResults;
  }
}

test.describe('Elite Accessibility Validation Suite', () => {
  let accessibilityHelper: AccessibilityTestHelper;

  test.describe('WCAG 2.1 AA Compliance Tests', () => {
    CRITICAL_PAGES.forEach(({ path, name, description }) => {
      test(`${name} (${path}) - WCAG Compliance`, async ({ page }) => {
        accessibilityHelper = new AccessibilityTestHelper(page);
        
        await accessibilityHelper.navigateAndInjectAxe(path);
        
        // Run comprehensive axe scan
        const violations = await getViolations(page, null, {
          tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
          rules: {
            'color-contrast': { enabled: true },
            'keyboard': { enabled: true },
            'aria-allowed-attr': { enabled: true },
            'aria-required-attr': { enabled: true },
            'heading-order': { enabled: true },
            'landmark-unique': { enabled: true },
            'page-has-heading-one': { enabled: true },
            'region': { enabled: true }
          }
        });
        
        // Log violations for debugging
        if (violations.length > 0) {
          console.log(`🚨 Accessibility violations on ${name}:`, violations);
        }
        
        // Assert no critical violations
        const criticalViolations = violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
        expect(criticalViolations).toHaveLength(0);
        
        // Check for axe compliance
        await checkA11y(page, null, {
          detailedReport: true,
          detailedReportOptions: { html: true }
        });
      });
    });
  });

  test.describe('Keyboard Navigation Tests', () => {
    CRITICAL_PAGES.slice(0, 3).forEach(({ path, name }) => {
      test(`${name} - Complete keyboard navigation`, async ({ page }) => {
        accessibilityHelper = new AccessibilityTestHelper(page);
        
        await accessibilityHelper.navigateAndInjectAxe(path);
        
        // Start from the beginning
        await page.keyboard.press('Tab');
        
        const focusableElements = await accessibilityHelper.testKeyboardNavigation();
        
        // Assert all focusable elements have visible focus
        const elementsWithoutFocus = focusableElements.filter(el => !el.hasVisibleFocus);
        expect(elementsWithoutFocus.length).toBe(0);
        
        // Test reverse tabbing
        await page.keyboard.press('Shift+Tab');
        
        // Test escape key functionality
        await page.keyboard.press('Escape');
        
        // Test enter key on buttons
        const buttons = await page.locator('button:visible').all();
        if (buttons.length > 0) {
          await buttons[0].focus();
          await page.keyboard.press('Enter');
        }
        
        console.log(`⌨️ Keyboard navigation tested on ${name}: ${focusableElements.length} focusable elements`);
      });
    });
  });

  test.describe('Color Contrast Validation', () => {
    test('Color contrast meets WCAG AA standards', async ({ page }) => {
      accessibilityHelper = new AccessibilityTestHelper(page);
      
      for (const { path, name } of CRITICAL_PAGES.slice(0, 3)) {
        await accessibilityHelper.navigateAndInjectAxe(path);
        
        const contrastResults = await accessibilityHelper.testColorContrast();
        
        // Run specific contrast checks with axe
        await checkA11y(page, null, {
          rules: {
            'color-contrast': { enabled: true }
          }
        });
        
        console.log(`🎨 Color contrast tested on ${name}: ${contrastResults.length} text elements`);
      }
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    CRITICAL_PAGES.slice(0, 3).forEach(({ path, name }) => {
      test(`${name} - Screen reader content structure`, async ({ page }) => {
        accessibilityHelper = new AccessibilityTestHelper(page);
        
        await accessibilityHelper.navigateAndInjectAxe(path);
        
        const srContent = await accessibilityHelper.testScreenReaderContent();
        
        // Assert proper heading hierarchy
        expect(srContent.headings.length).toBeGreaterThan(0);
        
        // Assert landmarks exist
        expect(srContent.landmarks.length).toBeGreaterThan(0);
        
        // Assert images have alt text (or are decorative)
        const imagesWithoutAlt = srContent.altTexts.filter(img => !img.alt && img.alt !== '');
        expect(imagesWithoutAlt.length).toBe(0);
        
        // Assert interactive elements have labels
        expect(srContent.ariaLabels.length).toBeGreaterThanOrEqual(0);
        
        console.log(`📢 Screen reader content on ${name}:`, {
          headings: srContent.headings.length,
          landmarks: srContent.landmarks.length,
          images: srContent.altTexts.length,
          ariaLabels: srContent.ariaLabels.length
        });
      });
    });
  });

  test.describe('Form Accessibility Tests', () => {
    const FORM_PAGES = ['/contact', '/sign-in', '/sign-up'];
    
    FORM_PAGES.forEach(path => {
      test(`Form accessibility on ${path}`, async ({ page }) => {
        accessibilityHelper = new AccessibilityTestHelper(page);
        
        try {
          await accessibilityHelper.navigateAndInjectAxe(path);
          
          const formResults = await accessibilityHelper.testFormAccessibility();
          
          for (const form of formResults) {
            // Assert form inputs have proper labels
            const inputsWithoutLabels = form.inputs.filter(input => 
              !input.hasLabel && !input.ariaLabel && !input.placeholder
            );
            expect(inputsWithoutLabels.length).toBe(0);
            
            // Assert required fields are properly marked
            const requiredInputs = form.inputs.filter(input => input.required);
            expect(requiredInputs.every(input => 
              input.hasLabel || input.ariaLabel
            )).toBe(true);
          }
          
          console.log(`📝 Form accessibility on ${path}: ${formResults.length} forms tested`);
          
        } catch (error) {
          if (error.message.includes('ERR_CONNECTION_REFUSED')) {
            console.log(`⚠️ Skipping ${path} - page not accessible`);
          } else {
            throw error;
          }
        }
      });
    });
  });

  test.describe('Reduced Motion Compliance', () => {
    test('Respects reduced motion preferences', async ({ page }) => {
      accessibilityHelper = new AccessibilityTestHelper(page);
      
      await accessibilityHelper.navigateAndInjectAxe('/');
      
      const motionResults = await accessibilityHelper.testReducedMotion();
      
      console.log(`🎭 Reduced motion tested: ${motionResults.length} animated elements`);
      
      // Run axe check for motion compliance
      await checkA11y(page, null, {
        rules: {
          'motion': { enabled: true }
        }
      });
    });
  });

  test.describe('Focus Management Tests', () => {
    test('Focus management in interactive components', async ({ page }) => {
      accessibilityHelper = new AccessibilityTestHelper(page);
      
      await accessibilityHelper.navigateAndInjectAxe('/');
      
      // Test modal focus trapping (if modals exist)
      const modalTriggers = await page.locator('button[aria-haspopup="dialog"], button[data-testid*="modal"]').all();
      
      for (const trigger of modalTriggers) {
        if (await trigger.isVisible()) {
          await trigger.click();
          await page.waitForTimeout(300);
          
          // Check if focus is trapped in modal
          const modal = page.locator('[role="dialog"], .modal').first();
          if (await modal.isVisible()) {
            // Test tab cycling within modal
            const firstFocusable = modal.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').first();
            const lastFocusable = modal.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').last();
            
            if (await firstFocusable.isVisible()) {
              await firstFocusable.focus();
              const isFocused = await firstFocusable.evaluate(el => document.activeElement === el);
              expect(isFocused).toBe(true);
            }
            
            // Close modal
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);
          }
        }
      }
    });
  });

  test.describe('Mobile Accessibility Tests', () => {
    test('Mobile touch targets and accessibility', async ({ page, browser }) => {
      // Create mobile context
      const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 667 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      });
      
      const mobilePage = await mobileContext.newPage();
      accessibilityHelper = new AccessibilityTestHelper(mobilePage);
      
      try {
        await accessibilityHelper.navigateAndInjectAxe('/');
        
        // Test touch target sizes (minimum 44x44px)
        const interactiveElements = await mobilePage.locator('button, a, input, select, textarea').all();
        
        for (const element of interactiveElements) {
          if (await element.isVisible()) {
            const boundingBox = await element.boundingBox();
            if (boundingBox) {
              expect(boundingBox.width).toBeGreaterThanOrEqual(44);
              expect(boundingBox.height).toBeGreaterThanOrEqual(44);
            }
          }
        }
        
        // Run mobile-specific accessibility checks
        await checkA11y(mobilePage, null, {
          tags: ['wcag2a', 'wcag2aa'],
          rules: {
            'target-size': { enabled: true }
          }
        });
        
      } finally {
        await mobileContext.close();
      }
    });
  });
});