"use client";

// Performance utilities for Core Web Vitals optimization
import { PerformanceMonitor } from "./webVitals";

// Resource loading optimization
export function preloadCriticalResources() {
  if (typeof window === "undefined") return;

  const monitor = PerformanceMonitor.getInstance();
  monitor.mark("preload-start");

  // Preload critical images
  const criticalImages = [
    "/images/hero-recovery-machine.jpg",
    "/images/cold-plunge-mobile.jpg",
    "/images/infrared-sauna-mobile.jpg",
    "/logo.png",
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    link.fetchPriority = "high";
    document.head.appendChild(link);
  });

  // Avoid prefetching non-existent endpoints in dev to prevent 404 noise

  monitor.mark("preload-end");
  monitor.measure("preload-duration", "preload-start", "preload-end");
}

// Intersection Observer for lazy loading
export function setupLazyLoading() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

  const lazyImages = document.querySelectorAll("img[data-src]");
  const lazyBackgrounds = document.querySelectorAll("[data-bg]");

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;

          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }

          if (img.dataset.bg) {
            img.style.backgroundImage = `url(${img.dataset.bg})`;
            img.classList.remove("lazy-bg");
            imageObserver.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.1,
    }
  );

  lazyImages.forEach((img) => imageObserver.observe(img));
  lazyBackgrounds.forEach((el) => imageObserver.observe(el));
}

// Critical rendering path optimization
export function optimizeCriticalPath() {
  if (typeof window === "undefined") return;

  // Defer non-critical CSS
  const deferCSS = (href: string) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = href;
    link.onload = () => {
      link.rel = "stylesheet";
    };
    document.head.appendChild(link);
  };

  // List of non-critical stylesheets
  const nonCriticalCSS = [
    // Add any non-critical CSS files
  ];

  nonCriticalCSS.forEach(deferCSS);

  // Optimize font loading
  const fontPreloads = [
    // Add font preloads if using custom fonts
  ];

  fontPreloads.forEach((font) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.type = "font/woff2";
    link.href = font;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Reduce JavaScript bundle impact
export function optimizeJavaScriptLoading() {
  if (typeof window === "undefined") return;

  // Defer non-critical JavaScript
  const deferScript = (src: string) => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  };

  // Use requestIdleCallback for non-critical tasks
  const scheduleNonCriticalWork = (work: () => void) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(work);
    } else {
      setTimeout(work, 1);
    }
  };

  return { deferScript, scheduleNonCriticalWork };
}

// Performance monitoring for Core Web Vitals
export function monitorCoreWebVitals() {
  if (typeof window === "undefined") return;

  // Track largest contentful paint
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];

    // Track LCP
    if (lastEntry.entryType === "largest-contentful-paint") {
      console.log("LCP:", lastEntry.startTime);

      // Warn if LCP is poor
      if (lastEntry.startTime > 2500) {
        console.warn("Poor LCP detected:", lastEntry.startTime);
      }
    }
  });

  observer.observe({ entryTypes: ["largest-contentful-paint"] });

  // Track cumulative layout shift
  let cumulativeLayoutShift = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as any[]) {
      if (!entry.hadRecentInput) {
        cumulativeLayoutShift += entry.value;
      }
    }

    if (cumulativeLayoutShift > 0.1) {
      console.warn("Poor CLS detected:", cumulativeLayoutShift);
    }
  });

  clsObserver.observe({ entryTypes: ["layout-shift"] });
}

// Image optimization helpers
export function generateSrcSet(src: string, sizes: number[]): string {
  return sizes.map((size) => `${src}?w=${size} ${size}w`).join(", ");
}

export function generateSizes(breakpoints: { [key: string]: string }): string {
  return Object.entries(breakpoints)
    .map(([mediaQuery, size]) => `${mediaQuery} ${size}`)
    .join(", ");
}

// Performance budget monitoring
export function checkPerformanceBudget() {
  if (typeof window === "undefined") return;

  const budget = {
    maxLCP: 2500, // 2.5 seconds
    maxFID: 100, // 100 milliseconds
    maxCLS: 0.1, // 0.1
    maxTTFB: 600, // 600 milliseconds
  };

  // Check against budget and warn if exceeded
  return budget;
}

// Initialize all performance optimizations
export function initPerformanceOptimizations() {
  if (typeof window === "undefined") return;

  preloadCriticalResources();
  setupLazyLoading();
  optimizeCriticalPath();
  monitorCoreWebVitals();

  // Schedule non-critical optimizations
  setTimeout(() => {
    registerServiceWorker();
    optimizeJavaScriptLoading();
  }, 3000);
}
