"use server";

import { createServerSupabaseClient } from "@/core/supabase/server";
import { AppError } from "@/lib/errors/AppError";
import { AuthError } from "@/lib/errors/AuthError";
import { Logger } from "@/lib/logger/Logger";
import { headers } from "next/headers";
import { z } from "zod";

/**
 * Magic link form schema
 */
const magicLinkSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * Sends a magic link to the user's email for passwordless authentication
 */
export async function sendMagicLinkAction(formData: FormData) {
  try {
    const email = magicLinkSchema.parse({
      email: formData.get("email"),
    }).email;

    const supabase = await createServerSupabaseClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?redirect_to=${callbackUrl || "/protected"}`,
      },
    });

    if (error) throw AuthError.from(error);

    return { success: true, message: "Magic link sent to your email" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Please enter a valid email address",
      };
    }

    Logger.getInstance().error(
      "Magic link authentication failed",
      { component: "sendMagicLinkAction" },
      AppError.from(error)
    );

    return {
      success: false,
      error: error instanceof AuthError ? error.toUserMessage() : "Could not send magic link",
    };
  }
}

/**
 * Verifies an OTP code sent to the user's email
 */
export async function verifyOtpAction(formData: FormData) {
  try {
    const email = z.string().email().parse(formData.get("email"));
    const token = z.string().min(6).parse(formData.get("token"));

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) throw AuthError.from(error);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Invalid verification code",
      };
    }

    Logger.getInstance().error(
      "OTP verification failed",
      { component: "verifyOtpAction" },
      AppError.from(error)
    );

    return {
      success: false,
      error: error instanceof AuthError ? error.toUserMessage() : "Could not verify code",
    };
  }
}
