import { Metadata } from "next";

// Make sure our metadata is valid
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata

export const globalmetadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "27 Circles | Web3 Smart Locker",
    template: "%s | 27 Circles",
  },
  description:
    "A smart locker system for the blockchain era. Store and protect your digital assets with cutting-edge technology.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "27 Circles | Web3 Smart Locker",
    description:
      "A smart locker system for the blockchain era. Store and protect your digital assets with cutting-edge technology.",
    siteName: "27 Circles",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "27 Circles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "27 Circles | Web3 Smart Locker",
    description:
      "A smart locker system for the blockchain era. Store and protect your digital assets with cutting-edge technology.",
    creator: "@27circles",
    site: "@27circles",
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
};
