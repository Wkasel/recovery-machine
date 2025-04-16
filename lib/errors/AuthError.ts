import { AppError } from "./AppError";
import type { ErrorMetadata } from "@/types/errors";

export class AuthError extends AppError {
  constructor(message: string, cause?: unknown, metadata: Partial<ErrorMetadata> = {}) {
    super(message, "AUTH_ERROR", "high", cause, metadata);
  }

  static invalidCredentials(cause?: unknown): AuthError {
    return new AuthError("Invalid credentials provided", cause, {
      subType: "invalid_credentials",
    });
  }

  static sessionExpired(cause?: unknown): AuthError {
    return new AuthError("Your session has expired. Please sign in again.", cause, {
      subType: "session_expired",
    });
  }

  static unauthorized(cause?: unknown): AuthError {
    return new AuthError("You are not authorized to perform this action", cause, {
      subType: "unauthorized",
    });
  }

  static emailNotVerified(cause?: unknown): AuthError {
    return new AuthError("Please verify your email address to continue", cause, {
      subType: "email_not_verified",
    });
  }

  override toUserMessage(): string {
    switch (this.metadata.subType) {
      case "invalid_credentials":
        return "The email or password you entered is incorrect";
      case "session_expired":
        return "Your session has expired. Please sign in again";
      case "unauthorized":
        return "You don't have permission to perform this action";
      case "email_not_verified":
        return "Please check your email and verify your account to continue";
      default:
        return this.message;
    }
  }
}
