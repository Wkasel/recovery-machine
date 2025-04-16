import { NavItem } from "@/types/nav";

export const navigationConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Dashboard",
      href: "/protected",
      auth: true,
    },
  ] as NavItem[],

  userNav: [
    {
      title: "Profile",
      href: "/protected/profile",
      auth: true,
    },
    {
      title: "Settings",
      href: "/protected/settings",
      auth: true,
    },
  ] as NavItem[],

  footerNav: {
    product: [
      { title: "Features", href: "/features" },
      { title: "Pricing", href: "/pricing" },
      { title: "Documentation", href: "/docs" },
    ],
    company: [
      { title: "About", href: "/about" },
      { title: "Blog", href: "/blog" },
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
