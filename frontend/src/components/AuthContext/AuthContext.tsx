'use client';
import { apiUrl } from '@/config';
import { createContext, useEffect, useState } from 'react';

export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      const response = await fetch(apiUrl('auth/me'), {
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);

          return;
        }
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data.user);
      console.log('data', data.user);
    }
    try {
      fetchMe();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(apiUrl('auth/login'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    setUser(data.user);
    console.log('data', data.user);
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(apiUrl('auth/register'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    setUser(data.user);
    console.log('data', data.user);
    setLoading(false);
  };

  const logout = () => {
    fetch(apiUrl('auth/logout'), {
      method: 'POST',
      credentials: 'include',
    });
  };
  const refresh = null;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
