import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify, calculateReadingTime } from '@/lib/utils';

export async function GET() {
  try {
    const writings = await prisma.writing.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ writings });
  } catch (error) {
    console.error('Writings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch writings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { title, category, content, excerpt, coverImage, tags, published, publishedAt } = data;

    if (!title || !category || !content) {
      return NextResponse.json(
        { error: 'Title, category, and content are required.' },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.writing.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const readingTime = calculateReadingTime(content);
    const generatedExcerpt = excerpt || content.slice(0, 160).trim() + '...';

    const writing = await prisma.writing.create({
      data: {
        title,
        slug: finalSlug,
        category,
        content,
        excerpt: generatedExcerpt,
        coverImage: coverImage || null,
        tags: tags || null,
        readingTime,
        published: published !== false,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json({ success: true, writing });
  } catch (error) {
    console.error('Writing create error:', error);
    return NextResponse.json({ error: 'Failed to create writing' }, { status: 500 });
  }
}
