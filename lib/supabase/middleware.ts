import type { Database } from "@/lib/types/supabase";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Debug logging for authentication
  console.log("🔍 Middleware auth check:", {
    path: request.nextUrl.pathname,
    hasUser: !!user,
    userEmail: user?.email,
    authError: authError?.message,
    cookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
  });

  // Check if the current path is a public path
  const isPublicPath =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes("/terms") ||
    request.nextUrl.pathname.includes("/privacy") ||
    request.nextUrl.pathname.startsWith("/book") ||
    request.nextUrl.pathname.startsWith("/pricing") ||
    request.nextUrl.pathname.startsWith("/how-it-works") ||
    request.nextUrl.pathname.startsWith("/contact") ||
    request.nextUrl.pathname.startsWith("/about") ||
    // Landing pages
    request.nextUrl.pathname.startsWith("/cold-plunge-la") ||
    request.nextUrl.pathname.startsWith("/infrared-sauna-delivery") ||
    request.nextUrl.pathname.startsWith("/corporate-wellness") ||
    // Static assets
    request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|mp4)$/) ||
    // API routes that should be public
    request.nextUrl.pathname.startsWith("/api/og") ||
    request.nextUrl.pathname.startsWith("/api/sitemap") ||
    request.nextUrl.pathname.startsWith("/sitemap") ||
    request.nextUrl.pathname.startsWith("/robots");

  if (!user && !isPublicPath) {
    // No user and not a public path, redirect to sign-in
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
