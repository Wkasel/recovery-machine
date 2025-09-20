"use client";

import { useAuth } from "@/components/auth/AuthContext";

export function useUser() {
  const { user, isLoading } = useAuth();
  return { data: user, isLoading };
}

export function useSignOut() {
  const { signOut: contextSignOut } = useAuth();

  return {
    mutate: contextSignOut,
    mutateAsync: contextSignOut,
  };
}
