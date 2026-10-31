'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { useWishlist } from '@/context/wishlist-context';
import { StudioCard, Studio } from '@/components/studio-card';
import { api } from '@/lib/api';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

function WishlistContent() {
  const { user } = useAuth();
  const { savedIds } = useWishlist();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistStudios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/wishlist');
      if (res.success && Array.isArray(res.studios)) {
        setStudios(res.studios);
      } else {
        setStudios([]);
      }
    } catch (err: any) {
      toast.error('Failed to load your saved studios wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlistStudios();
    }
  }, [user, savedIds.length]);

  return (
    <div className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Saved Workspaces</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground tracking-tight">
              My Saved Studios Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Production spaces you have bookmarked for upcoming video, photography, or music projects.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
          >
            <span>Browse More Studios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-[16/10] w-full bg-muted rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-4/5" />
                </div>
                <div className="h-10 bg-muted rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && studios.length === 0 && (
          <div className="text-center py-20 px-4 max-w-md mx-auto space-y-5 rounded-3xl border border-dashed border-border bg-card/50">
            <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-rose-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-foreground">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Click the heart icon on any creative studio card to save it here for quick inspection and booking.
              </p>
            </div>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
            >
              <span>Explore Studio Spaces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Studios Grid */}
        {!loading && studios.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}

