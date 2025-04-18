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
import { useSignOut, useUser } from "@/core/supabase/hooks";
import { IUser } from "@/core/types";
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav items={mainNavItems} user={user as IUser | null}>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar>
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || user.email || "User"}
                      />
                      <AvatarFallback>{getUserInitials(user as IUser)}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || user.email || "User"}
                      />
                      <AvatarFallback>{getUserInitials(user as IUser)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.user_metadata?.full_name && (
                        <p className="font-medium">{user.user_metadata.full_name}</p>
                      )}
                      {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
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
