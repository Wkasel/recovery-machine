import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "@/services/supabase/clientFactory";

export function useUserQuery() {
  return useQuery({
    queryKey: ["supabase", "user"],
    queryFn: async () => {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}
