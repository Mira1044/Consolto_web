/**
 * Template Service
 *
 * Service layer for template-related API calls.
 * Example implementation using the centralized API client.
 */

import { apiRequest } from '@/shared/services/api';

/**
 * Template Service
 * Handles all API calls related to templates
 */
class TemplateService {
  baseUrl = '/templates';

  /**
   * Fetches all templates
   *
   * @returns Promise resolving to array of templates
   */
  async getAll() {
    const response = await apiRequest.get(this.baseUrl);
    return Array.isArray(response) ? response : [];
  }

  /**
   * Fetches a single template by ID
   *
   * @param id - Template ID
   * @returns Promise resolving to template entity
   */
  async getById(id) {
    const response = await apiRequest.get(`${this.baseUrl}/${id}`);
    return response;
  }

  /**
   * Creates a new template
   *
   * @param formData - Template form data
   * @returns Promise resolving to created template
   */
  async create(formData) {
    const response = await apiRequest.post(this.baseUrl, formData);
    return response;
  }

  /**
   * Updates an existing template
   *
   * @param id - Template ID
   * @param formData - Updated template data
   * @returns Promise resolving to updated template
   */
  async update(id, formData) {
    const response = await apiRequest.put(`${this.baseUrl}/${id}`, formData);
    return response;
  }

  /**
   * Deletes a template
   *
   * @param id - Template ID
   * @returns Promise resolving when deletion is complete
   */
  async delete(id) {
    await apiRequest.delete(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const templateService = new TemplateService();
