/**
 * Contact service
 * Placeholder for future API integration for contact form submissions.
 *
 * This layer isolates any HTTP details from hooks/components,
 * making it easy to swap mock data with real API calls later.
 */

// import { api } from '@/shared/services/api';

import { validateContact } from '../validators/contactValidator';

export const contactService = {
  /**
   * Submit a contact form.
   * In the future, this would POST to the backend.
   */
  async submitContact(formData) {
    // Validate before sending
    const validation = validateContact(formData);
    if (!validation.success) {
      throw new Error('Validation failed');
    }

    // Example real call (commented until backend exists):
    // return api.post('/contact').body(validation.value).getData();

    // Simulate async network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...validation.value,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        });
      }, 1200);
    });
  },
};
