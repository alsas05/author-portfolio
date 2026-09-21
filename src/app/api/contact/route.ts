import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, honeypot } = await req.json();

    // Anti-spam honeypot detection
    if (honeypot && honeypot.trim() !== '') {
      // Silently accept bots without storing to protect database
      return NextResponse.json({
        success: true,
        message: 'Your message has been sent. Thank you for reaching out.',
      });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields (Name, Email, Subject, Message) are required.' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent. Thank you for reaching out.',
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting your message.' },
      { status: 500 }
    );
  }
}
