"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bell,
  Calendar,
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

interface AdminSidebarProps {
  admin: {
    role: string;
    permissions: Record<string, any>;
  };
}

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Referrals", href: "/admin/referrals", icon: UserPlus },
    { name: "Analytics", href: "/admin/analytics", icon: PieChart },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Service Areas", href: "/admin/service-areas", icon: MapPin },
    { name: "Email Templates", href: "/admin/email-templates", icon: Mail },
    { name: "Exports", href: "/admin/exports", icon: Download },
  ];

  // Super admin only sections
  if (admin.role === "super_admin") {
    navigation.push(
      { name: "Admin Users", href: "/admin/admin-users", icon: Shield },
      { name: "Settings", href: "/admin/settings", icon: Settings },
      { name: "System", href: "/admin/system", icon: Database },
      { name: "Backup", href: "/admin/backup", icon: Database }
    );
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black border-r border-neutral-800 px-6">
        <div className="flex h-16 shrink-0 items-center">
          <h2 className="text-xl font-bold text-white">Recovery Machine</h2>
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
                            ? "bg-neutral-900 text-white"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-900",
                          "group flex gap-x-3 rounded-none p-2 text-sm leading-6 font-semibold border-b border-neutral-900"
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? "text-brand" : "text-neutral-500 group-hover:text-brand",
                            "h-6 w-6 shrink-0"
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

        <div className="border-t border-neutral-800 pt-4 pb-4">
          <div className="text-xs font-semibold leading-6 text-neutral-500 uppercase tracking-wide">
            Role: {admin.role.replace("_", " ")}
          </div>
        </div>
      </div>
    </div>
  );
}
