"use server";

import { AuthError } from "@/core/errors/auth/AuthError";
import { AppError } from "@/core/errors/base/AppError";
import { createServerSupabaseClient } from "@/core/supabase/server";
import { Logger } from "@/lib/logger/Logger";
import { redirect } from "next/navigation";

/**
 * Signs the user out and redirects to the sign-in page
 */
export async function signOutAction() {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw AuthError.fromSupabaseError(error);
    return redirect("/sign-in");
  } catch (error) {
    Logger.getInstance().error(
      "Sign out failed",
      { component: "signOutAction" },
      AppError.from(error)
    );
    return redirect("/sign-in");
  }
}
