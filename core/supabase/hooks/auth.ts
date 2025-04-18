import { AppError } from "@/core/errors/base/AppError";
import { createBrowserSupabaseClient } from "@/core/supabase/client";
import { clientAuth } from "@/core/supabase/queries/auth/client";
import { Logger } from "@/lib/logger/Logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authKeys } from "../keys/auth";
import { userKeys } from "../keys/users";

/**
 * Hook to fetch the current user
 */
export function useUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      try {
        return await clientAuth.getUser();
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Return null instead of throwing to prevent cascade failures
        return null;
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch the current session
 */
export function useSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: clientAuth.getSession,
  });
}

/**
 * Hook to sign out the current user
 */
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

/**
 * Hook to update auth user data (email/password)
 */
export function useUpdateAuthUser() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  return useMutation({
    mutationFn: async ({ email, password }: { email?: string; password?: string }) => {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error } = await supabase.auth.updateUser({
          email,
          password,
        });
        if (error) throw error;
        return data;
      } catch (error) {
        Logger.getInstance().error(
          "Failed to update auth user",
          { component: "useUpdateAuthUser" },
          AppError.from(error)
        );
        throw AppError.from(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: userKeys.profile(user.id) });
      }
      toast.success("Auth details updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update auth details");
      console.error("Update auth user error:", error);
    },
  });
}

/**
 * Hook to subscribe to auth state changes
 */
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
