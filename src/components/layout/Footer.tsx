'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Feather, Instagram, Twitter, BookMarked, Mail } from 'lucide-react';
import NewsletterForm from '@/components/newsletter/NewsletterForm';

export default function Footer() {
  const pathname = usePathname();

  // Do not render public footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#1A1715] text-[#FAF8F5] pt-20 pb-12 border-t border-[#2A2521]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Section: Literary Quote & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2D2824]">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center space-x-3 text-[#C5A059]">
              <Feather className="w-5 h-5" />
              <span className="font-serif text-2xl tracking-[0.15em] font-semibold text-[#FAF8F5]">
                ALSA.S
              </span>
            </div>
            <p className="font-serif italic text-xl sm:text-2xl text-[#D4D2CF] max-w-md leading-relaxed">
              &ldquo;Some stories are meant to be read. Others are meant to be felt.&rdquo;
            </p>
            <p className="text-xs tracking-wider text-[#A9A59F] uppercase font-light">
              Author · Poet · Storyteller
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#221E1A] p-8 rounded-lg border border-[#3A352F] shadow-lg">
              <h3 className="font-serif text-xl text-[#FAF8F5] mb-2 font-medium">
                Letters from Alsa.S
              </h3>
              <p className="text-sm text-[#A9A59F] mb-6 leading-relaxed">
                A little piece of the world I&apos;m writing, sent to yours. Periodic thoughts, excerpts before publication, and midnight musings.
              </p>
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </div>

        {/* Middle Section: Site Navigation & Channels */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 text-sm">
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4 font-semibold">
              The Works
            </h4>
            <ul className="space-y-2.5 text-[#D4D2CF]">
              <li>
                <Link href="/books" className="hover:text-white transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/books/chronicles-of-heart-a-loves-tapestry" className="hover:text-white transition-colors">
                  Chronicles of Heart: A Love&apos;s Tapestry
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4 font-semibold">
              Writing Room
            </h4>
            <ul className="space-y-2.5 text-[#D4D2CF]">
              <li>
                <Link href="/writings" className="hover:text-white transition-colors">
                  Poetry Archive
                </Link>
              </li>
              <li>
                <Link href="/writings?category=Short+Stories" className="hover:text-white transition-colors">
                  Short Stories
                </Link>
              </li>
              <li>
                <Link href="/writings?category=Reflections" className="hover:text-white transition-colors">
                  Reflections
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Author&apos;s Journal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4 font-semibold">
              The Author
            </h4>
            <ul className="space-y-2.5 text-[#D4D2CF]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Biography
                </Link>
              </li>
              <li>
                <Link href="/about#philosophy" className="hover:text-white transition-colors">
                  Writing Philosophy
                </Link>
              </li>
              <li>
                <Link href="/about#journey" className="hover:text-white transition-colors">
                  The Journey
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Correspondence & Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] mb-4 font-semibold">
              Connect
            </h4>
            <div className="flex space-x-3 mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A2521] flex items-center justify-center text-[#D4D2CF] hover:text-[#C5A059] hover:bg-[#3A352F] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A2521] flex items-center justify-center text-[#D4D2CF] hover:text-[#C5A059] hover:bg-[#3A352F] transition-all"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://goodreads.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#2A2521] flex items-center justify-center text-[#D4D2CF] hover:text-[#C5A059] hover:bg-[#3A352F] transition-all"
                aria-label="Goodreads"
              >
                <BookMarked className="w-4 h-4" />
              </a>
              <a
                href="mailto:correspondence@alsas.com"
                className="w-8 h-8 rounded-full bg-[#2A2521] flex items-center justify-center text-[#D4D2CF] hover:text-[#C5A059] hover:bg-[#3A352F] transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-[#7F7970]">
              Inquiries: <span className="text-[#D4D2CF]">correspondence@alsas.com</span>
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-[#2A2521] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7F7970] space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Alsa.S. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-[#A9A59F] transition-colors">
              Privacy & Cookies
            </Link>
            <Link href="/terms" className="hover:text-[#A9A59F] transition-colors">
              Terms of Reading
            </Link>
            <Link href="/admin/login" className="hover:text-[#C5A059] transition-colors">
              Author Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
