import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { linkId } = await req.json();

    if (!linkId) {
      return NextResponse.json({ error: 'Missing linkId' }, { status: 400 });
    }

    await prisma.purchaseLink.update({
      where: { id: linkId },
      data: { clickCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json({ error: 'Failed to record click' }, { status: 500 });
  }
}
