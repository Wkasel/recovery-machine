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

// Auth action result types
type AuthResult = { success: true } | { success: false; error: string };

// Auth actions
export async function signIn(formData: FormData): Promise<AuthResult> {
  // Validate input first
  const parseResult = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parseResult.success) {
    return { success: false, error: "Please enter a valid email and password" };
  }

  const data = parseResult.data;
  const redirectTo = formData.get("redirectTo") as string | null;

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return error instead of throwing to prevent Server Components render errors
    return { success: false, error: "Invalid login credentials" };
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

// Password reset request
const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export async function requestPasswordReset(formData: FormData): Promise<AuthResult> {
  const parseResult = resetPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parseResult.success) {
    return { success: false, error: "Please enter a valid email address" };
  }

  const { email } = parseResult.data;

  const supabase = await createServerSupabaseClient();

  // Get the base URL for the reset callback
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL ||
      process.env.SITE_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://therecoverymachine.co");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    // Don't reveal if email exists or not for security
    console.error("Password reset error:", error);
  }

  // Always return success to prevent email enumeration attacks
  return { success: true };
}

// Update password (after clicking reset link)
const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const parseResult = updatePasswordSchema.safeParse({
    password: formData.get("password"),
  });

  if (!parseResult.success) {
    return { success: false, error: parseResult.error.errors[0]?.message || "Invalid password" };
  }

  const { password } = parseResult.data;

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Password update error:", error);
    return { success: false, error: "Failed to update password. Please try again." };
  }

  redirect("/profile");
}
