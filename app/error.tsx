"use client";
import { Logger } from "@/lib/logger/Logger";
import { AppError } from "@/lib/errors/AppError";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  // Log the error using your logger
  Logger.getInstance().error(
    "Server-side rendering error",
    { component: "GlobalErrorBoundary" },
    error instanceof AppError ? error : new AppError(error.message, "UNKNOWN_ERROR", "high", error)
  );

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <div className="max-w-md w-full p-8 bg-card rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-6 text-muted-foreground">
            An unexpected error occurred. Please try again or contact support if the problem
            persists.
          </p>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            onClick={() => reset()}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
