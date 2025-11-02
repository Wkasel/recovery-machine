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
    <div className="min-h-screen bg-background text-charcoal flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-amber-50 border-2 border-amber-200 rounded-lg flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Something went wrong</h1>
          <p className="text-xl text-charcoal-light mb-8 font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            We encountered an unexpected error. Please try again.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 bg-charcoal text-white px-6 py-3 rounded-full hover:bg-charcoal/90 transition-all hover:scale-105 font-medium"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-mint-accent/20 border-2 border-mint-accent text-charcoal px-6 py-3 rounded-full hover:bg-mint-accent/30 transition-all hover:scale-105 font-medium"
              style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-amber-50/50 border-2 border-amber-200/50 rounded-lg text-left backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2 text-center text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Error Details (Development)</h3>
            <pre className="text-sm text-amber-800 overflow-auto font-mono font-light">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-charcoal-light mt-2" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="mt-8">
          <p className="text-sm text-charcoal-light font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            If this problem persists, contact us on{" "}
            <a
              href="https://www.instagram.com/therecoverymachine_/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal font-medium hover:text-mint transition-colors hover:underline"
            >
              Instagram
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
