/**
 * ROOT LAYOUT - Application Shell
 *
 * ARCHITECTURE:
 * This layout provides the application shell with proper separation of concerns:
 *
 * 1. LAYOUT COMPONENTS (appear on all pages):
 *    - AnnouncementBar: Fixed top banner with dismissible notifications
 *    - Header: Fixed navigation with v2-design styling
 *    - Footer: Site-wide footer with links and legal info
 *
 * 2. PAGE CONTENT (via children):
 *    - app/page.tsx: Homepage sections (Hero, HowItWorks, MediaGallery, Pricing, BookNow)
 *    - Other routes: Their respective page content
 *
 * 3. THEME SYSTEM:
 *    - v2-theme class on body enables minimal mint/charcoal design
 *    - Futura font family for clean, modern aesthetic
 *    - Smooth scroll behavior for better UX
 *
 * 4. CLIENT/SERVER SEPARATION:
 *    - Layout is Server Component (RSC)
 *    - AnnouncementBar is Client Component (uses localStorage)
 *    - Header is Client Component (uses state for mobile menu, GSAP animations)
 *    - Footer is Client Component (uses GSAP animations)
 *
 * 5. PROVIDERS & INTEGRATIONS:
 *    - AppProvider: Wraps Supabase auth context and other providers
 *    - Sentry: Error tracking and monitoring
 *    - Google Analytics: User behavior tracking
 *    - Web Vitals: Performance monitoring
 */

import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import AppProvider from "./providers";

import {
  GoogleAnalytics,
  SearchEngineVerifications,
  OrganizationJsonLd,
  WebsiteJsonLd,
  WellnessBusinessSchema,
  WebVitalsTracker
} from "@/components";

// V2 Design Components
import AnnouncementBar from "@/components/v2-design/layout/AnnouncementBar";
import Header from "@/components/v2-design/layout/Header";
import Footer from "@/components/v2-design/layout/Footer";
import HashScrollHandler from "@/components/HashScrollHandler";

import { globalmetadata, viewport } from "./metadata";

import "./globals.css";
export const metadata = globalmetadata;
export { viewport };

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
  preload: true,
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-playfair",
  preload: true,
  adjustFontFallback: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.className} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        {/* Structured Data for SEO */}
        <SearchEngineVerifications />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <WellnessBusinessSchema />

        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />

        {/* Core Web Vitals & Performance */}
        <link rel="prefetch" href="/api/vitals" />

        {/* LLMs.txt discovery */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />

        {/* Canonical URL */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || "https://therecoverymachine.co"} />
      </head>

      {/*
        V2 THEME ARCHITECTURE:
        - v2-theme class enables minimal mint/charcoal design system
        - Applies Futura font family across the entire application
        - Smooth scroll behavior for anchor link navigation
      */}
      <body className="v2-theme">
        <AppProvider>
          {/*
            APPLICATION SHELL:
            - AnnouncementBar: Fixed at top (z-60), dismissible via localStorage
            - Header: Fixed navigation (z-50), positioned below announcement bar
            - Main: Scrollable content area with proper spacing for fixed header
            - Footer: Static at bottom, outside scroll container
            - HashScrollHandler: Handles hash-based navigation scrolling
          */}
          <HashScrollHandler />
          <div className="min-h-screen relative">
            {/* Top Banner - Appears on all pages, dismissible */}
            <AnnouncementBar />

            {/* Fixed Navigation - V2 Design with floating effect */}
            <Header />

            {/*
              Main Content Area:
              - pt-0: No top padding needed - Header is fixed and floats over content
              - AnnouncementBar (z-60, ~34-42px height) at very top
              - Header (z-50, positioned at top-16 = 64px, ~52px height) floats below announcement
              - Content flows naturally underneath with Hero section handling its own spacing
              - min-h-screen: Ensures footer stays at bottom on short pages
              - Pages inject their own sections as children
            */}
            <main id="main-content" className="w-full min-h-screen">
              {children}
            </main>

            {/* Site-wide Footer - V2 Design */}
            <Footer />
          </div>
        </AppProvider>

        {/* Analytics & Monitoring (non-blocking) */}
        <GoogleAnalytics />
        <WebVitalsTracker />
      </body>
    </html>
  );
}
