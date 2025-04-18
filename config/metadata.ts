export interface SiteMetadata {
  title: string;
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  siteUrl: string;
  locale: string;
  type: string;
  twitterHandle: string;
  author: {
    name: string;
    url: string;
  };
  organization: {
    name: string;
    url: string;
    logo: string;
  };
}

export const siteMetadata: SiteMetadata = {
  title: "27 Circles",
  defaultTitle: "27 Circles - Your Digital Transformation Partner",
  titleTemplate: "%s | 27 Circles",
  description: "Enterprise digital transformation and software development",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://27circles.com",
  locale: "en_US",
  type: "website",
  twitterHandle: "@27circles",
  author: {
    name: "27 Circles",
    url: "https://27circles.com",
  },
  organization: {
    name: "27 Circles",
    url: "https://27circles.com",
    logo: "https://27circles.com/logo.png",
  },
};
