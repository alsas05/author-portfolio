import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      bookCount,
      writingCount,
      blogCount,
      subscriberCount,
      messageCount,
      unreadMessageCount,
      purchaseLinks,
      recentMessages,
    ] = await Promise.all([
      prisma.book.count(),
      prisma.writing.count(),
      prisma.blogPost.count(),
      prisma.newsletterSubscriber.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.purchaseLink.findMany({
        select: { clickCount: true },
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const totalClicks = purchaseLinks.reduce((sum, link) => sum + link.clickCount, 0);

    return NextResponse.json({
      bookCount,
      writingCount,
      blogCount,
      subscriberCount,
      messageCount,
      unreadMessageCount,
      totalClicks,
      recentMessages,
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
