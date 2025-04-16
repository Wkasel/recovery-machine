"use server";

import { encodedRedirect } from "@/utils/utils";
import { createServerSupabaseClient } from "@/services/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Logger } from "@/lib/logger";
import { z } from "zod";
import { AppError } from "@/lib/errors/AppError";
import { AuthError } from "@/lib/errors/AuthError";

const authSchema = {
  signUp: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
  signIn: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
  resetPassword: z
    .object({
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
};

export const signUpAction = async (formData: FormData) => {
  try {
    const parsed = authSchema.signUp.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const supabase = await createServerSupabaseClient();
    const origin = (await headers()).get("origin");

    const { error } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) throw AuthError.from(error);

    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors[0]?.message || "Invalid form data";
      return encodedRedirect("error", "/sign-up", message);
    }

    Logger.getInstance().error(
      "Sign up failed",
      { component: "signUpAction" },
      AppError.from(error)
    );
    return encodedRedirect(
      "error",
      "/sign-up",
      error instanceof AuthError ? error.toUserMessage() : "Sign up failed"
    );
  }
};

export const signInAction = async (formData: FormData) => {
  try {
    const parsed = authSchema.signIn.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword(parsed);

    if (error) throw AuthError.from(error);

    return redirect("/protected");
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors[0]?.message || "Invalid form data";
      return encodedRedirect("error", "/sign-in", message);
    }

    Logger.getInstance().error(
      "Sign in failed",
      { component: "signInAction" },
      AppError.from(error)
    );
    return encodedRedirect(
      "error",
      "/sign-in",
      error instanceof AuthError ? error.toUserMessage() : "Sign in failed"
    );
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  try {
    const email = z.string().email("Invalid email address").parse(formData.get("email"));
    const supabase = await createServerSupabaseClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) throw AuthError.from(error);

    if (callbackUrl) {
      return redirect(callbackUrl);
    }

    return encodedRedirect(
      "success",
      "/forgot-password",
      "Check your email for a link to reset your password."
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return encodedRedirect("error", "/forgot-password", "Please enter a valid email address");
    }

    Logger.getInstance().error(
      "Password reset failed",
      { component: "forgotPasswordAction" },
      AppError.from(error)
    );
    return encodedRedirect(
      "error",
      "/forgot-password",
      error instanceof AuthError ? error.toUserMessage() : "Could not reset password"
    );
  }
};

export const resetPasswordAction = async (formData: FormData) => {
  try {
    const parsed = authSchema.resetPassword.parse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password: parsed.password,
    });

    if (error) throw AuthError.from(error);

    return encodedRedirect("success", "/protected/reset-password", "Password updated");
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors[0]?.message || "Invalid password";
      return encodedRedirect("error", "/protected/reset-password", message);
    }

    Logger.getInstance().error(
      "Password reset failed",
      { component: "resetPasswordAction" },
      AppError.from(error)
    );
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      error instanceof AuthError ? error.toUserMessage() : "Password update failed"
    );
  }
};

export const signOutAction = async () => {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw AuthError.from(error);
    return redirect("/sign-in");
  } catch (error) {
    Logger.getInstance().error(
      "Sign out failed",
      { component: "signOutAction" },
      AppError.from(error)
    );
    return redirect("/sign-in");
  }
};

// Example Zod schema for a server action
const exampleSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function zodValidatedAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = exampleSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }
  // Do something with parsed.data
  return { data: parsed.data };
}
