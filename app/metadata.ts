import { Metadata } from "next";

// Make sure our metadata is valid
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata

export const globalmetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "The Recovery Machine | Mobile Wellness Services",
    template: "%s | The Recovery Machine",
  },
  description:
    "Mobile cold plunge & infrared sauna delivered to your door. Weekly sessions for peak performance and recovery.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "The Recovery Machine | Mobile Wellness Services",
    description:
      "Mobile cold plunge & infrared sauna delivered to your door. Weekly sessions for peak performance and recovery.",
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
      "Mobile cold plunge & infrared sauna delivered to your door. Weekly sessions for peak performance and recovery.",
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
    canonical: process.env.NEXT_PUBLIC_APP_URL,
    languages: {
      "en-US": "/en-US",
    },
  },
  verification: {},
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};
