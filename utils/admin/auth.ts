import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function checkAdminAccess(minimumRole: 'operator' | 'admin' | 'super_admin' = 'admin') {
  const supabase = createServerSupabaseClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { isAdmin: false, error: 'Authentication required', user: null, admin: null };
  }

  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (adminError || !admin) {
    return { isAdmin: false, error: 'Admin access required', user, admin: null };
  }

  // Check role hierarchy
  const roleHierarchy = { operator: 1, admin: 2, super_admin: 3 };
  const userRoleLevel = roleHierarchy[admin.role as keyof typeof roleHierarchy] || 0;
  const requiredRoleLevel = roleHierarchy[minimumRole];

  if (userRoleLevel < requiredRoleLevel) {
    return { 
      isAdmin: false, 
      error: `Insufficient permissions. Required: ${minimumRole}, Current: ${admin.role}`, 
      user, 
      admin 
    };
  }

  return { isAdmin: true, error: null, user, admin };
}

export async function requireAdminAccess(minimumRole: 'operator' | 'admin' | 'super_admin' = 'admin') {
  const result = await checkAdminAccess(minimumRole);
  
  if (!result.isAdmin) {
    throw new Error(result.error || 'Access denied');
  }
  
  return { user: result.user!, admin: result.admin! };
}