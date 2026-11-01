'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

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

    // 2. Validate session with Better-Auth & backend API
    const verifySession = async () => {
      try {
        // A. Check Better-Auth session
        const sessionRes = await fetch('/api/auth/get-session');
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData?.user) {
            const authUser: User = {
              id: sessionData.user.id || sessionData.user._id,
              name: sessionData.user.name,
              email: sessionData.user.email,
              photoURL: sessionData.user.image || sessionData.user.photoURL,
              role: 'creator',
            };
            setUser(authUser);
            localStorage.setItem('studiospace_user', JSON.stringify(authUser));
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // fallback to Express API
      }

      // B. Validate session with backend API
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
        // Keep cached if offline
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
      toast.loading('Connecting to Google via Better-Auth...', { duration: 2500 });
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
      return true;
    } catch (err: any) {
      console.error('Better-Auth Google login error:', err);
      toast.error(err.message || 'Failed to start Google sign-in.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (e) {}
    try {
      await api.post('/api/auth/logout');
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('studiospace_user');
    toast.success('You have been logged out.');
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
