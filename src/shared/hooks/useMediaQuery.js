import { useState, useEffect } from 'react';

/**
 * Subscribes to a CSS media query (e.g. `(min-width: 1024px)`).
 * Safe for SSR: initial state is false until mount.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const m = window.matchMedia(query);
    const update = () => setMatches(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, [query]);

  return matches;
}
