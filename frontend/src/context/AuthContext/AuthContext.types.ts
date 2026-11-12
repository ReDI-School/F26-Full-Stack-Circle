import type { ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  user: User;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
