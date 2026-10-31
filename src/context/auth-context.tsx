'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, photoURL?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  register: async () => false,
  loginWithGoogle: async () => false,
  logout: async () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    // 1. Instant check from localStorage to prevent auth bounce on reload
    try {
      const cached = localStorage.getItem('studiospace_user');
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } catch (e) {
      console.error('Failed to parse cached user:', e);
    }

    // 2. Validate session with backend API
    const verifySession = async () => {
      try {
        const res = await api.get('/api/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('studiospace_user', JSON.stringify(res.user));
        } else {
          setUser(null);
          localStorage.removeItem('studiospace_user');
        }
      } catch (err) {
        // If 401 or offline, keep localStorage if token might still be valid or clear if unauth
        // Don't violently log out if server temporarily disconnected
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('studiospace_user', JSON.stringify(res.user));
        toast.success(`Welcome back, ${res.user.name}!`);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, photoURL?: string): Promise<boolean> => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password, photoURL });
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('studiospace_user', JSON.stringify(res.user));
        toast.success(`Account created! Welcome to StudioSpace, ${res.user.name}!`);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Mock Google Popup / OAuth profile for demonstration
      const demoProfiles = [
        {
          name: 'Elena Rostova',
          email: 'elena.rostova@creator.io',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        {
          name: 'Harry Cat (Examiner)',
          email: 'examiner@studiospace.io',
          photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        }
      ];

      // Pick examiner profile if unlogged, or prompt
      const selected = demoProfiles[1]; // examiner for convenience

      const res = await api.post('/api/auth/social-login', selected);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('studiospace_user', JSON.stringify(res.user));
        toast.success(`Authenticated with Google as ${res.user.name}!`);
        return true;
      }
      return false;
    } catch (err: any) {
      toast.error(err.message || 'Google authentication failed.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('studiospace_user');
      toast.success('You have been logged out.');
    }
  };

  const updateUser = (updated: Partial<User>) => {
    if (!user) return;
    const next = { ...user, ...updated };
    setUser(next);
    localStorage.setItem('studiospace_user', JSON.stringify(next));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

