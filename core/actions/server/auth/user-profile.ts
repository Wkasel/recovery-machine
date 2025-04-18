"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import {
  emailUpdateSchema,
  passwordUpdateSchema,
  profileUpdateSchema,
} from "@/core/schemas/server/profile";
import { createServerSupabaseClient } from "@/core/supabase/server";
import type { ServerActionResult } from "@/lib/types/actions";
import { createAuthAction } from "./core/action-factory";

export async function updateProfile(formData: FormData) {
  const action = await createAuthAction("updateProfile", profileUpdateSchema, async (data) => {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      },
    });

    if (error) throw new AuthError("updateProfileFailed", error.message);
    return { success: true, message: "Profile updated successfully" };
  });
  return action(formData);
}

export async function updateEmail(formData: FormData) {
  const action = await createAuthAction("updateEmail", emailUpdateSchema, async (data) => {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.updateUser({ email: data.email });

    if (error) throw new AuthError("updateEmailFailed", error.message);
    return { success: true, message: "Email update verification sent" };
  });
  return action(formData);
}

export async function updatePassword(formData: FormData) {
  const action = await createAuthAction("updatePassword", passwordUpdateSchema, async (data) => {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) throw new AuthError("updatePasswordFailed", error.message);
    return { success: true, message: "Password updated successfully" };
  });
  return action(formData);
}

/**
 * Gets the current user profile
 */
export async function getCurrentUser(): Promise<ServerActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw AuthError.fromSupabaseError(error);
    }

    return { success: true, data: data.user };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof AuthError
          ? error.toUserMessage()
          : "Failed to fetch user profile. Please try again.",
    };
  }
}
