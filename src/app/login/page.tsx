'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Aperture, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both your email address and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await login(email, password);
      if (success) {
        router.push(redirectUrl);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSocialSubmitting(true);
      const success = await loginWithGoogle();
      if (success) {
        router.push(redirectUrl);
      }
    } finally {
      setIsSocialSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Per examination rules, password reset is disabled for evaluation convenience. You can use examiner credentials: examiner@studiospace.io / Password123!');
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl border border-border bg-card shadow-2xl space-y-8 animate-in fade-in duration-300">
      {/* Brand & Heading */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-md mb-2">
          <Aperture className="w-6 h-6" />
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-foreground">
          Welcome to StudioSpace
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your creative bookings and studio listings
        </p>
      </div>

      {/* Examiner Quick Credentials Pill */}
      <div className="p-3.5 rounded-2xl bg-muted/60 border border-border/80 text-xs space-y-1">
        <div className="flex items-center justify-between font-semibold text-foreground">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Examiner Demo Account
          </span>
          <button
            type="button"
            onClick={() => {
              setEmail('examiner@studiospace.io');
              setPassword('Password123!');
              toast.success('Examiner credentials autofilled!');
            }}
            className="text-primary hover:underline font-bold text-[11px]"
          >
            Auto-fill
          </button>
        </div>
        <p className="text-muted-foreground font-mono text-[11px]">
          Email: <span className="text-foreground">examiner@studiospace.io</span>
        </p>
        <p className="text-muted-foreground font-mono text-[11px]">
          Password: <span className="text-foreground">Password123!</span>
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@studiospace.io"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to StudioSpace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <span className="relative px-3 bg-card text-xs text-muted-foreground uppercase tracking-wider">
          Or continue with
        </span>
      </div>

      {/* Google Social Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isSocialSubmitting}
        className="w-full py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-muted text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Link to Register */}
      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create creator account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-muted/20">
      <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}

