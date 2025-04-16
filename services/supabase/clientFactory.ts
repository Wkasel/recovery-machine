import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Logger } from "@/lib/logger/Logger";
import { AppError } from "@/lib/errors/AppError";

export async function getSupabaseClient() {
  if (typeof window !== "undefined") {
    // Client-side
    try {
      return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    } catch (error) {
      Logger.getInstance().error(
        "Failed to create Supabase browser client",
        { component: "clientFactory" },
        AppError.from(error)
      );
      throw AppError.from(error);
    }
  } else {
    // Server-side
    try {
      const cookieStore = await cookies();
      return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => {
                  cookieStore.set(name, value, options);
                });
              } catch (error) {
                // The `set` method was called from a Server Component.
              }
            },
          },
        }
      );
    } catch (error) {
      Logger.getInstance().error(
        "Failed to create Supabase server client",
        { component: "clientFactory" },
        AppError.from(error)
      );
      throw AppError.from(error);
    }
  }
}
