"use client";

import { MainNav } from "@/components/nav/MainNav";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ThemeToggle,
  Text, 
  Small,
  Inline 
} from "@/components";
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        {/* Brand Logo and Name */}
        <div className="mr-8">
          <Link href="/" className="flex items-center group">
            <Inline space="3" align="center">
              <div className="flex h-10 w-10 items-center justify-center bg-primary rounded-xl shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                <Snowflake className="h-5 w-5 text-primary-foreground" />
              </div>
              <Text
                size="lg"
                weight="medium"
                className="hidden font-serif sm:inline-block text-foreground group-hover:text-primary transition-colors"
              >
                Recovery Machine
              </Text>
            </Inline>
          </Link>
        </div>

        {/* Main Navigation */}
        <MainNav items={mainNavItems} user={user} />

        {/* Right side - Theme Toggle and Auth */}
        <div className="flex flex-1 items-center justify-end">
          <Inline space="4" align="center">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 bg-muted hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || user.email || "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="flex items-center justify-start gap-3 p-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || user.email || "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.user_metadata?.full_name && (
                        <Text size="sm" weight="medium" className="font-mono">
                          {user.user_metadata.full_name}
                        </Text>
                      )}
                      {user.email && (
                        <Small className="text-muted-foreground truncate font-mono">
                          {user.email}
                        </Small>
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
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-accent"
                    onSelect={(e) => {
                      e.preventDefault();
                      signOut();
                    }}
                  >
                    <Text size="sm" className="font-mono">Sign out</Text>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Inline space="3" align="center">
                <Button
                  asChild
                  variant="ghost"
                  className="text-sm font-medium text-foreground hover:text-foreground hover:bg-accent font-mono h-8 px-4"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 font-mono h-8 px-4"
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </Inline>
            )}
          </Inline>
        </div>
      </div>
    </header>
  );
}
