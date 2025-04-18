import { AuthError } from "@/core/errors/auth/AuthError";
import { createServerSupabaseClient } from "@/core/supabase/server-utils";
import { Logger } from "@/lib/logger/Logger";
import { NextRequest, NextResponse } from "next/server";

type EmailOtpType = "signup" | "magiclink" | "recovery" | "invite" | "email" | "email-change";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") ?? "/protected";
    const type = requestUrl.searchParams.get("type") as EmailOtpType;

    if (!code) {
      throw new AuthError("authCallbackFailed", "No code provided");
    }

    const supabase = await createServerSupabaseClient();

    if (type === "email") {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: code,
        type,
      });
      if (error) throw AuthError.fromSupabaseError(error);
    } else {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw AuthError.fromSupabaseError(error);
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin));
  } catch (error) {
    Logger.getInstance().error(
      "Auth callback failed",
      { component: "auth-callback" },
      error instanceof AuthError
        ? error
        : new AuthError("authCallbackFailed", "An unexpected error occurred")
    );
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
}
