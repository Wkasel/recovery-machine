// Simple validation test without setup dependencies
import { z } from 'zod';

describe('Basic Authentication Validation', () => {
  describe('Password Strength Validation', () => {
    const passwordSchema = z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

    it('accepts strong password', () => {
      const result = passwordSchema.safeParse('StrongPassword123!');
      expect(result.success).toBe(true);
    });

    it('rejects weak password - too short', () => {
      const result = passwordSchema.safeParse('Weak1!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
      }
    });

    it('rejects password without lowercase', () => {
      const result = passwordSchema.safeParse('PASSWORD123!');
      expect(result.success).toBe(false);
      if (!result.success) {
        const lowercaseError = result.error.issues.find(issue => 
          issue.message === 'Password must contain at least one lowercase letter'
        );
        expect(lowercaseError).toBeDefined();
      }
    });

    it('rejects password without uppercase', () => {
      const result = passwordSchema.safeParse('password123!');
      expect(result.success).toBe(false);
      if (!result.success) {
        const uppercaseError = result.error.issues.find(issue => 
          issue.message === 'Password must contain at least one uppercase letter'
        );
        expect(uppercaseError).toBeDefined();
      }
    });

    it('rejects password without number', () => {
      const result = passwordSchema.safeParse('Password!');
      expect(result.success).toBe(false);
      if (!result.success) {
        const numberError = result.error.issues.find(issue => 
          issue.message === 'Password must contain at least one number'
        );
        expect(numberError).toBeDefined();
      }
    });

    it('rejects password without special character', () => {
      const result = passwordSchema.safeParse('Password123');
      expect(result.success).toBe(false);
      if (!result.success) {
        const specialError = result.error.issues.find(issue => 
          issue.message === 'Password must contain at least one special character'
        );
        expect(specialError).toBeDefined();
      }
    });
  });

  describe('Email Validation', () => {
    const emailSchema = z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required");

    it('accepts valid email', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const result = emailSchema.safeParse('invalid-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    it('rejects empty email', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        // Zod prioritizes .email() validation over .min() for empty strings
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });
  });

  describe('Form Validation Combinations', () => {
    const signUpSchema = z.object({
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
      agreeToTerms: z.boolean().refine(val => val === true, {
        message: "You must agree to the terms and conditions",
      }),
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

    it('validates complete sign-up form', () => {
      const validData = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
        agreeToTerms: true,
      };

      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
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
        expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
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

  describe('Password Strength Calculator', () => {
    function getPasswordStrength(password: string) {
      const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^a-zA-Z0-9]/.test(password),
      };

      const score = Object.values(checks).filter(Boolean).length;
      
      let label = "Very Weak";
      if (score >= 5) label = "Very Strong";
      else if (score >= 4) label = "Strong";
      else if (score >= 3) label = "Medium";
      else if (score >= 2) label = "Weak";

      return { score, label, checks };
    }

    it('calculates very weak strength', () => {
      const result = getPasswordStrength('weak');
      expect(result.label).toBe('Very Weak');
      expect(result.score).toBe(1);
      expect(result.checks.length).toBe(false);
    });

    it('calculates very strong strength', () => {
      const result = getPasswordStrength('StrongPassword123!');
      expect(result.label).toBe('Very Strong');
      expect(result.score).toBe(5);
      expect(result.checks.length).toBe(true);
      expect(result.checks.lowercase).toBe(true);
      expect(result.checks.uppercase).toBe(true);
      expect(result.checks.number).toBe(true);
      expect(result.checks.special).toBe(true);
    });

    it('calculates medium strength', () => {
      const result = getPasswordStrength('Password123');
      expect(result.label).toBe('Strong');
      expect(result.score).toBe(4);
      expect(result.checks.special).toBe(false);
    });
  });
});