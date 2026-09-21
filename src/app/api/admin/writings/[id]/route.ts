import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { calculateReadingTime } from '@/lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const writing = await prisma.writing.findUnique({
      where: { id },
    });

    if (!writing) {
      return NextResponse.json({ error: 'Writing not found' }, { status: 404 });
    }

    return NextResponse.json({ writing });
  } catch (error) {
    console.error('Writing fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch writing' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await req.json();
    const { title, category, content, excerpt, coverImage, tags, published, publishedAt } = data;

    const readingTime = calculateReadingTime(content);

    const writing = await prisma.writing.update({
      where: { id },
      data: {
        title,
        category,
        content,
        excerpt,
        coverImage: coverImage || null,
        tags: tags || null,
        readingTime,
        published: Boolean(published),
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      },
    });

    return NextResponse.json({ success: true, writing });
  } catch (error) {
    console.error('Writing update error:', error);
    return NextResponse.json({ error: 'Failed to update writing' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.writing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Writing deleted successfully' });
  } catch (error) {
    console.error('Writing delete error:', error);
    return NextResponse.json({ error: 'Failed to delete writing' }, { status: 500 });
  }
}
