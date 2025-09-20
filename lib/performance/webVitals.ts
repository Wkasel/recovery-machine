import { Metric } from "web-vitals";

// Web Vitals tracking and optimization
export function sendToAnalytics(metric: Metric) {
  // Send to your analytics service
  if (typeof window !== "undefined") {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag("event", metric.name, {
        custom_parameter_1: metric.value,
        custom_parameter_2: metric.id,
        custom_parameter_3: metric.delta,
      });
    }

    // Vercel Analytics
    if (window.va) {
      window.va("track", "Web Vitals", {
        metric: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
      });
    }

    // Console logging for development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: getVitalRating(metric.name, metric.value),
        delta: metric.delta,
        id: metric.id,
      });
    }
  }
}

// Get performance rating based on thresholds
function getVitalRating(name: string, value: number): "good" | "needs-improvement" | "poor" {
  switch (name) {
    case "CLS":
      if (value <= 0.1) return "good";
      if (value <= 0.25) return "needs-improvement";
      return "poor";
    case "FID":
      if (value <= 100) return "good";
      if (value <= 300) return "needs-improvement";
      return "poor";
    case "LCP":
      if (value <= 2500) return "good";
      if (value <= 4000) return "needs-improvement";
      return "poor";
    case "TTFB":
      if (value <= 800) return "good";
      if (value <= 1800) return "needs-improvement";
      return "poor";
    case "INP":
      if (value <= 200) return "good";
      if (value <= 500) return "needs-improvement";
      return "poor";
    default:
      return "good";
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Mark performance timing
  mark(name: string): void {
    if (typeof window !== "undefined" && window.performance) {
      window.performance.mark(name);
    }
  }

  // Measure performance between marks
  measure(name: string, startMark: string, endMark?: string): number | undefined {
    if (typeof window !== "undefined" && window.performance) {
      try {
        const measure = window.performance.measure(name, startMark, endMark);
        const duration = measure.duration;
        this.metrics.set(name, duration);

        // Log slow operations
        if (duration > 1000) {
          console.warn(`[Performance] Slow operation detected: ${name} took ${duration}ms`);
        }

        return duration;
      } catch (error) {
        console.error("Performance measurement failed:", error);
      }
    }
    return undefined;
  }

  // Get all collected metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear();
    if (typeof window !== "undefined" && window.performance) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
  }
}

// Resource loading optimization
export function preloadCriticalResources() {
  if (typeof window !== "undefined") {
    // Preload critical images
    const criticalImages = [
      "/images/hero-cold-plunge.jpg",
      "/images/infrared-sauna.jpg",
      "/logo.png",
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload critical fonts (if not using next/font)
    const criticalFonts = [
      // Add any custom fonts that aren't handled by next/font
    ];

    criticalFonts.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/woff2";
      link.href = href;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }
}

// Optimize images with lazy loading and responsive sizes
export function optimizeImageLoading() {
  if (typeof window !== "undefined") {
    // Add intersection observer for lazy loading if native loading="lazy" isn't supported
    const images = document.querySelectorAll("img[data-src]");

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach((img) => {
        const image = img as HTMLImageElement;
        image.src = image.dataset.src!;
      });
    }
  }
}

// Declare global types for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    va?: (event: string, data: string, properties?: Record<string, any>) => void;
  }
}
