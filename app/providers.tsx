"use client";

import { queryClient } from "@/lib/query/config";
import { LoadingProvider } from "@/lib/ui/loading/context";
import { ModalProvider } from "@/lib/ui/modals/context";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LoadingProvider>
          <ModalProvider>
            <Toaster position="top-right" />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </ModalProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
