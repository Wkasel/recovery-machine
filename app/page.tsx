import { Metadata } from "next";
import { siteMetadata } from "@/config/metadata";
import Hero from "@/components/v2-design/sections/Hero";
import HowItWorks from "@/components/v2-design/sections/HowItWorks";
import MediaGallery from "@/components/v2-design/sections/MediaGallery";
import Pricing from "@/components/v2-design/sections/Pricing";
import BookNow from "@/components/v2-design/sections/BookNow";

/**
 * Home Page - V2 Minimal Design
 *
 * Clean, streamlined landing page composition:
 * - Hero (primary CTA)
 * - HowItWorks (explainer section)
 * - MediaGallery (visual proof)
 * - Pricing (conversion)
 * - BookNow (CTA)
 *
 * Layout components (AnnouncementBar, Header, Footer) are in app/layout.tsx
 */

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
  },
};

export default function Home() {
  return (
    <main className="bg-transparent">
      <Hero />
      <HowItWorks />
      <MediaGallery />
      <Pricing />
      <BookNow />
    </main>
  );
}
