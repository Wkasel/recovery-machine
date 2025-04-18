import { AppError } from "@/core/errors";
import { Logger } from "@/lib/logger/Logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userKeys } from "../keys/users";
import { userQueries } from "../queries/users/base";
import type { IUserProfile } from "../queries/users/server";

/**
 * Hook to fetch a user's profile
 */
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => userQueries.getUserProfile(userId),
    enabled: !!userId,
  });
}

/**
 * Hook to update a user's profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<IUserProfile> }) => {
      try {
        return await userQueries.updateUserProfile(userId, data);
      } catch (error) {
        Logger.getInstance().error(
          "Failed to update user profile",
          { component: "useUpdateUserProfile", userId },
          AppError.from(error)
        );
        throw AppError.from(error);
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Update profile error:", error);
    },
  });
}
