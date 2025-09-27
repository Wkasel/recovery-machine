import { Metadata, Viewport } from "next";

// Make sure our metadata is valid
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata

export const globalmetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "The Recovery Machine | Mobile Wellness Services",
    template: "%s | The Recovery Machine",
  },
  description:
    "Professional mobile cold plunge & infrared sauna therapy delivered to your location. Weekly wellness sessions for peak performance, athletic recovery, and optimal health. Certified specialists, commercial-grade equipment.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "The Recovery Machine | Mobile Wellness Services",
    description:
      "Professional mobile cold plunge & infrared sauna therapy delivered to your location. Weekly wellness sessions for peak performance, athletic recovery, and optimal health.",
    siteName: "The Recovery Machine",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "The Recovery Machine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Recovery Machine | Mobile Wellness Services",
    description:
      "Professional mobile cold plunge & infrared sauna therapy delivered to your location. Weekly wellness sessions for peak performance, athletic recovery, and optimal health.",
    creator: "@therecoverymachine",
    site: "@therecoverymachine",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`],
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
    canonical: process.env.NEXT_PUBLIC_APP_URL || "https://therecoverymachine.com",
    languages: {
      "en-US": "/en-US",
    },
  },
  keywords: [
    "mobile cold plunge",
    "infrared sauna delivery", 
    "recovery therapy",
    "wellness services",
    "mobile spa",
    "cold therapy",
    "heat therapy",
    "athletic recovery",
    "Los Angeles wellness",
    "professional recovery",
    "cryotherapy",
    "sauna therapy",
    "performance optimization",
    "mobile wellness"
  ],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
