import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: {
        purchaseLinks: true,
      },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ books });
  } catch (error: any) {
    console.error('Books fetch error:', error);
    return NextResponse.json({
      error: 'Failed to fetch books',
      message: error?.message || String(error),
      code: error?.code,
      meta: error?.meta,
      envDbUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@') : 'not-set',
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const {
      title,
      subtitle,
      genre,
      description,
      synopsis,
      excerpt,
      authorNote,
      coverImage,
      publisher,
      publicationDate,
      isbn,
      pageCount,
      language,
      format,
      status,
      featured,
      purchaseLinks,
    } = data;

    if (!title || !description || !synopsis || !genre || !coverImage) {
      return NextResponse.json(
        { error: 'Title, description, synopsis, genre, and cover image are required.' },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.book.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const book = await prisma.book.create({
      data: {
        title,
        slug: finalSlug,
        subtitle: subtitle || null,
        genre,
        description,
        synopsis,
        excerpt: excerpt || null,
        authorNote: authorNote || null,
        coverImage,
        publisher: publisher || null,
        publicationDate: publicationDate || null,
        isbn: isbn || null,
        pageCount: pageCount ? parseInt(pageCount, 10) : null,
        language: language || 'English',
        format: format || 'Hardcover, Paperback',
        status: status || 'PUBLISHED',
        featured: Boolean(featured),
        purchaseLinks: {
          create: Array.isArray(purchaseLinks)
            ? purchaseLinks
                .filter((p: { platform?: string; url?: string }) => p.platform && p.url)
                .map((p: { platform: string; displayName?: string; url: string; region?: string }) => ({
                  platform: p.platform,
                  displayName: p.displayName || `Buy on ${p.platform}`,
                  url: p.url,
                  region: p.region || 'Global',
                }))
            : [],
        },
      },
      include: {
        purchaseLinks: true,
      },
    });

    return NextResponse.json({ success: true, book });
  } catch (error) {
    console.error('Book create error:', error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}
