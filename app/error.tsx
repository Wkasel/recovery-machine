"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console (can be replaced with error reporting service)
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-900/20 border border-red-800 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-xl text-muted-foreground mb-8">
            We encountered an unexpected error. Please try again.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 hover:bg-neutral-200 transition-colors font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-6 py-3 hover:bg-neutral-800 transition-colors font-medium"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-neutral-900 border border-neutral-800 text-left">
            <h3 className="text-lg font-semibold mb-2 text-center">Error Details (Development)</h3>
            <pre className="text-sm text-red-400 overflow-auto">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            If this problem persists, contact us on{" "}
            <a
              href="https://www.instagram.com/therecoverymachine_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              Instagram
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
