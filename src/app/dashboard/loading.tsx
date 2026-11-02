import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="py-12 bg-background min-h-[calc(100vh-4rem)] animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Creator Header Skeleton */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm flex items-center gap-4 animate-pulse">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-muted" />
          <div className="space-y-2">
            <div className="h-7 w-48 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted/60" />
          </div>
        </div>

        {/* 3 Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 rounded-3xl border border-border bg-card space-y-3 animate-pulse">
              <div className="h-4 w-28 rounded bg-muted/60" />
              <div className="h-10 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>

        {/* Quick Links Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-6 rounded-3xl border border-border bg-card space-y-4 animate-pulse">
              <div className="h-6 w-40 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

