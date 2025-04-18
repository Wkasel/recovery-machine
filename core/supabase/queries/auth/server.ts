"use server";

import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";
import { createServerSupabaseClient } from "../../server-utils";

/**
 * Get user by ID (admin only)
 */
export async function getUserById(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) throw error;
    return data.user;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get user by ID",
      { component: "serverAuth.getUserById", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}

/**
 * Get current user
 */
export async function getUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If there's no user or there's an error, just return null without throwing
    if (error || !user) {
      // Still log the error but don't throw
      if (error) {
        Logger.getInstance().warn(
          "No user session found",
          { component: "serverAuth.getUser" },
          error
        );
      }
      return null;
    }

    return user;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get current user",
      { component: "serverAuth.getUser" },
      AppError.from(error)
    );
    // Return null instead of throwing for better error handling
    return null;
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    // If there's no session or there's an error, just return null without throwing
    if (error || !session) {
      // Still log the error but don't throw
      if (error) {
        Logger.getInstance().warn(
          "No active session found",
          { component: "serverAuth.getSession" },
          error
        );
      }
      return null;
    }

    return session;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get session",
      { component: "serverAuth.getSession" },
      AppError.from(error)
    );
    // Return null instead of throwing for better error handling
    return null;
  }
}
