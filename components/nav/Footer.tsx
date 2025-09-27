"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { HealthcareDisclaimer } from "@/components/seo/HealthcareDisclaimer";
import { siteMetadata } from "@/config/metadata";
import { navigationConfig } from "@/config/navigation";
import { FooterNavItem } from "@/types/nav";
import Link from "next/link";

interface FooterProps {
  items?: typeof navigationConfig.footerNav;
}

export function Footer({ items = navigationConfig.footerNav }: FooterProps) {
  const resolveHref = (item: FooterNavItem) => {
    if (typeof item.href === "function") {
      return item.href(siteMetadata);
    }
    return item.href;
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold">{siteMetadata.title}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{siteMetadata.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:col-span-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Services</h3>
              <ul className="flex flex-col gap-2">
                {items.services.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Locations</h3>
              <ul className="flex flex-col gap-2">
                {items.locations.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="flex flex-col gap-2">
                {items.company.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="flex flex-col gap-2">
                {items.legal.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="flex flex-col gap-4 items-center justify-between sm:flex-row">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>
                © {new Date().getFullYear()} {siteMetadata.title}. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-4">
                {items.social.map((item) => (
                  <Link
                    key={`${item.title}-${resolveHref(item)}`}
                    href={resolveHref(item)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
        
        <HealthcareDisclaimer type="footer" />
      </div>
    </footer>
  );
}
