/**
 * Experts service
 * Placeholder for future API integration for experts.
 *
 * This layer isolates any HTTP details from hooks/components,
 * making it easy to swap mock data with real API calls later.
 */

// import { api } from '@/shared/services/api';

import { MOCK_EXPERTS, EXPERT_CATEGORIES } from '@/shared/constants';
import { validateExperts, validateCategories } from '../validators/expertValidator';

export const expertsService = {
  /**
   * Fetch the list of experts.
   * In the future, this would GET from the backend.
   */
  async getExperts() {
    // Example real call (commented until backend exists):
    // return api.get('/experts').getData([]);

    const result = validateExperts(MOCK_EXPERTS);
    if (!result.success) {
      throw new Error('Invalid experts data received');
    }
    return result.value;
  },

  /**
   * Fetch the list of categories.
   * In the future, this would GET from the backend.
   */
  async getCategories() {
    // Example real call (commented until backend exists):
    // return api.get('/experts/categories').getData([]);

    const result = validateCategories(EXPERT_CATEGORIES);
    if (!result.success) {
      throw new Error('Invalid categories data received');
    }
    return result.value;
  },
};
