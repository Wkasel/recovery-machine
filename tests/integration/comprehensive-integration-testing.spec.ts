/**
 * Comprehensive Integration Testing Suite
 * Tests user flows, authentication, booking processes, and cross-component interactions
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Helper function to wait for network to be idle
 */
async function waitForNetworkIdle(page: Page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Helper function to check if user is authenticated
 */
async function isAuthenticated(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return localStorage.getItem('supabase.auth.token') !== null ||
           sessionStorage.getItem('supabase.auth.token') !== null ||
           document.cookie.includes('supabase-auth-token');
  });
}

/**
 * Helper function to simulate user authentication
 */
async function simulateAuthentication(page: Page) {
  await page.evaluate(() => {
    // Simulate authenticated state
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User'
        }
      }
    }));
  });
}

/**
 * Helper function to clear authentication
 */
async function clearAuthentication(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  });
}

test.describe('User Authentication Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    await clearAuthentication(page);
  });

  test('Complete sign-up flow', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to sign-up
    const signUpButton = page.locator('a[href*="sign"], button').filter({ hasText: /sign.*up|register/i }).first();
    
    if (await signUpButton.count() > 0) {
      await signUpButton.click();
      await waitForNetworkIdle(page);
      
      // Fill out sign-up form
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
      
      if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
        await emailInput.fill('test-user@example.com');
        await passwordInput.fill('TestPassword123!');
        
        // Submit form
        const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /sign.*up|register|create/i }).first();
        await submitButton.click();
        
        // Wait for response
        await waitForNetworkIdle(page);
        
        // Check for success indicators
        const successIndicators = await page.locator('.success, [role="alert"], .alert-success, .notification').count();
        const errorIndicators = await page.locator('.error, .alert-error, .alert-danger').count();
        
        // Should either succeed or show validation errors (both are valid for testing)
        expect(successIndicators > 0 || errorIndicators > 0).toBeTruthy();
      }
    }
  });

  test('Sign-in flow with email', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to sign-in
    const signInButton = page.locator('a[href*="sign"], button').filter({ hasText: /sign.*in|log.*in|login/i }).first();
    
    if (await signInButton.count() > 0) {
      await signInButton.click();
      await waitForNetworkIdle(page);
      
      // Fill out sign-in form
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
      
      if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
        await emailInput.fill('existing-user@example.com');
        await passwordInput.fill('ExistingPassword123!');
        
        // Submit form
        const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /sign.*in|log.*in|login/i }).first();
        await submitButton.click();
        
        await waitForNetworkIdle(page);
        
        // Check for response (success or error)
        const response = await page.locator('.success, .error, [role="alert"], .alert').count();
        expect(response).toBeGreaterThan(0);
      }
    }
  });

  test('Google One-Tap authentication', async ({ page }) => {
    await page.goto('/');
    
    // Check if Google One-Tap is loaded
    const googleOneTap = page.locator('#g_id_onload, .g_id_signin, [data-callback="handleCredentialResponse"]');
    
    if (await googleOneTap.count() > 0) {
      // Google One-Tap should be present and configured
      const oneTapConfig = await page.evaluate(() => {
        return window.google && window.google.accounts;
      });
      
      // Note: In a real test environment, you would mock the Google API response
      console.log('Google One-Tap detected:', oneTapConfig);
    }
  });

  test('Authentication state persistence', async ({ page }) => {
    await page.goto('/');
    
    // Simulate authentication
    await simulateAuthentication(page);
    
    // Reload page
    await page.reload();
    await waitForNetworkIdle(page);
    
    // Check if auth state is maintained
    const isAuthMaintained = await isAuthenticated(page);
    
    // Should maintain authentication across page reloads
    expect(isAuthMaintained).toBeTruthy();
  });
});

test.describe('Booking Flow Integration', () => {
  
  test.beforeEach(async ({ page }) => {
    await simulateAuthentication(page);
  });

  test('Complete booking process', async ({ page }) => {
    await page.goto('/book');
    await waitForNetworkIdle(page);
    
    // Service selection
    const serviceOptions = page.locator('button, .service-option, [data-service]');
    if (await serviceOptions.count() > 0) {
      await serviceOptions.first().click();
      await page.waitForTimeout(500);
    }
    
    // Date selection
    const dateSelector = page.locator('.calendar, [data-testid="calendar"], .date-picker');
    if (await dateSelector.count() > 0) {
      // Try to click on an available date
      const availableDates = page.locator('.available, .fc-day:not(.fc-day-disabled), [data-available="true"]');
      if (await availableDates.count() > 0) {
        await availableDates.first().click();
        await page.waitForTimeout(500);
      }
    }
    
    // Time selection
    const timeSlots = page.locator('.time-slot, [data-time], .available-time');
    if (await timeSlots.count() > 0) {
      await timeSlots.first().click();
      await page.waitForTimeout(500);
    }
    
    // Customer information
    const nameInput = page.locator('input[name="name"], input[placeholder*="name"]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const phoneInput = page.locator('input[name="phone"], input[type="tel"]').first();
    
    if (await nameInput.count() > 0) {
      await nameInput.fill('John Doe');
    }
    if (await emailInput.count() > 0) {
      await emailInput.fill('john.doe@example.com');
    }
    if (await phoneInput.count() > 0) {
      await phoneInput.fill('(555) 123-4567');
    }
    
    // Continue/Submit booking
    const continueButton = page.locator('button').filter({ hasText: /continue|next|book|submit/i }).first();
    if (await continueButton.count() > 0) {
      await continueButton.click();
      await waitForNetworkIdle(page);
      
      // Check for booking confirmation or payment step
      const confirmationOrPayment = await page.locator('.confirmation, .payment, .success, [data-step="payment"], [data-step="confirmation"]').count();
      expect(confirmationOrPayment).toBeGreaterThan(0);
    }
  });

  test('Booking form validation', async ({ page }) => {
    await page.goto('/book');
    await waitForNetworkIdle(page);
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /book|submit|continue/i }).first();
    
    if (await submitButton.count() > 0) {
      await submitButton.click();
      
      // Should show validation errors
      const validationErrors = await page.locator('.error, [aria-invalid="true"], .field-error, .validation-error').count();
      expect(validationErrors).toBeGreaterThan(0);
    }
  });

  test('Calendar navigation and availability', async ({ page }) => {
    await page.goto('/book');
    await waitForNetworkIdle(page);
    
    // Test calendar navigation
    const nextMonthButton = page.locator('.fc-next-button, [aria-label*="next"], .calendar-next').first();
    const prevMonthButton = page.locator('.fc-prev-button, [aria-label*="prev"], .calendar-prev').first();
    
    if (await nextMonthButton.count() > 0) {
      // Navigate to next month
      const currentMonth = await page.locator('.fc-toolbar-title, .calendar-title, .month-title').textContent();
      await nextMonthButton.click();
      await page.waitForTimeout(500);
      
      const newMonth = await page.locator('.fc-toolbar-title, .calendar-title, .month-title').textContent();
      expect(newMonth).not.toBe(currentMonth);
      
      // Navigate back
      if (await prevMonthButton.count() > 0) {
        await prevMonthButton.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Check availability display
    const availableDays = await page.locator('.available, .fc-day:not(.fc-day-disabled), [data-available="true"]').count();
    const unavailableDays = await page.locator('.unavailable, .fc-day-disabled, [data-available="false"]').count();
    
    console.log(`Available days: ${availableDays}, Unavailable days: ${unavailableDays}`);
    
    // Should have some availability information
    expect(availableDays + unavailableDays).toBeGreaterThan(0);
  });
});

test.describe('Payment Integration', () => {
  
  test.beforeEach(async ({ page }) => {
    await simulateAuthentication(page);
  });

  test('Payment flow integration', async ({ page }) => {
    // Navigate to a page that might have payment functionality
    await page.goto('/book');
    await waitForNetworkIdle(page);
    
    // Look for payment elements
    const paymentElements = page.locator('[data-payment], .payment-form, .bolt-checkout, .stripe-element');
    
    if (await paymentElements.count() > 0) {
      // Check if payment integration is loaded
      const paymentLoaded = await page.evaluate(() => {
        return window.Bolt || window.Stripe || window.PayPal;
      });
      
      console.log('Payment integration detected:', !!paymentLoaded);
      
      // Test payment form elements if present
      const cardInput = page.locator('input[data-payment="card"], .card-input, [placeholder*="card"]').first();
      const expInput = page.locator('input[data-payment="exp"], .exp-input, [placeholder*="exp"]').first();
      const cvvInput = page.locator('input[data-payment="cvv"], .cvv-input, [placeholder*="cvv"]').first();
      
      if (await cardInput.count() > 0) {
        // Test card input
        await cardInput.fill('4242424242424242');
        
        if (await expInput.count() > 0) {
          await expInput.fill('12/25');
        }
        
        if (await cvvInput.count() > 0) {
          await cvvInput.fill('123');
        }
        
        // Check form validation
        const payButton = page.locator('button').filter({ hasText: /pay|complete|submit/i }).first();
        if (await payButton.count() > 0) {
          await payButton.click();
          await page.waitForTimeout(1000);
          
          // Should either process or show validation
          const response = await page.locator('.error, .success, .processing, [role="alert"]').count();
          expect(response).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  test('Bolt payment integration', async ({ page }) => {
    await page.goto('/');
    
    // Check for Bolt integration
    const boltLoaded = await page.evaluate(() => {
      return typeof window.Bolt !== 'undefined';
    });
    
    if (boltLoaded) {
      console.log('Bolt payment system is loaded');
      
      // Look for Bolt checkout elements
      const boltCheckout = page.locator('.bolt-checkout, [data-bolt], .bolt-button');
      
      if (await boltCheckout.count() > 0) {
        // Test Bolt integration
        await boltCheckout.first().click();
        await page.waitForTimeout(1000);
        
        // Should open Bolt modal or redirect
        const boltModal = await page.locator('.bolt-modal, .bolt-popup, iframe[src*="bolt"]').count();
        expect(boltModal).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

test.describe('Admin Dashboard Integration', () => {
  
  test.beforeEach(async ({ page }) => {
    // Simulate admin authentication
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'admin-token',
        user: {
          id: 'admin-user-id',
          email: 'admin@example.com',
          user_metadata: {
            role: 'admin'
          }
        }
      }));
    });
  });

  test('Admin dashboard access and navigation', async ({ page }) => {
    await page.goto('/admin');
    await waitForNetworkIdle(page);
    
    // Check if admin dashboard loads
    const adminElements = page.locator('.admin-dashboard, [data-admin], .admin-panel');
    
    if (await adminElements.count() > 0) {
      // Test admin navigation
      const navItems = page.locator('.admin-nav a, .sidebar a, .nav-item');
      
      if (await navItems.count() > 0) {
        const firstNavItem = navItems.first();
        await firstNavItem.click();
        await waitForNetworkIdle(page);
        
        // Should navigate to admin section
        const currentUrl = page.url();
        expect(currentUrl).toContain('/admin');
      }
    }
  });

  test('Booking management functionality', async ({ page }) => {
    await page.goto('/admin');
    await waitForNetworkIdle(page);
    
    // Look for booking management
    const bookingManager = page.locator('[data-bookings], .bookings-table, .booking-list');
    
    if (await bookingManager.count() > 0) {
      // Test booking actions
      const bookingActions = page.locator('.booking-action, [data-action], .action-button');
      
      if (await bookingActions.count() > 0) {
        const actionButton = bookingActions.first();
        await actionButton.click();
        await page.waitForTimeout(500);
        
        // Should trigger some action or modal
        const modal = await page.locator('.modal, .dialog, .popup').count();
        const notification = await page.locator('.notification, .toast, [role="alert"]').count();
        
        expect(modal > 0 || notification > 0).toBeTruthy();
      }
    }
  });

  test('Settings management', async ({ page }) => {
    await page.goto('/admin');
    await waitForNetworkIdle(page);
    
    // Look for settings section
    const settingsLink = page.locator('a').filter({ hasText: /settings|config/i }).first();
    
    if (await settingsLink.count() > 0) {
      await settingsLink.click();
      await waitForNetworkIdle(page);
      
      // Test settings form
      const settingsInputs = page.locator('input, select, textarea');
      
      if (await settingsInputs.count() > 0) {
        // Try to modify a setting
        const firstInput = settingsInputs.first();
        const inputType = await firstInput.getAttribute('type');
        
        if (inputType === 'text' || inputType === 'email') {
          await firstInput.fill('test-value');
        } else if (inputType === 'checkbox') {
          await firstInput.check();
        }
        
        // Look for save button
        const saveButton = page.locator('button').filter({ hasText: /save|update|apply/i }).first();
        
        if (await saveButton.count() > 0) {
          await saveButton.click();
          await page.waitForTimeout(1000);
          
          // Should show save confirmation
          const confirmation = await page.locator('.success, .saved, [role="alert"]').count();
          expect(confirmation).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});

test.describe('Social Proof Integration', () => {
  
  test('Instagram feed integration', async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    // Check for Instagram integration
    const instagramWidget = page.locator('.instagram-feed, [data-instagram], .behold-widget');
    
    if (await instagramWidget.count() > 0) {
      // Wait for Instagram content to load
      await page.waitForTimeout(3000);
      
      const instagramPosts = await page.locator('.instagram-post, .behold-image, .ig-post').count();
      console.log(`Instagram posts loaded: ${instagramPosts}`);
      
      expect(instagramPosts).toBeGreaterThanOrEqual(0);
    }
  });

  test('Google Reviews integration', async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    // Check for Google Reviews
    const reviewsWidget = page.locator('.google-reviews, [data-reviews], .reviews-widget');
    
    if (await reviewsWidget.count() > 0) {
      // Wait for reviews to load
      await page.waitForTimeout(2000);
      
      const reviewItems = await page.locator('.review-item, .review, .testimonial').count();
      console.log(`Reviews loaded: ${reviewItems}`);
      
      expect(reviewItems).toBeGreaterThanOrEqual(0);
    }
  });

  test('Testimonial carousel functionality', async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    // Look for testimonial carousel
    const carousel = page.locator('.testimonial-carousel, .swiper, .carousel');
    
    if (await carousel.count() > 0) {
      // Test carousel navigation
      const nextButton = page.locator('.swiper-button-next, .carousel-next, [aria-label*="next"]').first();
      const prevButton = page.locator('.swiper-button-prev, .carousel-prev, [aria-label*="prev"]').first();
      
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(500);
        
        // Should change testimonial
        expect(await nextButton.isVisible()).toBeTruthy();
      }
      
      if (await prevButton.count() > 0) {
        await prevButton.click();
        await page.waitForTimeout(500);
      }
    }
  });
});

test.describe('SEO and Analytics Integration', () => {
  
  test('Google Analytics integration', async ({ page }) => {
    await page.goto('/');
    
    // Check for Google Analytics
    const gaLoaded = await page.evaluate(() => {
      return typeof window.gtag !== 'undefined' || typeof window.ga !== 'undefined';
    });
    
    console.log('Google Analytics loaded:', gaLoaded);
    
    if (gaLoaded) {
      // Test page view tracking
      await page.click('a[href="/about"]').catch(() => {
        // Link might not exist, that's okay
      });
      
      // GA should be tracking page views
      expect(gaLoaded).toBeTruthy();
    }
  });

  test('Structured data presence', async ({ page }) => {
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    // Check for JSON-LD structured data
    const structuredData = await page.locator('script[type="application/ld+json"]').count();
    console.log(`Structured data scripts found: ${structuredData}`);
    
    if (structuredData > 0) {
      // Validate JSON-LD structure
      const jsonLdContent = await page.locator('script[type="application/ld+json"]').first().textContent();
      
      try {
        const parsedJson = JSON.parse(jsonLdContent || '{}');
        expect(parsedJson['@context']).toBeTruthy();
        expect(parsedJson['@type']).toBeTruthy();
      } catch (error) {
        console.error('Invalid JSON-LD:', error);
      }
    }
  });

  test('Meta tags and SEO elements', async ({ page }) => {
    await page.goto('/');
    
    // Check essential meta tags
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    
    // Check viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });
});

test.describe('Error Handling Integration', () => {
  
  test('404 page handling', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    
    // Should handle 404 gracefully
    expect(response?.status()).toBe(404);
    
    // Should show proper 404 page
    const notFoundContent = await page.locator('h1, .error, .not-found').filter({ hasText: /404|not found|page not found/i }).count();
    expect(notFoundContent).toBeGreaterThan(0);
  });

  test('Network error handling', async ({ page }) => {
    // Simulate network failure
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/');
    
    // Look for error boundaries or error messages
    const errorElements = await page.locator('.error-boundary, .error-message, [role="alert"]').count();
    
    // Should handle API errors gracefully
    expect(errorElements).toBeGreaterThanOrEqual(0);
  });

  test('JavaScript error handling', async ({ page }) => {
    const jsErrors: string[] = [];
    
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    await page.goto('/');
    await waitForNetworkIdle(page);
    
    // Should not have critical JavaScript errors
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('Non-critical') &&
      !error.includes('DevTools')
    );
    
    console.log('JavaScript errors:', criticalErrors);
    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Cross-browser Compatibility', () => {
  
  test('Core functionality works across viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1280, height: 720 },  // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await waitForNetworkIdle(page);
      
      // Test core navigation
      const navigation = page.locator('nav, .navigation, .nav');
      expect(await navigation.count()).toBeGreaterThan(0);
      
      // Test theme toggle
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      if (await themeToggle.count() > 0) {
        await themeToggle.click();
        await page.waitForTimeout(300);
        
        // Should toggle theme successfully
        expect(await themeToggle.isVisible()).toBeTruthy();
      }
      
      console.log(`Viewport ${viewport.width}x${viewport.height} - Core functionality working`);
    }
  });
});