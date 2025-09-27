"use client";

import { MainNav } from "@/components/nav/MainNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navigationConfig } from "@/config/navigation";
import { useSignOut, useUser } from "@/lib/supabase/hooks";
import { IUser } from "@/lib/types/auth";
import { Snowflake } from "lucide-react";
import Link from "next/link";

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

  // Get user initials for avatar fallback
  const getUserInitials = (user: IUser | null) => {
    if (!user) return "";

    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    return user.email ? user.email[0].toUpperCase() : "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-black">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        {/* Vercel Logo and Brand */}
        <div className="mr-8 flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center bg-white">
              <Snowflake className="h-4 w-4 text-black" />
            </div>
            <span className="hidden font-medium text-lg text-white font-mono sm:inline-block">
              Recovery Machine
            </span>
          </Link>
        </div>

        {/* Main Navigation */}
        <MainNav items={mainNavItems} user={user} />

        {/* Right side - Auth */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 bg-neutral-900 hover:bg-neutral-800"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name || user.email || "User"}
                    />
                    <AvatarFallback className="text-xs bg-neutral-700 text-white">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-black border-neutral-800">
                <div className="flex items-center justify-start gap-3 p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name || user.email || "User"}
                    />
                    <AvatarFallback className="text-xs bg-neutral-700 text-white">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.user_metadata?.full_name && (
                      <p className="font-medium text-white font-mono text-sm">
                        {user.user_metadata.full_name}
                      </p>
                    )}
                    {user.email && (
                      <p className="text-xs text-neutral-400 truncate font-mono">{user.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                {userNavItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-neutral-900 font-mono text-sm"
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
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="text-sm font-medium text-white hover:text-white hover:bg-neutral-900 font-mono h-8 px-4"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button
                asChild
                className="text-sm font-medium bg-white text-black hover:bg-neutral-200 font-mono h-8 px-4"
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
