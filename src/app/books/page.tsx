import React from 'react';
import prisma from '@/lib/prisma';
import BookCard from '@/components/books/BookCard';
import { BookMarked } from 'lucide-react';

export const metadata = {
  title: 'Books & Published Works',
  description:
    'Explore the literary catalog of Alsa.S, including Like the Moon to the Tide, Chronicles of Heart, and forthcoming releases.',
};

export const revalidate = 60;

export default async function BooksPage() {
  let books: any[] = [];
  try {
    books = await prisma.book.findMany({
      orderBy: { order: 'asc' },
      include: { purchaseLinks: true },
    });
  } catch (err) {
    console.error('Failed to load books from database:', err);
  }

  return (
    <div className="py-16 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059]">
          <BookMarked className="w-3.5 h-3.5" />
          <span>The Published Archive</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#1A1715]">
          Novels &amp; Collections
        </h1>

        <div className="w-16 h-0.5 bg-[#C5A059] mx-auto my-4" />

        <p className="font-serif italic text-lg sm:text-xl text-[#5A544C] leading-relaxed">
          &ldquo;A book is a conversation between two people who may never breathe the same air, yet understand the exact same silence.&rdquo;
        </p>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Literary Note Box */}
      <div className="mt-24 p-8 sm:p-12 rounded-2xl bg-[#F5EFEB] border border-[#EAE2D8] text-center max-w-2xl mx-auto">
        <h3 className="font-serif text-2xl font-medium text-[#1A1715] mb-2">
          Signed Editions &amp; Special Requests
        </h3>
        <p className="text-sm text-[#5A544C] font-sans leading-relaxed mb-6">
          Selected first-edition hardcovers with gold foil stamped ribbons and personalized bookplates are made available for book clubs and reading societies.
        </p>
        <a
          href="/contact?subject=Signed+Editions"
          className="inline-flex items-center text-xs uppercase tracking-widest font-semibold text-[#8C6D3B] hover:text-[#1A1715] border-b border-[#C5A059] pb-1 transition-colors"
        >
          Inquire About Signed Copies &rarr;
        </a>
      </div>
    </div>
  );
}
