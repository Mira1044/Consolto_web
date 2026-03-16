/**
 * useTemplateList Hook
 *
 * Example hook for managing a list of templates.
 */

import { useState, useEffect, useCallback } from 'react';
import type { TemplateEntity } from '../types';
import { templateService } from '../services';

interface UseTemplateListReturn {
  templates: TemplateEntity[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  addTemplate: (template: TemplateEntity) => void;
  removeTemplate: (id: string) => void;
}

/**
 * Custom hook for managing a list of templates
 */
export const useTemplateList = (): UseTemplateListReturn => {
  const [templates, setTemplates] = useState<TemplateEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

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

  const addTemplate = useCallback((template: TemplateEntity) => {
    setTemplates((prev) => [...prev, template]);
  }, []);

  const removeTemplate = useCallback((id: string) => {
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
