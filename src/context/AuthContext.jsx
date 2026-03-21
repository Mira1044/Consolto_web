import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/shared/services/api';

const AUTH_KEY = 'consolto_user';

/** Reject empty / placeholder tokens so we don't skip the login screen by mistake. */
function isValidAuthToken(token) {
  if (token == null || typeof token !== 'string') return false;
  const t = token.trim();
  if (!t.length) return false;
  if (t === 'undefined' || t === 'null') return false;
  return true;
}

function readStoredUser() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (!parsed || !isValidAuthToken(parsed.token)) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
    return parsed;
  } catch {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());

  /** False until we finish verifying a stored token with the API (prevents wrong redirects). */
  const [authReady, setAuthReady] = useState(() => readStoredUser() === null);

  // Verify persisted session before letting routes decide guest vs authed
  useEffect(() => {
    if (authReady) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await apiRequest.get('/user/self-identification', { skipErrorHandler: true });
        if (cancelled) return;
        setUser((prev) => {
          if (!prev) return null;
          return { ...prev, ...data, token: prev.token };
        });
      } catch (err) {
        if (cancelled) return;
        const status = err?.response?.status;
        const hasResponse = !!err?.response;
        // Expired / invalid token
        if (status === 401 || status === 403) {
          setUser(null);
          try {
            localStorage.removeItem(AUTH_KEY);
          } catch {
            /* ignore */
          }
        } else if (!hasResponse && import.meta.env.DEV) {
          // Dev: API often not running — clear stale localStorage so login shows first
          setUser(null);
          try {
            localStorage.removeItem(AUTH_KEY);
          } catch {
            /* ignore */
          }
        }
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady]);

  useEffect(() => {
    if (user) {
      if (!isValidAuthToken(user.token)) {
        setUser(null);
        localStorage.removeItem(AUTH_KEY);
        return;
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  /**
   * Log the user in with a full auth object from the API: `{ ...userFields, token }`
   * or `{ user, token }`.
   */
  const login = useCallback((payload) => {
    if (!payload || typeof payload !== 'object') {
      return;
    }

    const { user: nestedUser, token, ...rest } = payload;

    if (nestedUser) {
      setUser({ ...nestedUser, token });
    } else {
      setUser({ ...rest, token });
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isLoggedIn = isValidAuthToken(user?.token);
  const token = user?.token ?? null;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAuthReady: authReady,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
