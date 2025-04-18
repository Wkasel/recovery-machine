import { baseAuthSchemas } from "@/core/schemas/shared/auth";
import { z } from "zod";

/**
 * Server-side auth schemas
 * These extend the base schemas with server-specific validation rules
 */
export const serverAuthSchemas = {
  /**
   * Email-password authentication
   */
  emailPassword: {
    signIn: z.object({
      email: baseAuthSchemas.email,
      password: baseAuthSchemas.password,
    }),
    signUp: z.object({
      email: baseAuthSchemas.email,
      password: baseAuthSchemas.password,
    }),
    resetPassword: z.object({
      email: baseAuthSchemas.email,
    }),
    updatePassword: z.object({
      password: baseAuthSchemas.password,
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
      email: baseAuthSchemas.email,
      token: baseAuthSchemas.token,
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
      phone: baseAuthSchemas.phone,
      token: baseAuthSchemas.token,
    }),
    signUp: z.object({
      phone: baseAuthSchemas.phone,
      fullName: baseAuthSchemas.fullName,
    }),
  },

  /**
   * Google One Tap authentication
   */
  googleOneTap: {
    signIn: z.object({
      credential: z.string(),
      nonce: z.string(),
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
    updateEmail: z.object({
      email: baseAuthSchemas.email,
    }),
    updatePassword: z.object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: baseAuthSchemas.password,
    }),
  },
} as const;

// Export types for use in server actions
export type EmailPasswordSignIn = z.infer<typeof serverAuthSchemas.emailPassword.signIn>;
export type EmailPasswordSignUp = z.infer<typeof serverAuthSchemas.emailPassword.signUp>;
export type MagicLinkSend = z.infer<typeof serverAuthSchemas.magicLink.send>;
export type PhoneSignUp = z.infer<typeof serverAuthSchemas.phone.signUp>;
export type ProfileUpdate = z.infer<typeof serverAuthSchemas.profile.update>;
export type GoogleOneTapSignIn = z.infer<typeof serverAuthSchemas.googleOneTap.signIn>;
