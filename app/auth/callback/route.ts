import { AuthError } from "@/core/errors/auth/AuthError";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Logger } from "@/lib/logger/Logger";
import { NextRequest, NextResponse } from "next/server";

type EmailOtpType = "signup" | "magiclink" | "recovery" | "invite" | "email" | "email-change";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") ?? "/profile";
    const type = requestUrl.searchParams.get("type") as EmailOtpType;

    console.log("Auth callback received:", { code: !!code, next, type, url: requestUrl.toString() });

    if (!code) {
      console.error("No auth code provided in callback");
      throw new AuthError("authCallbackFailed", "No code provided");
    }

    const supabase = await createServerSupabaseClient();

    if (type === "email") {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: code,
        type,
      });
      if (error) {
        console.error("OTP verification failed:", error);
        throw AuthError.fromSupabaseError(error);
      }
    } else {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Code exchange failed:", error);
        throw AuthError.fromSupabaseError(error);
      }
    }

    console.log("Auth callback successful, redirecting to:", next);
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  } catch (error) {
    console.error("Auth callback error:", error);
    Logger.getInstance().error(
      "Auth callback failed",
      { component: "auth-callback" },
      error instanceof AuthError
        ? error
        : new AuthError("authCallbackFailed", "An unexpected error occurred")
    );
    return NextResponse.redirect(new URL("/sign-in?error=callback_failed", request.url));
  }
}
