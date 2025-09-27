"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface ConversionEvent {
  event: string;
  page: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export function ConversionTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views and UTM parameters
  useEffect(() => {
    const trackPageView = () => {
      const conversionData: ConversionEvent = {
        event: "page_view",
        page: pathname,
        source: searchParams.get("utm_source") || undefined,
        medium: searchParams.get("utm_medium") || undefined,
        campaign: searchParams.get("utm_campaign") || undefined,
        content: searchParams.get("utm_content") || undefined,
        term: searchParams.get("utm_term") || undefined,
      };

      // Track with Google Analytics 4
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "page_view", {
          page_title: document.title,
          page_location: window.location.href,
          custom_parameters: {
            landing_page: pathname,
            utm_source: conversionData.source,
            utm_medium: conversionData.medium,
            utm_campaign: conversionData.campaign,
            utm_content: conversionData.content,
            utm_term: conversionData.term,
          },
        });
      }

      // Track with Facebook Pixel
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "PageView", {
          landing_page: pathname,
          utm_source: conversionData.source,
          utm_medium: conversionData.medium,
          utm_campaign: conversionData.campaign,
        });
      }

      // Console log for development
      if (process.env.NODE_ENV === "development") {
        console.log("Conversion tracking:", conversionData);
      }
    };

    trackPageView();
  }, [pathname, searchParams]);

  // Track specific landing page conversions
  useEffect(() => {
    const trackLandingPageSpecificEvents = () => {
      let landingPageType = "";
      
      if (pathname.includes("cold-plunge-la")) {
        landingPageType = "cold_plunge_landing";
      } else if (pathname.includes("infrared-sauna-delivery")) {
        landingPageType = "infrared_sauna_landing";
      } else if (pathname.includes("athletic-recovery")) {
        landingPageType = "athletic_recovery_landing";
      } else if (pathname.includes("corporate-wellness")) {
        landingPageType = "corporate_wellness_landing";
      }

      if (landingPageType && typeof window !== "undefined") {
        // Google Analytics custom event
        if (window.gtag) {
          window.gtag("event", "landing_page_visit", {
            event_category: "conversion",
            event_label: landingPageType,
            custom_parameters: {
              source: searchParams.get("utm_source"),
              medium: searchParams.get("utm_medium"),
              campaign: searchParams.get("utm_campaign"),
            },
          });
        }

        // Facebook Pixel custom event
        if (window.fbq) {
          window.fbq("trackCustom", "LandingPageVisit", {
            landing_type: landingPageType,
            utm_source: searchParams.get("utm_source"),
            utm_medium: searchParams.get("utm_medium"),
            utm_campaign: searchParams.get("utm_campaign"),
          });
        }
      }
    };

    trackLandingPageSpecificEvents();
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}

// Helper function to track conversion events from components
export const trackConversion = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window === "undefined") return;

  const conversionEvent = {
    event: eventName,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    ...eventData,
  };

  // Google Analytics
  if (window.gtag) {
    window.gtag("event", eventName, {
      event_category: "conversion",
      event_label: eventData?.type || "general",
      value: eventData?.value || undefined,
      custom_parameters: eventData,
    });
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq("trackCustom", eventName, eventData);
  }

  // Console log for development
  if (process.env.NODE_ENV === "development") {
    console.log("Conversion event tracked:", conversionEvent);
  }
};

// Specific tracking functions for common conversion events
export const trackBookingClick = (source: string, landingPage: string) => {
  trackConversion("booking_click", {
    type: "cta_click",
    source,
    landing_page: landingPage,
    button_type: "primary_cta",
  });
};

export const trackPricingView = (landingPage: string) => {
  trackConversion("pricing_view", {
    type: "pricing_interest",
    landing_page: landingPage,
  });
};

export const trackContactFormSubmit = (formType: string, landingPage: string) => {
  trackConversion("contact_form_submit", {
    type: "lead_generation",
    form_type: formType,
    landing_page: landingPage,
  });
};

export const trackPhoneClick = (landingPage: string) => {
  trackConversion("phone_click", {
    type: "phone_lead",
    landing_page: landingPage,
  });
};

// Add global type declarations for analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}