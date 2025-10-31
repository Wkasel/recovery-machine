import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import AppProvider from "./providers";

import {
  GoogleAnalytics,
  SearchEngineVerifications,
  OrganizationJsonLd,
  WebsiteJsonLd,
  WellnessBusinessSchema,
  Footer,
  Header,
  WebVitalsTracker
} from "@/components";
import { Analytics } from "@vercel/analytics/react";

import { globalmetadata, viewport } from "./metadata";

import "./globals.css";
export const metadata = globalmetadata;
export { viewport };

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.className} ${playfair.variable}`} suppressHydrationWarning>
      <head>
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
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || "https://therecoverymachine.com"} />
      </head>
      <body>
        <AppProvider>
          <div className="min-h-screen relative">
            <Header />
            <main id="main-content" className="w-full">
              {children}
            </main>
            <Footer />
          </div>
        </AppProvider>
        {/* <Analytics /> */}
        <GoogleAnalytics />
        <WebVitalsTracker />
      </body>
    </html>
  );
}
