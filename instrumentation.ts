import * as Sentry from "@sentry/nextjs";
import { SupabaseIntegration } from "@supabase/sentry-js-integration";
import { SupabaseClient } from "@supabase/supabase-js";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server-side instrumentation
    Sentry.init({
      dsn: SENTRY_DSN,
      enabled: process.env.NODE_ENV !== "development",
      tracesSampleRate: 1.0,
      integrations: [
        new SupabaseIntegration(SupabaseClient, {
          tracing: true,
          breadcrumbs: true,
          errors: true,
        }),
        // Temporarily disabled due to undefined Undici integration
        // new Sentry.Integrations.Undici({
        //   shouldCreateSpanForRequest: (url) => {
        //     return !url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest`);
        //   },
        // }),
      ],
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge runtime instrumentation
    Sentry.init({
      dsn: SENTRY_DSN,
      enabled: process.env.NODE_ENV !== "development",
      tracesSampleRate: 1.0,
      integrations: [
        new SupabaseIntegration(SupabaseClient, {
          tracing: true,
          breadcrumbs: true,
          errors: true,
        }),
      ],
    });
  }
}

// Export required hooks for Next.js 15
export const onRequestError = Sentry.captureRequestError;
