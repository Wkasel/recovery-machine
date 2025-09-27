export interface SiteMetadata {
  title: string;
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  siteUrl: string;
  locale: string;
  type: string;
  twitterHandle: string;
  instagramHandle: string;
  instagramUrl: string;
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
  title: "The Recovery Machine",
  defaultTitle: "The Recovery Machine - Mobile Wellness & Recovery Services",
  titleTemplate: "%s | The Recovery Machine",
  description:
    "Mobile cold plunge & infrared sauna delivered to your door. Weekly wellness sessions for peak performance and recovery. Professional spa services at your location.",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://therecoverymachine.com",
  locale: "en_US",
  type: "website",
  twitterHandle: "@therecoverymachine",
  instagramHandle: "therecoverymachine_",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/therecoverymachine_/",
  author: {
    name: "The Recovery Machine",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://therecoverymachine.com",
  },
  organization: {
    name: "The Recovery Machine",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://therecoverymachine.com",
    logo: "https://therecoverymachine.com/logo.png",
  },
};
