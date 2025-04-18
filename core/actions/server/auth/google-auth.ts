"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { AppError } from "@/core/errors/base/AppError";
import { createServerSupabaseClient } from "@/core/supabase/server";
import { Logger } from "@/lib/logger/Logger";
import { ServerActionResult } from "@/lib/types/actions";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Handle Google OAuth callback
 * This is typically used by middleware to complete the OAuth flow
 */
export async function handleGoogleOAuthCallback(
  code: string,
  state: string
): Promise<ServerActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) throw AuthError.fromSupabaseError(error);

    return { success: true, data: { session: data.session }, message: "Authentication successful" };
  } catch (error) {
    Logger.getInstance().error(
      "Google OAuth callback failed",
      { component: "handleGoogleOAuthCallback" },
      AppError.from(error)
    );

    return {
      success: false,
      error: error instanceof AuthError ? error.toUserMessage() : "Authentication failed",
    };
  }
}

/**
 * Initiates Google OAuth sign-in flow
 */
export async function signInWithGoogleAction() {
  try {
    const supabase = await createServerSupabaseClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = "/auth/callback";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}${callbackUrl}`,
        queryParams: {
          prompt: "select_account", // Always show account selector
        },
      },
    });

    if (error) throw AuthError.fromSupabaseError(error);

    if (!data?.url) {
      throw new AuthError("No redirect URL returned from OAuth provider");
    }

    return redirect(data.url);
  } catch (error) {
    Logger.getInstance().error(
      "Google authentication failed",
      { component: "signInWithGoogleAction" },
      AppError.from(error)
    );

    throw error;
  }
}
