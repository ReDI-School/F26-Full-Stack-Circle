'use client';
import { api, ApiError } from '@/config/api';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthContextType, AuthProviderProps, AuthResponse, User } from './AuthContext.types';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUser = useCallback(async () => {
    try {
      const data = await api.get<AuthResponse>('/auth/me');
      setUser(data?.user ?? null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);
      } else {
        console.error(error);
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        await syncUser();
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [syncUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<AuthResponse>('/auth/login', { email, password });
    setUser(data?.user ?? null);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await api.post<AuthResponse>('/auth/register', { name, email, password });
    setUser(data?.user ?? null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    await syncUser();
  }, [syncUser]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
