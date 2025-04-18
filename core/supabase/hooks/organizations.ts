import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationKeys } from "../keys/organizations";
import { organizationQueries } from "../queries/organizations/base";
import { toast } from "sonner";
import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";
import type { Organization } from "@/lib/types/supabase";

/**
 * Hook to fetch a single organization
 */
export function useOrganization(orgId: string) {
  return useQuery({
    queryKey: organizationKeys.detail(orgId),
    queryFn: () => organizationQueries.getOrganization(orgId),
    enabled: !!orgId,
  });
}

/**
 * Hook to fetch organizations for a user
 */
export function useUserOrganizations(userId: string) {
  return useQuery({
    queryKey: organizationKeys.list(userId),
    queryFn: () => organizationQueries.getUserOrganizations(userId),
    enabled: !!userId,
  });
}

/**
 * Hook to update an organization
 */
export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      { orgId, data }: { orgId: string; data: Partial<Organization> },
    ) => {
      try {
        return await organizationQueries.updateOrganization(orgId, data);
      } catch (error) {
        Logger.getInstance().error(
          "Failed to update organization",
          { component: "useUpdateOrganization", orgId },
          AppError.from(error),
        );
        throw AppError.from(error);
      }
    },
    onSuccess: (_, { orgId }) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.detail(orgId),
      });
      toast.success("Organization updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update organization");
      console.error("Update organization error:", error);
    },
  });
}
