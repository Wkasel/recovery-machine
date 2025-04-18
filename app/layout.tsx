import { Geist } from "next/font/google";
import AppProvider from "./providers";

import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/nav/Footer";
import { Header } from "@/components/nav/Header";
import { Analytics } from "@vercel/analytics/react";

import Debug from "./debug";
import "./globals.css";
import { globalmetadata } from "./metadata";

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
        <Debug />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="bg-background text-foreground">
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
