'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Wrench, Headphones, CheckCircle2 } from 'lucide-react';

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: '$1,000,000 Host Liability Protection',
    description: 'Every confirmed reservation includes platform-backed third-party property damage and bodily injury protection so hosts can list with absolute confidence.',
  },
  {
    icon: UserCheck,
    title: 'Verified Creator & Host Identity',
    description: 'Government ID verification, creator portfolio reviews, and studio inspection audits guarantee you are partnering with legitimate professionals.',
  },
  {
    icon: Wrench,
    title: 'Production Equipment & Gear Safety',
    description: 'Documented pre-shoot inspection forms and dedicated equipment check-in logs ensure lighting packages, camera rigs, and mixing desks remain protected.',
  },
  {
    icon: Headphones,
    title: '24/7 Dedicated Concierge & Support',
    description: 'On-set emergencies, schedule overruns, and technical queries handled 24/7 by our dedicated team of veteran production managers.',
  },
];

export function HostGuarantee() {
  return (
    <section id="host-guarantee" className="relative py-24 bg-card border-b border-border transition-colors">
      <div id="about-us" className="absolute -top-16 left-0 w-0 h-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>StudioSpace Trust & Safety</span>
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl text-foreground tracking-tight leading-tight">
              Host Guarantee & Creator Support Assurance
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed">
              We built StudioSpace to elevate creative collaboration. Our industry-leading safety protocols, liability coverage, and verified identity framework give both space owners and visiting creators seamless confidence.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Instant digital rental contracts with e-signatures',
                'Transparent damage dispute resolution within 48 hours',
                'Secure escrow payments released post-shoot completion',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/add-studio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-sm"
              >
                <span>Host Your Studio</span>
              </Link>
              <Link
                href="/studios"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-background text-foreground font-semibold text-sm hover:bg-muted"
              >
                <span>Browse Spaces</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Feature Boxes */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ASSURANCES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-background p-6 space-y-3 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

