import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { queryKeys } from '@/lib/queryClient';
import { expertsService } from '@/features/experts/services/expertsService';

/**
 * Whether the logged-in user has a consultant profile (GET /consultant/self).
 * Cached; does not refetch on every render.
 */
export function useConsultantSelf() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.consultant.self,
    queryFn: () => expertsService.getSelfConsultant(),
    enabled: !!user?.token,
    retry: false,
    staleTime: 5 * 60_000,
  });
}
