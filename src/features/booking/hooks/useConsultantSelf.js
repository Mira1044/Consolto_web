import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { queryKeys } from '@/lib/queryClient';
import { bookingService } from '../services/bookingService';

/**
 * Whether the logged-in user has a consultant profile (GET /consultant/self).
 * Cached; does not refetch on every render.
 */
export function useConsultantSelf() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.consultant.self,
    queryFn: () => bookingService.getConsultantSelf(),
    enabled: !!user?.token,
    retry: false,
    staleTime: 5 * 60_000,
  });
}
