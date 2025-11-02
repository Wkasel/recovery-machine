"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bell,
  Calendar,
  Clock,
  Database,
  Download,
  Mail,
  MapPin,
  PieChart,
  Settings,
  Shield,
  ShoppingCart,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface AdminSidebarProps {
  admin?: {
    role?: string;
    permissions?: Record<string, any>;
  } | null;
}

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Handle undefined admin during SSR/hydration
  if (!isHydrated || !admin) {
    return (
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border px-6 shadow-sm">
          <div className="flex h-16 shrink-0 items-center">
            <h2 className="text-xl font-bold text-foreground">Recovery Machine</h2>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Availability", href: "/admin/availability", icon: Clock },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Referrals", href: "/admin/referrals", icon: UserPlus },
    // { name: "Analytics", href: "/admin/analytics", icon: PieChart }, // Disabled - not implemented
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Service Areas", href: "/admin/service-areas", icon: MapPin },
    { name: "Email Templates", href: "/admin/email-templates", icon: Mail },
    { name: "Exports", href: "/admin/exports", icon: Download },
  ];

  // Super admin only sections
  if (admin?.role === "super_admin") {
    navigation.push(
      { name: "Admin Users", href: "/admin/admins", icon: Shield },
      { name: "Settings", href: "/admin/settings", icon: Settings }
    );
  } else if (admin?.role === "admin") {
    navigation.push(
      { name: "Settings", href: "/admin/settings", icon: Settings }
    );
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border px-6 shadow-sm">
        <div className="flex h-16 shrink-0 items-center">
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>Recovery Machine</h2>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? "bg-primary/10 text-primary-foreground border-l-4 border-primary"
                            : "text-muted-foreground hover:text-primary hover:bg-accent border-l-4 border-transparent",
                          "group flex gap-x-3 rounded-r-md p-3 text-sm leading-6 font-medium transition-all"
                        )}
                        style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}
                      >
                        <item.icon
                          className={cn(
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                            "h-5 w-5 shrink-0 transition-colors"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>

        <div className="border-t border-border pt-4 pb-4">
          <div className="text-xs font-semibold leading-6 text-muted-foreground uppercase tracking-wide" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
            Role: {admin?.role?.replace("_", " ") || "Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
}
