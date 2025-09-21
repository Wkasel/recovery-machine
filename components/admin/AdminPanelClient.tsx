"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuthDebug } from "@/components/debug/AuthDebug";

interface AdminPanelClientProps {
  children: React.ReactNode;
  user: User;
  adminData: {
    role: string;
  } | null;
}

export function AdminPanelClient({ children, user, adminData }: AdminPanelClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
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

  // Ensure we have all required data
  if (!adminData?.role || !user?.email) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>You don't have admin permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminHeader
        user={user}
        admin={{
          role: adminData.role,
          email: user.email || ''
        }}
      />
      <div className="flex">
        <AdminSidebar
          admin={{
            role: adminData.role,
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