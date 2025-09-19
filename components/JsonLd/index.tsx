import { siteMetadata } from "@/config/metadata";

interface JsonLdProps {
  children: object;
}

const JsonLd = ({ children }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(children) }}
    />
  );
};

export const OrganizationJsonLd = () => {
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteMetadata.organization.name,
        url: siteMetadata.organization.url,
        logo: siteMetadata.organization.logo,
        sameAs: [
          `https://twitter.com/${siteMetadata.twitterHandle.replace("@", "")}`,
          // Add other social media URLs when available
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["English", "Spanish"],
          areaServed: "US-CA"
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Los Angeles",
          addressRegion: "CA",
          addressCountry: "US"
        },
        // Add business-specific properties
        foundingDate: "2024",
        numberOfEmployees: "2-10",
        knowsAbout: [
          "Cold Plunge Therapy",
          "Infrared Sauna",
          "Recovery Therapy",
          "Wellness Services",
          "Mobile Spa Services"
        ]
      }}
    </JsonLd>
  );
};

export const WebsiteJsonLd = () => {
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteMetadata.title,
        url: siteMetadata.siteUrl,
        description: siteMetadata.description,
        publisher: {
          "@type": "Organization",
          name: siteMetadata.organization.name,
          logo: siteMetadata.organization.logo,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteMetadata.siteUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }}
    </JsonLd>
  );
};

export const WebPageJsonLd = ({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) => {
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description: description,
        url: url,
        publisher: {
          "@type": "Organization",
          name: siteMetadata.organization.name,
          logo: siteMetadata.organization.logo,
        },
        mainEntity: {
          "@type": "LocalBusiness",
          name: siteMetadata.organization.name,
          description: siteMetadata.description
        }
      }}
    </JsonLd>
  );
};

export const ArticleJsonLd = ({
  title,
  description,
  url,
  images = [],
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  description: string;
  url: string;
  images?: string[];
  datePublished: string;
  dateModified: string;
  authorName: string;
}) => {
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        url: url,
        image: images,
        datePublished,
        dateModified,
        author: {
          "@type": "Person",
          name: authorName,
        },
        publisher: {
          "@type": "Organization",
          name: siteMetadata.organization.name,
          logo: {
            "@type": "ImageObject",
            url: siteMetadata.organization.logo,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url
        }
      }}
    </JsonLd>
  );
};

// FAQ Schema for wellness questions
export const FAQJsonLd = ({ faqs }: { faqs: Array<{ question: string; answer: string }> }) => {
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(faq => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }}
    </JsonLd>
  );
};

// Breadcrumb Schema
export const BreadcrumbJsonLd = ({ 
  breadcrumbs 
}: { 
  breadcrumbs: Array<{ name: string; url: string }> 
}) => {
  return (
    <JsonLd>
      {{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((breadcrumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: breadcrumb.name,
          item: breadcrumb.url
        }))
      }}
    </JsonLd>
  );
};

export default JsonLd;
