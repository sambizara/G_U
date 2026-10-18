import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import http from '../api/http';

const AuthContext = createContext(null);

function normalizeUser(payload) {
  return payload?.user || payload?.utilisateur || payload;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('univ_token'));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('univ_user') || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('univ_token')));

  const logout = useCallback(async () => {
    try { if (localStorage.getItem('univ_token')) await http.post('/auth/logout'); } catch { /* local session is still cleared */ }
    localStorage.removeItem('univ_token');
    localStorage.removeItem('univ_user');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await http.post('/auth/login', { email, password });
    if (!data?.token) throw new Error('La réponse du serveur ne contient pas de token.');
    const nextToken = data.token;
    localStorage.setItem('univ_token', nextToken);
    setToken(nextToken);
    let nextUser = normalizeUser(data);
    if (!nextUser?.role) {
      const profile = await http.get('/auth/me');
      nextUser = normalizeUser(profile.data);
    }
    if (!nextUser?.role) {
      localStorage.removeItem('univ_token');
      setToken(null);
      throw new Error("Le rôle de l'utilisateur est absent de la réponse.");
    }
    localStorage.setItem('univ_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    let active = true;
    if (!token) { setLoading(false); return undefined; }
    http.get('/auth/me')
      .then(({ data }) => {
        if (!active) return;
        const profile = normalizeUser(data);
        setUser(profile);
        localStorage.setItem('univ_user', JSON.stringify(profile));
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem('univ_token');
        localStorage.removeItem('univ_user');
        setToken(null);
        setUser(null);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []); // Restore once at startup; login sets the profile directly.

  const value = useMemo(() => ({ token, user, loading, login, logout }), [token, user, loading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
}
