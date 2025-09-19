import { Metadata } from "next";
import { siteMetadata } from "@/config/metadata";
import { generateMetaKeywords } from "./keywords";

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  pageType?: string;
  path?: string;
  images?: string[];
  noIndex?: boolean;
  canonical?: string;
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  pageType = "website",
  path = "",
  images = [],
  noIndex = false,
  canonical,
  articleMeta
}: GenerateMetadataProps = {}): Metadata {
  const fullTitle = title 
    ? `${title} | ${siteMetadata.organization.name}`
    : siteMetadata.defaultTitle;
  
  const metaDescription = description || siteMetadata.description;
  const url = `${siteMetadata.siteUrl}${path}`;
  const canonicalUrl = canonical || url;
  
  // Generate keywords including page-specific and general wellness keywords
  const allKeywords = [
    ...keywords,
    ...generateMetaKeywords(pageType).split(', ')
  ].filter((keyword, index, array) => array.indexOf(keyword) === index);

  // Default image
  const defaultImage = `${siteMetadata.siteUrl}/og-image.jpg`;
  const metaImages = images.length > 0 ? images : [defaultImage];

  const metadata: Metadata = {
    title: fullTitle,
    description: metaDescription,
    keywords: allKeywords.join(', '),
    authors: [{ name: siteMetadata.author.name, url: siteMetadata.author.url }],
    creator: siteMetadata.organization.name,
    publisher: siteMetadata.organization.name,
    metadataBase: new URL(siteMetadata.siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: pageType === 'article' ? 'article' : 'website',
      locale: siteMetadata.locale,
      url: url,
      title: fullTitle,
      description: metaDescription,
      siteName: siteMetadata.organization.name,
      images: metaImages.map(image => ({
        url: image.startsWith('http') ? image : `${siteMetadata.siteUrl}${image}`,
        width: 1200,
        height: 630,
        alt: title || siteMetadata.organization.name,
      })),
      ...(articleMeta && {
        publishedTime: articleMeta.publishedTime,
        modifiedTime: articleMeta.modifiedTime,
        authors: articleMeta.author ? [articleMeta.author] : undefined,
        section: articleMeta.section,
        tags: articleMeta.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      creator: siteMetadata.twitterHandle,
      site: siteMetadata.twitterHandle,
      images: metaImages.map(image => 
        image.startsWith('http') ? image : `${siteMetadata.siteUrl}${image}`
      ),
    },
    // Verification tags (add when available)
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      // yandex: process.env.YANDEX_VERIFICATION,
      // bing: process.env.BING_VERIFICATION,
    },
    other: {
      // Additional meta tags for local business
      'geo.region': 'US-CA',
      'geo.placename': 'Los Angeles',
      'geo.position': '34.0522;-118.2437', // LA coordinates
      'ICBM': '34.0522, -118.2437',
      // Business type
      'business:contact_data:street_address': 'Los Angeles, CA',
      'business:contact_data:locality': 'Los Angeles', 
      'business:contact_data:region': 'CA',
      'business:contact_data:country_name': 'United States',
    },
  };

  return metadata;
}

// Predefined metadata for common pages
export const homePageMetadata = generateSEOMetadata({
  title: "Mobile Cold Plunge & Infrared Sauna Services",
  description: "The Recovery Machine delivers professional cold plunge and infrared sauna sessions to your location in Los Angeles. Weekly wellness programs for peak performance and recovery.",
  pageType: "home",
  keywords: [
    "mobile cold plunge Los Angeles",
    "infrared sauna delivery", 
    "recovery services LA",
    "mobile wellness therapy",
    "cold therapy at home"
  ]
});

export const servicesPageMetadata = generateSEOMetadata({
  title: "Recovery & Wellness Services",
  description: "Professional cold plunge therapy and infrared sauna sessions delivered to your door. Experience the benefits of recovery therapy at your location.",
  pageType: "services",
  path: "/services",
  keywords: [
    "cold plunge therapy",
    "infrared sauna sessions",
    "recovery therapy services",
    "mobile wellness treatments"
  ]
});

export const bookingPageMetadata = generateSEOMetadata({
  title: "Book Your Recovery Session",
  description: "Schedule your mobile cold plunge or infrared sauna session. Easy online booking for recovery therapy delivered to your Los Angeles location.",
  pageType: "booking", 
  path: "/booking",
  keywords: [
    "book cold plunge session",
    "schedule infrared sauna",
    "recovery appointment booking",
    "mobile wellness scheduling"
  ]
});