'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StudioCard, Studio } from '@/components/studio-card';
import { api } from '@/lib/api';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch 6 top-rated using .limit(6)
      const res = await api.get('/api/studios/featured');
      if (res.success && Array.isArray(res.studios)) {
        setStudios(res.studios);
      } else {
        setStudios([]);
      }
    } catch (err: any) {
      console.error('Featured studios error:', err);
      setError('Unable to load featured studio spaces at this moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-background border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-foreground">
              Featured Production Spaces
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Top-rated photography cycloramas, film sound stages, and broadcast recording suites chosen by fellow creators.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group"
          >
            <span>View All Spaces</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-[16/10] w-full bg-muted rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-4/5" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
                <div className="h-10 bg-muted rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State with Retry */}
        {!loading && error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-4 max-w-md mx-auto">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={fetchFeatured}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Fetch</span>
            </button>
          </div>
        )}

        {/* Grid of 6 Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

