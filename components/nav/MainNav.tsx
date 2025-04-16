"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { createBrowserSupabaseClient } from "@/services/supabase/client";
import { siteMetadata } from "@/config/metadata";
import { navigationConfig } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser, useSignOut } from "@/services/auth/hooks";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useState } from "react";
import { UserNav } from "./UserNav";

interface MainNavProps {
  items?: typeof navigationConfig.mainNav;
  children?: React.ReactNode;
}

const publicNavItems = [
  { href: "/", label: "Home" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
];

const protectedNavItems = [
  { href: "/protected", label: "Protected" },
  { href: "/protected/profile", label: "Profile" },
  { href: "/protected/settings", label: "Settings" },
];

export function MainNav({ items = navigationConfig.mainNav, children }: MainNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: user, isLoading } = useUser();
  const { mutate: signOut } = useSignOut();

  const navItems = user
    ? [...publicNavItems.filter((item) => !item.href.includes("sign")), ...protectedNavItems]
    : publicNavItems;

  const NavContent = () => (
    <NavigationMenuList className="flex flex-col md:flex-row gap-4">
      {navItems.map((item) => (
        <NavigationMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref>
            <NavigationMenuLink
              className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                pathname === item.href ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              {item.label}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );

  return (
    <div className="flex items-center justify-between">
      <div className="hidden md:flex">
        <NavigationMenu>
          <NavContent />
        </NavigationMenu>
      </div>

      <div className="flex md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[280px]">
            <NavigationMenu>
              <NavContent />
            </NavigationMenu>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-4">
        {!isLoading && user ? <UserNav user={user} onSignOut={signOut} /> : null}
      </div>
    </div>
  );
}
