import type { IUserProfile } from "./server";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userKeys } from "../../keys/users";
import { queryClient } from "@/lib/query/config";
import { userQueries } from "./base";
import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";

/**
 * Client-side user hooks (React Query)
 */
export const clientUsers = {
  /**
   * Hook to get user profile
   */
  useProfile(userId: string) {
    return useQuery({
      queryKey: userKeys.profile(userId),
      queryFn: () => userQueries.getUserProfile(userId),
      enabled: Boolean(userId),
    });
  },

  /**
   * Hook to update user profile
   */
  useUpdateProfile() {
    return useMutation({
      mutationFn: (
        { userId, profile }: { userId: string; profile: Partial<IUserProfile> },
      ) => userQueries.updateUserProfile(userId, profile),
      onSuccess: (data, variables) => {
        // Invalidate the profile query to refetch updated data
        queryClient.invalidateQueries({
          queryKey: userKeys.profile(variables.userId),
        });
      },
      onError: (error) => {
        Logger.getInstance().error(
          "Failed to update profile with mutation",
          { component: "clientUsers.useUpdateProfile" },
          AppError.from(error),
        );
      },
    });
  },
};
