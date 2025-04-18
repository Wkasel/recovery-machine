"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navigationConfig } from "@/config/navigation";
import { useSignOut, useUser } from "@/core/services/auth/hooks";
import type { IUser } from "@/core/types";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useState } from "react";

interface MainNavProps {
  items?: typeof navigationConfig.mainNav;
  children?: React.ReactNode;
  user: IUser | null;
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

function UserNavComponent() {
  const { data: user, isLoading } = useUser();
  const signOutMutation = useSignOut();

  if (isLoading || !user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const fullName = user.user_metadata?.full_name || user.email;
  const initials = fullName ? fullName.charAt(0).toUpperCase() : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl || undefined} alt={fullName || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={signOutMutation.isPending}
          onClick={() => signOutMutation.mutate()}
        >
          {signOutMutation.isPending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MainNav({ items = navigationConfig.mainNav, children, user }: MainNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: userData, isLoading } = useUser();

  const navItems = user
    ? [...publicNavItems.filter((item) => !item.href.includes("sign")), ...protectedNavItems]
    : publicNavItems;

  const NavContent = () => (
    <NavigationMenuList className="flex flex-col md:flex-row gap-4">
      {navItems.map((item) => (
        <NavigationMenuItem key={item.href}>
          <Link href={item.href} passHref>
            <NavigationMenuLink
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                pathname === item.href && "bg-accent text-accent-foreground"
              )}
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
        {!isLoading && user ? <UserNavComponent /> : null}
      </div>
    </div>
  );
}
