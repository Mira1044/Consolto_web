/**
 * Consistent “Consolto” / brand styling across the app.
 * Use these classes anywhere the brand name or gradient highlight appears.
 */

/** Full-color / dark mark for light backgrounds (navbar, auth, etc.) */
export const CONSOLTO_LOGO_PRIMARY_SRC = '/assets/Consolto.png';

/**
 * Light / monochrome mark for dark backgrounds (footer, session chrome).
 * If empty, BrandLogo falls back to CONSOLTO_LOGO_PRIMARY_SRC with a CSS invert filter.
 * Add `public/assets/Consolto-light.png` and set this when you have a proper light mark.
 */
export const CONSOLTO_LOGO_ON_DARK_SRC = '';

/** Wordmark + logo text (navbar, auth header, primary BrandLogo) — light backgrounds */
export const CONSOLTO_WORDMARK_PRIMARY_CLASSES =
  'font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent';

/** Highlighted words in marketing headings where the parent already sets font weight */
export const BRAND_HIGHLIGHT_GRADIENT_CLASSES =
  'bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent';

/** Wordmark on dark backgrounds (footer, dark sections) */
export const CONSOLTO_WORDMARK_ON_DARK_CLASSES =
  'font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent';
