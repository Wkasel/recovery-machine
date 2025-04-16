import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Script from "next/script";
import AppProvider from "./providers";
import { siteMetadata } from "@/config/metadata";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { SkipToContent } from "@/components/SkipToContent";
import { Analytics } from "@vercel/analytics/react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: siteMetadata.defaultTitle,
    template: siteMetadata.titleTemplate,
  },
  description: siteMetadata.description,
  openGraph: {
    type: siteMetadata.type,
    locale: siteMetadata.locale,
    url: siteMetadata.siteUrl,
    title: siteMetadata.defaultTitle,
    description: siteMetadata.description,
    siteName: siteMetadata.title,
    images: [
      {
        url: `${siteMetadata.siteUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: siteMetadata.defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.defaultTitle,
    description: siteMetadata.description,
    creator: siteMetadata.twitterHandle,
    images: [`${siteMetadata.siteUrl}/api/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
  },
  verification: {
    // Add verification tokens here
    // google: "your-google-verification-id",
    // yandex: "your-yandex-verification-id",
  },
};

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
        <Script
          id="env-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.__env__ = {
                NEXT_PUBLIC_GOOGLE_CLIENT_ID: '${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}',
                NEXT_PUBLIC_SUPABASE_URL: '${process.env.NEXT_PUBLIC_SUPABASE_URL || ""}',
                NEXT_PUBLIC_SUPABASE_ANON_KEY: '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""}'
              };
            `,
          }}
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"
          strategy="beforeInteractive"
        />
        {isDevelopment && <Script src="/debug-init.js" strategy="afterInteractive" />}
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="bg-background text-foreground">
        <SkipToContent />
        <AppProvider>
          <main id="main-content" className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav
                className="w-full flex justify-center border-b border-b-foreground/10 h-16"
                role="navigation"
                aria-label="Main navigation"
              >
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"} aria-label="Home">
                      {siteMetadata.title}
                    </Link>
                    <div className="flex items-center gap-2">
                      <DeployButton />
                    </div>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div>

              <footer
                className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16"
                role="contentinfo"
              >
                <p>
                  Powered by{" "}
                  <a
                    href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                    aria-label="Visit Supabase website"
                  >
                    Supabase
                  </a>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </AppProvider>
        <Analytics />
      </body>
    </html>
  );
}
