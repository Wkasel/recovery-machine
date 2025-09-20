// @ts-nocheck
"use client";

import { sendToAnalytics } from "@/lib/performance/webVitals";
import Script from "next/script";
import { useEffect } from "react";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export function GoogleAnalytics({
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
}: GoogleAnalyticsProps) {
  useEffect(() => {
    // Load web vitals and send to analytics
    import("web-vitals").then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
      onINP(sendToAnalytics);
    });
  }, []);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              // Enhanced ecommerce for booking tracking
              enhanced_ecommerce: true,
              // Custom dimensions for wellness business
              custom_map: {
                'service_type': 'dimension1',
                'session_duration': 'dimension2',
                'user_location': 'dimension3'
              }
            });

            // Track wellness-specific events
            window.gtag = gtag;
            
            // Track booking interactions
            gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href
            });
          `,
        }}
      />

      {/* Enhanced conversion tracking for wellness business */}
      <Script
        id="enhanced-conversions"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Track wellness-specific conversions
            function trackWellnessEvent(eventName, parameters = {}) {
              gtag('event', eventName, {
                event_category: 'wellness',
                event_label: parameters.service_type || 'general',
                value: parameters.value || 0,
                currency: 'USD',
                ...parameters
              });
            }
            
            // Track booking funnel
            function trackBookingStep(step, service_type = null) {
              gtag('event', 'booking_step', {
                event_category: 'booking_funnel',
                event_label: step,
                service_type: service_type,
                page_location: window.location.href
              });
            }
            
            // Track service interest
            function trackServiceInterest(service_type) {
              gtag('event', 'service_interest', {
                event_category: 'engagement',
                event_label: service_type,
                page_location: window.location.href
              });
            }
            
            // Make functions globally available
            window.trackWellnessEvent = trackWellnessEvent;
            window.trackBookingStep = trackBookingStep;
            window.trackServiceInterest = trackServiceInterest;
          `,
        }}
      />
    </>
  );
}

// Hook for tracking wellness events in components
export function useWellnessTracking() {
  const trackBookingStep = (step: string, serviceType?: string) => {
    if (typeof window !== "undefined" && window.trackBookingStep) {
      window.trackBookingStep(step, serviceType);
    }
  };

  const trackServiceInterest = (serviceType: string) => {
    if (typeof window !== "undefined" && window.trackServiceInterest) {
      window.trackServiceInterest(serviceType);
    }
  };

  const trackWellnessEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== "undefined" && window.trackWellnessEvent) {
      window.trackWellnessEvent(eventName, parameters);
    }
  };

  return {
    trackBookingStep,
    trackServiceInterest,
    trackWellnessEvent,
  };
}

// Declare global types
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    trackWellnessEvent: (eventName: string, parameters?: Record<string, any>) => void;
    trackBookingStep: (step: string, serviceType?: string) => void;
    trackServiceInterest: (serviceType: string) => void;
  }
}
