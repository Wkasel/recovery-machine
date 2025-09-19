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

  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase.auth.signInWithPassword(data);
  
  if (error) {
    throw new Error(error.message);
  }
  
  redirect("/profile");
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
  
  redirect("/verify-email");
}

export async function sendMagicLink(formData: FormData) {
  const data = magicLinkSchema.parse({
    email: formData.get("email"),
  });

  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
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