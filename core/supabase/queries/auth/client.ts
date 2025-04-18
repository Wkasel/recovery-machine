import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";
import { createBrowserSupabaseClient } from "../../client";

/**
 * Client-side auth queries
 */
export const clientAuth = {
  /**
   * Get current user
   */
  async getUser() {
    try {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.warn("Auth error:", error.message);
        return null;
      }

      return user;
    } catch (error) {
      Logger.getInstance().error(
        "Failed to get current user",
        { component: "clientAuth.getUser" },
        AppError.from(error),
      );
      console.error("User fetch error:", error);
      // Return null instead of throwing to avoid cascading errors
      return null;
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    try {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.warn("Session error:", error.message);
        return null;
      }

      return session;
    } catch (error) {
      Logger.getInstance().error(
        "Failed to get session",
        { component: "clientAuth.getSession" },
        AppError.from(error),
      );
      console.error("Session fetch error:", error);
      // Return null instead of throwing
      return null;
    }
  },

  /**
   * Sign out the user
   */
  async signOut() {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
      return true;
    } catch (error) {
      Logger.getInstance().error(
        "Failed to sign out",
        { component: "clientAuth.signOut" },
        AppError.from(error),
      );
      throw AppError.from(error);
    }
  },
};
