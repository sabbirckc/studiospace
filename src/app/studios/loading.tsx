import React from 'react';

export default function StudiosLoading() {
  return (
    <div className="py-12 sm:py-16 bg-background animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-32 rounded-full bg-muted animate-pulse" />
          <div className="h-10 w-72 rounded-2xl bg-muted animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-lg bg-muted/70 animate-pulse" />
        </div>

        {/* Filter Controls Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-6 border-b border-border">
          <div className="h-12 w-full md:w-80 rounded-2xl bg-muted/60 animate-pulse" />
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-9 w-24 rounded-full bg-muted/60 shrink-0 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Studio Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm space-y-4 animate-pulse"
            >
              <div className="aspect-[16/10] w-full bg-muted" />
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-3 w-12 rounded bg-muted" />
                </div>
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted/70" />
                <div className="pt-3 border-t border-border flex justify-between items-center">
                  <div className="h-4 w-16 rounded bg-muted" />
                  <div className="h-8 w-24 rounded-xl bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

