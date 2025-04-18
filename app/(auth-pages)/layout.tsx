"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function AuthPagesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSignUp = pathname === "/sign-up";

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isSignUp ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose your preferred {isSignUp ? "sign up" : "sign in"} method
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
