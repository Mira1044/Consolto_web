import { useState, useCallback } from 'react';
import { useErrorHandler } from '@/shared/services/error';
import { bookingService } from '../services/bookingService';

/**
 * useSessionGuard
 *
 * Checks whether the current user already has an active session
 * before allowing them to join a new one.
 *
 * Returns `guardJoin(callback)` — a function that runs the check
 * and only invokes `callback` when no active session exists.
 */
export function useSessionGuard() {
  const { showWarning } = useErrorHandler();
  const [checking, setChecking] = useState(false);

  const guardJoin = useCallback(
    async (onAllowed) => {
      if (checking) return;
      setChecking(true);

      try {
        const resp = await bookingService.checkActiveSession();
        if (resp?.hasActiveSession) {
          showWarning(
            'You have already joined a session from another device or tab. Please end it before joining a new one.',
            { duration: 5000 },
          );
          return;
        }
      } catch {
        // If the check fails, allow joining anyway.
      } finally {
        setChecking(false);
      }

      onAllowed();
    },
    [checking, showWarning],
  );

  return { guardJoin, checking };
}
