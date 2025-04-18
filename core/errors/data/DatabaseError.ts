import { AppError } from "../base/AppError";
import type { IErrorMetadata, IPostgrestError } from "../types";

export class DatabaseError extends AppError {
  constructor(message: string, cause?: unknown, metadata: Partial<IErrorMetadata> = {}) {
    super(message, "DATABASE_ERROR", "high", cause, metadata);
  }

  static fromPostgrestError(error: IPostgrestError, defaultMessage?: string): DatabaseError {
    const message = defaultMessage || DatabaseError.getMessageFromCode(error.code);
    return new DatabaseError(message, error, {
      postgresCode: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message,
    });
  }

  private static getMessageFromCode(code: string | null): string {
    switch (code) {
      case "23505": // unique_violation
        return "A record with this information already exists";
      case "23503": // foreign_key_violation
        return "This operation would break data relationships";
      case "23502": // not_null_violation
        return "Required information is missing";
      case "42P01": // undefined_table
        return "The requested data structure does not exist";
      case "42703": // undefined_column
        return "Invalid data field requested";
      default:
        return "A database error occurred";
    }
  }

  static connectionError(cause?: unknown): DatabaseError {
    return new DatabaseError("Unable to connect to the database", cause, {
      subType: "connection_error",
    });
  }

  static queryError(message: string, cause?: unknown): DatabaseError {
    return new DatabaseError(message, cause, { subType: "query_error" });
  }

  static notFound(resource: string): DatabaseError {
    return new DatabaseError(`${resource} not found`, null, {
      subType: "not_found",
    });
  }

  override isRetryable(): boolean {
    return this.metadata.subType === "connection_error";
  }

  override toUserMessage(): string {
    switch (this.metadata.subType) {
      case "connection_error":
        return "Unable to reach the database. Please try again later.";
      case "not_found":
        return this.message;
      default:
        return "An error occurred while accessing the database.";
    }
  }
}
