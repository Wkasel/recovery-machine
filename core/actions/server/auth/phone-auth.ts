"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { serverAuthSchemas } from "@/core/schemas/server/auth";
import { createServerSupabaseClient } from "@/core/supabase/server";
import { createAuthAction } from "./core/action-factory";

/**
 * Send OTP to phone number
 */
export const sendPhoneOtp = async (formData: FormData) => {
  const action = await createAuthAction(
    "sendPhoneOtp",
    serverAuthSchemas.phone.sendOtp,
    async ({ phone }) => {
      const supabase = await createServerSupabaseClient();

      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      return { message: "OTP sent to your phone" };
    }
  );
  return action(formData);
};

/**
 * Verify phone OTP
 */
export const verifyPhoneOtp = async (formData: FormData) => {
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

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      return { user: data.user, message: "Phone number verified successfully" };
    }
  );
  return action(formData);
};

/**
 * Phone sign-up with additional user metadata
 */
export const signUpWithPhone = async (formData: FormData) => {
  const action = await createAuthAction(
    "signUpWithPhone",
    serverAuthSchemas.phone.signUp,
    async ({ phone, fullName }) => {
      // First send OTP
      const supabase = await createServerSupabaseClient();

      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      return {
        message: "Verification code sent. Please verify your phone number to complete sign up.",
      };
    }
  );
  return action(formData);
};
