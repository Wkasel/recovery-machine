import { updateSession } from "@/core/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Update the Supabase auth session
  const authResponse = await updateSession(request);

  // Apply security headers to the response
  authResponse.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.vercel-scripts.com https://*.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
  );
  authResponse.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  authResponse.headers.set("X-Frame-Options", "DENY");
  authResponse.headers.set("X-Content-Type-Options", "nosniff");
  authResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  authResponse.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Cache Control - Adjust per route as needed
  if (request.nextUrl.pathname.startsWith("/api/")) {
    authResponse.headers.set("Cache-Control", "no-store");
  } else if (request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
    authResponse.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    authResponse.headers.set("Cache-Control", "public, max-age=3600, must-revalidate");
  }

  return authResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
