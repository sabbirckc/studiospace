'use client';

import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, Mail, User, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string) => Promise<boolean>;
}

export function GoogleAuthModal({ isOpen, onClose, onSubmit }: GoogleAuthModalProps) {
  const [name, setName] = useState('Sabbir Hossain');
  const [email, setEmail] = useState('sabbirhossainnubian@gmail.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  if (!isOpen) return null;

  const handleCopyOrigin = () => {
    navigator.clipboard.writeText('http://localhost:3000');
    setCopied(true);
    toast.success('Copied "http://localhost:3000" to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid Google email.');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await onSubmit(name.trim() || email.split('@')[0], email.trim());
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Google Origin Authorization</span>
          </div>

          <h2 className="font-heading font-black text-2xl text-foreground tracking-tight">
            Register with Google Email
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Google blocked the popup because <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-foreground font-semibold">http://localhost:3000</code> is not yet registered under <strong>Authorized JavaScript origins</strong> in your Google Cloud Console.
          </p>
        </div>

        {/* Form to Register directly with Google Email */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Google Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Register & Sign In with this Google Email</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggleable Google Console Setup Guide */}
        <div className="border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span>{showGuide ? 'Hide' : 'How to fix in Google Cloud Console (30-second fix)'}</span>
          </button>

          {showGuide && (
            <div className="mt-3 p-4 rounded-2xl bg-muted/50 border border-border space-y-3 text-xs animate-in fade-in duration-200">
              <p className="text-muted-foreground">
                To enable the official Google popup for your Client ID without seeing <em>Error 401: invalid_client / no registered origin</em>:
              </p>
              <ol className="list-decimal pl-4 space-y-2 text-foreground">
                <li>
                  Go to{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>Google Cloud Console Credentials</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>Click on your <strong>OAuth 2.0 Client ID</strong> (ending in <code className="font-mono text-[11px] bg-background px-1 py-0.5 rounded">...ga56tr</code>)</li>
                <li>
                  Scroll down to <strong>Authorized JavaScript origins</strong>, click <strong>+ ADD URI</strong> and paste:
                  <div className="mt-1 flex items-center gap-2">
                    <code className="px-2.5 py-1 rounded bg-background border border-border font-mono text-primary font-bold">
                      http://localhost:3000
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyOrigin}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] font-medium border border-border transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </li>
                <li>Click <strong>SAVE</strong> at the bottom of the page.</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
