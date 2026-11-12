import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Manav Shaji | Full-Stack Developer',
  description:
    'Developer portfolio for Manav Shaji, focusing on frontend and full-stack product engineering.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}