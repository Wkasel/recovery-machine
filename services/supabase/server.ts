import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { Logger } from "@/lib/logger/Logger";
import { AppError } from "@/lib/errors/AppError";
import { cookies } from "next/headers";

export class SupabaseServerError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, "API_ERROR", "high", cause);
    this.name = "SupabaseServerError";
  }
}

export async function createServerSupabaseClient() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new SupabaseServerError("Supabase URL is not defined");
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new SupabaseServerError("Supabase anon key is not defined");
    }

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookies().set(name, value, options);
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
              Logger.getInstance().debug("Cookie set called from Server Component", {
                component: "serverSupabaseClient",
              });
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookies().delete(name, options);
            } catch (error) {
              Logger.getInstance().debug("Cookie remove called from Server Component", {
                component: "serverSupabaseClient",
              });
            }
          },
        },
      }
    );
  } catch (error) {
    Logger.getInstance().error(
      "Failed to create Supabase server client",
      { component: "serverSupabaseClient" },
      error instanceof SupabaseServerError
        ? error
        : new SupabaseServerError(
            "Failed to create Supabase server client",
            error instanceof Error ? error : undefined
          )
    );
    throw error instanceof SupabaseServerError
      ? error
      : new SupabaseServerError(
          "Failed to create Supabase server client",
          error instanceof Error ? error : undefined
        );
  }
}
