import { AppError } from "./AppError";
import type { ErrorMetadata } from "@/types/errors";

export class ApiError extends AppError {
  constructor(
    message: string,
    statusCode: number,
    cause?: unknown,
    metadata: Partial<ErrorMetadata> = {}
  ) {
    super(message, "API_ERROR", ApiError.getSeverityFromStatusCode(statusCode), cause, {
      ...metadata,
      statusCode,
    });
  }

  private static getSeverityFromStatusCode(statusCode: number) {
    if (statusCode >= 500) return "high";
    if (statusCode >= 400) return "medium";
    return "low";
  }

  static badRequest(message: string, cause?: unknown): ApiError {
    return new ApiError(message, 400, cause);
  }

  static unauthorized(message = "Unauthorized", cause?: unknown): ApiError {
    return new ApiError(message, 401, cause);
  }

  static forbidden(message = "Forbidden", cause?: unknown): ApiError {
    return new ApiError(message, 403, cause);
  }

  static notFound(message = "Resource not found", cause?: unknown): ApiError {
    return new ApiError(message, 404, cause);
  }

  static methodNotAllowed(message = "Method not allowed", cause?: unknown): ApiError {
    return new ApiError(message, 405, cause);
  }

  static conflict(message: string, cause?: unknown): ApiError {
    return new ApiError(message, 409, cause);
  }

  static tooManyRequests(message = "Too many requests", cause?: unknown): ApiError {
    return new ApiError(message, 429, cause);
  }

  static internal(message = "Internal server error", cause?: unknown): ApiError {
    return new ApiError(message, 500, cause);
  }

  override isRetryable(): boolean {
    const statusCode = this.metadata.statusCode as number;
    return statusCode === 429 || statusCode >= 500;
  }

  override toUserMessage(): string {
    const statusCode = this.metadata.statusCode as number;
    if (statusCode >= 500) {
      return "An unexpected error occurred. Please try again later.";
    }
    return this.message;
  }
}
