'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Feather, Compass, BookOpen } from 'lucide-react';

const NAV_LINKS = [
  { name: 'HOME', href: '/' },
  { name: 'BOOKS', href: '/books' },
  { name: 'WRITINGS', href: '/writings' },
  { name: 'BLOG', href: '/blog' },
  { name: 'ABOUT', href: '/about' },
  { name: 'CONTACT', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide public navbar on admin routes
  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isAdminRoute) {
    return null;
  }

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search-modal'));
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/90 backdrop-blur-md shadow-sm border-b border-[#EAE2D8]/80 py-3'
          : 'bg-[#FAF8F5] border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand / Author Emblem */}
        <Link href="/" className="group flex items-center space-x-3 text-left">
          <div className="w-8 h-8 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-colors duration-300">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <span className="block font-serif text-xl sm:text-2xl tracking-[0.2em] font-semibold text-[#1A1715] group-hover:text-[#8C6D3B] transition-colors">
              ALSA.S
            </span>
            <span className="hidden sm:block text-[10px] tracking-[0.25em] text-[#8C7A65] uppercase font-light">
              Author · Poet · Storyteller
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-xs tracking-[0.2em] uppercase font-medium text-[#5A544C]">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 transition-colors duration-200 hover:text-[#1A1715] ${
                  isActive ? 'text-[#1A1715] font-semibold' : ''
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C5A059] animate-fade-in" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            aria-label="Open Search"
            className="flex items-center space-x-2 text-[#5A544C] hover:text-[#1A1715] transition-colors p-2 rounded-full hover:bg-[#F4EFEA]"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline text-xs tracking-wider text-[#8C7A65]">
              Search (Ctrl+K)
            </span>
          </button>

          {/* Admin shortcut */}
          <Link
            href="/admin"
            title="Author Studio"
            className="hidden sm:flex text-[#8C7A65] hover:text-[#C5A059] p-2 rounded-full hover:bg-[#F4EFEA] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-[#1A1715] hover:text-[#C5A059] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-[#FAF8F5] border-b border-[#EAE2D8] shadow-xl py-6 px-8 z-50 animate-fadeIn">
          <nav className="flex flex-col space-y-4 text-center">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-[0.25em] uppercase py-2 transition-colors ${
                    isActive ? 'text-[#C5A059] font-semibold' : 'text-[#5A544C] hover:text-[#1A1715]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-[#EAE2D8] flex items-center justify-center space-x-6">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSearch();
                }}
                className="text-xs uppercase tracking-widest text-[#8C7A65] hover:text-[#1A1715] flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Catalog</span>
              </button>
              <Link
                href="/admin"
                className="text-xs uppercase tracking-widest text-[#C5A059] hover:underline"
              >
                Author Studio
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
