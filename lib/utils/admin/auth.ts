import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export interface AdminUser {
  id: string;
  email: string;
  role: 'operator' | 'admin' | 'super_admin';
}

export async function requireAdminAccess(
  request: NextRequest,
  minimumRole: 'operator' | 'admin' | 'super_admin' = 'operator'
): Promise<AdminUser> {
  const supabase = await createServerSupabaseClient();
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Authentication required');
  }

  // Check if user is admin
  const { data: adminUser, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('email', user.email)
    .single();

  if (adminError || !adminUser) {
    throw new Error('Admin access required');
  }

  // Check role hierarchy
  const roleHierarchy = {
    operator: 1,
    admin: 2,
    super_admin: 3,
  };

  if (roleHierarchy[adminUser.role] < roleHierarchy[minimumRole]) {
    throw new Error(`${minimumRole} role required`);
  }

  return {
    id: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
  };
}

export async function checkAdminAccess(email: string): Promise<AdminUser | null> {
  const supabase = await createServerSupabaseClient();
  
  const { data: adminUser, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !adminUser) {
    return null;
  }

  return {
    id: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
  };
}