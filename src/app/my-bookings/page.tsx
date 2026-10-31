'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  XCircle,
  AlertCircle,
  Download,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface Booking {
  _id: string;
  bookingReference: string;
  studioId: string;
  studioTitle: string;
  studioCategory: string;
  studioLocation: string;
  studioImage?: string;
  hourlyRate: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  shootHours: number;
  totalAmount: number;
  guestCount: number;
  specialNotes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

function MyBookingsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Cancellation modal state
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/bookings/my-bookings');
      if (res.success && Array.isArray(res.bookings)) {
        setBookings(res.bookings);
      } else {
        setBookings([]);
      }
    } catch (err: any) {
      toast.error('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    try {
      setIsCancelling(true);
      const res = await api.patch(`/api/bookings/${bookingToCancel._id}/cancel`);
      if (res.success) {
        toast.success(`Booking ${bookingToCancel.bookingReference} has been cancelled.`);
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingToCancel._id ? { ...b, status: 'Cancelled' } : b))
        );
        setBookingToCancel(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Optional Feature 1: PDF Booking Invoice Generator
  const generatePDFInvoice = (booking: Booking) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(24, 24, 27); // Zinc 900
      doc.rect(0, 0, 210, 42, 'F');

      // Brand Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('StudioSpace', 16, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(212, 212, 216);
      doc.text('Peer-to-Peer Creative Workspace Platform', 16, 30);

      // Receipt Tag
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('OFFICIAL BOOKING RECEIPT', 125, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Issued: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 125, 30);

      // Invoice Details Block
      doc.setTextColor(39, 39, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('RESERVATION SPECIFICATIONS', 16, 56);

      doc.setDrawColor(228, 228, 231);
      doc.setLineWidth(0.5);
      doc.line(16, 60, 194, 60);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Booking Reference:`, 16, 70);
      doc.setFont('helvetica', 'bold');
      doc.text(booking.bookingReference, 60, 70);

      doc.setFont('helvetica', 'normal');
      doc.text(`Current Status:`, 16, 78);
      doc.setFont('helvetica', 'bold');
      doc.text(booking.status.toUpperCase(), 60, 78);

      doc.setFont('helvetica', 'normal');
      doc.text(`Creator Name:`, 16, 86);
      doc.setFont('helvetica', 'bold');
      doc.text(user?.name || 'Studio Creator', 60, 86);

      doc.setFont('helvetica', 'normal');
      doc.text(`Creator Email:`, 16, 94);
      doc.text(user?.email || 'N/A', 60, 94);

      // Studio Specs Box
      doc.setFillColor(244, 244, 245);
      doc.roundedRect(16, 104, 178, 38, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(24, 24, 27);
      doc.text(booking.studioTitle, 22, 114);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(`Category: ${booking.studioCategory} | Location: ${booking.studioLocation}`, 22, 122);
      doc.text(`Shoot Date: ${booking.bookingDate} | Hours: ${booking.startTime} - ${booking.endTime} (${booking.shootHours} Hours total)`, 22, 130);
      doc.text(`Crew Count: ${booking.guestCount} People`, 22, 136);

      // Financial Itemization Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(24, 24, 27);
      doc.text('FINANCIAL STATEMENT', 16, 158);
      doc.line(16, 162, 194, 162);

      // Table Header
      doc.setFillColor(240, 240, 240);
      doc.rect(16, 166, 178, 8, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Description', 20, 172);
      doc.text('Rate', 120, 172);
      doc.text('Quantity', 145, 172);
      doc.text('Subtotal', 175, 172);

      // Table Row
      doc.setFont('helvetica', 'normal');
      doc.text(`Production Studio Time (${booking.studioTitle.substring(0, 35)}...)`, 20, 182);
      doc.text(`$${booking.hourlyRate}/hr`, 120, 182);
      doc.text(`${booking.shootHours} hrs`, 145, 182);
      doc.text(`$${booking.totalAmount.toFixed(2)}`, 175, 182);

      doc.line(16, 188, 194, 188);

      // Total Row
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Total Reservation Amount:', 110, 202);
      doc.text(`$${booking.totalAmount.toFixed(2)} USD`, 165, 202);

      // Verification Watermark & Terms Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(161, 161, 170);
      doc.text('This invoice constitutes an official reservation document under StudioSpace Creator Terms & Conditions.', 16, 260);
      doc.text('Includes $1M Host Liability Protection and STC Double-Booking Guarantee.', 16, 265);
      doc.text(`Generated automatically by StudioSpace Platform • ID: ${booking._id}`, 16, 270);

      // Save PDF
      doc.save(`StudioSpace-Invoice-${booking.bookingReference}.pdf`);
      toast.success(`PDF invoice for ${booking.bookingReference} downloaded!`);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF receipt.');
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Pending Approval
          </span>
        );
      case 'Completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Production Schedule</span>
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-foreground tracking-tight">
              My Studio Bookings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Review your reserved shoot dates, status badges, and download PDF receipts.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
          >
            <span>Book Another Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border bg-card animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-muted rounded w-40" />
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && (
          <div className="text-center py-20 px-4 max-w-md mx-auto space-y-5 rounded-3xl border border-dashed border-border bg-card/50">
            <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-lg text-foreground">
                No Active Studio Bookings
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                You haven&apos;t reserved any production spaces yet. Explore available photography lofts and cinema sound stages.
              </p>
            </div>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
            >
              <span>Explore Studio Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Bookings List */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="p-6 rounded-3xl border border-border bg-card hover:border-foreground/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Info & Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      Ref: {booking.bookingReference}
                    </span>
                    {getStatusBadge(booking.status)}
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {booking.studioCategory}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg sm:text-xl text-foreground">
                    {booking.studioTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {booking.bookingDate}
                    </span>
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {booking.startTime} - {booking.endTime} ({booking.shootHours} hrs)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {booking.guestCount} Cast & Crew
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {booking.studioLocation}
                    </span>
                  </div>

                  {booking.specialNotes && (
                    <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-xl max-w-xl">
                      <strong>Notes:</strong> {booking.specialNotes}
                    </p>
                  )}
                </div>

                {/* Right: Pricing & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-border">
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-muted-foreground block">Total Amount</span>
                    <span className="font-heading font-black text-2xl text-foreground">
                      ${booking.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Optional Requirement: PDF Invoice Generator */}
                    <button
                      onClick={() => generatePDFInvoice(booking)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      title="Download PDF Invoice Receipt"
                    >
                      <Download className="w-3.5 h-3.5 text-primary" />
                      <span>PDF Invoice</span>
                    </button>

                    {/* Cancel Booking option for Pending slots */}
                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => setBookingToCancel(booking)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-destructive/20 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal for Cancellation */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-foreground">
                  Cancel Studio Reservation
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ref: {bookingToCancel.bookingReference}
                </p>
              </div>
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              Are you sure you want to cancel your upcoming reservation at <strong className="font-bold">&quot;{bookingToCancel.studioTitle}&quot;</strong> on {bookingToCancel.bookingDate}?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleCancelConfirm}
                className="px-5 py-2.5 rounded-xl bg-destructive text-white text-xs font-semibold hover:opacity-90 flex items-center gap-2"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  );
}
