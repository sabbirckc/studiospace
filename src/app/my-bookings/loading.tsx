import React from 'react';

export default function MyBookingsLoading() {
  return (
    <div className="py-12 sm:py-16 bg-background animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2 border-b border-border pb-6">
          <div className="h-6 w-36 rounded-full bg-muted animate-pulse" />
          <div className="h-8 w-64 rounded-2xl bg-muted animate-pulse" />
          <div className="h-4 w-80 rounded bg-muted/60 animate-pulse" />
        </div>

        {/* Bookings List Skeleton */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl border border-border bg-card shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-5 w-48 rounded bg-muted" />
                  <div className="h-3 w-36 rounded bg-muted/60" />
                  <div className="h-4 w-24 rounded-full bg-muted/50" />
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <div className="h-10 w-28 rounded-xl bg-muted/60" />
                <div className="h-10 w-28 rounded-xl bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
