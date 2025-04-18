"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { serverAuthSchemas } from "@/core/schemas/server/auth";
import { createServerSupabaseClient } from "@/core/supabase/server-utils";
import { ServerActionResult } from "@/lib/types/actions";
import { headers } from "next/headers";
import { createAuthAction } from "../core/action-factory";

/**
 * Send a magic link to the user's email
 */
export async function sendMagicLink(
  formData: FormData,
): Promise<ServerActionResult> {
  const action = await createAuthAction(
    "sendMagicLink",
    serverAuthSchemas.magicLink.send,
    async ({ email }) => {
      const supabase = await createServerSupabaseClient();
      const appHeaders = await headers();
      const origin = appHeaders.get("origin");
      const callbackUrl = formData.get("callbackUrl")?.toString();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback?redirect_to=${
            callbackUrl || "/dashboard"
          }`,
        },
      });

      if (error) throw AuthError.fromSupabaseError(error);

      return { message: "Magic link sent to your email" };
    },
  );
  return action(formData);
}

/**
 * Verify a magic link OTP code
 * Used when automatic redirect doesn't work
 */
export async function verifyMagicLinkOtp(
  formData: FormData,
): Promise<ServerActionResult> {
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

      if (error) throw AuthError.fromSupabaseError(error);

      return {
        message: "Successfully verified",
        data: { user: data.user },
      };
    },
  );
  return action(formData);
}
