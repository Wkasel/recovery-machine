import { NextRequest } from "next/server";

/**
 * CSRF Protection for Server Actions and API Routes
 * Edge Runtime compatible using Web Crypto API
 */

const CSRF_TOKEN_HEADER = "x-csrf-token";
const CSRF_SECRET_COOKIE = "__csrf-secret";

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function generateCSRFSecret(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashToken(token: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token + secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function verifyCSRFToken(
  request: NextRequest,
  expectedHash: string
): Promise<boolean> {
  const token = request.headers.get(CSRF_TOKEN_HEADER);
  const secret = request.cookies.get(CSRF_SECRET_COOKIE)?.value;

  if (!token || !secret) {
    return false;
  }

  const computedHash = await hashToken(token, secret);
  return computedHash === expectedHash;
}

export function isSecureOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    "https://recovery-machine.vercel.app", // Production domain
    "https://therecoverymachine.com", // Production domain
    "http://localhost:3000", // Development
    "http://localhost:3001", // Development (alternate port)
    "http://localhost:3002", // Development (alternate port)
    "https://localhost:3000", // Development with HTTPS
    "https://localhost:3001", // Development with HTTPS
    "https://localhost:3002", // Development with HTTPS
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
