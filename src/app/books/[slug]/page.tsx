import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  Globe,
  Tag,
  Feather,
  Sparkles,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import ExcerptViewer from '@/components/books/ExcerptViewer';
import BuyLinkTracker from './BuyLinkTracker';

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await prisma.book.findUnique({
    where: { slug },
  });

  if (!book) {
    return { title: 'Book Not Found | ALSA.S' };
  }

  return {
    title: `${book.title} | Books`,
    description: book.description,
    openGraph: {
      title: `${book.title} by Alsa.S`,
      description: book.description,
      images: [{ url: book.coverImage }],
    },
  };
}

export const revalidate = 60;

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;

  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      purchaseLinks: true,
    },
  });

  if (!book) {
    notFound();
  }

  // Schema.org JSON-LD Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: 'Alsa.S',
    },
    genre: book.genre,
    isbn: book.isbn,
    numberOfPages: book.pageCount,
    publisher: {
      '@type': 'Organization',
      name: book.publisher || 'Veritas & Quill Press',
    },
    inLanguage: book.language || 'English',
    description: book.description,
    image: book.coverImage,
  };

  return (
    <div className="py-12 sm:py-20 px-6 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Insert JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="mb-10 flex items-center space-x-2 text-xs uppercase tracking-widest text-[#8C7A65]">
        <Link href="/books" className="hover:text-[#1A1715] flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          All Books
        </Link>
        <span>/</span>
        <span className="text-[#1A1715] font-semibold">{book.title}</span>
      </nav>

      {/* Book Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start pb-16 border-b border-[#EAE2D8]">
        {/* Cover Art Presentation */}
        <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-28">
          <div className="book-cover-container relative w-72 h-[440px] sm:w-80 sm:h-[490px]">
            <div className="book-cover relative w-full h-full rounded-md overflow-hidden bg-[#1A1715] shadow-2xl">
              <div className="book-spine-line" />
              <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-30" />
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                priority
                sizes="(max-width: 1024px) 320px, 400px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
              <div className="absolute bottom-8 inset-x-8 z-20 text-center">
                <span className="text-[11px] uppercase tracking-widest text-[#DFC07C] font-semibold block mb-1">
                  {book.genre}
                </span>
                <h2 className="font-serif text-white text-2xl sm:text-3xl font-medium">
                  {book.title}
                </h2>
                <span className="font-serif italic text-xs text-[#D4D2CF] block mt-1">
                  by Alsa.S
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative, Synopsis & Purchase Links */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold px-3 py-1 rounded-full bg-[#FAF6EB] text-[#8C6D3B] border border-[#C5A059]/30">
                {book.genre}
              </span>
              <span className="text-xs text-[#8C7A65]">
                {book.status === 'UPCOMING' ? 'Forthcoming' : 'Published'}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#1A1715] leading-tight mb-2">
              {book.title}
            </h1>

            {book.subtitle && (
              <p className="font-serif italic text-xl sm:text-2xl text-[#8C7A65] mb-6">
                {book.subtitle}
              </p>
            )}

            <p className="font-serif text-lg sm:text-xl text-[#2B2621] leading-relaxed pretty-prose">
              {book.description}
            </p>
          </div>

          {/* WHERE TO BUY SECTION */}
          <section id="where-to-buy" className="p-6 sm:p-8 rounded-xl bg-[#FAF6EB]/70 border border-[#C5A059]/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-[#8C6D3B]">
                  Where to Buy
                </h3>
                <p className="text-xs text-[#8C7A65] mt-0.5 font-sans">
                  Purchase or pre-order directly from verified booksellers.
                </p>
              </div>
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
            </div>

            {book.purchaseLinks.length === 0 ? (
              <p className="text-xs text-[#8C7A65] italic">
                Purchase links will be made available upon distribution release.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {book.purchaseLinks.map((link) => (
                  <BuyLinkTracker key={link.id} link={link} />
                ))}
              </div>
            )}
          </section>

          {/* Synopsis */}
          <section className="space-y-4 pt-4">
            <h3 className="font-serif text-2xl font-medium text-[#1A1715] border-b border-[#EAE2D8] pb-2">
              Synopsis
            </h3>
            <div className="font-serif text-base sm:text-lg text-[#5A544C] leading-relaxed space-y-4">
              {book.synopsis.split('\n\n').map((paragraph, index) => (
                <p key={index} className="pretty-prose">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Author's Note */}
          {book.authorNote && (
            <section className="p-6 sm:p-8 rounded-xl bg-white border border-[#EAE2D8] space-y-3">
              <div className="flex items-center space-x-2 text-[#C5A059]">
                <Feather className="w-4 h-4" />
                <h3 className="font-serif text-xl font-medium text-[#1A1715]">
                  Author&apos;s Note
                </h3>
              </div>
              <p className="font-serif italic text-base text-[#5A544C] leading-relaxed">
                &ldquo;{book.authorNote}&rdquo;
              </p>
              <span className="text-xs font-serif text-[#8C7A65] block pt-2 text-right">
                — Alsa.S
              </span>
            </section>
          )}

          {/* Book Metadata Details Table */}
          <section className="space-y-4 pt-4">
            <h3 className="font-serif text-2xl font-medium text-[#1A1715] border-b border-[#EAE2D8] pb-2">
              Publication Details
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-[#5A544C] pt-2">
              {book.publisher && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8C7A65] block font-semibold">
                    Publisher
                  </span>
                  <span className="font-serif text-sm text-[#1A1715]">{book.publisher}</span>
                </div>
              )}
              {book.publicationDate && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8C7A65] block font-semibold">
                    Publication Date
                  </span>
                  <span className="font-serif text-sm text-[#1A1715]">{book.publicationDate}</span>
                </div>
              )}
              {book.isbn && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8C7A65] block font-semibold">
                    ISBN
                  </span>
                  <span className="font-mono text-xs text-[#1A1715]">{book.isbn}</span>
                </div>
              )}
              {book.pageCount && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8C7A65] block font-semibold">
                    Length
                  </span>
                  <span className="font-serif text-sm text-[#1A1715]">{book.pageCount} pages</span>
                </div>
              )}
              {book.language && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8C7A65] block font-semibold">
                    Language
                  </span>
                  <span className="font-serif text-sm text-[#1A1715]">{book.language}</span>
                </div>
              )}
              {book.format && (
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#8C7A65] block font-semibold">
                    Formats
                  </span>
                  <span className="font-serif text-sm text-[#1A1715]">{book.format}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Excerpt Section */}
      {book.excerpt && (
        <section className="mt-16">
          <ExcerptViewer excerpt={book.excerpt} bookTitle={book.title} />
        </section>
      )}
    </div>
  );
}
