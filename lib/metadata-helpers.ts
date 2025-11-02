import { Metadata } from 'next';

interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
}

/**
 * Generate consistent metadata for all pages
 * Uses custom OG image with hero design (green gradient, van, logo)
 */
export function generatePageMetadata({
  title,
  description,
  keywords,
  url,
  image,
  type = 'website',
}: PageMetadataOptions): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://therecoverymachine.co';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  // Use dynamic OG image route by default, or custom image if provided
  const fullImageUrl = image
    ? (image.startsWith('http') ? image : `${siteUrl}${image}`)
    : `${siteUrl}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    ...(keywords && { keywords }),
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'The Recovery Machine',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

/**
 * Common keywords for mobile recovery services
 */
export const commonKeywords = {
  base: 'mobile recovery, cold plunge, infrared sauna, wellness services, Southern California',
  la: 'Los Angeles, LA County, Beverly Hills, Santa Monica, Venice',
  oc: 'Orange County, Irvine, Newport Beach, Huntington Beach',
};
