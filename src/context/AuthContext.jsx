import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AUTH_KEY = 'consolto_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Only treat as authenticated when we have a real token.
      // This prevents old/mock saved users (no token) from skipping login.
      return parsed?.token ? parsed : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  /**
   * Log the user in.
   *
   * Supports both the old signature `login(email)` used by the initial
   * mock implementation and the new mobile-like flow where we pass a
   * full auth object that includes a token.
   */
  const login = useCallback((payload) => {
    // Backwards compatibility: login('user@example.com')
    if (typeof payload === 'string') {
      setUser({ email: payload });
      return;
    }

    if (!payload || typeof payload !== 'object') {
      return;
    }

    // New flow: payload is either the normalized auth user
    // { ...userFields, token } or a backend-like { user, token }.
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

  const isLoggedIn = !!user?.token;
  const token = user?.token ?? null;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
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
