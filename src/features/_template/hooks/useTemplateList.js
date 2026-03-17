/**
 * useTemplateList Hook
 *
 * Example hook for managing a list of templates.
 */

import { useState, useEffect, useCallback } from 'react';
import { templateService } from '../services';

/**
 * Custom hook for managing a list of templates
 */
export const useTemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await templateService.getAll();
      setTemplates(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch templates'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const addTemplate = useCallback((template) => {
    setTemplates((prev) => [...prev, template]);
  }, []);

  const removeTemplate = useCallback((id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
    addTemplate,
    removeTemplate,
  };
};
