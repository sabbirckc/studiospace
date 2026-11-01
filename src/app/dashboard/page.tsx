'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import {
  LayoutDashboard,
  FolderKanban,
  CalendarCheck,
  Heart,
  PlusCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  Aperture
} from 'lucide-react';

function DashboardContent() {
  const { user } = useAuth();
  const [listingCount, setListingCount] = useState<number>(0);
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const [listingsRes, bookingsRes, wishlistRes] = await Promise.allSettled([
          api.get('/api/studios/my-listings'),
          api.get('/api/bookings/my-bookings'),
          api.get('/api/wishlist/ids')
        ]);

        if (listingsRes.status === 'fulfilled' && listingsRes.value?.success) {
          setListingCount(listingsRes.value.studios?.length || 0);
        }
        if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.success) {
          setBookingCount(bookingsRes.value.bookings?.length || 0);
        }
        if (wishlistRes.status === 'fulfilled' && wishlistRes.value?.success) {
          setWishlistCount(wishlistRes.value.studioIds?.length || 0);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  return (
    <div className="py-12 bg-background min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Creator Profile Header */}
        <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name || 'Creator'}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-primary/20 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground">
                  {user?.name || 'Creator'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  Verified Creator
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>$1,000,000 Host & Creator Protection Guaranteed</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/add-studio"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Studio</span>
            </Link>
            <Link
              href="/studios"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
            >
              <Aperture className="w-4 h-4 text-primary" />
              <span>Explore Spaces</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: My Listings */}
          <Link
            href="/my-listings"
            className="p-6 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hosted Spaces
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-heading font-black text-3xl sm:text-4xl text-foreground">
                {loading ? '...' : listingCount}
              </span>
              <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Manage <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Active studio workspaces you own</p>
          </Link>

          {/* Card 2: My Bookings */}
          <Link
            href="/my-bookings"
            className="p-6 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reservations
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-heading font-black text-3xl sm:text-4xl text-foreground">
                {loading ? '...' : bookingCount}
              </span>
              <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                View <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Upcoming & past shoot sessions</p>
          </Link>

          {/* Card 3: Saved Wishlist */}
          <Link
            href="/wishlist"
            className="p-6 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Saved Spaces
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-heading font-black text-3xl sm:text-4xl text-foreground">
                {loading ? '...' : wishlistCount}
              </span>
              <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Inspect <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Bookmarked production lofts</p>
          </Link>

          {/* Card 4: Host Guarantee Status */}
          <div className="p-6 rounded-3xl border border-border bg-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Platform Safety
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-heading font-black text-2xl sm:text-3xl text-emerald-500">
                Active
              </span>
              <span className="text-xs font-medium text-muted-foreground">Level 1</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Full insurance & collision safeguard</p>
          </div>
        </div>

        {/* Quick Navigational Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Studio Host Quick Actions</span>
            </h2>
            <div className="space-y-2">
              <Link
                href="/add-studio"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-foreground">Create New Workspace Listing</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link
                href="/my-listings"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-foreground">Update or Delete Existing Spaces</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Creator Production Shortcuts</span>
            </h2>
            <div className="space-y-2">
              <Link
                href="/my-bookings"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-foreground">Download PDF Invoices for Confirmed Slots</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link
                href="/studios"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Aperture className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Discover Top-Rated Cyclorama Stages</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
