import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify, calculateReadingTime } from '@/lib/utils';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Blog posts fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { title, category, content, excerpt, featuredImage, tags, published, publishedAt } = data;

    if (!title || !category || !content) {
      return NextResponse.json(
        { error: 'Title, category, and content are required.' },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.blogPost.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const readingTime = calculateReadingTime(content);
    const generatedExcerpt = excerpt || content.slice(0, 160).trim() + '...';

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        category,
        content,
        excerpt: generatedExcerpt,
        featuredImage: featuredImage || null,
        tags: tags || null,
        readingTime,
        published: published !== false,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Blog post create error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
