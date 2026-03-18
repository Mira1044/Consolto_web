import { lazy } from 'react';
import { ROUTES } from './constants';

/**
 * Route configuration
 * Define all routes with their metadata, guards, and lazy-loaded components
 */

// Lazy load pages for code splitting
// Feature pages are loaded from their respective feature modules
const HomePage = lazy(() => import('@/features/auth').then(module => ({ default: module.LoginPage })));
const ContactPage = lazy(() => import('@/features/contact').then(module => ({ default: module.ContactPage })));
const ExpertsPage = lazy(() => import('@/features/experts').then(module => ({ default: module.ExpertsPage })));
const BookingPage = lazy(() => import('@/features/booking').then(module => ({ default: module.BookingPage })));
const LoginPage = lazy(() => import('@/features/auth').then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('@/features/auth').then(module => ({ default: module.SignupPage })));
// App-level pages stay in src/pages/
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);
const SessionPage = lazy(() =>
  import('@/features/communication').then((module) => ({ default: module.SessionPage })),
);
/**
 * Route definition structure:
 * {
 *   path: string - Route path
 *   element: React.Component - Component to render
 *   requiresAuth: boolean - Whether route requires authentication
 *   requiresGuest: boolean - Whether route requires guest (not authenticated)
 *   layout: string - Layout to use (optional, defaults to 'main')
 *   title: string - Page title for SEO/document title
 *   meta: object - Additional metadata
 * }
 */
export const routeConfig = [
  // Public routes
  {
    path: ROUTES.HOME,
    element: HomePage,
    requiresAuth: false,
    requiresGuest: true,
    layout: 'auth',
    title: 'Sign In - Consolto',
    meta: {
      description: 'Sign in to your Consolto account',
    },
  },
  {
    path: ROUTES.CONTACT,
    element: ContactPage,
    requiresAuth: false,
    requiresGuest: false,
    layout: 'main',
    title: 'Contact Us - Consolto',
    meta: {
      description: 'Get in touch with Consolto',
    },
  },

  // Auth routes (guest only)
  {
    path: ROUTES.LOGIN,
    element: LoginPage,
    requiresAuth: false,
    requiresGuest: true,
    layout: 'auth',
    title: 'Login - Consolto',
    meta: {
      description: 'Login to your Consolto account',
    },
  },
  {
    path: ROUTES.SIGNUP,
    element: SignupPage,
    requiresAuth: false,
    requiresGuest: true,
    layout: 'auth',
    title: 'Sign Up - Consolto',
    meta: {
      description: 'Create a new Consolto account',
    },
  },

  // Protected routes
  {
    path: ROUTES.EXPERTS,
    element: ExpertsPage,
    requiresAuth: true,
    requiresGuest: false,
    layout: 'main',
    title: 'Experts - Consolto',
    meta: {
      description: 'Browse our expert consultants',
    },
  },
  {
    path: ROUTES.BOOKING,
    element: BookingPage,
    requiresAuth: true,
    requiresGuest: false,
    layout: 'main',
    title: 'Booking - Consolto',
    meta: {
      description: 'Book a consultation',
    },
  },
  {
    path: ROUTES.BOOKINGS,
    element: BookingsPage,
    requiresAuth: true,
    requiresGuest: false,
    layout: 'main-no-footer',
    title: 'Bookings - Consolto',
    meta: {
      description: 'View and manage your bookings',
    },
  },

  // 404 - must be last
  {
    path: ROUTES.NOT_FOUND,
    element: NotFoundPage,
    requiresAuth: false,
    requiresGuest: false,
    layout: 'main',
    title: 'Page Not Found - Consolto',
    meta: {
      description: 'The page you are looking for does not exist',
    },
  },
  {
    path: ROUTES.SESSION,
    element: SessionPage,
    requiresAuth: true,
    requiresGuest: false,
    layout: 'none',
    title: 'Session - Consolto',
    meta: {
      description: 'Video call and chat session',
    },
  },
];

/**
 * Get route config by path
 */
export const getRouteByPath = (path) => {
  return routeConfig.find((route) => route.path === path);
};

/**
 * Get all public routes
 */
export const getPublicRoutes = () => {
  return routeConfig.filter((route) => !route.requiresAuth && !route.requiresGuest);
};

/**
 * Get all protected routes
 */
export const getProtectedRoutes = () => {
  return routeConfig.filter((route) => route.requiresAuth);
};

/**
 * Get all auth routes
 */
export const getAuthRoutes = () => {
  return routeConfig.filter((route) => route.requiresGuest);
};
