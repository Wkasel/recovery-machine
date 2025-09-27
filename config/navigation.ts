import { NavItem } from "@/types/nav";

export const navigationConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Dashboard",
      href: "/profile",
      auth: true,
    },
  ] as NavItem[],

  userNav: [
    {
      title: "Profile",
      href: "/profile",
      auth: true,
    },
    {
      title: "Settings", 
      href: "/profile",
      auth: true,
    },
  ] as NavItem[],

  footerNav: {
    services: [
      { title: "Cold Plunge LA", href: "/cold-plunge-la" },
      { title: "Infrared Sauna Delivery", href: "/infrared-sauna-delivery" },
      { title: "Athletic Recovery", href: "/athletic-recovery" },
      { title: "Corporate Wellness", href: "/corporate-wellness" },
    ],
    locations: [
      { title: "Beverly Hills", href: "/locations/beverly-hills" },
      { title: "Santa Monica", href: "/locations/santa-monica" },
      { title: "West Hollywood", href: "/locations/west-hollywood" },
      { title: "Manhattan Beach", href: "/locations/manhattan-beach" },
    ],
    company: [
      { title: "About", href: "/about" },
      { title: "Pricing", href: "/pricing" },
      { title: "Book Now", href: "/book" },
      { title: "Contact", href: "/contact" },
    ],
    legal: [
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
      { title: "Cookie Policy", href: "/cookies" },
    ],
    social: [
      {
        title: "Twitter",
        href: (meta: typeof import("@/config/metadata").siteMetadata) =>
          `https://twitter.com/${meta.twitterHandle}`,
        external: true,
      },
      {
        title: "GitHub",
        href: (meta: typeof import("@/config/metadata").siteMetadata) => meta.organization.url,
        external: true,
      },
      {
        title: "Website",
        href: (meta: typeof import("@/config/metadata").siteMetadata) => meta.organization.url,
        external: true,
      },
    ],
  },
} as const;
