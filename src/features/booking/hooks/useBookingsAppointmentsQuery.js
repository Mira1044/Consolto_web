import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { queryKeys } from '@/shared/query/queryKeys';
import { splitAppointmentsIntoUpcomingPast } from '../utils/bookingAppointmentNormalize';

/**
 * Cached, deduped appointments for the bookings page (TanStack Query).
 */
export function useBookingsAppointmentsQuery(roleTab) {
  return useQuery({
    queryKey: queryKeys.bookings.list(roleTab),
    queryFn: async ({ signal }) => {
      const { appointments } = await bookingService.loadAppointmentsForBookingsPage({ roleTab, signal });
      return splitAppointmentsIntoUpcomingPast(appointments);
    },
    enabled: roleTab === 'user' || roleTab === 'consultant',
    staleTime: 20_000,
  });
}
