'use client';
import { api, ApiError } from '@/config/api';
import { createContext, useEffect, useState } from 'react';

export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthResponse {
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: (() => Promise<void>) | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
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
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post<AuthResponse>('/auth/login', { email, password });
    setUser(data?.user ?? null);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api.post<AuthResponse>('/auth/register', { name, email, password });
    setUser(data?.user ?? null);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
  };
  const refresh: (() => Promise<void>) | null = null;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
