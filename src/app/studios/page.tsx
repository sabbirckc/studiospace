'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StudioCard, Studio } from '@/components/studio-card';
import { api } from '@/lib/api';
import { Search, Filter, SlidersHorizontal, Sparkles, RefreshCw, Layers } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Photo Studio',
  'Film Stage',
  'Podcast Room',
  'Music Suite',
  'Art Workshop'
];

function StudiosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');

  // Synchronize category if changed in URL
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const fetchStudios = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (sortBy) params.sort = sortBy;

      const res = await api.get('/api/studios', params);
      if (res.success && Array.isArray(res.studios)) {
        setStudios(res.studios);
      } else {
        setStudios([]);
      }
    } catch (err) {
      console.error('Fetch studios error:', err);
      setStudios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchStudios();
    }, 250);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      router.push('/studios');
    } else {
      router.push(`/studios?category=${encodeURIComponent(category)}`);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
    router.push('/studios');
  };

  return (
    <div className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Marketplace Catalog
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-foreground tracking-tight">
              Explore Creative Production Studios
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Book hourly access to verified cyclorama lofts, cinematic sound stages, and broadcast rooms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">
              Showing {studios.length} {studios.length === 1 ? 'space' : 'spaces'}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by studio name, gear, or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-3.5 rounded-xl border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="newest">Recently Added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="capacity">Max Capacity</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
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

        {/* Empty State */}
        {!loading && studios.length === 0 && (
          <div className="text-center py-20 px-4 max-w-md mx-auto space-y-5 rounded-3xl border border-dashed border-border bg-card/50">
            <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-foreground">
                No Creative Studios Found
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We couldn&apos;t find any production spaces matching your current search parameters or category filter.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Studios Grid */}
        {!loading && studios.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading studio catalog...</div>}>
      <StudiosContent />
    </Suspense>
  );
}

