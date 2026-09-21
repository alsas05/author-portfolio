import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    slug: string;
    subtitle?: string | null;
    genre: string;
    description: string;
    coverImage: string;
    status: string;
    publicationDate?: string | null;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const isUpcoming = book.status === 'UPCOMING';

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-[#EAE2D8] hover:border-[#C5A059]/50 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
      {/* Book Cover Showcase with 3D Depth */}
      <div className="relative aspect-[3/4] w-full bg-[#1A1715] overflow-hidden p-6 flex items-center justify-center">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />

        {/* 3D Book Cover Presentation */}
        <div className="book-cover-container relative w-44 h-64 z-20">
          <div className="book-cover relative w-full h-full rounded-sm overflow-hidden bg-[#262220]">
            {/* Book Spine Simulation */}
            <div className="book-spine-line" />
            <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-30" />

            {/* Book Cover Image */}
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Inner Title Overlay for Visual Richness */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 flex flex-col justify-end">
              <span className="text-[9px] uppercase tracking-widest text-[#DFC07C] font-semibold">
                {book.genre.split('/')[0]}
              </span>
              <h4 className="font-serif text-white text-xs font-semibold leading-tight line-clamp-2">
                {book.title}
              </h4>
            </div>
          </div>
        </div>

        {/* Publication Status Badge */}
        <div className="absolute top-4 right-4 z-30">
          <span
            className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md border ${
              isUpcoming
                ? 'bg-amber-950/70 text-amber-200 border-amber-600/50'
                : 'bg-[#1A1715]/70 text-[#DFC07C] border-[#C5A059]/40'
            }`}
          >
            {isUpcoming ? 'Upcoming Release' : 'Published'}
          </span>
        </div>
      </div>

      {/* Book Information */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-[#8C7A65] font-medium">
              {book.genre}
            </span>
            {book.publicationDate && (
              <span className="text-xs text-[#8C7A65] font-light">
                {book.publicationDate}
              </span>
            )}
          </div>

          <h3 className="font-serif text-2xl font-semibold text-[#1A1715] group-hover:text-[#8C6D3B] transition-colors mb-1.5 leading-snug">
            <Link href={`/books/${book.slug}`} className="focus:outline-none">
              <span className="absolute inset-0 z-0" />
              {book.title}
            </Link>
          </h3>

          {book.subtitle && (
            <p className="font-serif italic text-sm text-[#8C7A65] mb-3">
              {book.subtitle}
            </p>
          )}

          <p className="text-xs text-[#5A544C] leading-relaxed line-clamp-3 mb-4 font-sans">
            {book.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-[#F4EFEA] flex items-center justify-between relative z-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8C6D3B] group-hover:text-[#1A1715] transition-colors flex items-center">
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Explore Book
          </span>
          <div className="w-7 h-7 rounded-full bg-[#FAF8F5] group-hover:bg-[#C5A059] flex items-center justify-center text-[#8C7A65] group-hover:text-white transition-colors duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
