"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { serverAuthSchemas } from "@/core/schemas/server/auth";
import { createServerSupabaseClient } from "@/core/supabase/server-utils";
import { ServerActionResult } from "@/lib/types/actions";
import { createAuthAction } from "../core/action-factory";

/**
 * Send OTP to phone number
 */
export async function sendPhoneOtp(
  formData: FormData,
): Promise<ServerActionResult> {
  const action = await createAuthAction(
    "sendPhoneOtp",
    serverAuthSchemas.phone.sendOtp,
    async ({ phone }) => {
      const supabase = await createServerSupabaseClient();

      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw AuthError.fromSupabaseError(error);

      return { message: "Verification code sent to your phone" };
    },
  );
  return action(formData);
}

/**
 * Verify phone OTP
 */
export async function verifyPhoneOtp(
  formData: FormData,
): Promise<ServerActionResult> {
  const action = await createAuthAction(
    "verifyPhoneOtp",
    serverAuthSchemas.phone.verifyOtp,
    async ({ phone, token }) => {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });

      if (error) throw AuthError.fromSupabaseError(error);

      return {
        message: "Phone number verified successfully",
        data: { user: data.user },
      };
    },
  );
  return action(formData);
}

/**
 * Sign up with phone number and additional metadata
 */
export async function signUpWithPhone(
  formData: FormData,
): Promise<ServerActionResult> {
  const action = await createAuthAction(
    "signUpWithPhone",
    serverAuthSchemas.phone.signUp,
    async ({ phone, fullName }) => {
      const supabase = await createServerSupabaseClient();

      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw AuthError.fromSupabaseError(error);

      return {
        message:
          "Verification code sent. Please verify your phone number to complete sign up.",
      };
    },
  );
  return action(formData);
}
