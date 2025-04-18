import { baseAuthSchemas } from "@/core/schemas/shared/auth";
import { z } from "zod";

/**
 * Client-side auth schemas
 * These extend the base schemas with client-specific validation rules
 * and UI-focused error messages
 */
export const clientAuthSchemas = {
  /**
   * Email-password authentication
   */
  emailPassword: {
    signIn: z.object({
      email: baseAuthSchemas.email,
      password: baseAuthSchemas.password,
    }),
    signUp: z
      .object({
        email: baseAuthSchemas.email,
        password: baseAuthSchemas.password,
        confirmPassword: baseAuthSchemas.password,
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }),
    resetPassword: z.object({
      email: baseAuthSchemas.email,
    }),
    updatePassword: z
      .object({
        password: baseAuthSchemas.password,
        confirmPassword: baseAuthSchemas.password,
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }),
  },

  /**
   * Magic link authentication
   */
  magicLink: {
    send: z.object({
      email: baseAuthSchemas.email,
    }),
    verify: z.object({
      code: baseAuthSchemas.code,
    }),
  },

  /**
   * Phone authentication
   */
  phone: {
    sendOtp: z.object({
      phone: baseAuthSchemas.phone,
    }),
    verifyOtp: z.object({
      code: baseAuthSchemas.code,
    }),
    signUp: z.object({
      phone: baseAuthSchemas.phone,
      fullName: baseAuthSchemas.fullName,
      acceptTerms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
    }),
  },

  /**
   * User profile
   */
  profile: {
    update: z.object({
      email: baseAuthSchemas.email.optional(),
      fullName: baseAuthSchemas.fullName.optional(),
      username: baseAuthSchemas.username.optional(),
    }),
    updateEmail: z
      .object({
        email: baseAuthSchemas.email,
        confirmEmail: baseAuthSchemas.email,
      })
      .refine((data) => data.email === data.confirmEmail, {
        message: "Email addresses do not match",
        path: ["confirmEmail"],
      }),
    updatePassword: z
      .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: baseAuthSchemas.password,
        confirmPassword: baseAuthSchemas.password,
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }),
  },
} as const;

// Export types for use in forms and components
export type SignInFormValues = z.infer<typeof clientAuthSchemas.emailPassword.signIn>;
export type SignUpFormValues = z.infer<typeof clientAuthSchemas.emailPassword.signUp>;
export type MagicLinkFormValues = z.infer<typeof clientAuthSchemas.magicLink.send>;
export type PhoneSignUpFormValues = z.infer<typeof clientAuthSchemas.phone.signUp>;
export type ProfileUpdateFormValues = z.infer<typeof clientAuthSchemas.profile.update>;
