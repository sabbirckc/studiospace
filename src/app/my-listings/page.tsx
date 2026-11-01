'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { Studio } from '@/components/studio-card';
import { api } from '@/lib/api';
import {
  FolderKanban,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  AlertTriangle,
  X,
  Star,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

function MyListingsContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [listings, setListings] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom Confirmation Modal state (NO native browser alert/confirm!)
  const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/studios/my-listings');
      if (res.success && Array.isArray(res.studios)) {
        setListings(res.studios);
      } else {
        setListings([]);
      }
    } catch (err: any) {
      toast.error('Failed to load your studio listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  const handleDeleteConfirm = async () => {
    if (!studioToDelete) return;

    try {
      setIsDeleting(true);
      const res = await api.delete(`/api/studios/${studioToDelete._id}`);
      if (res.success) {
        toast.success(`"${studioToDelete.title}" has been deleted successfully.`);
        setListings((prev) => prev.filter((s) => s._id !== studioToDelete._id));
        setStudioToDelete(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete studio.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Host Management</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground tracking-tight">
              My Studio Listings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your published creative production spaces, rates, and listings.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Studio</span>
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-5 rounded-2xl border border-border bg-card animate-pulse flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 rounded-xl bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-48" />
                    <div className="h-3 bg-muted rounded w-32" />
                  </div>
                </div>
                <div className="h-8 bg-muted rounded w-24" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-20 px-4 max-w-md mx-auto space-y-5 rounded-3xl border border-dashed border-border bg-card/50">
            <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
              <FolderKanban className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-foreground">
                No Studio Listings Found
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                You haven&apos;t published any production studios yet. Start sharing your workspace with fellow creators today.
              </p>
            </div>
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Host Your First Space</span>
            </Link>
          </div>
        )}

        {/* Listings Table / Cards */}
        {!loading && listings.length > 0 && (
          <div className="space-y-4">
            {listings.map((item) => (
              <div
                key={item._id}
                className="p-5 rounded-2xl border border-border bg-card hover:border-foreground/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/image-1.png';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-foreground">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {item.rating || '4.9'}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-lg text-foreground line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.location}</span>
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-foreground pt-0.5">
                      <span>Rate: <strong className="text-primary">${item.hourlyRate}/hr</strong></span>
                      <span>Capacity: {item.maxCapacity} crew</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2.5 self-end md:self-center">
                  <Link
                    href={`/studios/${item._id}`}
                    target="_blank"
                    className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="View Public Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/studios/edit/${item._id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Listing</span>
                  </Link>

                  {/* Custom Modal Trigger (No default alert!) */}
                  <button
                    onClick={() => setStudioToDelete(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-destructive/20 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal for Deleting Studio */}
      {studioToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-foreground">
                  Confirm Listing Deletion
                </h3>
                <p className="text-xs text-muted-foreground">
                  This action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              Are you sure you want to delete <strong className="text-destructive font-bold">&quot;{studioToDelete.title}&quot;</strong> from StudioSpace?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStudioToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-destructive text-white text-xs font-semibold hover:opacity-90 flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <ProtectedRoute>
      <MyListingsContent />
    </ProtectedRoute>
  );
}

