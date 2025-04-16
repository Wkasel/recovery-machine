// services/supabase/queries/users.ts
// TanStack Query hooks for users will go here.

import { createServerSupabaseClient } from "../server";
import { AppError } from "@/lib/errors/AppError";
import { Logger } from "@/lib/logger/Logger";

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  updated_at: string;
  isAdmin: boolean;
};

export async function getUserProfile(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get user profile",
      { component: "userQueries", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to update user profile",
      { component: "userQueries", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}
