import { QueryClient } from "@tanstack/react-query";

/**
 * Shared React Query client configuration.
 * Note: Auth-related queries are in services/auth/hooks.ts
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
    },
  },
});
