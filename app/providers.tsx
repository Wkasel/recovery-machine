"use client";

import { AuthContextProvider } from "@/components/auth";
import { RootErrorBoundary } from "@/components/error-boundary";
import { QueryProvider } from "@/lib/query/QueryProvider";
import { LoadingProvider } from "@/lib/ui/loading/context";
import { ModalProvider } from "@/lib/ui/modals/context";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <RootErrorBoundary>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthContextProvider>
            <LoadingProvider>
              <ModalProvider>
                <Toaster position="top-right" />
                {children}
              </ModalProvider>
            </LoadingProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </RootErrorBoundary>
    </QueryProvider>
  );
}
