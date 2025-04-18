"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { createServerSupabaseClient } from "@/core/supabase/server";
import type { ServerActionResult } from "@/lib/types/actions";
import { Provider } from "@supabase/supabase-js";
import { createRedirectAction } from "./core/action-factory";

// Provider types
export type OAuthProvider = Provider;

// OAuth configuration options
export interface OAuthOptions {
  redirectTo?: string;
  scopes?: string;
  queryParams?: Record<string, string>;
}

/**
 * Sign in with OAuth provider
 */
export const signInWithOAuth = async (provider: OAuthProvider) => {
  const action = await createRedirectAction("signInWithOAuth", async (provider: OAuthProvider) => {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      throw AuthError.fromSupabaseError(error);
    }

    if (!data.url) {
      throw new AuthError("No redirect URL returned from OAuth provider");
    }

    return data.url;
  });
  return action(provider);
};

/**
 * Handle OAuth callback
 * This is called after the OAuth provider redirects back to the app
 */
export async function handleOAuthCallback(code: string): Promise<ServerActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw AuthError.fromSupabaseError(error);
    }

    return { success: true, message: "Authentication successful" };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof AuthError
          ? error.toUserMessage()
          : "Authentication failed. Please try again.",
    };
  }
}

/**
 * Links an OAuth provider to an existing account
 * Must be called when user is already signed in
 */
export const linkOAuthProvider = async (provider: OAuthProvider, options?: OAuthOptions) => {
  const action = await createRedirectAction(
    "linkOAuthProvider",
    async (provider: OAuthProvider, options?: OAuthOptions) => {
      const supabase = await createServerSupabaseClient();

      // Check if user is signed in
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw AuthError.unauthorized();
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo:
            options?.redirectTo ||
            `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?linking=true`,
          scopes: options?.scopes,
          queryParams: options?.queryParams,
        },
      });

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      return data.url;
    }
  );
  return action(provider, options);
};

/**
 * Unlinks an OAuth provider from an account
 */
export async function unlinkOAuthProvider(provider: OAuthProvider): Promise<ServerActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    // This functionality requires custom implementation at the database level
    // as Supabase doesn't provide this out of the box

    // Example implementation would require:
    // 1. Get user identities
    // 2. Filter out the provider to unlink
    // 3. Update user identities in the database

    // For now, return a message to implement this with a custom function
    return {
      success: false,
      error: "This functionality requires custom implementation with a Supabase Edge Function",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof AuthError
          ? error.toUserMessage()
          : "Failed to unlink provider. Please try again.",
    };
  }
}
