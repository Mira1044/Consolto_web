/**
 * Common API helper shapes (JSDoc only, no runtime types)
 */

/**
 * @typedef {Object} ApiError
 * @property {string} [field]
 * @property {string} message
 * @property {string} [code]
 */

/**
 * @typedef {Object} RequestConfig
 * @property {boolean} [skipAuth]
 * @property {boolean} [skipErrorHandler]
 * @property {number} [timeout]
 * @property {Object.<string,string>} [headers]
 */

/**
 * @typedef {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} HttpMethod
 */
