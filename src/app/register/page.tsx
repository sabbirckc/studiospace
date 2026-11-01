'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Aperture, Lock, Mail, User, Image as ImageIcon, ArrowRight, Check, X, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false);

  // Password validation rules
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in your name, email, and password.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password does not satisfy all security criteria.');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await register(name, email, password, photoURL);
      if (success) {
        toast.success('Registration complete! Redirecting to login...');
        router.push('/login');
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
        router.push('/');
      }
    } finally {
      setIsSocialSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-muted/20">
      <div className="w-full max-w-md p-8 rounded-3xl border border-border bg-card shadow-2xl space-y-6 animate-in fade-in duration-300">
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-md mb-2">
            <Aperture className="w-6 h-6" />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-foreground">
            Create Creator Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join StudioSpace to list workspaces or reserve production studios
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

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
                placeholder="marcus@production.co"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Photo URL Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Profile Photo URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
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

            {/* Password Validation Checklist */}
            <div className="pt-2 p-3 rounded-xl bg-muted/50 border border-border space-y-1.5 text-xs">
              <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider">
                Password Security Requirements:
              </span>
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-destructive" />
                )}
                <span className={hasMinLength ? 'text-emerald-500' : 'text-muted-foreground'}>
                  At least 6 characters in length
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasUppercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-destructive" />
                )}
                <span className={hasUppercase ? 'text-emerald-500' : 'text-muted-foreground'}>
                  Contains at least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasLowercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <X className="w-3.5 h-3.5 text-destructive" />
                )}
                <span className={hasLowercase ? 'text-emerald-500' : 'text-muted-foreground'}>
                  Contains at least one lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isPasswordValid}
            className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <span>Register Creator Account</span>
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
            Or register with
          </span>
        </div>

        {/* Google Social Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSocialSubmitting}
          className="w-full py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-muted text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
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


        {/* Link to Login */}
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}

