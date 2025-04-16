import { Analytics } from "@vercel/analytics/react";
import { type Event } from "@/types/analytics";
import { Logger } from "@/lib/logger/Logger";

export class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public async trackEvent(event: Event) {
    try {
      // Track with Vercel Analytics
      if (typeof window !== "undefined") {
        (window as any).va?.track(event.name, event.properties);
      }

      // Log event for debugging
      if (process.env.NODE_ENV === "development") {
        Logger.getInstance().debug("Analytics event tracked", {
          component: "AnalyticsService",
          event,
        });
      }

      // Here you could add more analytics providers
      // - Google Analytics
      // - Mixpanel
      // - PostHog
      // etc.
    } catch (error) {
      Logger.getInstance().error(
        "Failed to track analytics event",
        { component: "AnalyticsService", event },
        error
      );
    }
  }

  public async trackPageView(url: string) {
    await this.trackEvent({
      name: "page_view",
      properties: { url },
    });
  }

  public async trackError(error: Error, context?: Record<string, unknown>) {
    await this.trackEvent({
      name: "error",
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    });
  }
}

// Analytics Provider Component
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Analytics />
      {children}
    </>
  );
}
