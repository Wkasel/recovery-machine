"use client";

import * as React from "react";
import Link from "next/link";
import { MainNav } from "@/components/nav/MainNav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { useUser, useSignOut } from "@/services/auth/hooks";

interface HeaderProps {
  mainNavItems?: typeof navigationConfig.mainNav;
  userNavItems?: typeof navigationConfig.userNav;
}

export function Header({
  mainNavItems = navigationConfig.mainNav,
  userNavItems = navigationConfig.userNav,
}: HeaderProps) {
  const { data: user } = useUser();
  const { mutate: signOut } = useSignOut();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav items={mainNavItems}>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.email && <p className="font-medium">{user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {userNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>{item.title}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button asChild size="sm" variant="ghost">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </MainNav>
      </div>
    </header>
  );
}
