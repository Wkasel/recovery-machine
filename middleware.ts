import { requireSecureRequest } from "@/lib/security/csrf";
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip security checks in development to avoid edge runtime issues
  if (process.env.NODE_ENV !== "production") {
    // Just update Supabase session in development
    return await updateSession(request);
  }

  // Apply security checks for state-changing requests in production
  try {
    requireSecureRequest(request);
  } catch (error) {
    console.warn("Security check failed:", error);
    return new Response("Forbidden", { status: 403 });
  }

  // Update Supabase session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
