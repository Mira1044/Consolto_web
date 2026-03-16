/**
 * Template Service
 *
 * Service layer for template-related API calls.
 * Example implementation using the centralized API client.
 */

import { apiRequest } from '@/shared/services/api';
import type { TemplateEntity, TemplateFormData } from '../types';
import type { ApiResponse } from '@/shared/types/api';

/**
 * Template Service
 * Handles all API calls related to templates
 */
class TemplateService {
  private baseUrl = '/templates';

  /**
   * Fetches all templates
   *
   * @returns Promise resolving to array of templates
   */
  async getAll(): Promise<TemplateEntity[]> {
    const response = await apiRequest.get<ApiResponse<TemplateEntity[]>>(this.baseUrl);
    return Array.isArray(response) ? response : [];
  }

  /**
   * Fetches a single template by ID
   *
   * @param id - Template ID
   * @returns Promise resolving to template entity
   */
  async getById(id: string): Promise<TemplateEntity> {
    const response = await apiRequest.get<ApiResponse<TemplateEntity>>(`${this.baseUrl}/${id}`);
    return response as TemplateEntity;
  }

  /**
   * Creates a new template
   *
   * @param formData - Template form data
   * @returns Promise resolving to created template
   */
  async create(formData: TemplateFormData): Promise<TemplateEntity> {
    const response = await apiRequest.post<ApiResponse<TemplateEntity>>(this.baseUrl, formData);
    return response as TemplateEntity;
  }

  /**
   * Updates an existing template
   *
   * @param id - Template ID
   * @param formData - Updated template data
   * @returns Promise resolving to updated template
   */
  async update(id: string, formData: TemplateFormData): Promise<TemplateEntity> {
    const response = await apiRequest.put<ApiResponse<TemplateEntity>>(`${this.baseUrl}/${id}`, formData);
    return response as TemplateEntity;
  }

  /**
   * Deletes a template
   *
   * @param id - Template ID
   * @returns Promise resolving when deletion is complete
   */
  async delete(id: string): Promise<void> {
    await apiRequest.delete(`${this.baseUrl}/${id}`);
  }
}

// Export singleton instance
export const templateService = new TemplateService();
