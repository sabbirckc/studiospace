'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Aperture } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error Boundary caught error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 bg-background animate-in fade-in duration-300">
      <div className="max-w-md w-full text-center space-y-8 p-8 rounded-3xl border border-border bg-card shadow-xl">
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-destructive/10 animate-ping opacity-30" />
          <div className="relative w-16 h-16 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center border border-destructive/20 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
            <Aperture className="w-3.5 h-3.5" />
            <span>Studio Production Interrupted</span>
          </div>
          <h1 className="font-heading font-black text-2xl text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            A temporary glitch interrupted this workspace view. You can reload the view or return to the StudioSpace home stage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
