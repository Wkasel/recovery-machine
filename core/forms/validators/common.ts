import { z } from "zod";

/**
 * Common form field validators
 */

export const emailValidator = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

export const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const nameValidator = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s-']+$/, "Name can only contain letters, spaces, hyphens and apostrophes");

export const phoneValidator = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number in E.164 format");

export const urlValidator = z.string().url("Please enter a valid URL").or(z.literal("")).optional();

export const dateValidator = z.coerce
  .date()
  .min(new Date("1900-01-01"), "Date must be after 1900")
  .max(new Date(), "Date cannot be in the future");

/**
 * Common form schemas
 */

export const profileSchema = z.object({
  fullName: nameValidator,
  email: emailValidator,
  phone: phoneValidator.optional(),
  avatarUrl: urlValidator,
});

export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
