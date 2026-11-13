import type { Metadata } from 'next';
import { Instrument_Serif, Inter, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic'],
  display: 'swap',
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Manav Shaji | Full-Stack Developer',
  description:
    'Developer portfolio for Manav Shaji, focusing on frontend and full-stack product engineering.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}