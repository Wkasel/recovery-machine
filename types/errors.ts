export type ErrorCode =
  | "AUTH_ERROR"
  | "API_ERROR"
  | "DATABASE_ERROR"
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export interface ErrorMetadata {
  code: ErrorCode;
  severity: ErrorSeverity;
  timestamp: string;
  requestId?: string;
  userId?: string;
  path?: string;
  [key: string]: unknown;
}

export interface SerializedError {
  message: string;
  code: ErrorCode;
  severity: ErrorSeverity;
  stack?: string;
  cause?: unknown;
  metadata?: Record<string, unknown>;
}
