"use client";

import { initPerformanceOptimizations } from "@/lib/performance/performanceUtils";
import { sendToAnalytics } from "@/lib/performance/webVitals";
import { useEffect } from "react";

export function WebVitalsTracker() {
  useEffect(() => {
    // Initialize performance optimizations
    initPerformanceOptimizations();

    // Load web vitals and track them
    import("web-vitals").then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(sendToAnalytics);
      onFID(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
      onINP(sendToAnalytics);
    });

    // Track custom wellness-specific metrics
    const trackWellnessMetrics = () => {
      // Track booking form interaction
      const bookingButtons = document.querySelectorAll("[data-booking-trigger]");
      bookingButtons.forEach((button) => {
        button.addEventListener("click", () => {
          if (window.gtag) {
            window.gtag("event", "booking_interest", {
              event_category: "wellness_engagement",
              event_label: "booking_button_click",
            });
          }
        });
      });

      // Track service interest
      const serviceCards = document.querySelectorAll("[data-service-type]");
      serviceCards.forEach((card) => {
        card.addEventListener("click", () => {
          const serviceType = card.getAttribute("data-service-type");
          if (window.gtag && serviceType) {
            window.gtag("event", "service_interest", {
              event_category: "wellness_engagement",
              event_label: serviceType,
              service_type: serviceType,
            });
          }
        });
      });

      // Track scroll depth for engagement
      let maxScroll = 0;
      const trackScrollDepth = () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;

          // Track milestone scrolls
          if ([25, 50, 75, 90].includes(scrollPercent)) {
            if (window.gtag) {
              window.gtag("event", "scroll_depth", {
                event_category: "engagement",
                event_label: `${scrollPercent}%`,
                value: scrollPercent,
              });
            }
          }
        }
      };

      window.addEventListener("scroll", trackScrollDepth, { passive: true });
    };

    // Track metrics after page load
    if (document.readyState === "complete") {
      trackWellnessMetrics();
    } else {
      window.addEventListener("load", trackWellnessMetrics);
    }

    // Performance budget alerts
    const checkPerformanceBudget = () => {
      if ("PerformanceObserver" in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();

          entries.forEach((entry) => {
            // Alert if LCP is poor
            if (entry.entryType === "largest-contentful-paint" && entry.startTime > 2500) {
              console.warn(`🚨 Poor LCP detected: ${entry.startTime}ms (target: <2500ms)`);

              // Send alert to analytics
              if (window.gtag) {
                window.gtag("event", "performance_alert", {
                  event_category: "core_web_vitals",
                  event_label: "poor_lcp",
                  value: Math.round(entry.startTime),
                });
              }
            }
          });
        });

        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      }
    };

    checkPerformanceBudget();

    // Cleanup
    return () => {
      window.removeEventListener("load", trackWellnessMetrics);
    };
  }, []);

  return null; // This component doesn't render anything
}

// Hook for manual wellness event tracking
export function useWellnessAnalytics() {
  const trackBookingStep = (step: string, serviceType?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "booking_funnel", {
        event_category: "conversion",
        event_label: step,
        service_type: serviceType,
        custom_parameter_1: step,
        custom_parameter_2: serviceType || "general",
      });
    }
  };

  const trackServiceView = (serviceType: string, location?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "service_view", {
        event_category: "wellness_engagement",
        event_label: serviceType,
        service_type: serviceType,
        location: location || "unknown",
      });
    }
  };

  const trackContactInteraction = (method: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "contact_interaction", {
        event_category: "lead_generation",
        event_label: method,
        contact_method: method,
      });
    }
  };

  const trackPriceCheck = (serviceType: string, priceRange?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "price_interest", {
        event_category: "wellness_engagement",
        event_label: serviceType,
        service_type: serviceType,
        price_range: priceRange || "unknown",
      });
    }
  };

  return {
    trackBookingStep,
    trackServiceView,
    trackContactInteraction,
    trackPriceCheck,
  };
}
