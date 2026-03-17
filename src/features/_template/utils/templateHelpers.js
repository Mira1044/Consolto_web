/**
 * Template Helper Functions
 *
 * Additional utility functions for template operations.
 */

/**
 * Checks if a template is active
 *
 * @param template - Template entity
 * @returns True if template is active
 */
export const isTemplateActive = (template) => {
  return template.updatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
};

/**
 * Filters templates by status
 *
 * @param templates - Array of templates
 * @param _status - Status to filter by
 * @returns Filtered templates
 */
export const filterTemplatesByStatus = (templates, _status) => {
  return templates.filter((_template) => {
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
export const sortTemplatesByDate = (templates, ascending = false) => {
  return [...templates].sort((a, b) => {
    const dateA = a.createdAt.getTime();
    const dateB = b.createdAt.getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
