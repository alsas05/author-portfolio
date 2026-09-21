'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Book, Feather, BookOpen, ArrowRight, Loader2 } from 'lucide-react';

interface SearchResult {
  type: 'BOOK' | 'POETRY' | 'SHORT STORY' | 'ESSAY' | 'BLOG';
  title: string;
  excerpt: string;
  url: string;
  meta?: string;
}

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for Ctrl+K or Cmd+K and custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-search-modal', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-search-modal', handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Live search debounced
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'BOOK':
        return 'bg-[#C5A059]/20 text-[#8C6D3B] border-[#C5A059]/40';
      case 'POETRY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SHORT STORY':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'BLOG':
      case 'ESSAY':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOK':
        return <Book className="w-4 h-4 text-[#C5A059]" />;
      case 'POETRY':
      case 'SHORT STORY':
        return <Feather className="w-4 h-4 text-purple-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#12100E]/70 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-xl shadow-2xl border border-[#EAE2D8] overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-[#EAE2D8] bg-white">
          <Search className="w-5 h-5 text-[#8C7A65] mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, poems, stories, and journal essays..."
            className="flex-1 bg-transparent border-none outline-none text-base text-[#1A1715] placeholder-[#8C7A65] font-serif tracking-wide"
          />
          {loading && <Loader2 className="w-5 h-5 text-[#C5A059] animate-spin ml-2" />}
          <button
            onClick={() => setIsOpen(false)}
            className="ml-3 p-1 rounded-full text-[#8C7A65] hover:text-[#1A1715] hover:bg-[#F5EFEB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 flex-1 space-y-2">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-[#8C7A65]">
              <Feather className="w-8 h-8 mx-auto mb-3 text-[#C5A059] opacity-60" />
              <p className="font-serif text-lg text-[#1A1715]">Search the Literary Catalog</p>
              <p className="text-xs text-[#8C7A65] mt-1">
                Type a title, line of poetry, or character to discover Alsa.S&apos;s writing.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setQuery('Moon')}
                  className="text-xs px-3 py-1 bg-white border border-[#EAE2D8] rounded-full hover:border-[#C5A059] text-[#5A544C]"
                >
                  &ldquo;Moon&rdquo;
                </button>
                <button
                  onClick={() => setQuery('Tapestry')}
                  className="text-xs px-3 py-1 bg-white border border-[#EAE2D8] rounded-full hover:border-[#C5A059] text-[#5A544C]"
                >
                  &ldquo;Tapestry&rdquo;
                </button>
                <button
                  onClick={() => setQuery('Poetry')}
                  className="text-xs px-3 py-1 bg-white border border-[#EAE2D8] rounded-full hover:border-[#C5A059] text-[#5A544C]"
                >
                  Poetry
                </button>
                <button
                  onClick={() => setQuery('Sacred Hour')}
                  className="text-xs px-3 py-1 bg-white border border-[#EAE2D8] rounded-full hover:border-[#C5A059] text-[#5A544C]"
                >
                  Sacred Hour
                </button>
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-12 text-center text-[#8C7A65]">
              <p className="font-serif text-base text-[#1A1715]">No pages found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1">Try another keyword, phrase, or title.</p>
            </div>
          ) : (
            results.map((item, idx) => (
              <Link
                key={idx}
                href={item.url}
                onClick={() => setIsOpen(false)}
                className="group block p-3.5 rounded-lg hover:bg-white border border-transparent hover:border-[#EAE2D8] hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    {getIcon(item.type)}
                    <span
                      className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${getBadgeStyle(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                    <h4 className="font-serif text-base font-medium text-[#1A1715] group-hover:text-[#8C6D3B] transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8C7A65] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                {item.excerpt && (
                  <p className="text-xs text-[#5A544C] line-clamp-2 mt-1.5 pl-6 font-sans">
                    {item.excerpt}
                  </p>
                )}
                {item.meta && (
                  <span className="text-[11px] text-[#8C7A65] mt-1 block pl-6 font-light">
                    {item.meta}
                  </span>
                )}
              </Link>
            ))
          )}
        </div>

        {/* Modal Footer Key Guide */}
        <div className="px-5 py-2.5 bg-[#F5EFEB] border-t border-[#EAE2D8] flex items-center justify-between text-[11px] text-[#8C7A65]">
          <span>Tip: Press ESC to close</span>
          <span>Navigation: Select to open</span>
        </div>
      </div>
    </div>
  );
}
