"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { AppError } from "@/core/errors/base/AppError";
import { serverAuthSchemas } from "@/core/schemas/server/auth";
import { createServerSupabaseClient } from "@/core/supabase/server-utils";
import { Logger } from "@/lib/logger/Logger";
import { ServerActionResult } from "@/lib/types/actions";
import { createAuthAction } from "../core/action-factory";

/**
 * Update user profile data
 */
export async function updateProfile(formData: FormData): Promise<ServerActionResult> {
  const action = await createAuthAction(
    "updateProfile",
    serverAuthSchemas.profile.update,
    async ({ fullName, username, email }) => {
      try {
        const supabase = await createServerSupabaseClient();

        const {
          data: { user },
          error,
        } = await supabase.auth.updateUser({
          email,
          data: {
            full_name: fullName,
            username,
          },
        });

        if (error) throw AuthError.fromSupabaseError(error);

        return {
          message: "Profile updated successfully",
          data: { user },
        };
      } catch (error) {
        Logger.getInstance().error(
          "Profile update failed",
          { component: "updateProfile" },
          AppError.from(error)
        );
        throw error;
      }
    }
  );
  return action(formData);
}

/**
 * Update user email address
 */
export async function updateEmail(formData: FormData): Promise<ServerActionResult> {
  const action = await createAuthAction(
    "updateEmail",
    serverAuthSchemas.profile.updateEmail,
    async ({ email }) => {
      try {
        const supabase = await createServerSupabaseClient();

        const {
          data: { user },
          error,
        } = await supabase.auth.updateUser({
          email,
        });

        if (error) throw AuthError.fromSupabaseError(error);

        return {
          message: "Email update confirmation sent. Please check your email.",
          data: { user },
        };
      } catch (error) {
        Logger.getInstance().error(
          "Email update failed",
          { component: "updateEmail" },
          AppError.from(error)
        );
        throw error;
      }
    }
  );
  return action(formData);
}

/**
 * Update user password
 */
export async function updatePassword(formData: FormData): Promise<ServerActionResult> {
  const action = await createAuthAction(
    "updatePassword",
    serverAuthSchemas.profile.updatePassword,
    async ({ currentPassword, newPassword }) => {
      try {
        const supabase = await createServerSupabaseClient();

        const {
          data: { user },
          error,
        } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw AuthError.fromSupabaseError(error);

        return {
          message: "Password updated successfully",
          data: { user },
        };
      } catch (error) {
        Logger.getInstance().error(
          "Password update failed",
          { component: "updatePassword" },
          AppError.from(error)
        );
        throw error;
      }
    }
  );
  return action(formData);
}
