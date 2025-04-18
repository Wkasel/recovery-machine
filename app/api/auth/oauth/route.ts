import { signInWithOAuth } from "@/core/actions/server/auth/methods/oauth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const provider = searchParams.get("provider") as
    | "google"
    | "github"
    | "facebook";
  const redirectTo = searchParams.get("redirectTo") || "/protected";

  if (!provider) {
    return NextResponse.json(
      { error: "Provider is required" },
      { status: 400 },
    );
  }

  try {
    const result = await signInWithOAuth(provider, redirectTo);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 },
      );
    }

    // If we have a URL in the result, redirect to it
    if (result.data?.url) {
      return NextResponse.redirect(result.data.url);
    }

    // Fallback in case no redirect URL is provided
    return NextResponse.json({
      success: true,
      message: "OAuth process initiated",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Failed to initiate OAuth",
      },
      { status: 500 },
    );
  }
}
