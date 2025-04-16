import { ErrorCode, ErrorMetadata, ErrorSeverity, SerializedError } from "@/types/errors";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly severity: ErrorSeverity;
  readonly metadata: ErrorMetadata;
  readonly cause?: unknown;

  constructor(
    message: string,
    code: ErrorCode = "UNKNOWN_ERROR",
    severity: ErrorSeverity = "medium",
    cause?: unknown,
    metadata: Partial<ErrorMetadata> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.cause = cause;
    this.metadata = {
      code,
      severity,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializes the error for logging or transmission
   */
  serialize(): SerializedError {
    return {
      message: this.message,
      code: this.code,
      severity: this.severity,
      stack: this.stack,
      cause: this.cause,
      metadata: this.metadata,
    };
  }

  /**
   * Creates a user-friendly message that can be shown in the UI
   */
  toUserMessage(): string {
    return this.message;
  }

  /**
   * Determines if the error is retryable
   */
  isRetryable(): boolean {
    return this.code === "NETWORK_ERROR";
  }

  /**
   * Creates an AppError instance from a caught error
   */
  static from(error: unknown, defaultMessage = "An unexpected error occurred"): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message, "UNKNOWN_ERROR", "medium", error);
    }

    return new AppError(
      typeof error === "string" ? error : defaultMessage,
      "UNKNOWN_ERROR",
      "medium",
      error
    );
  }
}
