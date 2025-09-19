import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { User } from "@/lib/types/supabase";

// Client-side queries
export const userQueries = {
  async getCurrentUser(): Promise<User | null> {
    const supabase = createBrowserSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return null;
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const supabase = createBrowserSupabaseClient();
    
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Server-side queries
export const userServerQueries = {
  async getCurrentUser(): Promise<User | null> {
    const supabase = await createServerSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return null;
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(id: string): Promise<User | null> {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) return null;
    return data;
  },
};