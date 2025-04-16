import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/services/supabase/client";
import { toast } from "sonner";
import { AppError } from "@/lib/errors/AppError";
import { Logger } from "@/lib/logger/Logger";
import * as authQueries from "@/services/supabase/queries/auth";
import * as userQueries from "@/services/supabase/queries/users";

// Query keys
export const authKeys = {
  user: ["auth", "user"] as const,
  session: ["auth", "session"] as const,
  profile: (userId: string) => ["auth", "profile", userId] as const,
};

// Hooks
export function useUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
      } catch (error) {
        Logger.getInstance().error(
          "Failed to get user",
          { component: "useUser" },
          AppError.from(error)
        );
        throw AppError.from(error);
      }
    },
  });
}

export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
      } catch (error) {
        Logger.getInstance().error(
          "Failed to get session",
          { component: "useSession" },
          AppError.from(error)
        );
        throw AppError.from(error);
      }
    },
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: authKeys.profile(userId),
    queryFn: () => userQueries.getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        const supabase = createBrowserSupabaseClient();
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        Logger.getInstance().error(
          "Failed to sign out",
          { component: "useSignOut" },
          AppError.from(error)
        );
        throw AppError.from(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      queryClient.invalidateQueries({ queryKey: authKeys.session });
      router.push("/sign-in");
      toast.success("Successfully signed out");
    },
    onError: (error) => {
      toast.error("Failed to sign out");
      console.error("Sign out error:", error);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      profile,
    }: {
      email?: string;
      password?: string;
      profile?: Partial<userQueries.UserProfile>;
    }) => {
      try {
        const supabase = createBrowserSupabaseClient();
        let authData;

        if (email || password) {
          const { data, error: authError } = await supabase.auth.updateUser({
            email,
            password,
          });
          if (authError) throw authError;
          authData = data;
        }

        if (profile && authData?.user) {
          const updatedProfile = await userQueries.updateUserProfile(authData.user.id, profile);
          return { auth: authData, profile: updatedProfile };
        }

        return { auth: authData };
      } catch (error) {
        Logger.getInstance().error(
          "Failed to update user",
          { component: "useUpdateUser" },
          AppError.from(error)
        );
        throw AppError.from(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Update user error:", error);
    },
  });
}

export function useAuthStateChange() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return {
    subscribe: () => {
      const supabase = createBrowserSupabaseClient();
      return supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
          queryClient.invalidateQueries({ queryKey: authKeys.user });
          queryClient.invalidateQueries({ queryKey: authKeys.session });
          router.push("/protected");
        } else if (event === "SIGNED_OUT") {
          queryClient.invalidateQueries({ queryKey: authKeys.user });
          queryClient.invalidateQueries({ queryKey: authKeys.session });
          router.push("/sign-in");
        }
      });
    },
  };
}
