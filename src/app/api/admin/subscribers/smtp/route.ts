import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { getSmtpConfig, sendEmail, renderLiteraryEmailHtml } from '@/lib/email';
import nodemailer from 'nodemailer';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const config = await getSmtpConfig();
    return NextResponse.json({
      config: {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.user,
        pass: config.pass ? '••••••••••••••••' : '',
        fromName: config.fromName,
        fromEmail: config.fromEmail,
        isConfigured: config.isConfigured,
      },
    });
  } catch (error) {
    console.error('Fetch SMTP settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch email settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { host, port, secure, user, pass, fromName, fromEmail } = body;

    // Fetch existing so if pass is left masked, we preserve the existing one
    const existing = await getSmtpConfig();
    const finalPass = pass && !pass.includes('••') ? pass : existing.pass;

    const dataToSave = {
      host: host || 'smtp.gmail.com',
      port: Number(port) || 465,
      secure: secure !== undefined ? Boolean(secure) : true,
      user: user?.trim() || '',
      pass: finalPass?.trim() || '',
      fromName: fromName?.trim() || 'Alsa.S',
      fromEmail: fromEmail?.trim() || user?.trim() || '',
    };

    await prisma.siteSetting.upsert({
      where: { key: 'smtp_settings' },
      update: { value: JSON.stringify(dataToSave) },
      create: {
        key: 'smtp_settings',
        value: JSON.stringify(dataToSave),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Gmail & SMTP settings saved successfully!',
    });
  } catch (error) {
    console.error('Save SMTP settings error:', error);
    return NextResponse.json({ error: 'Failed to save email settings' }, { status: 500 });
  }
}

// POST: Test SMTP connection and send a test email
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { testRecipient } = await req.json();

    if (!testRecipient || !testRecipient.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid recipient email address for testing.' },
        { status: 400 }
      );
    }

    const config = await getSmtpConfig();
    if (!config.user || !config.pass) {
      return NextResponse.json(
        {
          error:
            'Gmail credentials are missing. Please enter your Gmail address and 16-character App Password, then click Save Settings.',
        },
        { status: 400 }
      );
    }

    // Verify SMTP connection
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    await transporter.verify();

    // Send test email
    const html = renderLiteraryEmailHtml({
      subject: 'Test Dispatch from Alsa.S Author Studio',
      content:
        'This is a verification test message from your Author Studio.\n\nYour Gmail SMTP integration is now active and authenticated! When you broadcast dispatches or presentation decks from the Admin Studio, they will be delivered directly into your readers’ Gmail inboxes.',
      deckTitle: 'Sample Pitch Deck — Chronicles of Heart',
      deckUrl: 'https://example.com/sample-deck.pdf',
      deckDescription: 'This is an example presentation deck attachment showing how decks appear in Gmail.',
      recipientEmail: testRecipient,
    });

    await sendEmail({
      to: testRecipient,
      subject: 'Test Dispatch from Alsa.S Author Studio',
      html,
    });

    return NextResponse.json({
      success: true,
      message: `Connection verified! A test email has been sent to ${testRecipient}. Please check your inbox.`,
    });
  } catch (error: any) {
    console.error('SMTP verification error:', error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          'Failed to connect to Gmail SMTP. Please verify your Gmail address and Google App Password.',
      },
      { status: 500 }
    );
  }
}
