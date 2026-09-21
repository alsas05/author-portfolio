import React from 'react';
import prisma from '@/lib/prisma';
import WritingsClient from './WritingsClient';
import { Feather } from 'lucide-react';

export const metadata = {
  title: 'Writings & Creative Archive',
  description:
    'Read poetry, short stories, epistolary fragments, and literary reflections by Alsa.S.',
};

export const revalidate = 60;

interface WritingsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function WritingsPage({ searchParams }: WritingsPageProps) {
  const { category } = await searchParams;

  const writings = await prisma.writing.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="py-16 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Editorial Archive Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059]">
          <Feather className="w-3.5 h-3.5" />
          <span>The Writing Room</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#1A1715]">
          Writings &amp; Fragments
        </h1>

        <div className="w-16 h-0.5 bg-[#C5A059] mx-auto my-4" />

        <p className="font-serif italic text-lg sm:text-xl text-[#5A544C] leading-relaxed">
          &ldquo;Between the draft and the finished book lies a forest of unprinted pages. Here are the poems and stories gathered from those paths.&rdquo;
        </p>
      </div>

      {/* Writings Client Component */}
      <WritingsClient
        initialWritings={writings}
        initialCategory={category || 'All'}
      />
    </div>
  );
}
