import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlobalSearchModal from '@/components/search/GlobalSearchModal';

const serifFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const sansFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'ALSA.S — Author · Poet · Storyteller',
    template: '%s | ALSA.S',
  },
  description:
    'The literary sanctuary of author and poet Alsa.S. Explore published novels, poetry collections, short stories, and reflective journals.',
  keywords: [
    'Alsa.S',
    'Author',
    'Poet',
    'Like the Moon to the Tide',
    'Chronicles of Heart',
    'The Devourer’s Crown',
    'Literature',
    'Poetry',
    'Novels',
  ],
  authors: [{ name: 'Alsa.S' }],
  creator: 'Alsa.S',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alsas.com',
    siteName: 'ALSA.S Author Platform',
    title: 'ALSA.S — Author · Poet · Storyteller',
    description: 'Some stories are meant to be read. Others are meant to be felt. Welcome to the literary home of Alsa.S.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'ALSA.S Literary World',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALSA.S — Author · Poet · Storyteller',
    description: 'Explore the novels, poetry, and stories of Alsa.S.',
    creator: '@alsas_writes',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1715] selection:bg-[#C5A059]/25 selection:text-[#1A1715]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <GlobalSearchModal />
      </body>
    </html>
  );
}
