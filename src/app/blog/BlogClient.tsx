'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Search, ArrowRight, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  featuredImage?: string | null;
  readingTime?: string | null;
  publishedAt: string | Date;
  tags?: string | null;
}

interface BlogClientProps {
  posts: BlogPost[];
}

const CATEGORIES = [
  'All',
  'Writing Journey',
  'Behind the Stories',
  "Author's Journal",
  'Book Updates',
  'Reading Corner',
  'Thoughts',
];

export default function BlogClient({ posts }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = posts[0];
  const gridPosts = selectedCategory === 'All' && !searchQuery ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="space-y-12">
      {/* Category Pills and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#EAE2D8]">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all ${
                  isActive
                    ? 'bg-[#1A1715] text-[#FAF8F5] shadow-sm'
                    : 'bg-white border border-[#EAE2D8] text-[#5A544C] hover:border-[#C5A059] hover:text-[#1A1715]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8C7A65] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#EAE2D8] rounded-full focus:outline-none focus:border-[#C5A059] text-[#1A1715] placeholder-[#8C7A65] font-sans"
          />
        </div>
      </div>

      {/* Featured Article Hero Banner (Shown when no active search & 'All') */}
      {selectedCategory === 'All' && !searchQuery && featuredPost && (
        <article className="group bg-white rounded-2xl border border-[#EAE2D8] hover:border-[#C5A059]/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {featuredPost.featuredImage && (
            <div className="lg:col-span-7 relative aspect-[16/10] w-full bg-[#1A1715] overflow-hidden">
              <Image
                src={featuredPost.featuredImage}
                alt={featuredPost.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-[#1A1715]/80 backdrop-blur-md px-3 py-1 rounded text-[10px] uppercase tracking-widest font-semibold text-[#DFC07C]">
                {featuredPost.category}
              </div>
            </div>
          )}

          <div className="lg:col-span-5 p-8 sm:p-12 space-y-4">
            <div className="flex items-center space-x-2 text-xs text-[#8C7A65] font-light">
              <span>{formatDate(featuredPost.publishedAt)}</span>
              <span>·</span>
              <span>{featuredPost.readingTime || '5 min read'}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1715] group-hover:text-[#8C6D3B] transition-colors leading-tight">
              <Link href={`/blog/${featuredPost.slug}`}>
                {featuredPost.title}
              </Link>
            </h2>

            <p className="text-sm sm:text-base text-[#5A544C] leading-relaxed line-clamp-4 font-sans font-light">
              {featuredPost.excerpt}
            </p>

            <div className="pt-4">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center text-xs uppercase tracking-widest font-semibold text-[#1A1715] group-hover:text-[#C5A059] transition-colors"
              >
                <span>Read Full Essay</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Editorial Grid */}
      {gridPosts.length === 0 ? (
        <div className="py-20 text-center text-[#8C7A65]">
          <BookOpen className="w-8 h-8 mx-auto mb-3 text-[#C5A059] opacity-40" />
          <p className="font-serif text-xl text-[#1A1715]">No journal essays found</p>
          <p className="text-xs text-[#8C7A65] mt-1">
            Try adjusting your query or category selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-xl border border-[#EAE2D8] hover:border-[#C5A059]/60 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {post.featuredImage && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#262220]">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#1A1715]/85 backdrop-blur-md px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-semibold text-[#DFC07C]">
                    {post.category}
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-[#8C7A65] mb-2 font-light">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>·</span>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#1A1715] group-hover:text-[#8C6D3B] transition-colors mb-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5A544C] leading-relaxed line-clamp-3 mb-4 font-sans font-light">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4EFEA] flex items-center justify-between">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs uppercase tracking-widest font-semibold text-[#8C6D3B] group-hover:text-[#1A1715] flex items-center"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
