type Organization = {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
};

type Article = {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
};

export function generateOrganizationSchema(org: Organization) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url,
    ...(org.logo && { logo: org.logo }),
    ...(org.sameAs && { sameAs: org.sameAs }),
  };
}

export function generateArticleSchema(article: Article, org: Organization) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: article.author.url,
    },
    publisher: generateOrganizationSchema(org),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebsiteSchema(org: Organization) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: org.name,
    url: org.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${org.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
