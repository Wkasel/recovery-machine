export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "AuthError";
  }

  static fromSupabaseError(error: any): AuthError {
    return new AuthError(error.message || "Authentication error", error.code);
  }
}