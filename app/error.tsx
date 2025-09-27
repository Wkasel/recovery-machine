"use client";

import { useSentry } from "@/lib/hooks/use-sentry";
import { useEffect } from "react";

export default function Error({
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
        url: window.location.href,
      },
      tags: {
        errorType: "client_error",
        component: "error_boundary",
      },
    });

    // Add a breadcrumb for context
    addBreadcrumb({
      category: "error_boundary",
      message: "Client error occurred",
      data: {
        errorMessage: error.message,
        errorStack: error.stack,
      },
      level: "error",
    });
  }, [error, captureException, addBreadcrumb]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
      {process.env.NODE_ENV === "development" && (
        <pre className="text-sm bg-red-50 p-4 rounded mb-4 overflow-auto max-w-full">
          {error.message}
        </pre>
      )}
      <button
        onClick={reset}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
