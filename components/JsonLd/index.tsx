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
          `https://twitter.com/${siteMetadata.twitterHandle}`,
          // Add other social media URLs
        ],
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
      }}
    </JsonLd>
  );
};

export default JsonLd;
