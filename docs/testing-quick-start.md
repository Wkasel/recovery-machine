# Testing Quick Start Guide

## Overview

This guide helps you get started with testing the Recovery Machine application quickly. Our testing strategy covers unit tests, E2E tests, accessibility, and performance.

## Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install --with-deps
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI (no watch, coverage included)
npm run test:ci
```

### End-to-End Tests
```bash
# Run all E2E tests headlessly
npm run test:e2e

# Run E2E tests with UI (visual mode)
npm run test:e2e:ui

# Run E2E tests with browser visible
npm run test:e2e:headed

# Run specific test file
npx playwright test tests/e2e/booking-flow.e2e.ts
```

### Accessibility Tests
```bash
# Run accessibility test suite
npm run test:a11y

# Run with specific browser
npx playwright test tests/accessibility --project=chromium
```

### Performance Tests
```bash
# Run performance tests
npx playwright test tests/performance

# Run with slow 3G simulation
npx playwright test tests/performance --project="Mobile Chrome"
```

### All Tests
```bash
# Run complete test suite (CI-ready)
npm run test:all
```

## Writing Tests

### Unit Tests

Create tests in the same directory as your component:

```typescript
// components/booking/BookingForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingForm } from './BookingForm';

describe('BookingForm', () => {
  it('should validate required fields', async () => {
    render(<BookingForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/email is required/i)).toBeVisible();
  });
});
```

### E2E Tests

Create E2E tests in `tests/e2e/`:

```typescript
// tests/e2e/new-feature.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('New Feature', () => {
  test('should complete user journey', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('button', { name: /start/i }).click();
    
    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
```

## Test Data

Use the test factories for consistent test data:

```typescript
import { createTestUser, createTestBooking } from '@/tests/utils/test-factories';

const user = createTestUser();
const booking = createTestBooking({ userId: user.id });
```

## Debugging Tests

### Unit Tests
```bash
# Debug with Jest
npm run test:watch
# Press 'o' to run only tests related to changed files
# Press 'p' to filter by test name pattern
```

### E2E Tests
```bash
# Debug with Playwright UI
npm run test:e2e:ui

# Debug specific test
npx playwright test --debug tests/e2e/booking-flow.e2e.ts
```

## Coverage Reports

After running `npm run test:coverage`, open:
- `coverage/lcov-report/index.html` for detailed HTML report
- `coverage/coverage-summary.json` for JSON summary

### Coverage Thresholds
- **Global**: 80% (statements, branches, functions, lines)
- **Critical paths** (booking, payment): 90%+

## Common Issues

### Flaky Tests
```bash
# Retry failed tests
npx playwright test --retries=3

# Run specific test multiple times
npx playwright test booking-flow.e2e.ts --repeat-each=5
```

### Mock Issues
```bash
# Clear Jest cache
npx jest --clearCache

# Reset all mocks in test
afterEach(() => {
  jest.clearAllMocks();
});
```

### Network Issues
```bash
# Test with network throttling
npx playwright test --project="Mobile Chrome"
```

## CI/CD Integration

Tests automatically run on:
- Push to `main` or `develop` branches
- Pull request creation/updates

### Quality Gates
- ✅ Unit test coverage > 80%
- ✅ All E2E tests pass
- ✅ No accessibility violations
- ✅ Performance budgets met
- ✅ No high-severity security issues

## Test File Organization

```
tests/
├── components/           # Unit tests for components
│   ├── hero.test.tsx
│   └── booking/
├── e2e/                  # End-to-end tests
│   ├── booking-flow.e2e.ts
│   └── payment-flow.e2e.ts
├── accessibility/        # Accessibility tests
│   └── a11y.test.ts
├── performance/          # Performance tests
│   └── web-vitals.test.ts
└── utils/               # Test utilities
    ├── test-factories.ts
    └── setup.ts
```

## Best Practices

### 1. Test Naming
```typescript
// Good: Descriptive and specific
it('should show validation error when email is invalid', () => {});

// Bad: Vague
it('should work', () => {});
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('should update user profile', async () => {
  // Arrange
  const user = createTestUser();
  render(<UserProfile user={user} />);
  
  // Act
  await fireEvent.click(screen.getByRole('button', { name: /edit/i }));
  await fireEvent.change(screen.getByLabelText(/name/i), { 
    target: { value: 'New Name' } 
  });
  
  // Assert
  expect(screen.getByDisplayValue('New Name')).toBeVisible();
});
```

### 3. Use Data Attributes for E2E
```tsx
// Component
<button data-testid="checkout-button">Checkout</button>

// Test
await page.getByTestId('checkout-button').click();
```

### 4. Mock External Dependencies
```typescript
// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}));
```

## Performance Tips

### Faster Unit Tests
```bash
# Run only changed files
npm run test:watch

# Run tests for specific component
npm test -- --testNamePattern="BookingForm"
```

### Faster E2E Tests
```bash
# Run on specific browser only
npx playwright test --project=chromium

# Skip slow tests in development
npx playwright test --grep-invert="@slow"
```

## Getting Help

1. **Check test output**: Read error messages carefully
2. **Use debugging tools**: `--debug`, `--ui`, `--headed` flags
3. **Review documentation**: See full testing strategy in `docs/testing-strategy.md`
4. **Team sync**: Discuss testing patterns in code reviews

## Next Steps

1. Run the test suite: `npm run test:all`
2. Write your first test following the examples above
3. Set up your IDE with Jest and Playwright extensions
4. Review the comprehensive testing strategy documentation