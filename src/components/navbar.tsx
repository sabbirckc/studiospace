'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import {
  Aperture,
  LayoutDashboard,
  Sun,
  Moon,
  Menu,
  X,
  PlusCircle,
  FolderKanban,
  CalendarCheck,
  Heart,
  LogOut,
  ChevronDown,
  User as UserIcon,
  Sparkles
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Dynamically detect if user scrolled into #how-it-works or #about-us on homepage
      if (window.location.pathname === '/') {
        const aboutEl = document.getElementById('about-us');
        const howEl = document.getElementById('how-it-works');

        if (aboutEl) {
          const rect = aboutEl.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 200) {
            setActiveHash('#about-us');
            return;
          }
        }

        if (howEl) {
          const rect = howEl.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 200) {
            setActiveHash('#how-it-works');
            return;
          }
        }

        if (window.scrollY < 400) {
          setActiveHash('');
        }
      }
    };

    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Handle smooth scroll when navigating to #how-it-works or #about-us on mount or route transition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#how-it-works' || hash === '#about-us') {
        setActiveHash(hash);
        setTimeout(() => {
          const id = hash.replace('#', '');
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      }
    }
  }, [pathname]);

  // Close menus on path change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore Studios', href: '/studios' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'About Us', href: '/#about-us' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#how-it-works')) {
      if (pathname === '/') {
        e.preventDefault();
        const el = document.getElementById('how-it-works');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', '#how-it-works');
          setActiveHash('#how-it-works');
        }
      }
    } else if (href.includes('#about-us')) {
      if (pathname === '/') {
        e.preventDefault();
        const el = document.getElementById('about-us');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', '#about-us');
          setActiveHash('#about-us');
        }
      }
    } else if (href === '/') {
      if (pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
        setActiveHash('');
      }
    } else {
      setActiveHash('');
    }
    setMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/#how-it-works') {
      return pathname === '/' && activeHash === '#how-it-works';
    }
    if (href === '/#about-us') {
      return pathname === '/' && activeHash === '#about-us';
    }
    if (href === '/') {
      return pathname === '/' && !activeHash;
    }
    return pathname.startsWith(href) && href !== '/';
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md shadow-sm border-border'
          : 'bg-background/70 backdrop-blur-sm border-border/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Aperture Icon */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-45">
            <Aperture className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black tracking-tight text-xl leading-none flex items-center gap-1">
              Studio<span className="text-zinc-500 dark:text-zinc-400">Space</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              Production Sharing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Active Indicators */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full animate-fade-in" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle + Auth State */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggler (Challenge 3) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Unauthenticated State */}
          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-opacity"
              >
                Register
              </Link>
            </div>
          ) : (
            /* Authenticated State with User Dropdown */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                className="flex items-center gap-2.5 p-1.5 rounded-full border border-border hover:bg-muted/50 transition-colors"
              >
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
                <span className="text-sm font-medium max-w-[120px] truncate pr-1">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground mr-1" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-border shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                >
                  <div className="px-3 py-2.5 border-b border-border mb-1">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-foreground hover:bg-muted transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/add-studio"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-foreground hover:bg-muted transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-500" />
                    <span>Add New Studio</span>
                  </Link>

                  <Link
                    href="/my-listings"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-foreground hover:bg-muted transition-colors"
                  >
                    <FolderKanban className="w-4 h-4 text-blue-500" />
                    <span>My Studio Listings</span>
                  </Link>

                  <Link
                    href="/my-bookings"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-foreground hover:bg-muted transition-colors"
                  >
                    <CalendarCheck className="w-4 h-4 text-amber-500" />
                    <span>My Bookings</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-foreground hover:bg-muted transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Saved Wishlist</span>
                  </Link>

                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-muted"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.href) ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-border pt-3">
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/dashboard"
                    className="col-span-2 flex items-center justify-center gap-2 p-2.5 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard Overview</span>
                  </Link>
                  <Link
                    href="/add-studio"
                    className="flex items-center gap-2 p-2.5 text-xs font-medium rounded-lg border border-border hover:bg-muted"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Add Studio</span>
                  </Link>
                  <Link
                    href="/my-listings"
                    className="flex items-center gap-2 p-2.5 text-xs font-medium rounded-lg border border-border hover:bg-muted"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-blue-500" />
                    <span>My Listings</span>
                  </Link>
                  <Link
                    href="/my-bookings"
                    className="flex items-center gap-2 p-2.5 text-xs font-medium rounded-lg border border-border hover:bg-muted"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>My Bookings</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-2 p-2.5 text-xs font-medium rounded-lg border border-border hover:bg-muted"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Wishlist</span>
                  </Link>
                </div>

                <button
                  onClick={logout}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-sm text-destructive rounded-xl border border-destructive/20 hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

