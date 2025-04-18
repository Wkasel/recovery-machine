// services/supabase/queries/users.ts
// TanStack Query hooks for users will go here.

import { AppError } from "@/core/errors/base/AppError";
import { Logger } from "@/lib/logger/Logger";
import { createBrowserSupabaseClient } from "../client";

export interface IUserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  updated_at: string;
  isAdmin: boolean;
}

export async function getUserProfile(userId: string): Promise<IUserProfile> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error) throw error;
    return data as IUserProfile;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get user profile",
      { component: "userQueries", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}

export async function updateUserProfile(
  userId: string,
  profile: Partial<IUserProfile>
): Promise<IUserProfile> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as IUserProfile;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to update user profile",
      { component: "userQueries", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}
