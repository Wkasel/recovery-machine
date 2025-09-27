import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function checkAdminAccess(
  userEmail: string,
  minimumRole: "operator" | "admin" | "super_admin" = "admin"
) {
  const supabase = await createServerSupabaseClient();

  const { data: admin, error: adminError } = await supabase
    .from("admins")
    .select("*")
    .eq("email", userEmail)
    .single();

  if (adminError || !admin) {
    return { isAdmin: false, error: "Admin access required", admin: null };
  }

  // Check role hierarchy
  const roleHierarchy = { operator: 1, admin: 2, super_admin: 3 };
  const userRoleLevel = roleHierarchy[admin.role as keyof typeof roleHierarchy] || 0;
  const requiredRoleLevel = roleHierarchy[minimumRole];

  if (userRoleLevel < requiredRoleLevel) {
    return {
      isAdmin: false,
      error: `Insufficient permissions. Required: ${minimumRole}, Current: ${admin.role}`,
      admin,
    };
  }

  return { isAdmin: true, error: null, admin };
}

export async function requireAdminAccess(
  request: any,
  minimumRole: "operator" | "admin" | "super_admin" = "admin"
) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication required");
  }

  const result = await checkAdminAccess(user.email!, minimumRole);

  if (!result.isAdmin) {
    throw new Error(result.error || "Access denied");
  }

  return { user, admin: result.admin! };
}
