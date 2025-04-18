import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";
import { queryClient } from "@/lib/query/config";
import type { Organization } from "@/lib/types/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { organizationKeys } from "../../keys/organizations";
import { organizationQueries } from "./base";

/**
 * Client-side organization hooks (React Query)
 */
export const clientOrganizations = {
  /**
   * Hook to get an organization
   */
  useOrganization(orgId: string) {
    return useQuery({
      queryKey: organizationKeys.detail(orgId),
      queryFn: () => organizationQueries.getOrganization(orgId),
      enabled: Boolean(orgId),
    });
  },

  /**
   * Hook to get user organizations
   */
  useUserOrganizations(userId: string) {
    return useQuery({
      queryKey: organizationKeys.list(userId),
      queryFn: () => organizationQueries.getUserOrganizations(userId),
      enabled: Boolean(userId),
    });
  },

  /**
   * Hook to update an organization
   */
  useUpdateOrganization() {
    return useMutation({
      mutationFn: ({ orgId, data }: { orgId: string; data: Partial<Organization> }) =>
        organizationQueries.updateOrganization(orgId, data),
      onSuccess: (data, variables) => {
        // Invalidate both the detail query and the user's list
        queryClient.invalidateQueries({
          queryKey: organizationKeys.detail(variables.orgId),
        });
        // Note: If we know the userId, we could also invalidate the list query
      },
      onError: (error) => {
        Logger.getInstance().error(
          "Failed to update organization with mutation",
          { component: "clientOrganizations.useUpdateOrganization" },
          AppError.from(error)
        );
      },
    });
  },
};
