'use client';

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Type } from 'lucide-react';

interface ExcerptViewerProps {
  excerpt: string;
  bookTitle: string;
}

export default function ExcerptViewer({ excerpt, bookTitle }: ExcerptViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  return (
    <div className="bg-[#FAF6EB]/60 rounded-xl border border-[#EAE2D8] p-6 sm:p-10 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE2D8]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1A1715]">
              Read an Excerpt
            </h3>
            <p className="text-xs text-[#8C7A65]">From {bookTitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isOpen && (
            <button
              onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
              className="text-xs px-3 py-1.5 rounded-full border border-[#EAE2D8] bg-white text-[#5A544C] hover:border-[#C5A059] flex items-center space-x-1 transition-colors"
              title="Toggle reading font size"
            >
              <Type className="w-3.5 h-3.5" />
              <span>{fontSize === 'normal' ? 'Larger Text' : 'Standard'}</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-5 py-2 rounded-full bg-[#1A1715] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center space-x-2"
          >
            <span>{isOpen ? 'Close Excerpt' : 'Begin Reading'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="pt-8 animate-fadeIn">
          {/* Parchment Book Page Layout */}
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-lg border border-[#EAE2D8] shadow-md relative">
            <div className="absolute top-4 right-4 text-[10px] tracking-widest uppercase text-[#B8A389] font-serif">
              Sample Passage
            </div>

            <div
              className={`font-serif leading-relaxed text-[#2B2621] space-y-6 drop-cap ${
                fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
              }`}
            >
              {excerpt.split('\n\n').map((paragraph, index) => (
                <p key={index} className="pretty-prose">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-[#F4EFEA] text-center">
              <span className="text-xs font-serif italic text-[#8C7A65]">
                — Excerpt courtesy of Veritas &amp; Quill Press
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
