import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Feather, BookOpen, ArrowRight, Compass, Sparkles, Quote } from 'lucide-react';
import prisma from '@/lib/prisma';
import BookCard from '@/components/books/BookCard';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import { formatDate } from '@/lib/utils';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let featuredBook: any = null;
  let books: any[] = [];
  let recentWritings: any[] = [];
  let recentPosts: any[] = [];

  try {
    featuredBook = await prisma.book.findFirst({
      where: { featured: true },
      include: { purchaseLinks: true },
    });

    if (!featuredBook) {
      featuredBook = await prisma.book.findFirst({
        include: { purchaseLinks: true },
        orderBy: { order: 'asc' },
      });
    }

    books = await prisma.book.findMany({
      orderBy: { order: 'asc' },
      take: 4,
    });

    recentWritings = await prisma.writing.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });

    recentPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });
  } catch (err) {
    console.error('Error loading homepage data from DB:', err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section — Midnight Library Atmosphere */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#12100E] text-[#FAF8F5] overflow-hidden px-6 sm:px-8 py-24">
        {/* Cinematic Backdrop Image with Deep Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop"
            alt="Atmospheric Author Library"
            fill
            priority
            className="object-cover opacity-20 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12100E]/70 via-[#12100E]/85 to-[#FAF8F5]" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#12100E]/60 to-[#12100E]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
          {/* Subtle Emblem Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FAF8F5]/10 border border-[#C5A059]/40 backdrop-blur-md text-[#DFC07C]">
            <Feather className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
              Author · Poet · Storyteller
            </span>
          </div>

          {/* Author Headline */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight leading-none text-[#FAF8F5]">
            ALSA.S
          </h1>

          {/* Literary Statement */}
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#E4D9C8] font-light leading-snug">
              &ldquo;Some stories are meant to be read.
            </p>
            <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#C5A059] font-normal leading-snug">
              Others are meant to be felt.&rdquo;
            </p>
          </div>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#D4D2CF] font-sans font-light leading-relaxed">
            Welcome into the quiet sanctuary of novels, poetry, and midnight reflections. Step across the threshold and explore the written world.
          </p>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/books"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C5A059] hover:bg-[#B38C44] text-[#12100E] font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Explore My Books</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/writings"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 backdrop-blur-sm flex items-center justify-center space-x-2"
            >
              <span>Enter the Writing Room</span>
              <Compass className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Ambient Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 text-[#8C7A65]">
          <span className="text-[9px] uppercase tracking-[0.3em] font-medium">Scroll to enter</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#C5A059] to-transparent animate-pulse" />
        </div>
      </section>

      {/* 2. Featured Book Spotlight */}
      {featuredBook && (
        <section className="py-24 px-6 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059] block mb-2">
              Featured Work
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1A1715]">
              Spotlight Novel
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059] mx-auto mt-4" />
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 sm:p-14 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Book Cover 3D Presentation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="book-cover-container relative w-64 h-96 sm:w-72 sm:h-[430px]">
                <div className="book-cover relative w-full h-full rounded-md overflow-hidden bg-[#221E1A] shadow-2xl">
                  <div className="book-spine-line" />
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-30" />
                  <Image
                    src={featuredBook.coverImage}
                    alt={featuredBook.title}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1024px) 300px, 400px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />
                  <div className="absolute bottom-6 inset-x-6 z-20 text-center">
                    <span className="text-[10px] uppercase tracking-widest text-[#DFC07C] font-semibold block mb-1">
                      {featuredBook.genre}
                    </span>
                    <h3 className="font-serif text-white text-xl sm:text-2xl font-medium">
                      {featuredBook.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Details & Narrative Teaser */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF6EB] border border-[#C5A059]/30 text-[#8C6D3B] text-xs uppercase tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{featuredBook.genre}</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1A1715] leading-tight">
                {featuredBook.title}
              </h3>

              {featuredBook.subtitle && (
                <p className="font-serif italic text-lg sm:text-xl text-[#8C7A65]">
                  {featuredBook.subtitle}
                </p>
              )}

              <p className="text-base sm:text-lg text-[#5A544C] font-serif leading-relaxed pretty-prose">
                {featuredBook.description}
              </p>

              {featuredBook.excerpt && (
                <div className="p-5 bg-[#FAF8F5] rounded-lg border-l-2 border-[#C5A059] my-4 italic font-serif text-sm text-[#5A544C]">
                  &ldquo;{featuredBook.excerpt.split('\n\n')[0]}&rdquo;
                </div>
              )}

              {/* Action Triggers */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={`/books/${featuredBook.slug}`}
                  className="px-7 py-3.5 rounded-full bg-[#1A1715] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore Book &amp; Excerpt</span>
                </Link>

                <Link
                  href={`/books/${featuredBook.slug}#where-to-buy`}
                  className="px-7 py-3.5 rounded-full border border-[#C5A059] text-[#8C6D3B] hover:bg-[#FAF6EB] text-xs uppercase tracking-widest font-semibold transition-all flex items-center space-x-2"
                >
                  <span>Where to Buy</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. The Bookshelf — Published Works */}
      <section className="py-20 bg-[#F5EFEB] border-y border-[#EAE2D8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059] block mb-2">
                Published &amp; Forthcoming
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1A1715]">
                The Author&apos;s Bookshelf
              </h2>
            </div>
            <Link
              href="/books"
              className="mt-4 sm:mt-0 text-xs uppercase tracking-widest font-semibold text-[#8C6D3B] hover:text-[#1A1715] transition-colors flex items-center group"
            >
              <span>View All Editions</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Scattered Pages — Latest Poetry & Stories */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059] block mb-2">
              From the Writing Desk
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1A1715]">
              Scattered Pages
            </h2>
            <p className="text-sm text-[#8C7A65] mt-2 max-w-md font-sans">
              Poetry, short stories, and reflective fragments written during the late hours.
            </p>
          </div>
          <Link
            href="/writings"
            className="mt-4 sm:mt-0 text-xs uppercase tracking-widest font-semibold text-[#8C6D3B] hover:text-[#1A1715] transition-colors flex items-center group"
          >
            <span>Browse Creative Archive</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentWritings.map((writing) => (
            <article
              key={writing.id}
              className="group bg-white rounded-xl border border-[#EAE2D8] hover:border-[#C5A059]/60 p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-[#FAF6EB] text-[#8C6D3B] border border-[#C5A059]/25">
                    {writing.category}
                  </span>
                  <span className="text-xs text-[#8C7A65]">
                    {writing.readingTime || '3 min read'}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-[#1A1715] group-hover:text-[#8C6D3B] transition-colors mb-3 leading-snug">
                  <Link href={`/writings/${writing.slug}`}>
                    {writing.title}
                  </Link>
                </h3>

                <p className="font-serif italic text-[#5A544C] text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                  &ldquo;{writing.excerpt}&rdquo;
                </p>
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
      </section>

      {/* 5. Author's Journal / Blog Showcase */}
      <section className="py-20 bg-[#FAF6EB]/50 border-t border-[#EAE2D8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059] block mb-2">
                The Journal
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1A1715]">
                Behind the Stories
              </h2>
            </div>
            <Link
              href="/blog"
              className="mt-4 sm:mt-0 text-xs uppercase tracking-widest font-semibold text-[#8C6D3B] hover:text-[#1A1715] transition-colors flex items-center group"
            >
              <span>Open Journal</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl border border-[#EAE2D8] hover:border-[#C5A059]/50 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {post.featuredImage && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#262220]">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#1A1715]/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-semibold text-[#DFC07C]">
                      {post.category}
                    </div>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-[#8C7A65] mb-2 font-light">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>·</span>
                      <span>{post.readingTime}</span>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-[#1A1715] group-hover:text-[#8C6D3B] transition-colors mb-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-xs text-[#5A544C] leading-relaxed line-clamp-3 mb-4 font-sans">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F4EFEA] flex items-center justify-between">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs uppercase tracking-widest font-semibold text-[#8C6D3B] group-hover:text-[#1A1715] flex items-center"
                    >
                      <span>Read Journal</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Intimate Author Section */}
      <section className="py-24 max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8">
        <div className="w-12 h-12 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059] mx-auto">
          <Quote className="w-5 h-5" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1A1715] max-w-3xl mx-auto leading-tight">
          &ldquo;I write to give shape to the things we feel before we know the words for them.&rdquo;
        </h2>

        <p className="max-w-2xl mx-auto text-base text-[#5A544C] leading-relaxed font-sans font-light">
          Alsa.S is an author, poet, and storyteller whose work explores emotional resonance, memory, human devotion, and the quiet architectures of longing. Her books are read across continents and cherished by readers seeking intimacy and wonder.
        </p>

        <div className="pt-4">
          <Link
            href="/about"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#8C6D3B] hover:text-[#1A1715] transition-colors pb-1 border-b border-[#C5A059]"
          >
            <span>Learn More About the Author</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
