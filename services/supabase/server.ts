import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AppError } from "@/lib/errors/AppError";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export class SupabaseServerError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, "API_ERROR", "high", cause);
  }
}

export async function createServerSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new SupabaseServerError("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new SupabaseServerError("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies();
          return cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        async setAll(cookiesList) {
          const cookieStore = await cookies();

          for (const cookie of cookiesList) {
            cookieStore.set({
              name: cookie.name,
              value: cookie.value,
              ...(cookie.options as Omit<ResponseCookie, "name" | "value">),
            });
          }
        },
      },
    }
  );
}
