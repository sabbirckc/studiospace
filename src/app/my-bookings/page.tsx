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
  Sparkles,
  Printer,
  ExternalLink,
  Eye,
  X
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

  // Invoice modal state for on-screen view, print & download fallback
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

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

  // Optional Feature 1: Robust PDF Booking Invoice Generator
  const generatePDFInvoice = (booking: Booking, autoOpen: boolean = false) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const safeTotal = Number(booking.totalAmount || 0);
      const safeHourly = Number(booking.hourlyRate || 0);
      const safeHours = Number(booking.shootHours || 1);
      const safeTitle = String(booking.studioTitle || 'Creative Production Studio');
      const safeRef = String(booking.bookingReference || `ST-${booking._id || Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeCategory = String(booking.studioCategory || 'Production Studio');
      const safeLocation = String(booking.studioLocation || 'Creative Arts District');
      const safeDate = String(booking.bookingDate || new Date().toISOString().split('T')[0]);
      const safeStart = String(booking.startTime || '09:00');
      const safeEnd = String(booking.endTime || '17:00');
      const safeGuestCount = Number(booking.guestCount || 1);
      const safeStatus = String(booking.status || 'Pending').toUpperCase();
      const safeNotes = String(booking.specialNotes || 'None');
      const userName = String(user?.name || 'Studio Creator');
      const userEmail = String(user?.email || 'creator@studiospace.io');

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
      doc.text('OFFICIAL BOOKING RECEIPT', 120, 22);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Issued: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 120, 30);

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
      doc.text(safeRef, 60, 70);

      doc.setFont('helvetica', 'normal');
      doc.text(`Current Status:`, 16, 78);
      doc.setFont('helvetica', 'bold');
      doc.text(safeStatus, 60, 78);

      doc.setFont('helvetica', 'normal');
      doc.text(`Creator Name:`, 16, 86);
      doc.setFont('helvetica', 'bold');
      doc.text(userName, 60, 86);

      doc.setFont('helvetica', 'normal');
      doc.text(`Creator Email:`, 16, 94);
      doc.text(userEmail, 60, 94);

      // Studio Specs Box
      doc.setFillColor(244, 244, 245);
      doc.roundedRect(16, 104, 178, 38, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(24, 24, 27);
      doc.text(safeTitle.length > 45 ? `${safeTitle.substring(0, 42)}...` : safeTitle, 22, 114);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(`Category: ${safeCategory} | Location: ${safeLocation}`, 22, 122);
      doc.text(`Shoot Date: ${safeDate} | Hours: ${safeStart} - ${safeEnd} (${safeHours} Hours total)`, 22, 130);
      doc.text(`Crew Count: ${safeGuestCount} People | Notes: ${safeNotes.substring(0, 50)}`, 22, 136);

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
      doc.text('Subtotal', 172, 172);

      // Table Row
      doc.setFont('helvetica', 'normal');
      const descText = `Production Studio Time (${safeTitle.substring(0, 32)}...)`;
      doc.text(descText, 20, 182);
      doc.text(`$${safeHourly}/hr`, 120, 182);
      doc.text(`${safeHours} hrs`, 145, 182);
      doc.text(`$${safeTotal.toFixed(2)}`, 172, 182);

      doc.line(16, 188, 194, 188);

      // Total Row
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Total Reservation Amount:', 105, 202);
      doc.text(`$${safeTotal.toFixed(2)} USD`, 165, 202);

      // Verification Watermark & Terms Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(161, 161, 170);
      doc.text('This invoice constitutes an official reservation document under StudioSpace Creator Terms & Conditions.', 16, 260);
      doc.text('Includes $1M Host Liability Protection and STC Double-Booking Guarantee.', 16, 265);
      doc.text(`Generated automatically by StudioSpace Platform • ID: ${booking._id || 'N/A'}`, 16, 270);

      // Generate pure binary PDF Blob
      const pdfArrayBuffer = doc.output('arraybuffer');
      const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfBlob);
      const fileName = `StudioSpace-Invoice-${safeRef}.pdf`;

      if (autoOpen) {
        // Direct open in browser PDF viewer
        window.open(blobUrl, '_blank');
        toast.success(`Invoice opened in browser!`);
      } else {
        // Bulletproof anchor download directly triggering browser file download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        toast.success(`PDF invoice for ${safeRef} downloaded!`);

        setTimeout(() => {
          if (document.body.contains(a)) {
            document.body.removeChild(a);
          }
          URL.revokeObjectURL(blobUrl);
        }, 60000);
      }
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
                      ${Number(booking.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Optional Requirement: PDF Invoice Generator */}
                    <button
                      onClick={() => {
                        setSelectedInvoiceBooking(booking);
                        generatePDFInvoice(booking, false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                      title="Download and view official PDF invoice"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Invoice</span>
                    </button>

                    <button
                      onClick={() => setSelectedInvoiceBooking(booking)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                      title="View on-screen invoice receipt"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>View</span>
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

      {/* Official Invoice Receipt Modal (On-Screen View, Direct PDF Download & Print) */}
      {selectedInvoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden my-8">
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-heading font-bold text-sm text-foreground">
                  Official Reservation Invoice Receipt
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => generatePDFInvoice(selectedInvoiceBooking, false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  title="Download binary PDF file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => generatePDFInvoice(selectedInvoiceBooking, true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  title="Open PDF directly in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  title="Print invoice or save via browser PDF printer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceBooking(null)}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div id="printable-invoice" className="p-6 sm:p-10 space-y-6 text-foreground bg-card">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-heading font-black text-xl tracking-tight text-foreground">
                      StudioSpace
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Peer-to-Peer Creative Workspace Platform</p>
                </div>
                <div className="text-left sm:text-right space-y-1">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 block sm:inline-block">
                    OFFICIAL BOOKING RECEIPT
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold block">
                    Booking Reference
                  </span>
                  <span className="font-mono font-bold text-sm text-foreground">
                    {selectedInvoiceBooking.bookingReference}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold block">
                    Reservation Status
                  </span>
                  {getStatusBadge(selectedInvoiceBooking.status)}
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold block">
                    Creator Name
                  </span>
                  <span className="font-semibold text-foreground">{user?.name || 'Studio Creator'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold block">
                    Creator Email
                  </span>
                  <span className="text-foreground">{user?.email || 'N/A'}</span>
                </div>
              </div>

              {/* Studio Info Card */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                <h4 className="font-heading font-bold text-sm text-foreground">
                  {selectedInvoiceBooking.studioTitle}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
                  <p><strong>Category:</strong> {selectedInvoiceBooking.studioCategory}</p>
                  <p><strong>Location:</strong> {selectedInvoiceBooking.studioLocation}</p>
                  <p><strong>Production Date:</strong> {selectedInvoiceBooking.bookingDate}</p>
                  <p><strong>Shoot Hours:</strong> {selectedInvoiceBooking.startTime} - {selectedInvoiceBooking.endTime} ({selectedInvoiceBooking.shootHours} hrs)</p>
                  <p><strong>Cast & Crew:</strong> {selectedInvoiceBooking.guestCount} People</p>
                  {selectedInvoiceBooking.specialNotes && (
                    <p className="col-span-full"><strong>Notes:</strong> {selectedInvoiceBooking.specialNotes}</p>
                  )}
                </div>
              </div>

              {/* Financial Itemization Table */}
              <div className="space-y-2">
                <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Financial Statement & Hourly Charges
                </h5>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/60 text-muted-foreground uppercase font-bold text-[10px]">
                      <tr>
                        <th className="px-4 py-2.5">Description</th>
                        <th className="px-4 py-2.5 text-right">Hourly Rate</th>
                        <th className="px-4 py-2.5 text-right">Shoot Hours</th>
                        <th className="px-4 py-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-4 py-3 font-medium text-foreground">
                          Production Studio Reservation ({selectedInvoiceBooking.studioCategory})
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          ${Number(selectedInvoiceBooking.hourlyRate || 0)}/hr
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {selectedInvoiceBooking.shootHours} hrs
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-foreground">
                          ${Number(selectedInvoiceBooking.totalAmount || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-muted/30 border-t border-border font-bold">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right text-foreground">
                          Total Reservation Amount:
                        </td>
                        <td className="px-4 py-3 text-right text-primary text-sm font-black">
                          ${Number(selectedInvoiceBooking.totalAmount || 0).toFixed(2)} USD
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Policy Footer */}
              <div className="pt-4 border-t border-border text-[11px] text-muted-foreground space-y-1">
                <p>• Verified under StudioSpace Platform Creator Terms & Conditions.</p>
                <p>• Covered by $1,000,000 Host Liability Protection and STC Double-Booking Prevention Guarantee.</p>
                <p className="font-mono text-[10px]">ID: {selectedInvoiceBooking._id}</p>
              </div>
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

