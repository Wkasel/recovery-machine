"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { createServerSupabaseClient } from "@/core/supabase/server-utils";
import { ServerActionResult } from "@/lib/types/actions";
import { redirect } from "next/navigation";

/**
 * Signs the user out
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
      error: error instanceof AuthError
        ? error.toUserMessage()
        : "Failed to sign out",
    };
  }
}

/**
 * Signs the user out and redirects to the sign-in page
 */
export async function signOutWithRedirect(
  redirectTo: string = "/sign-in",
): Promise<void> {
  const result = await signOut();
  if (!result.success) {
    throw new AuthError(result.error || "Failed to sign out");
  }
  redirect(redirectTo);
}
