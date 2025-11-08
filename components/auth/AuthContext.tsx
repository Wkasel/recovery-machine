"use client";

import { getUser, signOut as clientSignOut } from "@/lib/auth/client-auth";
import { IUser } from "@/lib/types/auth";
import type { User } from "@supabase/supabase-js";
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

  const refreshUser = async () => {
    try {
      setIsLoading(true);

      // Get the user, which will return null if not authenticated
      const userData = await getUser();

      // Set the user data (already in IUser format from API)
      setUser(userData);
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
      await clientSignOut();

      // Update local state
      setUser(null);

      // Force a page reload to clear all cached state
      // This is safer than trying to clear query cache
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error("Error signing out:", error);
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
