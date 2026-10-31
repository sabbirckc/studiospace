'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Studio } from '@/components/studio-card';
import { BookingModal } from '@/components/booking-modal';
import { useWishlist } from '@/context/wishlist-context';
import { api } from '@/lib/api';
import {
  Star,
  MapPin,
  Users,
  Shield,
  Heart,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Share2,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export default function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const studioId = resolvedParams.id;
  const router = useRouter();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = studio ? isInWishlist(studio._id) : false;

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/studios/${studioId}`);
        if (res.success && res.studio) {
          setStudio(res.studio);
          setActiveImage(res.studio.imageUrl);
        }
      } catch (err: any) {
        toast.error('Failed to load studio specifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudio();
  }, [studioId]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Studio link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse">
        <div className="h-6 bg-muted rounded w-32" />
        <div className="h-96 bg-muted rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded-2xl" />
          </div>
          <div className="h-64 bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4 space-y-4">
        <h2 className="font-heading font-black text-2xl text-foreground">Studio Not Found</h2>
        <p className="text-sm text-muted-foreground">This production space does not exist or has been removed.</p>
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const galleryImages = studio.gallery && studio.gallery.length > 0 ? studio.gallery : [studio.imageUrl];

  return (
    <div className="py-10 sm:py-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Studios</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => toggleWishlist(studio._id, studio.title)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-medium transition-colors ${
                saved ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' : 'hover:bg-muted'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Studio Heading & Meta */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {studio.category}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-foreground">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{studio.rating ? studio.rating.toFixed(2) : '4.95'}</span>
              <span className="text-muted-foreground font-normal">
                ({studio.reviewCount || 1} verified creator reviews)
              </span>
            </div>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground">
            {studio.title}
          </h1>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{studio.location}</span>
          </p>
        </div>

        {/* Gallery Showcase */}
        <div className="space-y-4">
          <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-muted border border-border shadow-lg">
            <img
              src={activeImage}
              alt={studio.title}
              onError={() => setActiveImage('https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=80')}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Details & Booking Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Specifications, Amenities & Host */}
          <div className="lg:col-span-8 space-y-10">
            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border border-border bg-card space-y-1 text-center">
                <Users className="w-5 h-5 mx-auto text-primary" />
                <span className="text-xs text-muted-foreground block">Max Capacity</span>
                <span className="font-bold text-sm text-foreground">{studio.maxCapacity} Creators</span>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card space-y-1 text-center">
                <DollarSign className="w-5 h-5 mx-auto text-emerald-500" />
                <span className="text-xs text-muted-foreground block">Hourly Rate</span>
                <span className="font-bold text-sm text-foreground">${studio.hourlyRate} / hr</span>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card space-y-1 text-center">
                <Shield className="w-5 h-5 mx-auto text-amber-500" />
                <span className="text-xs text-muted-foreground block">Deposit</span>
                <span className="font-bold text-sm text-foreground">${studio.securityDeposit || 0}</span>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card space-y-1 text-center">
                <Sparkles className="w-5 h-5 mx-auto text-blue-500" />
                <span className="text-xs text-muted-foreground block">Protection</span>
                <span className="font-bold text-sm text-foreground">$1M Guarantee</span>
              </div>
            </div>

            {/* Detailed Overview */}
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                Workspace Overview
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {studio.overview}
              </p>
            </div>

            {/* Production Amenities & Gear Included */}
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                Amenities & Equipment Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studio.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card/60"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs sm:text-sm text-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Host Details */}
            <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Studio Host & Verified Partner
              </span>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-lg text-primary">
                  {studio.ownerName ? studio.ownerName.charAt(0) : 'H'}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {studio.ownerName || 'Verified Studio Host'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {studio.ownerEmail} • Host on StudioSpace
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Identity & Gear Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="p-6 rounded-3xl border border-border bg-card shadow-xl space-y-6">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <div>
                  <span className="font-heading font-black text-3xl text-foreground">
                    ${studio.hourlyRate}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ hour</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{studio.rating ? studio.rating.toFixed(1) : '4.9'}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Minimum Production Session</span>
                  <span className="font-semibold text-foreground">2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Max Crew Capacity</span>
                  <span className="font-semibold text-foreground">{studio.maxCapacity} people</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cancellation Policy</span>
                  <span className="font-semibold text-foreground">Free up to 48 hrs prior</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Workspace Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-[11px] text-center text-muted-foreground">
                You won&apos;t be billed immediately. Confirmation includes double-booking collision check.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        studio={studio}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}

