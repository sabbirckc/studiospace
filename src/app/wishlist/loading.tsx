import React from 'react';

export default function WishlistLoading() {
  return (
    <div className="py-12 sm:py-16 bg-background animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2 border-b border-border pb-6">
          <div className="h-6 w-36 rounded-full bg-muted animate-pulse" />
          <div className="h-8 w-64 rounded-2xl bg-muted animate-pulse" />
          <div className="h-4 w-80 rounded bg-muted/60 animate-pulse" />
        </div>

        {/* Wishlist Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden space-y-4 animate-pulse">
              <div className="aspect-[16/10] w-full bg-muted" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

