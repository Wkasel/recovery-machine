"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { serverAuthSchemas } from "@/core/schemas/server/auth";
import { createServerSupabaseClient } from "@/core/supabase/server";
import { createAuthAction } from "./core/action-factory";

/**
 * Send a magic link to the user's email
 */
export const sendMagicLink = async (formData: FormData) => {
  const action = await createAuthAction(
    "sendMagicLink",
    serverAuthSchemas.magicLink.send,
    async ({ email }) => {
      const supabase = await createServerSupabaseClient();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      return { message: "Magic link sent to your email" };
    }
  );
  return action(formData);
};

/**
 * Verify a magic link OTP code (for cases where automatic redirect doesn't work)
 */
export const verifyMagicLinkOtp = async (formData: FormData) => {
  const action = await createAuthAction(
    "verifyMagicLinkOtp",
    serverAuthSchemas.magicLink.verify,
    async ({ email, token }) => {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "magiclink",
      });

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      return {
        user: data.user,
        message: "Signed in successfully",
      };
    }
  );
  return action(formData);
};
