import { AppError } from "../base/AppError";
import type { IErrorMetadata } from "../types";

export class AuthError extends AppError {
  constructor(message: string, cause?: unknown, metadata: Partial<IErrorMetadata> = {}) {
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

  /**
   * Converts a Supabase error to an AuthError
   */
  static fromSupabaseError(error: Error & { code?: string; status?: number }): AuthError {
    // Common Supabase auth error codes
    switch (error.code) {
      case "auth/invalid-email":
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "invalid_credentials":
        return AuthError.invalidCredentials(error);

      case "auth/email-already-in-use":
        return new AuthError("This email is already in use", error, {
          subType: "email_in_use",
        });

      case "auth/weak-password":
        return new AuthError("Password is too weak", error, {
          subType: "weak_password",
        });

      case "auth/session-expired":
      case "401":
        return AuthError.sessionExpired(error);

      case "email_not_confirmed":
        return AuthError.emailNotVerified(error);

      default:
        // Status-based fallbacks
        if (error.status === 401) {
          return AuthError.unauthorized(error);
        }

        // Generic fallback
        return new AuthError(error.message || "Authentication error occurred", error);
    }
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
      case "email_in_use":
        return "This email is already associated with an account";
      case "weak_password":
        return "Please choose a stronger password";
      default:
        return this.message;
    }
  }
}
