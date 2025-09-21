"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuthDebug } from "@/components/debug/AuthDebug";
import { User } from "@supabase/supabase-js";

interface AdminClientWrapperProps {
  children: React.ReactNode;
  user: User;
  adminData: {
    role: string;
  };
}

export function AdminClientWrapper({ children, user, adminData }: AdminClientWrapperProps) {
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
