import { QueryClient } from "@tanstack/react-query";

/**
 * Creates and configures a TanStack QueryClient instance.
 * Configured per AGENTS.md guidelines:
 * - Exponential backoff retry on network errors.
 * - Disables retry on 4xx client errors (validation, auth failures).
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        retry: (failureCount, error: any) => {
          // Do not retry on 4xx errors (client/validation issues)
          const statusCode = error?.statusCode || error?.response?.status;
          if (statusCode && statusCode >= 400 && statusCode < 500) {
            return false;
          }
          // Retry network/server errors up to 3 times with backoff
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
