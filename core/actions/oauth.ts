"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithOAuth(provider: "google" | "github" | "discord") {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (data.url) {
    redirect(data.url);
  }
}