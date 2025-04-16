import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Script from "next/script";
import AppProvider from "./providers";

import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { SkipToContent } from "@/components/SkipToContent";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";

import { globalmetadata } from "./metadata";
import Debug from "./debug";

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
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <head>
        <Debug />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="bg-background text-foreground">
        <SkipToContent />
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-1 w-full">
              <div className="flex flex-col gap-20 max-w-5xl mx-auto p-5">{children}</div>
            </main>
            <Footer />
          </div>
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
