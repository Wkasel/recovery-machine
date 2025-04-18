"use server";

import { AppError } from "@/core/errors/base/AppError";
import { type IUserProfile } from "@/core/supabase/queries/users/server";
import { createServerSupabaseClient } from "@/core/supabase/server-utils";
import { ServerActionResult } from "@/core/types";
import { Logger } from "@/lib/logger/Logger";

export async function getUserProfileAction(
  userId: string,
): Promise<ServerActionResult<IUserProfile>> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("profiles").select("*").eq(
      "id",
      userId,
    ).single();

    if (error) throw error;
    return {
      success: true,
      data: data as IUserProfile,
    };
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get user profile",
      { component: "userActions", userId },
      AppError.from(error),
    );
    return {
      success: false,
      error: AppError.from(error).toUserMessage(),
    };
  }
}

export async function updateUserProfileAction(
  userId: string,
  profile: Partial<IUserProfile>,
): Promise<ServerActionResult<IUserProfile>> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return {
      success: true,
      data: data as IUserProfile,
      message: "Profile updated successfully",
    };
  } catch (error) {
    Logger.getInstance().error(
      "Failed to update user profile",
      { component: "userActions", userId },
      AppError.from(error),
    );
    return {
      success: false,
      error: AppError.from(error).toUserMessage(),
    };
  }
}
