"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { getQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        theme="system"
      />
    </QueryClientProvider>
  );
}

export default Providers;
