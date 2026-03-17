/**
 * Format Template Data Utility
 *
 * Example utility function for formatting template data.
 * Replace with your actual utility functions.
 */

/**
 * Formats form data into a template entity
 *
 * @param formData - Form data to format
 * @param id - Optional ID for existing entities
 * @returns Formatted template entity
 */
export const formatTemplateData = (formData, id) => {
  const now = new Date();

  return {
    id: id || `template-${Date.now()}`,
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    createdAt: now,
    ...(id && { updatedAt: now }),
  };
};

/**
 * Validates template form data
 *
 * @param formData - Form data to validate
 * @returns Validation error message or null if valid
 */
export const validateTemplateForm = (formData) => {
  if (!formData.name || formData.name.trim().length === 0) {
    return 'Name is required';
  }

  if (formData.name.length > 100) {
    return 'Name must be less than 100 characters';
  }

  if (formData.description && formData.description.length > 500) {
    return 'Description must be less than 500 characters';
  }

  return null;
};
