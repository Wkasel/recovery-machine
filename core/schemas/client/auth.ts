import { z } from "zod";

// Phone authentication schemas
const phoneNumber = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number");

const otpToken = z
  .string()
  .length(6, "Verification code must be 6 digits")
  .regex(/^\d{6}$/, "Verification code must contain only numbers");

// Email authentication schemas
const email = z.string().email("Please enter a valid email address");
const password = z.string().min(8, "Password must be at least 8 characters");

export const clientAuthSchemas = {
  // Phone authentication
  phone: {
    sendOtp: z.object({
      phone: phoneNumber,
    }),
    verifyOtp: z.object({
      token: otpToken,
    }),
  },

  // Email authentication
  email: {
    signIn: z.object({
      email,
      password: z.string().min(1, "Password is required"),
    }),
    signUp: z
      .object({
        email,
        password,
        confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      }),
    magicLink: z.object({
      email,
    }),
    resetPassword: z.object({
      email,
    }),
  },
};

// Type exports
export type PhoneSendOtpInput = z.infer<typeof clientAuthSchemas.phone.sendOtp>;
export type PhoneVerifyOtpInput = z.infer<typeof clientAuthSchemas.phone.verifyOtp>;
export type EmailSignInInput = z.infer<typeof clientAuthSchemas.email.signIn>;
export type EmailSignUpInput = z.infer<typeof clientAuthSchemas.email.signUp>;
export type MagicLinkInput = z.infer<typeof clientAuthSchemas.email.magicLink>;
export type ResetPasswordInput = z.infer<typeof clientAuthSchemas.email.resetPassword>;
