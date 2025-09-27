import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedSignInForm } from '@/components/auth/enhanced/forms/EnhancedSignInForm';
import { EnhancedSignUpForm } from '@/components/auth/enhanced/forms/EnhancedSignUpForm';
import { PasswordStrengthIndicator } from '@/components/auth/enhanced/forms/PasswordStrengthIndicator';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock auth actions
jest.mock('@/core/actions/auth', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  sendMagicLink: jest.fn(),
}));

describe('Enhanced Authentication Components', () => {
  describe('EnhancedSignInForm', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders sign-in form with password and magic link options', () => {
      render(<EnhancedSignInForm />);
      
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByText('Magic Link')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    test('switches between password and magic link authentication methods', async () => {
      const user = userEvent.setup();
      render(<EnhancedSignInForm />);
      
      // Initially shows password form
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByText('Sign in')).toBeInTheDocument();
      
      // Switch to magic link
      await user.click(screen.getByText('Magic Link'));
      
      // Should show magic link form
      expect(screen.getByText('Send magic link')).toBeInTheDocument();
      expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
    });

    test('validates email field correctly', async () => {
      const user = userEvent.setup();
      render(<EnhancedSignInForm />);
      
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByText('Sign in');
      
      // Try to submit without email
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      
      // Enter invalid email
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    test('shows password visibility toggle', async () => {
      const user = userEvent.setup();
      render(<EnhancedSignInForm />);
      
      const passwordInput = screen.getByLabelText('Password');
      const toggleButton = screen.getByLabelText('Show password');
      
      // Initially password type
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click toggle
      await user.click(toggleButton);
      
      // Should change to text type
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    });

    test('handles remember me checkbox', async () => {
      const user = userEvent.setup();
      render(<EnhancedSignInForm />);
      
      const rememberMeCheckbox = screen.getByLabelText('Remember me');
      
      expect(rememberMeCheckbox).not.toBeChecked();
      
      await user.click(rememberMeCheckbox);
      
      expect(rememberMeCheckbox).toBeChecked();
    });
  });

  describe('EnhancedSignUpForm', () => {
    test('renders sign-up form with all required fields', () => {
      render(<EnhancedSignUpForm />);
      
      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByLabelText(/I agree to the/)).toBeInTheDocument();
    });

    test('validates password confirmation', async () => {
      const user = userEvent.setup();
      render(<EnhancedSignUpForm />);
      
      const passwordInput = screen.getByLabelText('Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      const submitButton = screen.getByText('Create account');
      
      await user.type(passwordInput, 'Password123!');
      await user.type(confirmPasswordInput, 'DifferentPassword123!');
      
      // Check terms checkbox
      await user.click(screen.getByLabelText(/I agree to the/));
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
      });
    });

    test('requires terms agreement before submission', async () => {
      const user = userEvent.setup();
      render(<EnhancedSignUpForm />);
      
      const submitButton = screen.getByText('Create account');
      
      // Button should be disabled without terms agreement
      expect(submitButton).toBeDisabled();
      
      // Check terms checkbox
      await user.click(screen.getByLabelText(/I agree to the/));
      
      // Button should now be enabled
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('PasswordStrengthIndicator', () => {
    test('shows password strength for weak password', () => {
      render(<PasswordStrengthIndicator password="weak" />);
      
      expect(screen.getByText('Very Weak')).toBeInTheDocument();
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
    });

    test('shows password strength for strong password', () => {
      render(<PasswordStrengthIndicator password="StrongPassword123!" />);
      
      expect(screen.getByText('Very Strong')).toBeInTheDocument();
      
      // All requirements should be met
      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons).toHaveLength(5);
    });

    test('updates strength indicator in real-time', () => {
      const { rerender } = render(<PasswordStrengthIndicator password="" />);
      
      // No indicator for empty password
      expect(screen.queryByText('Password strength')).not.toBeInTheDocument();
      
      // Weak password
      rerender(<PasswordStrengthIndicator password="weak" />);
      expect(screen.getByText('Very Weak')).toBeInTheDocument();
      
      // Strong password
      rerender(<PasswordStrengthIndicator password="StrongPassword123!" />);
      expect(screen.getByText('Very Strong')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('forms have proper ARIA labels and descriptions', () => {
      render(<EnhancedSignInForm />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    });

    test('error messages are properly associated with form fields', async () => {
      const user = userEvent.setup();
      render(<EnhancedSignInForm />);
      
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByText('Sign in');
      
      await user.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByText('Email is required');
        expect(errorMessage).toBeInTheDocument();
        // Error should be associated with input via aria-describedby
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    test('password visibility toggle has proper accessibility', async () => {
      const user = userEvent.setup();
      render(<EnhancedSignInForm />);
      
      const toggleButton = screen.getByLabelText('Show password');
      
      expect(toggleButton).toHaveAttribute('type', 'button');
      expect(toggleButton).toHaveAttribute('tabIndex', '-1');
      
      await user.click(toggleButton);
      
      expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    test('shows loading state during form submission', async () => {
      const user = userEvent.setup();
      
      // Mock a slow sign-in action
      const mockSignIn = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
      jest.doMock('@/core/actions/auth', () => ({
        signIn: mockSignIn,
      }));
      
      render(<EnhancedSignInForm />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Sign in');
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      // Should show loading state
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Rate Limiting', () => {
    test('shows rate limiting message after multiple failed attempts', async () => {
      const user = userEvent.setup();
      
      // Mock failed sign-in attempts
      const mockSignIn = jest.fn(() => Promise.reject(new Error('Invalid credentials')));
      jest.doMock('@/core/actions/auth', () => ({
        signIn: mockSignIn,
      }));
      
      render(<EnhancedSignInForm />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByText('Sign in');
      
      // Simulate multiple failed attempts
      for (let i = 0; i < 6; i++) {
        await user.clear(emailInput);
        await user.clear(passwordInput);
        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);
        
        await waitFor(() => {
          expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
      }
      
      // Should show rate limiting message
      await waitFor(() => {
        expect(screen.getByText(/Too many failed attempts/)).toBeInTheDocument();
      });
    });
  });
});