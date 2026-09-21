'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Feather, Sun, Moon, Coffee, ArrowLeft, ArrowRight, Share2, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface WritingReaderProps {
  writing: {
    id: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    excerpt: string;
    readingTime?: string | null;
    publishedAt: Date | string;
    tags?: string | null;
  };
  prevWriting?: { title: string; slug: string } | null;
  nextWriting?: { title: string; slug: string } | null;
}

export default function WritingReader({
  writing,
  prevWriting,
  nextWriting,
}: WritingReaderProps) {
  const [theme, setTheme] = useState<'ivory' | 'sepia' | 'midnight'>('ivory');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState(false);

  const isPoetry = writing.category.toLowerCase().includes('poet');

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getThemeClass = () => {
    switch (theme) {
      case 'sepia':
        return 'theme-sepia bg-[#F4EAD4] text-[#3A2F25] border-[#E3D4B8]';
      case 'midnight':
        return 'theme-midnight bg-[#12100E] text-[#D9CDBF] border-[#2A2521]';
      default:
        return 'theme-ivory bg-[#FAF8F5] text-[#1A1715] border-[#EAE2D8]';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-base leading-relaxed';
      case 'lg':
        return 'text-xl sm:text-2xl leading-loose';
      default:
        return 'text-lg sm:text-xl leading-relaxed';
    }
  };

  return (
    <div className="w-full">
      {/* Reader Controls Toolbar */}
      <div className="sticky top-20 z-30 mb-8 max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-full px-5 py-2.5 shadow-sm border border-[#EAE2D8]">
          <Link
            href="/writings"
            className="text-xs font-semibold text-[#8C7A65] hover:text-[#1A1715] flex items-center space-x-1 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Archive</span>
          </Link>

          {/* Theme Switcher */}
          <div className="flex items-center space-x-1.5 border-x border-[#EAE2D8] px-3">
            <button
              onClick={() => setTheme('ivory')}
              aria-label="Ivory Theme"
              className={`p-1.5 rounded-full transition-colors ${
                theme === 'ivory' ? 'bg-[#C5A059]/20 text-[#8C6D3B]' : 'text-[#8C7A65] hover:bg-gray-100'
              }`}
              title="Ivory Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              aria-label="Sepia Theme"
              className={`p-1.5 rounded-full transition-colors ${
                theme === 'sepia' ? 'bg-[#C5A059]/20 text-[#8C6D3B]' : 'text-[#8C7A65] hover:bg-gray-100'
              }`}
              title="Sepia Mode"
            >
              <Coffee className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('midnight')}
              aria-label="Midnight Theme"
              className={`p-1.5 rounded-full transition-colors ${
                theme === 'midnight' ? 'bg-[#C5A059]/20 text-[#8C6D3B]' : 'text-[#8C7A65] hover:bg-gray-100'
              }`}
              title="Midnight Mode"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* Font Sizing & Share */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setFontSize((prev) => (prev === 'sm' ? 'base' : prev === 'base' ? 'lg' : 'sm'))
              }
              className="text-xs uppercase tracking-wider font-semibold text-[#8C7A65] hover:text-[#1A1715] px-2 py-1 rounded"
              title="Change reading size"
            >
              Text {fontSize === 'sm' ? 'A' : fontSize === 'base' ? 'A+' : 'A++'}
            </button>

            <button
              onClick={copyShareLink}
              className="text-[#8C7A65] hover:text-[#1A1715] p-1.5 rounded-full transition-colors"
              title="Copy share link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Literary Page Experience */}
      <article
        className={`max-w-3xl mx-auto p-8 sm:p-16 rounded-2xl border transition-colors duration-500 shadow-sm ${getThemeClass()}`}
      >
        {/* Header Metadata */}
        <header className="text-center mb-12 pb-8 border-b border-current/10">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059] mb-4">
            <Feather className="w-3.5 h-3.5" />
            <span>{writing.category}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight mb-4 text-balance">
            {writing.title}
          </h1>

          <div className="flex items-center justify-center space-x-4 text-xs tracking-wider opacity-75 font-sans">
            <span>{formatDate(writing.publishedAt)}</span>
            <span>·</span>
            <span>{writing.readingTime || '3 min read'}</span>
          </div>
        </header>

        {/* Content Body */}
        <div
          className={`font-serif ${getFontSizeClass()} ${
            isPoetry
              ? 'whitespace-pre-line text-center max-w-xl mx-auto italic font-normal py-4'
              : 'space-y-6 text-left drop-cap'
          }`}
        >
          {isPoetry ? (
            writing.content
          ) : (
            writing.content.split('\n\n').map((para, i) => (
              <p key={i} className="pretty-prose leading-relaxed">
                {para}
              </p>
            ))
          )}
        </div>

        {/* Post-Reading Signoff */}
        <div className="mt-16 pt-8 border-t border-current/10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full border border-current/20 flex items-center justify-center mb-3">
            <Feather className="w-5 h-5 text-[#C5A059]" />
          </div>
          <span className="font-serif italic text-sm opacity-80">
            Pen of Alsa.S
          </span>
          {writing.tags && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {writing.tags.split(',').map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-current/15 opacity-70"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Previous & Next Navigation */}
      <nav className="max-w-3xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevWriting ? (
          <Link
            href={`/writings/${prevWriting.slug}`}
            className="group p-5 rounded-xl bg-white border border-[#EAE2D8] hover:border-[#C5A059] transition-all flex flex-col justify-between"
          >
            <span className="text-[11px] uppercase tracking-widest text-[#8C7A65] flex items-center group-hover:text-[#C5A059]">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Previous Piece
            </span>
            <span className="font-serif text-lg font-medium text-[#1A1715] mt-1 line-clamp-1">
              {prevWriting.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextWriting ? (
          <Link
            href={`/writings/${nextWriting.slug}`}
            className="group p-5 rounded-xl bg-white border border-[#EAE2D8] hover:border-[#C5A059] transition-all flex flex-col justify-between text-right"
          >
            <span className="text-[11px] uppercase tracking-widest text-[#8C7A65] flex items-center justify-end group-hover:text-[#C5A059]">
              <span>Next Piece</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
            <span className="font-serif text-lg font-medium text-[#1A1715] mt-1 line-clamp-1">
              {nextWriting.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
