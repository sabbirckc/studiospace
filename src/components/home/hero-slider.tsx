'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Video, Camera, Mic } from 'lucide-react';

interface SlideData {
  id: number;
  badge: string;
  badgeIcon: any;
  headline: string;
  subtext: string;
  image: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    badge: 'Premier Daylight Cycloramas',
    badgeIcon: Camera,
    headline: 'High-Performance Production Studios for Visionary Creators',
    subtext: 'Discover pristine cyclorama walls, soundproofed cinema bays, and bespoke podcast suites with instant booking and transparent hourly rates.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=85',
    primaryCtaText: 'Explore Studios',
    primaryCtaLink: '/studios',
    secondaryCtaText: 'Host Your Space',
    secondaryCtaLink: '/add-studio',
  },
  {
    id: 2,
    badge: 'Acoustic Sound Stages & LED Volumes',
    badgeIcon: Video,
    headline: 'Cinematic Soundproof Stages Engineered for Film & Commercials',
    subtext: 'Book certified STC-60 acoustic sound stages, virtual production LED volumes, and pre-rigged ARRI lighting grids across premier creative districts.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=85',
    primaryCtaText: 'Explore Stages',
    primaryCtaLink: '/studios?category=Film%20Stage',
    secondaryCtaText: 'Host Your Space',
    secondaryCtaLink: '/add-studio',
  },
  {
    id: 3,
    badge: 'Broadcast Vodcast & Dolby Atmos Suites',
    badgeIcon: Mic,
    headline: 'Broadcast-Ready Recording Lounges for Podcasters & Musicians',
    subtext: 'Multi-camera 4K podcast setups and Genelec 7.1.4 Dolby Atmos mixing rooms tailored for chart-topping audio and video productions.',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1920&q=85',
    primaryCtaText: 'Explore Audio Suites',
    primaryCtaLink: '/studios?category=Podcast%20Room',
    secondaryCtaText: 'Host Your Space',
    secondaryCtaLink: '/add-studio',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full h-[580px] sm:h-[620px] lg:h-[680px] overflow-hidden bg-black select-none">
      {/* Slides */}
      {HERO_SLIDES.map((slide, index) => {
        const Icon = slide.badgeIcon;
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Deep Cinematic Gradient */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.headline}
                className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Feature Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{slide.badge}</span>
                </div>

                {/* Headline */}
                <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                  {slide.headline}
                </h1>

                {/* Subtext */}
                <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-xl">
                  {slide.subtext}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={slide.primaryCtaLink}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 shadow-lg hover:shadow-white/20 transition-all group"
                  >
                    <span>{slide.primaryCtaText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href={slide.secondaryCtaLink}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{slide.secondaryCtaText}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Manual Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 flex items-center justify-center transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 flex items-center justify-center transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
