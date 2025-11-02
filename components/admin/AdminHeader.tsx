"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Menu, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  admin?: {
    role?: string;
    email?: string;
  } | null;
  user?: {
    id?: string;
    email?: string;
    user_metadata?: any;
  } | null;
}

export function AdminHeader({ admin, user }: AdminHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Early return with loading state for any missing props or during hydration
  if (!isHydrated || !admin?.role || !user?.email) {
    return (
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            </div>
            <div className="animate-pulse bg-muted h-8 w-32 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getRoleBadgeColor = (role: string | undefined | null) => {
    if (!role) return "bg-muted text-muted-foreground";

    switch (role) {
      case "super_admin":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "admin":
        return "bg-primary/20 text-primary-foreground border-primary/30";
      case "operator":
        return "bg-primary/10 text-primary-foreground border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-foreground hover:text-primary hover:bg-accent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Admin Panel</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative text-foreground hover:text-primary hover:bg-accent">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 h-auto py-2 text-foreground hover:text-primary hover:bg-accent">
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary-foreground">{user?.email?.slice(0, 2).toUpperCase() || "AD"}</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                      {user?.user_metadata?.full_name || user?.email || "Admin User"}
                    </span>
                    <Badge className={getRoleBadgeColor(admin?.role)} variant="secondary" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                      {admin?.role?.replace("_", " ") || "Loading..."}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                <DropdownMenuLabel className="text-foreground">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem className="text-foreground hover:bg-accent hover:text-primary cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="text-foreground hover:bg-accent hover:text-primary cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:bg-destructive/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
