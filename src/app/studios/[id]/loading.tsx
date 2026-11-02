import React from 'react';

export default function StudioDetailLoading() {
  return (
    <div className="py-10 bg-background animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link Skeleton */}
        <div className="h-4 w-32 rounded bg-muted animate-pulse" />

        {/* Gallery / Image Skeleton */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm space-y-4 p-4 animate-pulse">
          <div className="aspect-[21/9] sm:aspect-[21/8] w-full rounded-2xl bg-muted" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-24 h-16 rounded-xl bg-muted" />
            ))}
          </div>
        </div>

        {/* Main Content & Booking Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <div className="h-6 w-28 rounded-full bg-muted animate-pulse" />
              <div className="h-10 w-3/4 rounded-2xl bg-muted animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-muted/70 animate-pulse" />
            </div>

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl border border-border bg-card space-y-2 animate-pulse">
                  <div className="h-4 w-16 rounded bg-muted" />
                  <div className="h-6 w-24 rounded bg-muted" />
                </div>
              ))}
            </div>

            {/* Amenities Skeleton */}
            <div className="p-6 rounded-2xl border border-border bg-card space-y-4 animate-pulse">
              <div className="h-5 w-40 rounded bg-muted" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 rounded-xl bg-muted/60" />
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Booking Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-3xl border border-border bg-card shadow-lg space-y-6 animate-pulse">
              <div className="space-y-2 pb-4 border-b border-border">
                <div className="h-7 w-32 rounded bg-muted" />
                <div className="h-3 w-48 rounded bg-muted/60" />
              </div>
              <div className="space-y-3">
                <div className="h-12 w-full rounded-2xl bg-muted/60" />
                <div className="h-12 w-full rounded-2xl bg-muted/60" />
              </div>
              <div className="h-14 w-full rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
