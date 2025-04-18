"use client";

import { Logger } from "@/lib/logger/Logger";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

// Loading context type
interface LoadingContextType {
  /**
   * Set loading state for a specific key
   * @param key - Unique identifier for the loading state
   * @param isLoading - Whether the key is in loading state
   */
  setLoading: (key: string, isLoading: boolean) => void;

  /**
   * Check if a specific key is in loading state
   * @param key - Unique identifier for the loading state
   */
  isLoading: (key: string) => boolean;

  /**
   * Get all keys that are currently in loading state
   */
  getLoadingKeys: () => string[];
}

// Create context with default values
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Loading provider component that manages loading states
 *
 * Wraps your application to provide loading state management
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Set loading state for a specific key
  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates((prev) => {
      // If the state isn't changing, don't update
      if (prev[key] === isLoading) return prev;

      Logger.getInstance().debug(isLoading ? "Loading started" : "Loading ended", {
        component: "LoadingProvider",
        key,
      });

      if (isLoading) {
        return { ...prev, [key]: true };
      } else {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      }
    });
  }, []);

  // Check if a specific key is in loading state
  const isLoading = useCallback(
    (key: string) => {
      return !!loadingStates[key];
    },
    [loadingStates]
  );

  // Get all keys that are currently in loading state
  const getLoadingKeys = useCallback(() => {
    return Object.keys(loadingStates);
  }, [loadingStates]);

  // Context value
  const value: LoadingContextType = {
    setLoading,
    isLoading,
    getLoadingKeys,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

/**
 * Hook to access the loading context
 *
 * @returns Loading context with methods for managing loading states
 * @throws Error if used outside of a LoadingProvider
 *
 * @example
 * ```tsx
 * const { setLoading, isLoading } = useLoading();
 *
 * const fetchData = async () => {
 *   setLoading('fetchData', true);
 *   try {
 *     await api.fetchData();
 *   } finally {
 *     setLoading('fetchData', false);
 *   }
 * };
 *
 * return (
 *   <div>
 *     {isLoading('fetchData') ? <Spinner /> : <Content />}
 *   </div>
 * );
 * ```
 */
export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);

  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }

  return context;
}

/**
 * Higher-order function that creates a loading hook for a specific domain
 *
 * @param prefix - Prefix for loading keys to avoid conflicts
 * @returns Hook with methods for managing loading states in a specific domain
 *
 * @example
 * ```tsx
 * // Define a domain-specific loading hook
 * export const useAuthLoading = createDomainLoading('auth');
 *
 * // Use in components
 * const { setLoading, isLoading } = useAuthLoading();
 *
 * // Loading states will be prefixed: 'auth.login', 'auth.register', etc.
 * setLoading('login', true);
 * ```
 */
export function createDomainLoading(prefix: string) {
  return function useDomainLoading() {
    const { setLoading, isLoading, getLoadingKeys } = useLoading();

    return {
      setLoading: (key: string, isLoading: boolean) => setLoading(`${prefix}.${key}`, isLoading),

      isLoading: (key: string) => isLoading(`${prefix}.${key}`),

      getLoadingKeys: () =>
        getLoadingKeys()
          .filter((key) => key.startsWith(`${prefix}.`))
          .map((key) => key.replace(`${prefix}.`, "")),
    };
  };
}
