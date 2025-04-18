"use client";

import { signOutWithRedirect } from "@/core/actions/server/auth/core/sign-out";
import { getUser } from "@/core/supabase/queries/auth/server";
import { IUser } from "@/core/types";
import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextValue {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Helper function to convert User to IUser
function convertUserToIUser(user: User | null): IUser | null {
  if (!user) return null;

  return {
    ...user,
    email: user.email || null,
    user_metadata: user.user_metadata || {},
  } as IUser;
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const refreshUser = async () => {
    try {
      setIsLoading(true);

      // Get the user, which will return null if not authenticated (we fixed the server code)
      const userData = await getUser();

      // Convert and set the user data
      const convertedUser = convertUserToIUser(userData);
      setUser(convertedUser);
    } catch (error) {
      console.error("Unhandled error in refreshUser:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const signOut = async () => {
    try {
      setIsLoading(true);
      await signOutWithRedirect();

      // Reset cached data
      queryClient.clear();

      // Update local state
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
