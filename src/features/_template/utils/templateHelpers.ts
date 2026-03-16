/**
 * Template Helper Functions
 *
 * Additional utility functions for template operations.
 */

import type { TemplateEntity, TemplateStatus } from '../types';

/**
 * Checks if a template is active
 *
 * @param template - Template entity
 * @returns True if template is active
 */
export const isTemplateActive = (template: TemplateEntity): boolean => {
  // Example logic - adjust based on your needs
  return template.updatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
};

/**
 * Filters templates by status
 *
 * @param templates - Array of templates
 * @param status - Status to filter by
 * @returns Filtered templates
 */
export const filterTemplatesByStatus = (
  templates: TemplateEntity[],
  _status: TemplateStatus
): TemplateEntity[] => {
  // Example implementation - adjust based on your data structure
  return templates.filter((_template) => {
    // Add your filtering logic here
    // Example: return template.status === status;
    return true;
  });
};

/**
 * Sorts templates by creation date
 *
 * @param templates - Array of templates
 * @param ascending - Sort order (default: false = newest first)
 * @returns Sorted templates
 */
export const sortTemplatesByDate = (
  templates: TemplateEntity[],
  ascending = false
): TemplateEntity[] => {
  return [...templates].sort((a, b) => {
    const dateA = a.createdAt.getTime();
    const dateB = b.createdAt.getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
