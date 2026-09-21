import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.status === 'UNSUBSCRIBED') {
        await prisma.newsletterSubscriber.update({
          where: { email: cleanEmail },
          data: { status: 'ACTIVE' },
        });
        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription to Letters from Alsa.S has been renewed.',
        });
      }
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to Letters from Alsa.S. Thank you!',
      });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Welcome to Letters from Alsa.S. You will receive periodic dispatches from the desk.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while subscribing.' },
      { status: 500 }
    );
  }
}
