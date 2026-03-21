# Data fetching (Consolto web)

## TanStack React Query

- **Provider**: `src/main.jsx` wraps the app with `QueryClientProvider` using `src/lib/queryClient.js`.
- **Defaults**: `staleTime` 30s, `gcTime` 5m, `refetchOnWindowFocus: false`, `retry: 1` — reduces duplicate calls and noisy refetches.
- **Strict Mode**: React 18 double-mounts in dev; identical queries in-flight are **deduped** by React Query.

## Query keys

Centralized in `src/lib/queryClient.js` (`queryKeys`) so invalidation stays consistent.

## Invalidation

After mutations (cancel, reschedule, complete), call:

```js
queryClient.invalidateQueries({ queryKey: ['bookings', 'appointments'] });
```

## Server API

- HTTP layer: `src/shared/services/api/apiClient.js` (`apiRequest` / `apiClient`).
- Feature services: `features/*/services/*Service.js`.

## Experts list

`useExperts` loads **one** `GET /consultant/consultants` and derives categories via `deriveCategoriesFromNormalizedExperts` (no second duplicate GET).
