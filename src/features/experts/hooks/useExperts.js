import { useEffect, useMemo, useState, useCallback } from 'react';
import { expertsService } from '../services/expertsService';
import { filterExperts, getVisibleCategories, enrichCategoriesWithIcons } from '../utils/expertUtils';
import { useErrorHandler } from '@/shared/services/error';

/**
 * useExperts
 * Feature-level hook that encapsulates experts list, filters, and derived data.
 * All data flows through the service layer; filtering uses pure utility functions.
 */
export const useExperts = () => {
  const [experts, setExperts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleApiError } = useErrorHandler();

  // Load experts and categories from service layer on mount
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const [expertsData, categoriesData] = await Promise.all([
          expertsService.getExperts(),
          expertsService.getCategories(),
        ]);
        if (mounted) {
          setExperts(expertsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        handleApiError(err, { context: { feature: 'experts', action: 'load' } });
      } finally {
        if (mounted) {
setIsLoading(false);
}
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [handleApiError]);

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
    // state
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
