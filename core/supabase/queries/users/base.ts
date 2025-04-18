import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";
import { createBrowserSupabaseClient } from "../../client";
import type { IUserProfile } from "./server";

/**
 * Base client-side user queries (used by hooks)
 */
export const userQueries = {
  /**
   * Get a user profile by ID
   */
  async getUserProfile(userId: string): Promise<IUserProfile | null> {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

      if (error) throw error;
      return data;
    } catch (error) {
      Logger.getInstance().error(
        "Failed to get user profile",
        { component: "userQueries.getUserProfile", userId },
        AppError.from(error)
      );
      throw AppError.from(error);
    }
  },

  /**
   * Update a user's profile
   */
  async updateUserProfile(userId: string, profile: Partial<IUserProfile>): Promise<IUserProfile> {
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
        { component: "userQueries.updateUserProfile", userId },
        AppError.from(error)
      );
      throw AppError.from(error);
    }
  },
};
