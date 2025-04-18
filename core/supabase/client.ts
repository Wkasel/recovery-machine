import { AppError } from "@/core/errors/base/AppError";
import { Logger } from "@/lib/logger/Logger";
import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabaseClient() {
  try {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  } catch (error) {
    Logger.getInstance().error(
      "Failed to create Supabase browser client",
      { component: "browserSupabaseClient" },
      AppError.from(error),
    );
    throw AppError.from(error);
  }
}
