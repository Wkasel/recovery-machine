"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuthDebug } from "@/components/debug/AuthDebug";
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
      <div className="min-h-screen bg-black text-white">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-800 border-b border-gray-700"></div>
          <div className="flex">
            <div className="w-64 h-screen bg-gray-900"></div>
            <div className="flex-1 p-6">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
      <div className="pointer-events-none lg:ml-64">
        <div className="pointer-events-auto">
          <AuthDebug />
        </div>
      </div>
    </div>
  );
}
