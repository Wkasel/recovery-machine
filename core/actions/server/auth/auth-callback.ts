"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { createServerSupabaseClient } from "@/core/supabase/server";
import { ServerActionResult } from "@/lib/types/actions";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuthAction } from "./core/action-factory";

const authCallbackSchema = z.object({
  code: z.string(),
});

async function handleAuthCallbackInner(
  data: z.infer<typeof authCallbackSchema>
): Promise<{ message: string }> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.exchangeCodeForSession(data.code);

  if (error) {
    throw AuthError.fromSupabaseError(error);
  }

  return { message: "Authentication successful" };
}

export const handleAuthCallback = async (
  formData: FormData
): Promise<ServerActionResult<{ message: string }>> => {
  const action = await createAuthAction(
    "handleAuthCallback",
    authCallbackSchema,
    handleAuthCallbackInner
  );
  return action(formData);
};

export async function handleAuthCallbackWithRedirect(code: string): Promise<void> {
  const formData = new FormData();
  formData.append("code", code);
  const result = await handleAuthCallback(formData);
  if (!result.success) {
    throw new AuthError(result.error || "Authentication failed");
  }
  redirect("/dashboard");
}
