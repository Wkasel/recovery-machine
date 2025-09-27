"use client";

import { useSentry } from "@/lib/hooks/use-sentry";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { captureException, addBreadcrumb } = useSentry();

  useEffect(() => {
    // Log the error to Sentry
    captureException({
      error,
      context: {
        digest: error.digest,
      },
      tags: {
        errorType: "server_error",
        component: "global_error_boundary",
      },
    });

    // Add a breadcrumb for context
    addBreadcrumb({
      category: "global_error_boundary",
      message: "Server error occurred",
      data: {
        errorMessage: error.message,
        errorStack: error.stack,
      },
      level: "error",
    });
  }, [error, captureException, addBreadcrumb]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong!</h2>
          {process.env.NODE_ENV === "development" && (
            <pre className="text-sm bg-muted p-4 rounded mb-4 overflow-auto max-w-full">
              {error.message}
            </pre>
          )}
          <button
            onClick={reset}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
