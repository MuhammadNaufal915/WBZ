import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Axios base config
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('wbz_admin_token'));
  const [loading, setLoading] = useState(true);

  // Sync token to axios header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await axios.get('/admin/me');
        setAdmin(res.data.admin);
      } catch {
        // Token expired / invalid
        setToken(null);
        setAdmin(null);
        localStorage.removeItem('wbz_admin_token');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await axios.post('/admin/login', { email, password });
    const { admin: adminData, token: newToken } = res.data;
    localStorage.setItem('wbz_admin_token', newToken);
    setToken(newToken);
    setAdmin(adminData);
    return adminData;
  }, []);

  const logout = useCallback(async () => {
    try { await axios.post('/admin/logout'); } catch {}
    localStorage.removeItem('wbz_admin_token');
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
