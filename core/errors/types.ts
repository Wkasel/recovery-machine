/**
 * Error metadata interface
 */
export interface IErrorMetadata {
  subType?: string;
  postgresCode?: string;
  details?: string;
  hint?: string;
  message?: string;
  statusCode?: number;
  severity?: ErrorSeverity;
}

/**
 * Postgrest error interface
 */
export interface IPostgrestError {
  code: string;
  details?: string;
  hint?: string;
  message: string;
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
