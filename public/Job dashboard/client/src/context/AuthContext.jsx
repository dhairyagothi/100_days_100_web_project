import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || null);
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('adminInfo');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem('adminInfo', JSON.stringify(admin));
    } else {
      localStorage.removeItem('adminInfo');
    }
  }, [admin]);

  const login = (newToken, adminData) => {
    setToken(newToken);
    setAdmin(adminData);
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
  };

  const isAuthenticated = !!token;

  const value = useMemo(
    () => ({ token, admin, isAuthenticated, login, logout }),
    [token, admin, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
