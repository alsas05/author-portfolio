import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const [books, writings, blogPosts] = await Promise.all([
      // Search Books
      prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { subtitle: { contains: query } },
            { description: { contains: query } },
            { genre: { contains: query } },
          ],
        },
        take: 5,
      }),
      // Search Writings
      prisma.writing.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            { excerpt: { contains: query } },
            { category: { contains: query } },
          ],
        },
        take: 6,
      }),
      // Search Blog Posts
      prisma.blogPost.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            { excerpt: { contains: query } },
            { category: { contains: query } },
          ],
        },
        take: 5,
      }),
    ]);

    const results = [
      ...books.map((b) => ({
        type: 'BOOK' as const,
        title: b.title,
        excerpt: b.description,
        url: `/books/${b.slug}`,
        meta: `${b.genre} · ${b.status === 'UPCOMING' ? 'Upcoming' : 'Published'}`,
      })),
      ...writings.map((w) => {
        let typeLabel: 'POETRY' | 'SHORT STORY' | 'ESSAY' = 'POETRY';
        if (w.category.toLowerCase().includes('story')) typeLabel = 'SHORT STORY';
        else if (w.category.toLowerCase().includes('reflection') || w.category.toLowerCase().includes('letter')) typeLabel = 'ESSAY';

        return {
          type: typeLabel,
          title: w.title,
          excerpt: w.excerpt,
          url: `/writings/${w.slug}`,
          meta: `${w.category} · ${w.readingTime || '3 min read'}`,
        };
      }),
      ...blogPosts.map((p) => ({
        type: 'BLOG' as const,
        title: p.title,
        excerpt: p.excerpt,
        url: `/blog/${p.slug}`,
        meta: `Journal · ${p.category} · ${p.readingTime || '5 min read'}`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
