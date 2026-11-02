import React from 'react';

export default function MyListingsLoading() {
  return (
    <div className="py-12 sm:py-16 bg-background animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <div className="h-6 w-32 rounded-full bg-muted animate-pulse" />
            <div className="h-8 w-64 rounded-2xl bg-muted animate-pulse" />
            <div className="h-4 w-80 rounded bg-muted/60 animate-pulse" />
          </div>
          <div className="h-11 w-40 rounded-xl bg-muted animate-pulse" />
        </div>

        {/* Listings Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-4 space-y-4 animate-pulse">
              <div className="aspect-[16/10] w-full rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted/60" />
              </div>
              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <div className="h-9 w-20 rounded-xl bg-muted/60" />
                <div className="h-9 w-20 rounded-xl bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
