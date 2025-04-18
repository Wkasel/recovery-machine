import { AppError } from "@/core/errors/base/AppError";

// This class is separated from the server.ts file because
// "use server" files can only export async functions
export class SupabaseServerError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, "API_ERROR", "high", cause);
  }
}

// Re-export createServerSupabaseClient for backward compatibility
// Files that import from this module directly need to be updated to
// import from server.ts instead
export { createServerSupabaseClient } from "./server";
