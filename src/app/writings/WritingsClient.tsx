'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Feather, Search, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Writing {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  readingTime?: string | null;
  publishedAt: string | Date;
  tags?: string | null;
}

interface WritingsClientProps {
  initialWritings: Writing[];
  initialCategory?: string;
}

const CATEGORIES = [
  'All',
  'Poetry',
  'Short Stories',
  'Excerpts',
  'Letters',
  'Reflections',
];

export default function WritingsClient({
  initialWritings,
  initialCategory = 'All',
}: WritingsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWritings = useMemo(() => {
    return initialWritings.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [initialWritings, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#EAE2D8]">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory.toLowerCase() === category.toLowerCase();
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all ${
                  isActive
                    ? 'bg-[#1A1715] text-[#FAF8F5] shadow-sm'
                    : 'bg-white border border-[#EAE2D8] text-[#5A544C] hover:border-[#C5A059] hover:text-[#1A1715]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Live Filter Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8C7A65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archive..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#EAE2D8] rounded-full focus:outline-none focus:border-[#C5A059] text-[#1A1715] placeholder-[#8C7A65] font-sans"
          />
        </div>
      </div>

      {/* Writings Results Grid */}
      {filteredWritings.length === 0 ? (
        <div className="py-20 text-center text-[#8C7A65]">
          <Feather className="w-8 h-8 mx-auto mb-3 text-[#C5A059] opacity-40" />
          <p className="font-serif text-xl text-[#1A1715]">No writings found</p>
          <p className="text-xs text-[#8C7A65] mt-1">
            Try adjusting your search terms or selecting another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWritings.map((writing) => (
            <article
              key={writing.id}
              className="group bg-white rounded-xl border border-[#EAE2D8] hover:border-[#C5A059] p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-[#FAF6EB] text-[#8C6D3B] border border-[#C5A059]/30">
                    {writing.category}
                  </span>
                  <div className="flex items-center text-xs text-[#8C7A65]">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>{writing.readingTime || '3 min read'}</span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-medium text-[#1A1715] group-hover:text-[#8C6D3B] transition-colors mb-3 leading-snug">
                  <Link href={`/writings/${writing.slug}`}>{writing.title}</Link>
                </h3>

                <p className="font-serif italic text-sm sm:text-base text-[#5A544C] leading-relaxed line-clamp-3 mb-6">
                  &ldquo;{writing.excerpt}&rdquo;
                </p>

                {writing.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {writing.tags.split(',').map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C7A65] border border-[#EAE2D8]"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#F4EFEA] flex items-center justify-between">
                <span className="text-xs text-[#8C7A65] font-light">
                  {formatDate(writing.publishedAt)}
                </span>
                <Link
                  href={`/writings/${writing.slug}`}
                  className="text-xs uppercase tracking-widest font-semibold text-[#1A1715] group-hover:text-[#C5A059] flex items-center"
                >
                  <span>Read Piece</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
