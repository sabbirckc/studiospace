'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import {
  Aperture,
  PlusCircle,
  Image as ImageIcon,
  DollarSign,
  Users,
  MapPin,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  UploadCloud,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { uploadToImgBB } from '@/lib/upload';

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

function AddStudioForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState<number | ''>(120);
  const [securityDeposit, setSecurityDeposit] = useState<number | ''>(200);
  const [maxCapacity, setMaxCapacity] = useState<number | ''>(15);
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-Speed 1Gbps Fiber Wi-Fi',
    'Hair & Makeup Vanity Station'
  ]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [overview, setOverview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    try {
      setIsUploading(true);
      toast.loading('Uploading studio photo to ImgBB...', { duration: 2000 });
      const uploadedUrl = await uploadToImgBB(file);
      setImageUrl(uploadedUrl);
      toast.success('Studio image uploaded to ImgBB successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image to ImgBB.');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleAddCustomAmenity = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities((prev) => [...prev, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category || !hourlyRate || !location.trim() || !imageUrl.trim() || !overview.trim()) {
      toast.error('Please complete all required fields including image URL and overview.');
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

      const res = await api.post('/api/studios', payload);

      if (res.success) {
        toast.success('Your creative studio has been listed successfully!');
        router.push('/my-listings');
      }
    } catch (err: any) {
      console.error('Add studio error:', err);
      toast.error(err.message || 'Failed to list studio space.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-2 border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Host Workspace</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-foreground tracking-tight">
            Add New Production Studio
          </h1>
          <p className="text-sm text-muted-foreground">
            Share your photography cyc wall, film sound stage, podcast lounge, or music suite with verified creators.
          </p>
        </div>

        {/* Studio Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Host Credentials (Read-only) */}
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

          {/* Basic Details */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-foreground">
              General Studio Information
            </h2>

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
                placeholder="e.g. Daylight Cyclorama & Infinity Sound Stage"
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
                    placeholder="e.g. DUMBO Arts Quarter, Brooklyn, NY"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Hourly Rate ($ / hr) *
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
                  Max Cast & Crew Capacity
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
          </div>

          {/* Media & Visuals */}
          <div className="space-y-4">
            <h2 className="font-heading font-bold text-lg text-foreground">
              Studio Photography & Cover Image
            </h2>

            {/* ImgBB Direct Device File Upload */}
            <div className="p-4 rounded-2xl border border-dashed border-border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Upload from Device (ImgBB Integration)</p>
                  <p className="text-[11px] text-muted-foreground">Upload local photos directly to ImgBB cloud storage</p>
                </div>
              </div>
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                {isUploading ? 'Uploading...' : 'Choose Image File'}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                High-Resolution Image URL *
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <span className="text-[11px] text-muted-foreground block">
                Provide a direct high-res image link from Unsplash, ImgBB, or your CDN.
              </span>
            </div>

            {/* Real-time Image Preview */}
            {imageUrl && (
              <div className="relative aspect-[16/9] max-w-md rounded-2xl overflow-hidden border border-border bg-muted">
                <img
                  src={imageUrl}
                  alt="Studio Preview"
                  className="w-full h-full object-cover"
                  onError={() => toast.error('Provided image URL could not be loaded.')}
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 text-white text-[11px] font-medium">
                  Cover Preview
                </span>
              </div>
            )}
          </div>

          {/* Amenities Checklist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg text-foreground">
                Production Gear & Amenities
              </h2>
              <span className="text-xs text-muted-foreground">
                {selectedAmenities.length} selected
              </span>
            </div>

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

            {/* Custom Amenity Tag */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAmenity(e))}
                placeholder="Add custom gear (e.g. Aputure 600d Pro light, fog machine)"
                className="flex-1 px-4 py-2 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={handleAddCustomAmenity}
                className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:opacity-90"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Detailed Overview */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Detailed Overview & Rules *
            </label>
            <textarea
              required
              rows={5}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Describe the space dimensions, daylight exposure, ceiling height, noise isolation, load-in procedures, and rules for sound or paint."
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl border border-border text-sm font-semibold hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <span>Publish Studio Space</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddStudioPage() {
  return (
    <ProtectedRoute>
      <AddStudioForm />
    </ProtectedRoute>
  );
}

