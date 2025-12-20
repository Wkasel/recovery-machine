"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { User } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

interface AdminClientWrapperProps {
  children: React.ReactNode;
  user?: User;
  adminData?: {
    role: string;
  } | null;
}

export function AdminClientWrapper({ children, user, adminData }: AdminClientWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during SSR or if data is missing
  if (!isClient || !adminData || !user) {
    return (
      <div className="min-h-screen bg-background text-charcoal">
        <div className="animate-pulse">
          <div className="h-16 bg-mint-accent/20 border-b border-mint-accent/30"></div>
          <div className="flex">
            <div className="w-64 h-screen bg-white/70 backdrop-blur-sm border-r border-mint-accent/20"></div>
            <div className="flex-1 p-6">
              <div className="h-8 bg-mint-accent/20 rounded mb-4"></div>
              <div className="h-32 bg-mint-accent/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-charcoal">
      <AdminHeader
        user={user}
        admin={{
          role: adminData?.role || '',
          email: user.email || ''
        }}
      />
      <div className="flex">
        <AdminSidebar
          admin={{
            role: adminData?.role || '',
            permissions: {}
          }}
        />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-6 lg:ml-64">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
