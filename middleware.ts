import { requireSecureRequest } from "@/lib/security/csrf";
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Apply security checks for state-changing requests
  try {
    requireSecureRequest(request);
  } catch (error) {
    console.warn("Security check failed:", error);
    // Log security violations but don't block in development
    if (process.env.NODE_ENV === "production") {
      return new Response("Forbidden", { status: 403 });
    }
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
