import type { ErrorSeverity, ErrorType, IErrorMetadata } from "../types";

export interface SerializedError {
  message: string;
  code: ErrorType;
  severity: ErrorSeverity;
  stack?: string;
  cause?: unknown;
  metadata: IErrorMetadata;
}

export class AppError extends Error {
  readonly type: ErrorType;
  readonly severity: ErrorSeverity;
  readonly metadata: IErrorMetadata;
  readonly cause?: unknown;

  constructor(
    message: string,
    type: ErrorType,
    severity: ErrorSeverity,
    cause?: unknown,
    metadata: Partial<IErrorMetadata> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.severity = severity;
    this.cause = cause;
    this.metadata = {
      ...metadata,
      severity: metadata.severity || severity,
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
      code: this.type,
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
    return "An unexpected error occurred. Please try again.";
  }

  /**
   * Determines if the error is retryable
   */
  isRetryable(): boolean {
    return false;
  }

  /**
   * Creates an AppError instance from a caught error
   */
  static from(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }
    if (error instanceof Error) {
      return new AppError(error.message, "APP_ERROR", "medium", error);
    }
    return new AppError(String(error), "APP_ERROR", "medium");
  }
}
