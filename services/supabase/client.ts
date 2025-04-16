import { createBrowserClient } from "@supabase/ssr";
import { Logger } from "@/lib/logger/Logger";
import { AppError } from "@/lib/errors/AppError";

export function createBrowserSupabaseClient() {
  try {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  } catch (error) {
    Logger.getInstance().error(
      "Failed to create Supabase browser client",
      { component: "browserSupabaseClient" },
      AppError.from(error)
    );
    throw AppError.from(error);
  }
}
