import { contactSchema } from '../models/contactModel';

/**
 * Validate a contact form object against the domain schema.
 * Returns { success: boolean, errors?: Record<string, string[]> }
 */
export const validateContact = (contact) => {
  const result = contactSchema.safeParse(contact);
  if (result.success) {
    return { success: true, value: result.data };
  }

  const {fieldErrors} = result.error.flatten();
  return {
    success: false,
    errors: fieldErrors,
  };
};
