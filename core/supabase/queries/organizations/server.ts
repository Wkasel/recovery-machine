"use server";

import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";
import type { Organization } from "@/lib/types/supabase";
import { createServerSupabaseClient } from "../../server-utils";

/**
 * Get an organization by ID
 */
export async function getOrganization(orgId: string): Promise<Organization | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get organization",
      { component: "getOrganization", orgId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}

/**
 * Get organizations for a user
 */
export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("organizations").select("*").eq("owner_id", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    Logger.getInstance().error(
      "Failed to get user organizations",
      { component: "getUserOrganizations", userId },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}
