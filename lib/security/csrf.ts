import { createHash, randomBytes } from "crypto";
import { NextRequest } from "next/server";

/**
 * CSRF Protection for Server Actions and API Routes
 */

const CSRF_TOKEN_HEADER = "x-csrf-token";
const CSRF_SECRET_COOKIE = "__csrf-secret";

export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex");
}

export function generateCSRFSecret(): string {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string, secret: string): string {
  return createHash("sha256")
    .update(token + secret)
    .digest("hex");
}

export function verifyCSRFToken(request: NextRequest, expectedHash: string): boolean {
  const token = request.headers.get(CSRF_TOKEN_HEADER);
  const secret = request.cookies.get(CSRF_SECRET_COOKIE)?.value;

  if (!token || !secret) {
    return false;
  }

  const computedHash = hashToken(token, secret);
  return computedHash === expectedHash;
}

export function isSecureOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    "http://localhost:3000", // Development
    "https://localhost:3000", // Development with HTTPS
  ].filter(Boolean);

  // Check origin header
  if (origin && allowedOrigins.includes(origin)) {
    return true;
  }

  // Check referer header as fallback
  if (referer) {
    return allowedOrigins.some((allowed) => referer.startsWith(allowed + "/"));
  }

  return false;
}

export function requireSecureRequest(request: NextRequest): void {
  // Skip CSRF for GET requests (they should be safe operations)
  if (request.method === "GET") {
    return;
  }

  // Skip CSRF for webhook endpoints (they have their own verification)
  if (request.nextUrl.pathname.startsWith("/api/webhooks/")) {
    return;
  }

  // Verify origin for state-changing requests
  if (!isSecureOrigin(request)) {
    throw new Error("Invalid origin for security-sensitive request");
  }
}
