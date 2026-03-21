import { QueryClient } from '@tanstack/react-query';

/**
 * App-wide React Query defaults:
 * - Dedupes concurrent requests (helps with React StrictMode double-mount in dev)
 * - Reduces refetch noise; opt-in per-query where live data is required
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

/** Query key factories — keep keys consistent for invalidation */
export const queryKeys = {
  auth: {
    session: ['auth', 'session'],
  },
  bookings: {
    appointments: (roleTab) => ['bookings', 'appointments', roleTab],
  },
  consultant: {
    self: ['consultant', 'self'],
  },
  experts: {
    list: ['experts', 'list'],
  },
};
