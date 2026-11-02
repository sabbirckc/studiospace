'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

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

  // Sync token helper with backend
  const syncBackendToken = async (u: { email: string; name?: string; photoURL?: string }) => {
    try {
      const syncRes = await fetch(`${API_BASE_URL}/api/auth/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: u.email,
          name: u.name,
          photoURL: u.photoURL,
        }),
      });
      const syncData = await syncRes.json();
      if (syncData?.success && syncData?.token) {
        localStorage.setItem('studiospace_token', syncData.token);
        if (syncData.user) {
          const syncedUser: User = {
            id: syncData.user.id || syncData.user._id,
            name: syncData.user.name,
            email: syncData.user.email,
            photoURL: syncData.user.photoURL,
            role: syncData.user.role || 'creator',
          };
          setUser(syncedUser);
          localStorage.setItem('studiospace_user', JSON.stringify(syncedUser));
        }
      }
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
  };

  // Initialize session on mount
  useEffect(() => {
    // 1. Instant check from localStorage to prevent auth bounce on reload
    let localUser: User | null = null;
    try {
      const cached = localStorage.getItem('studiospace_user');
      if (cached) {
        localUser = JSON.parse(cached);
        setUser(localUser);
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
            await syncBackendToken(authUser);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // fallback to Express API
      }

      // If user is cached locally, ensure backend token exists
      if (localUser?.email) {
        const token = localStorage.getItem('studiospace_token');
        if (!token) {
          await syncBackendToken(localUser);
        }
      }

      // B. Validate session with backend API
      try {
        const res = await api.get('/api/auth/me');
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('studiospace_user', JSON.stringify(res.user));
        } else if (!localUser) {
          setUser(null);
          localStorage.removeItem('studiospace_user');
          localStorage.removeItem('studiospace_token');
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
        if (res.token) {
          localStorage.setItem('studiospace_token', res.token);
        }
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
        if (res.token) {
          localStorage.setItem('studiospace_token', res.token);
        }
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
      toast.loading('Logging...', { duration: 2500 });
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
    localStorage.removeItem('studiospace_token');
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
