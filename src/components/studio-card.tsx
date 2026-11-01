'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Users, Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/wishlist-context';

export interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  gallery?: string[];
  amenities: string[];
  overview: string;
  ownerEmail?: string;
  ownerName?: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
}

export function StudioCard({ studio }: { studio: Studio }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(studio._id);

  const fallbackImage = '/image-1.png';
  const [imgSrc, setImgSrc] = React.useState(studio.imageUrl || fallbackImage);

  React.useEffect(() => {
    setImgSrc(studio.imageUrl || fallbackImage);
  }, [studio.imageUrl]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Photo Studio':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'Film Stage':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Podcast Room':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Music Suite':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Art Workshop':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="group flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-foreground/20 transition-all duration-300">
      {/* Studio Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={imgSrc}
          alt={studio.title}
          onError={() => setImgSrc(fallbackImage)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${getCategoryColor(
              studio.category
            )}`}
          >
            {studio.category}
          </span>
        </div>

        {/* Wishlist Heart Button (Optional Requirement) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(studio._id, studio.title);
          }}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
            saved
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white font-medium text-xs flex items-baseline gap-1">
          <span className="font-bold text-sm">${studio.hourlyRate}</span>
          <span className="text-white/70">/ hr</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="flex flex-col flex-1 p-5 justify-between gap-4">
        <div className="space-y-2">
          {/* Rating & Capacity */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{studio.rating ? studio.rating.toFixed(1) : '4.9'}</span>
              <span className="text-muted-foreground font-normal">
                ({studio.reviewCount || 1})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Up to {studio.maxCapacity} people</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-base leading-snug text-foreground group-hover:text-primary line-clamp-1 transition-colors">
            {studio.title}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground line-clamp-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span>{studio.location}</span>
          </p>

          {/* Amenities snippets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {studio.amenities.slice(0, 2).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground truncate max-w-[140px]"
              >
                {amenity}
              </span>
            ))}
            {studio.amenities.length > 2 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                +{studio.amenities.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* View Details Action Button */}
        <Link
          href={`/studios/${studio._id}`}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-primary hover:text-primary-foreground font-medium text-xs transition-all duration-200 group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

