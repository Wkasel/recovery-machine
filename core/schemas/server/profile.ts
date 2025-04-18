import { z } from "zod";

// Profile update schema
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  avatar_url: z.string().url("Must be a valid URL").optional(),
});

// Email update schema
export const emailUpdateSchema = z.object({
  email: z.string().email("Must be a valid email address"),
});

// Password update schema
export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

// Export types
export type ProfileUpdateInput = z.input<typeof profileUpdateSchema>;
export type ProfileUpdateOutput = z.output<typeof profileUpdateSchema>;

export type EmailUpdateInput = z.input<typeof emailUpdateSchema>;
export type EmailUpdateOutput = z.output<typeof emailUpdateSchema>;

export type PasswordUpdateInput = z.input<typeof passwordUpdateSchema>;
export type PasswordUpdateOutput = z.output<typeof passwordUpdateSchema>;
