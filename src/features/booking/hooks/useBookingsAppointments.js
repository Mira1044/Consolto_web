import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useErrorHandler } from '@/shared/services/error';
import { queryKeys } from '@/lib/queryClient';
import { bookingService } from '../services/bookingService';
import { normalizeAppointmentLists } from '../utils/normalizeAppointment';

/**
 * Fetches upcoming + past appointments for the current role tab.
 * React Query dedupes concurrent requests (StrictMode-safe) and caches by roleTab.
 */
export function useBookingsAppointments(roleTab) {
  const { user } = useAuth();
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: queryKeys.bookings.appointments(roleTab),
    queryFn: async () => {
      try {
        const fetchFn =
          roleTab === 'consultant'
            ? bookingService.getConsultantAppointments
            : bookingService.getUserAppointments;

        const [upcomingResp, pastResp] = await Promise.all([
          fetchFn({ page: 1, limit: 10, status_type: 'upcoming' }),
          fetchFn({ page: 1, limit: 10, status_type: 'past' }),
        ]);
        return normalizeAppointmentLists(upcomingResp, pastResp);
      } catch (err) {
        handleApiError(err, {
          context: {
            feature: 'booking',
            action: roleTab === 'consultant' ? 'getConsultantAppointments' : 'getUserAppointments',
          },
        });
        throw err;
      }
    },
    enabled: !!user?.token,
    staleTime: 30_000,
  });
}
