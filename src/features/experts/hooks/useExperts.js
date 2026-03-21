import { useMemo, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { expertsService, deriveCategoriesFromNormalizedExperts } from '../services/expertsService';
import { filterExperts, getVisibleCategories, enrichCategoriesWithIcons } from '../utils/expertUtils';
import { useErrorHandler } from '@/shared/services/error';
import { queryKeys } from '@/lib/queryClient';

/**
 * Experts list + filters. Single network request; categories derived from the same payload.
 */
export const useExperts = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const { handleApiError } = useErrorHandler();

  const expertsQuery = useQuery({
    queryKey: queryKeys.experts.list,
    queryFn: async () => {
      try {
        return await expertsService.getExperts();
      } catch (err) {
        handleApiError(err, { context: { feature: 'experts', action: 'load' } });
        throw err;
      }
    },
    staleTime: 60_000,
  });

  const experts = expertsQuery.data ?? [];
  const isLoading = expertsQuery.isPending;

  const categories = useMemo(() => {
    if (!experts.length) return [];
    try {
      return deriveCategoriesFromNormalizedExperts(experts);
    } catch {
      return [];
    }
  }, [experts]);

  const enrichedCategories = useMemo(() => enrichCategoriesWithIcons(categories), [categories]);

  const visibleCategories = useMemo(
    () => getVisibleCategories(enrichedCategories, showAll),
    [enrichedCategories, showAll],
  );

  const filteredExperts = useMemo(
    () => filterExperts(experts, { search, activeCategory }),
    [experts, search, activeCategory],
  );

  const clearCategory = useCallback(() => setActiveCategory(null), []);

  return {
    isLoading,
    search,
    activeCategory,
    showAll,
    setSearch,
    setActiveCategory,
    setShowAll,
    clearCategory,
    visibleCategories,
    filteredExperts,
  };
};
