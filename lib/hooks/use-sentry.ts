import * as Sentry from "@sentry/nextjs";
import { useCallback } from "react";

interface SentryUser {
  id: string;
  email?: string;
  username?: string;
}

interface ErrorWithContext {
  error: Error;
  context?: Record<string, any>;
  tags?: Record<string, string>;
  level?: Sentry.SeverityLevel;
}

export function useSentry() {
  const captureException = useCallback(
    ({ error, context, tags, level = "error" }: ErrorWithContext) => {
      Sentry.withScope((scope) => {
        if (context) {
          scope.setExtras(context);
        }
        if (tags) {
          scope.setTags(tags);
        }
        scope.setLevel(level);
        Sentry.captureException(error);
      });
    },
    []
  );

  const setUser = useCallback((user: SentryUser | null) => {
    if (user) {
      Sentry.setUser(user);
    } else {
      Sentry.setUser(null);
    }
  }, []);

  const addBreadcrumb = useCallback(
    (breadcrumb: {
      category: string;
      message: string;
      data?: Record<string, any>;
      level?: Sentry.SeverityLevel;
    }) => {
      Sentry.addBreadcrumb({
        ...breadcrumb,
        timestamp: Date.now() / 1000,
      });
    },
    []
  );

  const setTag = useCallback((key: string, value: string) => {
    Sentry.setTag(key, value);
  }, []);

  const setContext = useCallback((name: string, context: Record<string, any>) => {
    Sentry.setContext(name, context);
  }, []);

  return {
    captureException,
    setUser,
    addBreadcrumb,
    setTag,
    setContext,
  };
}
