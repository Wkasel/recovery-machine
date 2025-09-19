import { Geist } from "next/font/google";
import AppProvider from "./providers";

import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/nav/Footer";
import { Header } from "@/components/nav/Header";
import { Analytics } from "@vercel/analytics/react";

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
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="bg-background text-foreground">
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
      </body>
    </html>
  );
}
