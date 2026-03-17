/**
 * useTemplateData Hook
 *
 * Example custom hook for fetching and managing template data.
 * Replace with your actual hook implementation.
 */

import { useState, useEffect, useCallback } from 'react';
import { templateService } from '../services';

/**
 * Custom hook for managing template data
 *
 * @param id - Template ID to fetch
 * @returns Template data, loading state, error, and refetch function
 */
export const useTemplateData = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await templateService.getById(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch template'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
