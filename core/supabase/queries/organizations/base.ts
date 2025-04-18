import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";
import type { Organization } from "@/lib/types/supabase";
import { createBrowserSupabaseClient } from "../../client";

/**
 * Base client-side organization queries (used by hooks)
 */
export const organizationQueries = {
    /**
     * Get an organization by ID
     */
    async getOrganization(orgId: string): Promise<Organization | null> {
        try {
            const supabase = createBrowserSupabaseClient();
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
                { component: "organizationQueries.getOrganization", orgId },
                AppError.from(error),
            );
            throw AppError.from(error);
        }
    },

    /**
     * Get organizations for a user
     */
    async getUserOrganizations(userId: string): Promise<Organization[]> {
        try {
            const supabase = createBrowserSupabaseClient();
            const { data, error } = await supabase
                .from("organizations")
                .select("*")
                .eq("owner_id", userId);

            if (error) throw error;
            return data;
        } catch (error) {
            Logger.getInstance().error(
                "Failed to get user organizations",
                {
                    component: "organizationQueries.getUserOrganizations",
                    userId,
                },
                AppError.from(error),
            );
            throw AppError.from(error);
        }
    },

    /**
     * Update an organization
     */
    async updateOrganization(
        orgId: string,
        data: Partial<Organization>,
    ): Promise<Organization> {
        try {
            const supabase = createBrowserSupabaseClient();
            const { data: updatedOrg, error } = await supabase
                .from("organizations")
                .update(data)
                .eq("id", orgId)
                .select()
                .single();

            if (error) throw error;
            return updatedOrg;
        } catch (error) {
            Logger.getInstance().error(
                "Failed to update organization",
                { component: "organizationQueries.updateOrganization", orgId },
                AppError.from(error),
            );
            throw AppError.from(error);
        }
    },
};
