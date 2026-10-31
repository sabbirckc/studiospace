'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Clock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Discover Spaces',
    description: 'Filter verified photo cyc walls, sound stages, and podcast rooms by equipment, ceiling height, and lighting gear.',
    icon: Search,
    color: 'from-purple-500 to-indigo-600',
  },
  {
    step: '02',
    title: 'Select Shoot Hours',
    description: 'Pick exact production dates, load-in and wrap times with dynamic calendar checks and transparent hourly rates.',
    icon: Clock,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    step: '03',
    title: 'Book Instantly',
    description: 'Lock in reservations with guaranteed double-booking prevention, automated invoicing, and zero hidden platform fees.',
    icon: ShieldCheck,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    step: '04',
    title: 'Create & Produce',
    description: 'Arrive on set with pre-rigged lighting, high-speed fiber Wi-Fi, dedicated green rooms, and seamless host check-in.',
    icon: Sparkles,
    color: 'from-amber-500 to-rose-600',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Streamlined Workflow
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl tracking-tight text-foreground">
            How Booking Works on StudioSpace
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            From discovering the ideal acoustic stage to rolling camera, our 4-step workflow removes production friction.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                {/* Step Number Watermark */}
                <div className="text-4xl font-heading font-black text-muted/50 mb-4 select-none">
                  {item.step}
                </div>

                <div className="space-y-4">
                  {/* Icon Box */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subtle border accent */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Step {index + 1} of 4</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-md transition-all"
          >
            <span>Explore All Workspaces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
