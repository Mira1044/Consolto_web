import { QueryClient } from '@tanstack/react-query';

/**
 * Shared QueryClient: dedupes in-flight requests (including under React Strict Mode),
 * caches responses, and avoids redundant refetches.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
