import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import WritingReader from '@/components/writings/WritingReader';

interface WritingDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WritingDetailPageProps) {
  try {
    const { slug } = await params;
    const writing = await prisma.writing.findUnique({
      where: { slug },
    });

    if (!writing) {
      return { title: 'Piece Not Found | ALSA.S' };
    }

    return {
      title: `${writing.title} | Writings`,
      description: writing.excerpt,
      openGraph: {
        title: `${writing.title} by Alsa.S`,
        description: writing.excerpt,
        type: 'article',
      },
    };
  } catch (err) {
    console.error('Error generating writing metadata:', err);
    return { title: 'Writings | ALSA.S' };
  }
}

export const revalidate = 60;

export default async function WritingDetailPage({ params }: WritingDetailPageProps) {
  const { slug } = await params;

  let writing = null;
  try {
    writing = await prisma.writing.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.error('Error loading writing:', err);
  }

  if (!writing) {
    notFound();
  }

  // Increment view count non-blockingly
  try {
    await prisma.writing.update({
      where: { id: writing.id },
      data: { views: { increment: 1 } },
    });
  } catch {
    // Non-blocking
  }

  // Get previous and next pieces for navigation
  let prevWriting = null;
  let nextWriting = null;
  let relatedWritings: any[] = [];

  try {
    const [pWriting, nWriting, rWritings] = await Promise.all([
      prisma.writing.findFirst({
        where: {
          published: true,
          publishedAt: { lt: writing.publishedAt },
        },
        orderBy: { publishedAt: 'desc' },
        select: { title: true, slug: true },
      }),
      prisma.writing.findFirst({
        where: {
          published: true,
          publishedAt: { gt: writing.publishedAt },
        },
        orderBy: { publishedAt: 'asc' },
        select: { title: true, slug: true },
      }),
      prisma.writing.findMany({
        where: {
          published: true,
          category: writing.category,
          id: { not: writing.id },
        },
        take: 3,
        select: { title: true, slug: true, excerpt: true, readingTime: true },
      }),
    ]);
    prevWriting = pWriting;
    nextWriting = nWriting;
    relatedWritings = rWritings;
  } catch (err) {
    console.error('Error fetching adjacent writings:', err);
  }

  return (
    <div className="py-12 sm:py-20 px-6 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Digital Reading Room Component */}
      <WritingReader
        writing={writing}
        prevWriting={prevWriting}
        nextWriting={nextWriting}
      />

      {/* Related Pieces in Same Category */}
      {relatedWritings.length > 0 && (
        <div className="max-w-3xl mx-auto mt-20 pt-12 border-t border-[#EAE2D8]">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059] block mb-2">
            More in {writing.category}
          </span>
          <h3 className="font-serif text-2xl font-medium text-[#1A1715] mb-6">
            Related Fragments &amp; Verses
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedWritings.map((item) => (
              <Link
                key={item.slug}
                href={`/writings/${item.slug}`}
                className="group p-5 rounded-lg bg-white border border-[#EAE2D8] hover:border-[#C5A059] transition-all flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-serif text-base font-medium text-[#1A1715] group-hover:text-[#8C6D3B] line-clamp-2 mb-2">
                    {item.title}
                  </h4>
                  <p className="font-serif italic text-xs text-[#5A544C] line-clamp-2">
                    &ldquo;{item.excerpt}&rdquo;
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#8C7A65] mt-4 block">
                  {item.readingTime || '3 min read'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
