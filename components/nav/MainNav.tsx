"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navigationConfig } from "@/config/navigation";
import type { IUser } from "@/lib/types/auth";
import { cn } from "@/lib/utils";
import { Menu, Snowflake } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useState } from "react";

interface MainNavProps {
  items?: typeof navigationConfig.mainNav;
  children?: React.ReactNode;
  user: IUser | null;
}


export function MainNav({ items = navigationConfig.mainNav, children, user }: MainNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Simplified nav items for Recovery Machine
  const navItems = user 
    ? [
        { href: "/", label: "Home" },
        { href: "/book", label: "Book Session" },
        { href: "/protected", label: "Dashboard" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/book", label: "Book Session" },
        { href: "/about", label: "About" },
      ];

  const NavContent = () => (
    <NavigationMenuList className="flex flex-col md:flex-row gap-1">
      {navItems.map((item) => (
        <NavigationMenuItem key={item.href}>
          <NavigationMenuLink asChild>
            <Link
              href={item.href}
              className={cn(
                "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                pathname === item.href && "bg-accent text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  );

  return (
    <div className="flex items-center">
      {/* Desktop Navigation */}
      <div className="hidden md:flex">
        <NavigationMenu>
          <NavContent />
        </NavigationMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-3 mt-6">
              <Link href="/" className="flex items-center space-x-2 mb-6" onClick={() => setOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Snowflake className="h-4 w-4" />
                </div>
                <span className="font-bold">The Recovery Machine</span>
              </Link>
              
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              
              {!user && (
                <div className="pt-4 mt-4 border-t space-y-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
