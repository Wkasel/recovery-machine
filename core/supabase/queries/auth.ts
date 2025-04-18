// services/supabase/queries/auth.ts
// TanStack Query hooks for auth will go here.

import { AppError } from "@/core/errors/base/AppError";
import { Logger } from "@/lib/logger/Logger";
import { createServerSupabaseClient } from "../server";

export async function getUserById(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) throw error;
    return data.user;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get user by ID",
      { component: "authQueries", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}

export async function getUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return user;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get current user",
      { component: "authQueries" },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}

export async function getSession() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    return session;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get session",
      { component: "authQueries" },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}
