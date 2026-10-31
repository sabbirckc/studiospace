'use client';

import React from 'react';
import Link from 'next/link';
import {
  Aperture,
  Film,
  Camera,
  Mic,
  ShieldCheck,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  Award,
  Globe2
} from 'lucide-react';

export default function AboutUsPage() {
  const stats = [
    { value: '450+', label: 'Verified Production Studios' },
    { value: '18,500+', label: 'Hours of Production Booked' },
    { value: '99.4%', label: 'Creator Satisfaction Rate' },
    { value: '$1M', label: 'Host Liability Guarantee' },
  ];

  const pillars = [
    {
      icon: Clock,
      title: 'Transparent Hourly Access',
      description: 'Traditional sound stages force creators into rigid 12-hour minimum day rates. StudioSpace provides flexible hourly slots with zero surprise power drops or hidden fees.',
    },
    {
      icon: Award,
      title: 'Certified Production Gear',
      description: 'Every space lists exact ceiling heights, soundproofing STC ratings, continuous power distribution (Camlock/3-Phase), and pre-rigged lighting grids.',
    },
    {
      icon: ShieldCheck,
      title: 'Double-Booking Protection',
      description: 'Our proprietary collision prevention engine checks schedules in real-time against confirmed bookings, guaranteeing your crew never arrives to an occupied set.',
    },
    {
      icon: Globe2,
      title: 'Community-Driven Economy',
      description: 'Studio owners monetize downtime between major commercial shoots, while emerging creators and independent filmmakers access tier-one infrastructure.',
    },
  ];

  const faqs = [
    {
      q: 'How does StudioSpace verify production studios?',
      a: 'Every studio host submits gear inventories, electrical specifications, and walkthrough photos. Our concierge team validates acoustic soundproofing, daylight exposure, and equipment safety before listings go live.',
    },
    {
      q: 'What happens if a scheduling conflict or double-booking occurs?',
      a: 'Our platform prevents double-bookings at the database level. In the rare event of an unforeseen host emergency, our 24/7 on-call concierge will immediately relocate your crew or issue a 100% full refund.',
    },
    {
      q: 'Are equipment and gear covered under the Host Guarantee?',
      a: 'Yes. Every confirmed reservation through StudioSpace includes up to $1,000,000 in platform-backed property and liability protection, alongside mandatory check-in inspection forms.',
    },
    {
      q: 'Can creators download official tax and production receipts?',
      a: 'Absolutely. Every booking generated on StudioSpace features an instant downloadable PDF Invoice with itemized shoot hours, hourly rates, and reference IDs for your production accounting.',
    },
  ];

  return (
    <div id="about-us" className="py-12 sm:py-20 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header / Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary">
            <Aperture className="w-4 h-4" />
            <span>About StudioSpace</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-foreground tracking-tight leading-[1.1]">
            Empowering the Next Era of Cinematic & Creative Production
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            StudioSpace is the premier peer-to-peer marketplace built by directors, cinematographers,
            and sound engineers to make high-end production spaces accessible, transparent, and seamless.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-border bg-card text-center space-y-2 shadow-sm hover:border-foreground/20 transition-colors"
            >
              <div className="font-heading font-black text-3xl sm:text-4xl text-primary">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-border shadow-xl aspect-[4/3] bg-muted">
            <img
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
              alt="Film & Sound Studio Production"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Built by Creators, for Creators
                </span>
                <p className="font-heading font-bold text-lg sm:text-xl">
                  Turning empty studio hours into thriving creative collaborations.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Our Origin & Mission
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-foreground tracking-tight">
              Why We Built StudioSpace
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Finding a reliable photography cyc wall or an acoustic sound stage used to mean endless phone tag,
              opaque pricing quotes, unexpected equipment upcharges, and cumbersome insurance requirements.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We launched StudioSpace to democratize production access. By uniting studio hosts with verified filmmakers,
              photographers, podcasters, and music artists, we enable peer-to-peer sharing with transparent hourly rates,
              verified technical specifications, and automated conflict-free bookings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant Verified Invoicing</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>$1M Liability Coverage</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>24/7 Production Concierge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Platform Standards
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-foreground tracking-tight">
              Our Core Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl border border-border bg-card space-y-3 hover:border-foreground/30 hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Got Questions?
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-border bg-card space-y-2"
              >
                <h3 className="font-heading font-bold text-base text-foreground">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="rounded-3xl border border-border bg-gradient-to-r from-zinc-900 to-black text-white p-8 sm:p-12 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="font-heading font-black text-2xl sm:text-3xl tracking-tight">
              Ready to Book Your Next Creative Studio?
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Explore hundreds of verified cyclorama lofts, cinema stages, and broadcast lounges with instant booking.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 shadow-lg transition-all"
            >
              <span>Explore Studios</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all"
            >
              <span>Host Your Space</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
