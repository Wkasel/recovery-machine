import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabaseClient(): any {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    // Return a mock client for SSR/build time
    return null as any;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createBrowserClient(supabaseUrl, supabaseKey);
}

// Legacy export for compatibility
export const createClient = createBrowserSupabaseClient;
