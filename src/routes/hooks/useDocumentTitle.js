import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteByPath } from '../config/routes';

/**
 * Hook to update document title based on current route
 */
export const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const route = getRouteByPath(location.pathname);
    if (route?.title) {
      document.title = route.title;
    } else {
      document.title = 'Consolto';
    }
  }, [location.pathname]);
};
