"use client";

import { Snowflake } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AuthPagesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSignUp = pathname === "/sign-up";

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Remove main header and footer for auth pages */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Single logo header */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-12 w-12 items-center justify-center bg-white text-black">
                <Snowflake className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-white">Recovery Machine</span>
            </Link>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {isSignUp ? "Join Recovery Machine" : "Welcome back"}
              </h1>
              <p className="text-sm text-neutral-400">
                {isSignUp
                  ? "Start your recovery journey with cold plunge and infrared sauna sessions"
                  : "Sign in to your account to continue your recovery journey"}
              </p>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
