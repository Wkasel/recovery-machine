import { ZodError } from "zod";
import { AppError } from "../base/AppError";
import type { IErrorMetadata } from "../types";

export class ValidationError extends AppError {
  constructor(message: string, cause?: unknown, metadata: Partial<IErrorMetadata> = {}) {
    super(message, "VALIDATION_ERROR", "low", cause, metadata);
  }

  static fromZodError(error: ZodError): ValidationError {
    const issues = error.errors.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return new ValidationError("Validation failed", error, {
      subType: "zod_error",
      details: JSON.stringify(issues),
    });
  }

  static invalidInput(field: string, reason: string): ValidationError {
    return new ValidationError(`Invalid ${field}: ${reason}`, null, {
      subType: "invalid_input",
      details: field,
    });
  }

  static missingField(field: string): ValidationError {
    return new ValidationError(`Missing required field: ${field}`, null, {
      subType: "missing_field",
      details: field,
    });
  }

  override toUserMessage(): string {
    switch (this.metadata.subType) {
      case "zod_error":
        try {
          const issues = JSON.parse(this.metadata.details || "[]");
          return issues.map((i: { path: string; message: string }) => i.message).join(", ");
        } catch {
          return "Invalid input provided";
        }
      case "invalid_input":
        return this.message;
      case "missing_field":
        return this.message;
      default:
        return "Please check your input and try again";
    }
  }
}
