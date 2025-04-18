import type { User } from "@supabase/supabase-js";

/**
 * Extended user interface with metadata
 */
export interface IUser extends Omit<User, "email"> {
  email: string | null;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    [key: string]: any;
  };
}

/**
 * Common result type for server actions
 */
export interface ServerActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Error metadata interface
 */
export interface IErrorMetadata {
  subType?: string;
  code?: string;
  details?: string;
  hint?: string;
  message?: string;
  postgresCode?: string;
  statusCode?: number;
  severity?: "low" | "medium" | "high" | "critical";
}

/**
 * Postgrest error interface
 */
export interface IPostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

/**
 * Error severity levels
 */
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/**
 * Error types for categorization
 */
export type ErrorType =
  | "AUTH_ERROR"
  | "VALIDATION_ERROR"
  | "API_ERROR"
  | "DATABASE_ERROR"
  | "APP_ERROR";
