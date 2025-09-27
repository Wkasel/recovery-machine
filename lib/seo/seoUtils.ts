// SEO utility functions for The Recovery Machine
import { siteMetadata } from "@/config/metadata";
import { wellnessKeywords } from "./keywords";

// Generate canonical URL
export function generateCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteMetadata.siteUrl}${cleanPath}`;
}

// Generate Open Graph image URL
export function generateOGImageUrl(title?: string, description?: string): string {
  const baseUrl = `${siteMetadata.siteUrl}/api/og`;
  const params = new URLSearchParams();

  if (title) params.append("title", title);
  if (description) params.append("description", description);

  return params.toString()
    ? `${baseUrl}?${params.toString()}`
    : `${siteMetadata.siteUrl}/og-image.jpg`;
}

// Generate page-specific keywords
export function generatePageKeywords(
  pageType: string,
  location?: string,
  service?: string
): string[] {
  const baseKeywords = wellnessKeywords.primary;
  const locationKeywords = location
    ? [`${service || "wellness"} ${location}`, `mobile spa ${location}`]
    : [];
  const serviceKeywords = service ? [`${service} therapy`, `${service} benefits`] : [];

  return [
    ...baseKeywords,
    ...locationKeywords,
    ...serviceKeywords,
    ...wellnessKeywords.secondary.slice(0, 5),
  ];
}

// Generate schema.org structured data for local SEO
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteMetadata.siteUrl}#business`,
    name: siteMetadata.organization.name,
    image: siteMetadata.organization.logo,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    telephone: "+1-XXX-XXX-XXXX", // Replace with actual phone
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "34.0522",
      longitude: "-118.2437",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Los Angeles, CA",
      },
      {
        "@type": "City",
        name: "Beverly Hills, CA",
      },
      {
        "@type": "City",
        name: "Santa Monica, CA",
      },
    ],
    serviceType: ["Cold Plunge Therapy", "Infrared Sauna", "Mobile Wellness Services"],
    priceRange: "$$",
    openingHours: "Mo-Su 07:00-20:00",
  };
}

// Generate FAQ schema for a page
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// SEO-friendly URL slug generator
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Generate location-based page URLs
export function generateLocationUrls(service: string): string[] {
  const locations = [
    "los-angeles",
    "beverly-hills",
    "santa-monica",
    "west-hollywood",
    "manhattan-beach",
    "venice",
    "malibu",
  ];

  return locations.map((location) => `/services/${generateSlug(service)}/${location}`);
}

// Meta description generator with character limit
export function generateMetaDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;

  // Find the last complete word within the limit
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`;
}

// Generate social media sharing URLs
export function generateSharingUrls(url: string, title: string, description: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription} ${encodedUrl}`,
  };
}

// Check for SEO best practices
export function validateSEO(metadata: {
  title?: string;
  description?: string;
  keywords?: string[];
}): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Title validation
  if (!metadata.title) {
    issues.push("Missing page title");
  } else {
    if (metadata.title.length < 30) {
      suggestions.push("Title could be longer (30-60 characters recommended)");
    }
    if (metadata.title.length > 60) {
      issues.push("Title too long (over 60 characters)");
    }
  }

  // Description validation
  if (!metadata.description) {
    issues.push("Missing meta description");
  } else {
    if (metadata.description.length < 120) {
      suggestions.push("Description could be longer (120-160 characters recommended)");
    }
    if (metadata.description.length > 160) {
      issues.push("Description too long (over 160 characters)");
    }
  }

  // Keywords validation
  if (!metadata.keywords || metadata.keywords.length === 0) {
    suggestions.push("Consider adding relevant keywords");
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

// Generate hreflang tags for multi-language support
export function generateHrefLangTags(currentPath: string) {
  const languages = ["en", "es"]; // English and Spanish
  const baseUrl = siteMetadata.siteUrl;

  return languages.map((lang) => {
    const url = lang === "en" ? `${baseUrl}${currentPath}` : `${baseUrl}/${lang}${currentPath}`;

    return {
      rel: "alternate",
      hrefLang: lang,
      href: url,
    };
  });
}
