import { useMemo, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { expertsService } from '../services/expertsService';
import { filterExperts, getVisibleCategories, enrichCategoriesWithIcons, deriveCategoriesFromExperts } from '../utils/expertUtils';
import { validateCategories } from '../validators/expertValidator';
import { EXPERT_CATEGORIES } from '@/shared/constants';
import { queryKeys } from '@/shared/query/queryKeys';

/**
 * Experts list + categories (categories derived from experts — single API call).
 */
export const useExperts = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const expertsQuery = useQuery({
    queryKey: queryKeys.experts.list(),
    queryFn: () => expertsService.getExperts(),
    staleTime: 60_000,
  });

  const experts = expertsQuery.data ?? [];

  const categories = useMemo(() => {
    const derived = deriveCategoriesFromExperts(experts);
    const result = validateCategories(derived.length ? derived : EXPERT_CATEGORIES);
    return result.success ? result.value : EXPERT_CATEGORIES;
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
    isLoading: expertsQuery.isPending || expertsQuery.isFetching,
    isError: expertsQuery.isError,
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
