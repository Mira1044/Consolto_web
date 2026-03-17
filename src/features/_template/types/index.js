/**
 * Feature-specific type documentation (JSDoc only)
 *
 * These typedefs exist purely for editor help and documentation.
 */

/**
 * @typedef {Object} TemplateEntity
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} TemplateComponentProps
 * @property {TemplateEntity} data
 * @property {(id: string) => void} [onAction]
 * @property {string} [className]
 */

/**
 * @typedef {Object} TemplateApiResponse
 * @property {boolean} success
 * @property {TemplateEntity[]} data
 * @property {string} [message]
 */

/**
 * @typedef {Object} TemplateFormData
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {Object} UseTemplateReturn
 * @property {TemplateEntity|null} data
 * @property {boolean} loading
 * @property {Error|null} error
 * @property {() => Promise<void>} refetch
 */

/**
 * @readonly
 * @enum {string}
 */
export const TemplateStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
};
