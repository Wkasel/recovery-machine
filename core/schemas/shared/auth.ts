import { z } from "zod";

/**
 * Core validation schemas for authentication
 * These are the base building blocks used by both client and server validation
 */
export const baseAuthSchemas = {
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .regex(/^\+?[0-9\s\-()]+$/, "Please enter a valid phone number"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(6, "Code must be at least 6 characters"),
  token: z.string().min(6, "Token must be at least 6 characters"),
} as const;

/**
 * Common response types for auth operations
 */
export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Common auth-related types
 */
export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}
