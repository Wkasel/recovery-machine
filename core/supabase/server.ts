import { AppError } from "@/core/errors/base/AppError";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { DbClient } from "./types";

export class SupabaseServerError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, "API_ERROR", "high", cause);
  }
}

export async function createServerSupabaseClient(): Promise<DbClient> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.delete(name, options);
        },
      },
    }
  );
}
