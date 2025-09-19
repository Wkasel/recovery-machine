"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { signOut } from "@/core/actions/auth";
import { IUser } from "@/lib/types/auth";

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