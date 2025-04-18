import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";
import type { Profile } from "@/lib/types/supabase";
import { createServerSupabaseClient } from "../server";

/**
 * Get a user's profile
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error) throw error;
    return data;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get profile",
      { component: "profileQueries", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}

/**
 * Update a user's profile
 */
export async function updateProfile(userId: string, profile: Partial<Profile>): Promise<Profile> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to update profile",
      { component: "profileQueries", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}
