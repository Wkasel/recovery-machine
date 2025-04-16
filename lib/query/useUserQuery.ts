import { useQuery } from "@tanstack/react-query";
import { createBrowserSupabaseClient } from "@/services/supabase/client";

export function useUserQuery() {
  return useQuery({
    queryKey: ["supabase", "user"],
    queryFn: async () => {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
