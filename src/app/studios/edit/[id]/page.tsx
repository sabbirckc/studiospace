'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { Studio } from '@/components/studio-card';
import { api } from '@/lib/api';
import {
  Edit,
  DollarSign,
  Users,
  MapPin,
  Image as ImageIcon,
  Check,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_AMENITIES = [
  'Two-Wall Infinity Cyclorama',
  'Profoto B10X Strobe Kit',
  '14ft North-Facing Windows',
  'STC-60 Soundproofing',
  'Pre-Rigged ARRI SkyPanel Grid',
  'Drive-In Elephant Doors',
  '4x Shure SM7B Broadcast Mics',
  'Rødecaster Pro II Integrated Board',
  'Genelec 7.1.4 Dolby Atmos Rig',
  'Floating Floor Vocal Iso Booth',
  'High-Speed 1Gbps Fiber Wi-Fi',
  'Hair & Makeup Vanity Station',
  'Private Client Green Room',
  'Freight Elevator Access',
  'Drive-In Vehicle Access'
];

function EditStudioForm({ studioId }: { studioId: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState<number | ''>(100);
  const [securityDeposit, setSecurityDeposit] = useState<number | ''>(0);
  const [maxCapacity, setMaxCapacity] = useState<number | ''>(10);
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [overview, setOverview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/studios/${studioId}`);
        if (res.success && res.studio) {
          const s: Studio = res.studio;

          // Verify ownership
          if (user && s.ownerEmail && s.ownerEmail !== user.email) {
            toast.error('You do not have permission to modify this studio listing.');
            router.push('/my-listings');
            return;
          }

          setTitle(s.title);
          setCategory(s.category);
          setHourlyRate(s.hourlyRate);
          setSecurityDeposit(s.securityDeposit || 0);
          setMaxCapacity(s.maxCapacity);
          setLocation(s.location);
          setImageUrl(s.imageUrl);
          setSelectedAmenities(s.amenities || []);
          setOverview(s.overview);
        }
      } catch (err: any) {
        toast.error('Failed to fetch existing studio information.');
        router.push('/my-listings');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchExisting();
    }
  }, [studioId, user, router]);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category || !hourlyRate || !location.trim() || !imageUrl.trim() || !overview.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        category,
        hourlyRate: Number(hourlyRate),
        securityDeposit: Number(securityDeposit || 0),
        maxCapacity: Number(maxCapacity || 10),
        location: location.trim(),
        imageUrl: imageUrl.trim(),
        gallery: [imageUrl.trim()],
        amenities: selectedAmenities,
        overview: overview.trim(),
      };

      const res = await api.put(`/api/studios/${studioId}`, payload);

      if (res.success) {
        toast.success('Studio listing updated successfully!');
        router.push('/my-listings');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update studio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Loading listing specifications...</p>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-2 border-b border-border pb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to My Listings</span>
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary">
            <Edit className="w-3.5 h-3.5" />
            <span>Update Studio Listing</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-foreground tracking-tight">
            Edit Workspace Specifications
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Read-only Host info */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Host Verification Info (Read-Only)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Host Name:</span>
                <p className="font-semibold text-foreground">{user?.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Host Email:</span>
                <p className="font-semibold text-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Studio Listing Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Studio Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Photo Studio">Photo Studio</option>
                <option value="Film Stage">Film Stage</option>
                <option value="Podcast Room">Podcast Room</option>
                <option value="Music Suite">Music Suite</option>
                <option value="Art Workshop">Art Workshop</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Location / Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hourly Rate ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  required
                  min={1}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Security Deposit ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  min={0}
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Max Capacity
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  min={1}
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Image URL & Preview */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Image URL *
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {imageUrl && (
              <div className="relative aspect-[16/9] max-w-sm rounded-xl overflow-hidden border border-border bg-muted mt-2">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Amenities Included
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {DEFAULT_AMENITIES.map((item) => {
                const isSelected = selectedAmenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted-foreground/40'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overview *
            </label>
            <textarea
              required
              rows={5}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/my-listings')}
              className="px-6 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Changes...' : 'Save & Update Studio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <ProtectedRoute>
      <EditStudioForm studioId={resolvedParams.id} />
    </ProtectedRoute>
  );
}

