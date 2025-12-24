"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminInfo {
  email: string;
  role: string;
}

export default function AdminBanner() {
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Don't show on admin pages - they already have admin context
  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (!user?.email) {
          setAdminInfo(null);
          setIsLoading(false);
          return;
        }

        const { data: admin } = await supabase
          .from("admins")
          .select("email, role")
          .eq("email", user.email)
          .single();

        if (admin) {
          setAdminInfo(admin);
        } else {
          setAdminInfo(null);
        }
      } catch {
        setAdminInfo(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [pathname]);

  // Don't render while loading, on admin pages, or if not an admin
  if (isLoading || isAdminPage || !adminInfo) {
    return null;
  }

  return (
    <div className="bg-charcoal text-white py-2 px-4 text-center text-sm font-medium z-[70] relative">
      <div className="flex items-center justify-center gap-2">
        <Shield className="h-4 w-4 text-mint" />
        <span>
          Logged in as <span className="text-mint font-semibold">{adminInfo.role.replace("_", " ")}</span>
        </span>
        <span className="mx-2 text-white/40">|</span>
        <Link
          href="/admin"
          className="text-mint hover:text-mint-light underline underline-offset-2 transition-colors"
        >
          Go to Admin Panel
        </Link>
      </div>
    </div>
  );
}
