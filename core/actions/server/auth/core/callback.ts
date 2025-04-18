"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { createServerSupabaseClient } from "@/core/supabase/server-utils";
import { ServerActionResult } from "@/lib/types/actions";
import { redirect } from "next/navigation";
import { z } from "zod";

const callbackSchema = z.object({
  code: z.string(),
  next: z.string().optional(),
});

interface CallbackData {
  message: string;
  redirectTo: string;
}

/**
 * Generic callback handler for all auth methods
 * Handles code exchange and redirection
 */
export async function handleAuthCallback(
  formData: FormData
): Promise<ServerActionResult<CallbackData>> {
  try {
    const { code, next } = callbackSchema.parse({
      code: formData.get("code"),
      next: formData.get("next"),
    });

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw AuthError.fromSupabaseError(error);
    }

    return {
      success: true,
      message: "Authentication successful",
      data: {
        message: "Authentication successful",
        redirectTo: next || "/dashboard",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof AuthError ? error.toUserMessage() : "Authentication failed",
    };
  }
}

/**
 * Convenience wrapper that handles the callback and performs the redirect
 */
export async function handleAuthCallbackWithRedirect(code: string, next?: string): Promise<void> {
  const formData = new FormData();
  formData.append("code", code);
  if (next) formData.append("next", next);

  const result = await handleAuthCallback(formData);
  if (!result.success) {
    throw new AuthError(result.error || "Authentication failed");
  }

  redirect(result.data?.redirectTo || "/dashboard");
}
