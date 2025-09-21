// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { SupabaseIntegration } from "@supabase/sentry-js-integration";
import { SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __SENTRY_INITIALIZED__?: boolean;
  }
}

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Prevent multiple Sentry initializations and ensure errors don't break the site
if (typeof window !== 'undefined' && !window.__SENTRY_INITIALIZED__) {
  window.__SENTRY_INITIALIZED__ = true;

  try {
    // Only initialize Sentry if DSN is provided
    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        enabled: process.env.NODE_ENV !== "development",
        
        // Critical: Ensure Sentry errors don't break the app
        beforeSend(event, hint) {
          // If there's an error in Sentry itself, don't send it and don't crash
          try {
            return event;
          } catch (error) {
            console.warn('Sentry beforeSend error:', error);
            return null;
          }
        },

        integrations: [
          // Wrap each integration in try/catch
          (() => {
            try {
              return Sentry.replayIntegration({
                maskAllText: true,
                blockAllMedia: true,
              });
            } catch (error) {
              console.warn('Sentry replay integration error:', error);
              return null;
            }
          })(),
          (() => {
            try {
              return new SupabaseIntegration(SupabaseClient, {
                tracing: true,
                breadcrumbs: true,
                errors: true,
              });
            } catch (error) {
              console.warn('Sentry Supabase integration error:', error);
              return null;
            }
          })(),
          (() => {
            try {
              return Sentry.browserTracingIntegration({
                shouldCreateSpanForRequest: (url) => {
                  return !url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest`);
                },
              });
            } catch (error) {
              console.warn('Sentry browser tracing integration error:', error);
              return null;
            }
          })(),
        ].filter(Boolean), // Remove any null integrations
      });
    }
  } catch (error) {
    // If Sentry completely fails to initialize, log it but don't crash the app
    console.warn('Failed to initialize Sentry, continuing without error tracking:', error);
  }
}
