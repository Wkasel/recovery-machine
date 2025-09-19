import { Geist } from "next/font/google";
import AppProvider from "./providers";

import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/nav/Footer";
import { Header } from "@/components/nav/Header";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SearchEngineVerifications } from "@/components/analytics/SearchConsoleVerification";
import { WebVitalsTracker } from "@/components/performance/WebVitalsTracker";

import { globalmetadata } from "./metadata";

import "./globals.css";
export const metadata = globalmetadata;

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.className} dark`} suppressHydrationWarning>
      <head>
        <SearchEngineVerifications />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="bg-black text-white">
        <AppProvider>
          <div className="min-h-screen relative">
            <Header />
            <main id="main-content" className="w-full">
              {children}
            </main>
            <Footer />
          </div>
        </AppProvider>
        <Analytics />
        <GoogleAnalytics />
        <WebVitalsTracker />
      </body>
    </html>
  );
}
