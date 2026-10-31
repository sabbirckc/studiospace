import React from 'react';
import Link from 'next/link';
import { Aperture, Home, Film, Sparkles, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-300">
        {/* Creative Studio 404 Illustration / Motif */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-25" />
          <div className="relative w-28 h-28 rounded-3xl bg-card border border-border shadow-xl flex items-center justify-center text-primary">
            <Aperture className="w-14 h-14" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-mono font-bold text-muted-foreground">
            ERROR 404 • WORKSPACE OFF-AIR
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-foreground tracking-tight">
            Production Stage Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The studio bay or production route you are trying to reach has wrapped up, moved sets, or does not exist on StudioSpace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/studios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Studios</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

