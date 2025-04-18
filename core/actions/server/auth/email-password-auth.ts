"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { serverAuthSchemas } from "@/core/schemas/server/auth";
import { createServerSupabaseClient } from "@/core/supabase/server";
import { ServerActionResult } from "@/lib/types/actions";
import { createAuthAction } from "./core/action-factory";

/**
 * Sign in with email and password
 */
export const signInWithEmailPassword = async (formData: FormData) => {
  const action = await createAuthAction(
    "signInWithEmailPassword",
    serverAuthSchemas.emailPassword.signIn,
    async ({ email, password }) => {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      return { user: data.user, message: "Signed in successfully" };
    }
  );
  return action(formData);
};

/**
 * Sign up with email and password
 */
export const signUpWithEmailPassword = async (formData: FormData) => {
  const action = await createAuthAction(
    "signUpWithEmailPassword",
    serverAuthSchemas.emailPassword.signUp,
    async ({ email, password }) => {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        return { message: "Account already exists. Please sign in." };
      }

      const needsEmailConfirmation = !data.user?.email_confirmed_at;

      return {
        user: data.user,
        needsEmailConfirmation,
        message: needsEmailConfirmation
          ? "Please check your email to confirm your account"
          : "Account created successfully",
      };
    }
  );
  return action(formData);
};

/**
 * Send a password reset email
 */
export const resetPassword = async (formData: FormData) => {
  const action = await createAuthAction(
    "resetPassword",
    serverAuthSchemas.emailPassword.resetPassword,
    async ({ email }) => {
      const supabase = await createServerSupabaseClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      });

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      return { message: "Password reset link sent to your email" };
    }
  );
  return action(formData);
};

/**
 * Update the user's password after a reset
 */
export const updatePassword = async (formData: FormData) => {
  const action = await createAuthAction(
    "updatePassword",
    serverAuthSchemas.emailPassword.updatePassword,
    async ({ password }) => {
      const supabase = await createServerSupabaseClient();

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      return { message: "Password updated successfully" };
    }
  );
  return action(formData);
};

/**
 * Sign out the current user
 */
export async function signOut(): Promise<ServerActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw AuthError.fromSupabaseError(error);
    }

    return { success: true, message: "Signed out successfully" };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof AuthError
          ? error.toUserMessage()
          : "Failed to sign out. Please try again.",
    };
  }
}
