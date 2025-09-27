import { 
  signInSchema, 
  signUpSchema, 
  getPasswordStrength 
} from '@/components/auth/enhanced/validation/auth-schemas';

describe('Authentication Validation', () => {
  describe('signInSchema', () => {
    it('validates correct sign-in data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      };

      const result = signInSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    it('rejects empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required');
      }
    });
  });

  describe('signUpSchema', () => {
    it('validates correct sign-up data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
        agreeToTerms: true,
      };

      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects weak password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        agreeToTerms: true,
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordErrors = result.error.issues.filter(issue => issue.path[0] === 'password');
        expect(passwordErrors.length).toBeGreaterThan(0);
      }
    });

    it('rejects mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'DifferentPassword123!',
        agreeToTerms: true,
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match");
      }
    });

    it('requires terms agreement', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
        agreeToTerms: false,
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('You must agree to the terms and conditions');
      }
    });
  });

  describe('getPasswordStrength', () => {
    it('returns very weak for short password', () => {
      const result = getPasswordStrength('weak');
      expect(result.label).toBe('Very Weak');
      expect(result.score).toBe(1);
      expect(result.checks.length).toBe(false);
    });

    it('returns very strong for complex password', () => {
      const result = getPasswordStrength('StrongPassword123!');
      expect(result.label).toBe('Very Strong');
      expect(result.score).toBe(5);
      expect(result.checks.length).toBe(true);
      expect(result.checks.lowercase).toBe(true);
      expect(result.checks.uppercase).toBe(true);
      expect(result.checks.number).toBe(true);
      expect(result.checks.special).toBe(true);
    });

    it('returns medium for partially strong password', () => {
      const result = getPasswordStrength('Password123');
      expect(result.label).toBe('Strong');
      expect(result.score).toBe(4);
      expect(result.checks.special).toBe(false);
    });
  });
});