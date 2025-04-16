const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

import { siteMetadata } from "@/config/metadata";

export const globalmetadata = {
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
