// Environment configuration for SEO and analytics
export const seoConfig = {
  // Analytics
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
  bingSiteVerification: process.env.BING_SITE_VERIFICATION,

  // Social Media
  facebookAppId: process.env.FACEBOOK_APP_ID,
  twitterHandle: "@therecoverymachine",

  // Business Information
  businessEmail: process.env.BUSINESS_EMAIL || "hello@therecoverymachine.co",

  // Performance
  enableWebVitals: process.env.ENABLE_WEB_VITALS !== "false",
  enableServiceWorker: process.env.ENABLE_SERVICE_WORKER !== "false",

  // Local SEO
  primaryLocation: {
    city: "Los Angeles",
    state: "CA",
    country: "US",
    coordinates: {
      lat: 34.0522,
      lng: -118.2437,
    },
  },

  serviceAreas: [
    "Los Angeles, CA",
    "Beverly Hills, CA",
    "Santa Monica, CA",
    "West Hollywood, CA",
    "Manhattan Beach, CA",
    "Venice, CA",
    "Malibu, CA",
  ],
};

// Performance budgets for monitoring
export const performanceBudgets = {
  // Core Web Vitals thresholds
  lcp: {
    good: 2500, // Good: <= 2.5s
    poor: 4000, // Poor: > 4.0s
  },
  fid: {
    good: 100, // Good: <= 100ms
    poor: 300, // Poor: > 300ms
  },
  cls: {
    good: 0.1, // Good: <= 0.1
    poor: 0.25, // Poor: > 0.25
  },
  ttfb: {
    good: 600, // Good: <= 600ms
    poor: 1800, // Poor: > 1.8s
  },
  inp: {
    good: 200, // Good: <= 200ms
    poor: 500, // Poor: > 500ms
  },
};

// SEO validation rules
export const seoRules = {
  title: {
    min: 30,
    max: 60,
    required: true,
  },
  description: {
    min: 120,
    max: 160,
    required: true,
  },
  keywords: {
    min: 3,
    max: 10,
    required: false,
  },
  images: {
    altRequired: true,
    maxFileSize: 500 * 1024, // 500KB
    optimizedFormats: ["webp", "avif"],
  },
};
