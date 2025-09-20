import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().min(1, "Name is required").optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional(),
  address: z.string().min(5, "Please enter a complete address").optional(),
});

export const userPreferencesSchema = z.object({
  email_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
  marketing_emails: z.boolean().default(false),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
