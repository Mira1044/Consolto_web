import { expertsListSchema, categoriesListSchema } from '../models/expertModel';

/**
 * Validate an array of experts against the domain schema.
 * Returns { success: boolean, value?: Expert[], errors?: Record<string, string[]> }
 */
export const validateExperts = (data) => {
  const result = expertsListSchema.safeParse(data);
  if (result.success) {
    return { success: true, value: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors,
  };
};

/**
 * Validate an array of categories against the domain schema.
 */
export const validateCategories = (data) => {
  const result = categoriesListSchema.safeParse(data);
  if (result.success) {
    return { success: true, value: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors,
  };
};
