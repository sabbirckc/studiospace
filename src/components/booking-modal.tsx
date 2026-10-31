'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Studio } from '@/components/studio-card';
import { api } from '@/lib/api';
import { X, Calendar, Clock, Users, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface BookingModalProps {
  studio: Studio;
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

export function BookingModal({ studio, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Get tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [bookingDate, setBookingDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [guestCount, setGuestCount] = useState(4);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate shoot hours
  const startH = parseInt(startTime.split(':')[0], 10);
  const endH = parseInt(endTime.split(':')[0], 10);
  const shootHours = Math.max(1, endH - startH);
  const totalAmount = shootHours * studio.hourlyRate;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    if (!user) {
      toast.error('You must be signed in to reserve a studio space.');
      router.push(`/login?redirect=/studios/${studio._id}`);
      return;
    }

    if (startH >= endH) {
      toast.error('End time must be later than start time.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        studioId: studio._id,
        studioTitle: studio.title,
        studioCategory: studio.category,
        studioLocation: studio.location,
        studioImage: studio.imageUrl,
        hourlyRate: studio.hourlyRate,
        bookingDate,
        startTime,
        endTime,
        shootHours,
        totalAmount,
        guestCount,
        specialNotes
      };

      const res = await api.post('/api/bookings', payload);

      if (res.success) {
        toast.success(`Booking reserved! Reference: ${res.booking.bookingReference}`);
        onClose();
        router.push('/my-bookings');
      }
    } catch (err: any) {
      console.error('Booking failed:', err);
      // Challenge 2: Collision error handling
      setConflictError(err.message || 'Time slot is unavailable.');
      toast.error(err.message || 'Booking conflict detected.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Instant Studio Reservation
          </span>
          <h2 className="font-heading font-black text-xl sm:text-2xl text-foreground">
            Book {studio.title}
          </h2>
          <p className="text-xs text-muted-foreground">
            {studio.category} • ${studio.hourlyRate}/hr • {studio.location}
          </p>
        </div>

        {/* Challenge 2 Conflict Alert Banner */}
        {conflictError && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-1">
            <div className="flex items-center gap-2 text-destructive font-semibold text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Double-Booking Collision Detected</span>
            </div>
            <p className="text-xs text-destructive/90 pl-6 leading-relaxed">
              {conflictError}
            </p>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          {/* Production Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Production Shoot Date</span>
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={bookingDate}
              onChange={(e) => {
                setBookingDate(e.target.value);
                setConflictError(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Time Slots (Start and End) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Load-In (Start)</span>
              </label>
              <select
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setConflictError(null);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {TIME_SLOTS.slice(0, -1).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Wrap-Up (End)</span>
              </label>
              <select
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setConflictError(null);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {TIME_SLOTS.slice(1).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Crew / Guest Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Production Crew & Cast Size (Max: {studio.maxCapacity})</span>
            </label>
            <input
              type="number"
              min={1}
              max={studio.maxCapacity}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Special Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Production Scope / Equipment Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Bringing RED V-Raptor package, 4 crew members, audio recording required."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Price Breakdown Summary */}
          <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Hourly Rate (${studio.hourlyRate} × {shootHours} hrs)</span>
              <span className="font-medium text-foreground">${studio.hourlyRate * shootHours}</span>
            </div>
            {studio.securityDeposit ? (
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Refundable Security Deposit</span>
                <span className="font-medium text-foreground">${studio.securityDeposit}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between pt-2 border-t border-border font-bold text-sm text-foreground">
              <span>Total Estimated Reservation</span>
              <span className="text-base text-primary">${totalAmount}</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting || startH >= endH}
            className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <span>Confirm & Request Booking</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
