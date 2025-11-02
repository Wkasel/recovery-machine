"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AuthPagesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSignUp = pathname === "/sign-up";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and header */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="The Recovery Machine"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-charcoal" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
                {isSignUp ? "Join Recovery Machine" : "Welcome back"}
              </h1>
              <p className="text-sm text-charcoal-light font-light" style={{ fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' }}>
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
