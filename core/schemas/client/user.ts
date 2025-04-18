import { baseAuthSchemas } from "@/core/schemas/shared/auth";
import { z } from "zod";

/**
 * Client-side user schemas
 * These extend the base schemas with client-specific validation rules
 * and UI-focused error messages
 */
export const clientUserSchemas = {
  /**
   * User profile form
   */
  profile: z.object({
    fullName: baseAuthSchemas.fullName,
    email: baseAuthSchemas.email.optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    avatarUrl: z.string().url("Please enter a valid URL").optional().nullable(),
  }),

  /**
   * Change password form
   */
  changePassword: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: baseAuthSchemas.password,
      confirmPassword: baseAuthSchemas.password,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),

  /**
   * Account settings form
   */
  accountSettings: z.object({
    email: baseAuthSchemas.email.optional(),
    language: z
      .enum(["en", "es", "fr", "de", "pt"], {
        errorMap: () => ({ message: "Please select a valid language" }),
      })
      .optional(),
    notificationPreferences: z
      .object({
        email: z.boolean().optional(),
        push: z.boolean().optional(),
        sms: z.boolean().optional(),
      })
      .optional(),
  }),
} as const;

// Export types for use in components
export type ProfileFormValues = z.infer<typeof clientUserSchemas.profile>;
export type ChangePasswordFormValues = z.infer<typeof clientUserSchemas.changePassword>;
export type AccountSettingsFormValues = z.infer<typeof clientUserSchemas.accountSettings>;
