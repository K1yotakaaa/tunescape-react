import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  buildLoginUrl,
  handleCallback,
  refreshAccessToken,
  fetchMe,
} from '../lib/spotify';
import { STORAGE_KEYS } from '../config';
import { loadJSON, saveJSON, removeKey } from '../lib/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [tokens, setTokens] = useState(() =>
    loadJSON(STORAGE_KEYS.tokens)
  );
  const [user, setUser] = useState(null);
  const [demoMode, setDemoMode] = useState(
    () => localStorage.getItem(STORAGE_KEYS.demoMode) === '1'
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const refreshTimer = useRef(null);
  const hasHandledCallback = useRef(false);

  const isAuthenticated = !!tokens?.access_token || demoMode;

  useEffect(() => {
    if (tokens) saveJSON(STORAGE_KEYS.tokens, tokens);
    else removeKey(STORAGE_KEYS.tokens);
  }, [tokens]);

  useEffect(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    if (!tokens?.expires_at) return;

    const msLeft = tokens.expires_at - Date.now();
    const when = Math.max(30_000, msLeft - 60_000);

    refreshTimer.current = setTimeout(async () => {
      try {
        const fresh = await refreshAccessToken(tokens.refresh_token);
        setTokens(fresh);
      } catch (e) {
        setError('Session expired. Please log in again.');
        setTokens(null);
      }
    }, when);

    return () => clearTimeout(refreshTimer.current);
  }, [tokens]);

  useEffect(() => {
    let aborted = false;
    const ctrl = new AbortController();

    async function run() {
      if (demoMode) {
        setUser({ display_name: 'Demo Listener' });
        setLoading(false);
        return;
      }
      if (!tokens?.access_token) {
        setUser(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const me = await fetchMe(tokens.access_token, ctrl.signal);
        if (!aborted) setUser(me);
      } catch (e) {
        if (!aborted) setError(e.message);
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    run();
    return () => {
      aborted = true;
      ctrl.abort();
    };
  }, [tokens, demoMode]);

  useEffect(() => {
    if (window.location.pathname !== '/callback') return;
    
    if (hasHandledCallback.current) return;
    hasHandledCallback.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const err = params.get('error');

    if (err) {
      setError(err);
      window.history.replaceState({}, '', '/');
      return;
    }
    if (!code) return;

    handleCallback(code, state)
      .then((fresh) => {
        setTokens(fresh);
        window.history.replaceState({}, '', '/');
      })
      .catch((e) => {
        setError(e.message);
        window.history.replaceState({}, '', '/');
      });
  }, []);

  const login = async () => {
    const url = await buildLoginUrl();
    window.location.href = url;
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
    setDemoMode(false);
    localStorage.removeItem(STORAGE_KEYS.demoMode);
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
  };

  const enterDemoMode = () => {
    setDemoMode(true);
    localStorage.setItem(STORAGE_KEYS.demoMode, '1');
    setUser({ display_name: 'Demo Listener' });
  };

  const getValidToken = async () => {
    if (demoMode) return null;
    if (!tokens) return null;
    if (tokens.expires_at - Date.now() > 60_000) return tokens.access_token;
    const fresh = await refreshAccessToken(tokens.refresh_token);
    setTokens(fresh);
    return fresh.access_token;
  };

  const value = {
    tokens,
    user,
    loading,
    error,
    isAuthenticated,
    demoMode,
    login,
    logout,
    enterDemoMode,
    getValidToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}