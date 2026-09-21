import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
      include: { purchaseLinks: true },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Book get error:', error);
    return NextResponse.json({ error: 'Failed to retrieve book' }, { status: 500 });
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

    // Delete existing purchase links and re-create to keep in sync
    await prisma.purchaseLink.deleteMany({
      where: { bookId: id },
    });

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title,
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
      include: { purchaseLinks: true },
    });

    return NextResponse.json({ success: true, book: updatedBook });
  } catch (error) {
    console.error('Book update error:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
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
    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Book delete error:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
