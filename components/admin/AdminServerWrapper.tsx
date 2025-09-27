import { AdminClientWrapper } from "@/components/admin/AdminClientWrapper";
import { checkAdminAccess } from "@/utils/admin/auth";
import { userServerQueries } from "@/core/queries/user";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";

interface AdminServerWrapperProps {
  children: React.ReactNode;
  minimumRole?: "operator" | "admin" | "super_admin";
}

export async function AdminServerWrapper({ 
  children, 
  minimumRole = "admin" 
}: AdminServerWrapperProps) {
  const supabase = await createServerSupabaseClient();
  
  // Get current authenticated user
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    redirect("/auth/signin?redirect=/admin");
  }

  // Check admin access
  const adminResult = await checkAdminAccess(authUser.email!, minimumRole);
  
  if (!adminResult.isAdmin || !adminResult.admin) {
    redirect("/admin/unauthorized");
  }

  // Prepare admin data for client component
  const adminData = {
    role: adminResult.admin.role,
  };

  return (
    <AdminClientWrapper user={authUser} adminData={adminData}>
      {children}
    </AdminClientWrapper>
  );
}