"use server";

import { createServerSupabaseClient } from "@/core/supabase/server";
import { AuthError } from "@/lib/errors/AuthError";
import { serverAuthSchemas } from "@/lib/schemas";
import { createAuthAction } from "./core/action-factory";

export const signInWithGoogleOneTap = async (formData: FormData) => {
  const action = await createAuthAction(
    "signInWithGoogleOneTap",
    serverAuthSchemas.googleOneTap.signIn,
    async ({ credential, nonce }) => {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: credential,
        nonce,
      });

      if (error) {
        throw AuthError.fromSupabaseError(error);
      }

      return { user: data.user, message: "Signed in successfully" };
    }
  );
  return action(formData);
};
