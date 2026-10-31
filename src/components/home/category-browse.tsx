'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Clapperboard, Mic2, Disc3, Palette, ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Photo Studios',
    slug: 'Photo Studio',
    description: 'Daylight lofts, corner cyclorama cyc walls, and editorial backdrops.',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    count: '30+ Spaces',
    accentColor: 'from-purple-600/80 to-purple-950/90',
  },
  {
    name: 'Sound Stages',
    slug: 'Film Stage',
    description: 'Acoustic STC-60 certified bays, green screens, and LED volumes.',
    icon: Clapperboard,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
    count: '18+ Stages',
    accentColor: 'from-amber-600/80 to-amber-950/90',
  },
  {
    name: 'Podcast Rooms',
    slug: 'Podcast Room',
    description: 'Multi-cam 4K turnkey vodcasting lounges with Shure SM7B rigs.',
    icon: Mic2,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    count: '24+ Lounges',
    accentColor: 'from-emerald-600/80 to-emerald-950/90',
  },
  {
    name: 'Music Suites',
    slug: 'Music Suite',
    description: 'Dolby Atmos 7.1.4 mixing suites, analog synthesizers, and vocal booths.',
    icon: Disc3,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
    count: '22+ Suites',
    accentColor: 'from-blue-600/80 to-blue-950/90',
  },
  {
    name: 'Art Workshops',
    slug: 'Art Workshop',
    description: 'Ceramics labs with pottery wheels, natural skylit painter lofts.',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    count: '15+ Labs',
    accentColor: 'from-rose-600/80 to-rose-950/90',
  },
];

export function CategoryBrowse() {
  return (
    <section className="py-20 bg-muted/30 border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Curated Categories
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl tracking-tight text-foreground">
            Browse by Creative Discipline
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Whether shooting a feature film, recording a chart-topping single, or hosting an art exhibition, select your discipline below.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/studios?category=${encodeURIComponent(cat.slug)}`}
                className="group relative h-72 rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-foreground/30 transition-all duration-300 flex flex-col justify-end p-5"
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark & Accent Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.accentColor} opacity-75 group-hover:opacity-85 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Top Corner Icon & Arrow */}
                <div className="relative z-10 flex items-center justify-between mb-auto">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-1 text-white">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-white/70">
                    {cat.count}
                  </span>
                  <h3 className="font-heading font-bold text-lg leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

