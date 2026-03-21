/**
 * Centralized query keys for TanStack Query — use these everywhere for invalidation.
 */
export const queryKeys = {
  experts: {
    all: () => ['experts'],
    list: () => ['experts', 'list'],
  },
  bookings: {
    all: () => ['bookings'],
    list: (roleTab) => ['bookings', 'list', roleTab],
  },
};
