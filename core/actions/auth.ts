"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// Simple auth schemas
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const magicLinkSchema = z.object({
  email: z.string().email(),
});

// Auth actions
export async function signIn(formData: FormData) {
  const data = signInSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const redirectTo = formData.get("redirectTo") as string | null;

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return a friendlier error message
    throw new Error("Invalid login credentials");
  }

  // Redirect to the specified URL or default to /profile
  // Only allow internal redirects (starting with /)
  const targetUrl = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/profile";
  redirect(targetUrl);
}

export async function signUp(formData: FormData) {
  const data = signUpSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/verify-email?email=${encodeURIComponent(data.email)}`);
}

export async function sendMagicLink(formData: FormData) {
  const data = magicLinkSchema.parse({
    email: formData.get("email"),
  });

  const redirectTo = formData.get("redirectTo") as string | null;

  const supabase = await createServerSupabaseClient();

  // Auto-detect the current URL from Vercel or other environment
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL ||
      process.env.SITE_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3002"
        : "https://therecoverymachine.co");

  // Build the callback URL with optional redirect
  const callbackUrl = new URL(`${baseUrl}/auth/callback`);
  if (redirectTo && redirectTo.startsWith("/")) {
    callbackUrl.searchParams.set("next", redirectTo);
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, message: "Check your email for the magic link!" };
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}

export async function signOutWithRedirect() {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}

export async function getUser() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}
