"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { createServerSupabaseClient } from "@/core/supabase/server-utils";
import { ServerActionResult } from "@/lib/types/actions";
import { Provider } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

// Provider types
export type OAuthProvider = Provider;

// OAuth configuration options
export interface OAuthOptions {
  redirectTo?: string;
  scopes?: string;
  queryParams?: Record<string, string>;
}

// Schema for Google One Tap
const googleOneTapSchema = z.object({
  credential: z.string(),
  nonce: z.string(),
});

/**
 * Generate a URL for OAuth sign in
 */
export async function generateOAuthURL(
  provider: Provider,
  redirectTo: string,
): Promise<ServerActionResult<string>> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: origin + "/auth/callback?next=" + redirectTo,
      },
    });

    if (error) {
      throw AuthError.fromSupabaseError(error);
    }

    return {
      success: true,
      data: data.url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof AuthError
        ? error.toUserMessage()
        : "Failed to generate OAuth URL",
    };
  }
}

/**
 * Sign in with OAuth without redirect
 */
export async function signInWithOAuth(
  provider: Provider,
  redirectTo: string = "/protected",
): Promise<ServerActionResult> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: origin + "/auth/callback?next=" + redirectTo,
      },
    });

    if (error) {
      throw AuthError.fromSupabaseError(error);
    }

    return {
      success: true,
      message: "OAuth sign in initiated",
      data: {
        url: data?.url || null,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof AuthError
        ? error.toUserMessage()
        : "Failed to sign in with OAuth",
    };
  }
}

/**
 * Sign up with OAuth without redirect
 */
export async function signUpWithOAuth(
  provider: Provider,
  redirectTo: string = "/protected",
): Promise<ServerActionResult> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: origin + "/auth/callback?next=" + redirectTo,
      },
    });

    if (error) {
      throw AuthError.fromSupabaseError(error);
    }

    return {
      success: true,
      message: "OAuth sign up initiated",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof AuthError
        ? error.toUserMessage()
        : "Failed to sign up with OAuth",
    };
  }
}

/**
 * Sign in with Google One Tap
 */
export async function signInWithGoogleOneTap(
  formData: FormData,
): Promise<ServerActionResult> {
  try {
    const { credential, nonce } = googleOneTapSchema.parse({
      credential: formData.get("credential"),
      nonce: formData.get("nonce"),
    });

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: credential,
      nonce,
    });

    if (error) throw AuthError.fromSupabaseError(error);

    return {
      success: true,
      message: "Signed in successfully",
      data: { user: data.user },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof AuthError
        ? error.toUserMessage()
        : "Failed to sign in",
    };
  }
}

/**
 * Link OAuth provider to existing account
 */
export async function linkOAuthProvider(
  provider: OAuthProvider,
  options?: OAuthOptions,
): Promise<void> {
  try {
    const supabase = await createServerSupabaseClient();
    const appHeaders = await headers();
    const origin = appHeaders.get("origin");
    const redirectTo = options?.redirectTo || "/auth/callback?linking=true";

    // Check if user is signed in
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw AuthError.unauthorized();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}${redirectTo}`,
        scopes: options?.scopes,
        queryParams: options?.queryParams,
      },
    });

    if (error) throw AuthError.fromSupabaseError(error);
    if (!data?.url) {
      throw new AuthError("No redirect URL returned from OAuth provider");
    }

    redirect(data.url);
  } catch (error) {
    throw error instanceof AuthError
      ? error
      : new AuthError("Failed to link OAuth provider");
  }
}
