/**
 * Route path constants
 * Centralized route paths to avoid hardcoding strings throughout the app
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  CONTACT: '/contact',

  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',

  // Protected routes
  EXPERTS: '/experts',
  BOOKING: '/booking',

  // Fallback
  NOT_FOUND: '/404',
};

/**
 * Route names for navigation and breadcrumbs
 */
export const ROUTE_NAMES = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.CONTACT]: 'Contact',
  [ROUTES.LOGIN]: 'Login',
  [ROUTES.SIGNUP]: 'Sign Up',
  [ROUTES.EXPERTS]: 'Experts',
  [ROUTES.BOOKING]: 'Booking',
  [ROUTES.BOOKINGS]: 'Bookings',
  [ROUTES.NOT_FOUND]: 'Not Found',
  [ROUTES.SESSION]: 'Session',
};
