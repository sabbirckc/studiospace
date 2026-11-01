'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Aperture, Send } from 'lucide-react';
import { toast } from 'sonner';

// Custom Modern X (Twitter) Vector Icon
function XIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15"/>
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you! You are now subscribed to the StudioSpace Creator Brief.');
    setNewsletterEmail('');
  };

  const categories = [
    { name: 'Photo Studios', href: '/studios?category=Photo%20Studio' },
    { name: 'Film Stages', href: '/studios?category=Film%20Stage' },
    { name: 'Podcast Rooms', href: '/studios?category=Podcast%20Room' },
    { name: 'Music Suites', href: '/studios?category=Music%20Suite' },
    { name: 'Art Workshops', href: '/studios?category=Art%20Workshop' },
  ];

  const quickLinks = [
    { name: 'Explore All Studios', href: '/studios' },
    { name: 'Host Your Space', href: '/add-studio' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Host Guarantee', href: '/#host-guarantee' },
    { name: 'About Us & FAQ', href: '/about-us' },
  ];

  return (
    <footer className="border-t border-border bg-card text-card-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/#hero-banner"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  const banner = document.getElementById('hero-banner');
                  if (banner) {
                    banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <Aperture className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black tracking-tight text-xl leading-none">
                  Studio<span className="text-zinc-500 dark:text-zinc-400">Space</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  Production Sharing
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The high-performance peer-to-peer workspace marketplace engineered for creators, directors,
              photographers, podcasters, and musicians. Unlock world-class production spaces with transparent
              hourly rates and instant booking.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow us on X"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-foreground">
              Studio Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.name}>
                  <Link
                    href={c.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-foreground">
              Explore Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((q) => (
                <li key={q.name}>
                  <Link
                    href={q.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {q.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-foreground">
              Creator Dispatch
            </h3>
            <p className="text-sm text-muted-foreground">
              Receive newly listed production spaces, exclusive shoot discounts, and creator gear guides weekly.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="creator@studiospace.io"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center transition-opacity"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-muted-foreground block">
                No spam. Unsubscribe at any time.
              </span>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} StudioSpace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Safety Guidelines</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
