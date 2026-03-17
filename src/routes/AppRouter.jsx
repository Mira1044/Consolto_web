import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routeConfig, ROUTES } from './config';
import { ProtectedRoute, PublicRoute } from './guards';
import { MainLayout } from '@/shared/components/layout';
import { Loader } from '@/shared/components/ui';
import { useDocumentTitle } from './hooks';

/**
 * AuthLayout - Simple layout for authentication pages
 */
const AuthLayout = ({ children }) => (
  <div className="from-primary/10 via-background to-background min-h-screen bg-gradient-to-br">
    {children}
  </div>
);

/**
 * AppRouter - Centralized routing component
 * Handles all route definitions, guards, and layouts
 */
export const AppRouter = () => {
  // Update document title based on current route
  useDocumentTitle();

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
          const LayoutComponent = layout === 'auth' ? AuthLayout : MainLayout;

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
