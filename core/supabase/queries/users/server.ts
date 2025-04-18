"use server";

import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";
import { createServerSupabaseClient } from "../../server-utils";

export interface IUserProfile {
  id: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get a user profile by ID
 */
export async function getUserProfile(userId: string): Promise<IUserProfile | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error) throw error;
    return data;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get user profile",
      { component: "getUserProfile", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}

/**
 * Update a user's profile
 */
export async function updateUserProfile(
  userId: string,
  profile: Partial<IUserProfile>
): Promise<IUserProfile> {
  try {
    const supabase = await createServerSupabaseClient();
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
      { component: "updateUserProfile", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}
