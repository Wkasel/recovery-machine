import { NavItem } from "@/types/nav";

export const navigationConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Services",
      href: "/services",
    },
    {
      title: "Book Now",
      href: "/book",
      highlight: true,
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
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
      { title: "Cold Plunge", href: "/services" },
      { title: "Infrared Sauna", href: "/services" },
      { title: "Athletic Recovery", href: "/services" },
      { title: "Corporate Wellness", href: "/services" },
    ],
    locations: [
      { title: "Orange County", href: "/services#orange-county" },
      { title: "Los Angeles", href: "/services#los-angeles" },
      { title: "Service Areas", href: "/services" },
    ],
    company: [
      { title: "About", href: "/about" },
      { title: "Pricing", href: "/pricing" },
      { title: "Contact", href: "/contact" },
    ],
    legal: [
      { title: "Privacy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
      { title: "Cookie Policy", href: "/cookies" },
    ],
    social: [
      {
        title: "Instagram",
        href: (meta: typeof import("@/config/metadata").siteMetadata) => meta.instagramUrl,
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
