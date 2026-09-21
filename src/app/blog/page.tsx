import React from 'react';
import prisma from '@/lib/prisma';
import BlogClient from './BlogClient';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Journal & Essays',
  description:
    "Author's journal, writing journey reflections, behind-the-scenes essays, and book updates from Alsa.S.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="py-16 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Journal Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>The Author&apos;s Journal</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#1A1715]">
          Notes &amp; Essays
        </h1>

        <div className="w-16 h-0.5 bg-[#C5A059] mx-auto my-4" />

        <p className="font-serif italic text-lg sm:text-xl text-[#5A544C] leading-relaxed">
          &ldquo;Musings on the craft, the quiet mornings at the desk, and the living worlds behind each completed story.&rdquo;
        </p>
      </div>

      <BlogClient posts={posts} />
    </div>
  );
}
