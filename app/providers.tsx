"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/config";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {/* Add modal, skeleton, and other providers here as needed */}
        <Toaster position="top-right" />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
