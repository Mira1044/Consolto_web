import { Suspense, Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { routeConfig, ROUTES } from './config';
import { ProtectedRoute, PublicRoute } from './guards';
import { MainLayout, MainLayoutNoFooter } from '@/shared/components/layout';
import { BrandLogo } from '@/shared/components/BrandLogo';
import { Loader } from '@/shared/components/ui';
import { useDocumentTitle } from './hooks';

/** Auth pages — logo bar + guest-only content (login, signup, home) */
const AuthLayout = ({ children }) => (
  <div className="from-primary/10 via-background to-background min-h-screen bg-gradient-to-br">
    <header className="sticky top-0 z-50 w-full border-b border-blue-100/60 bg-white/85 backdrop-blur-md px-4 py-3 sm:px-6">
      <BrandLogo variant="primary" to={ROUTES.HOME} />
    </header>
    {children}
  </div>
);

/**
 * AppRouter - Centralized routing component
 * Handles all route definitions, guards, and layouts
 */
export const AppRouter = () => {
  const { isAuthReady } = useAuth();

  // Update document title based on current route
  useDocumentTitle();

  // Wait until persisted token is verified (or skipped) so we don't flash Experts/Bookings
  // or hide the login form while localStorage still looks "logged in".
  if (!isAuthReady) {
    return <Loader fullScreen size="lg" text="Checking session..." />;
  }

  return (
    <Suspense fallback={<Loader fullScreen size="lg" text="Loading..." />}>
      <Routes>
        {routeConfig.map((route) => {
          const { path, element: Component, requiresAuth, requiresGuest, layout = 'main' } = route;

          // Determine which guard to use
          let WrappedComponent = <Component />;

          if (requiresAuth) {
            WrappedComponent = (
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            );
          } else if (requiresGuest) {
            WrappedComponent = (
              <PublicRoute>
                <Component />
              </PublicRoute>
            );
          }

          // Determine which layout to use
          const LayoutComponent =
            layout === 'auth'
              ? AuthLayout
              : layout === 'none'
                ? Fragment
                : layout === 'main-no-footer'
                  ? MainLayoutNoFooter
                  : MainLayout;

          return (
            <Route
              key={path}
              path={path}
              element={<LayoutComponent>{WrappedComponent}</LayoutComponent>}
            />
          );
        })}

        {/* Catch-all route - redirect to 404 */}
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </Suspense>
  );
};
