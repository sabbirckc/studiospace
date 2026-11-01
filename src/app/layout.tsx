import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

import { ThemeProvider } from '@/context/theme-context';
import { AuthProvider } from '@/context/auth-context';
import { WishlistProvider } from '@/context/wishlist-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform',
  description:
    'Discover, inspect dynamic availability, and reserve photography cycloramas, film sound stages, podcast rooms, and music suites with transparent pricing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased suppressHydrationWarning">
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <Navbar />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
              <Toaster richColors position="top-right" closeButton />
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
