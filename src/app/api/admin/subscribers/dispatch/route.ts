import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { getSmtpConfig, sendEmail, renderLiteraryEmailHtml } from '@/lib/email';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dispatches = await prisma.subscriberDispatch.findMany({
      orderBy: { sentAt: 'desc' },
    });
    return NextResponse.json({ dispatches });
  } catch (error) {
    console.error('Fetch dispatches error:', error);
    return NextResponse.json({ error: 'Failed to fetch dispatches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      subject,
      messageType = 'LETTER',
      content,
      deckTitle,
      deckUrl,
      deckDescription,
      audience = 'ALL',
      testEmail,
    } = body;

    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: 'Subject line is required.' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message body content is required.' }, { status: 400 });
    }

    let recipients: string[] = [];

    if (audience === 'TEST') {
      if (!testEmail || !testEmail.includes('@')) {
        return NextResponse.json(
          { error: 'Please enter a valid test email address.' },
          { status: 400 }
        );
      }
      recipients = [testEmail.trim().toLowerCase()];
    } else {
      const activeSubscribers = await prisma.newsletterSubscriber.findMany({
        where: { status: 'ACTIVE' },
        select: { email: true },
      });
      recipients = activeSubscribers.map((s) => s.email);
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers found to receive this dispatch.' },
        { status: 400 }
      );
    }

    // Check if SMTP is configured
    const smtpConfig = await getSmtpConfig();
    let emailDeliverySuccess = false;
    let deliveryMessage = '';
    const failedEmails: string[] = [];

    if (smtpConfig.isConfigured) {
      // Send real emails to each recipient's Gmail inbox
      for (const recipient of recipients) {
        try {
          const html = renderLiteraryEmailHtml({
            subject: subject.trim(),
            messageType,
            content: content.trim(),
            deckTitle: deckTitle?.trim() || null,
            deckUrl: deckUrl?.trim() || null,
            deckDescription: deckDescription?.trim() || null,
            recipientEmail: recipient,
          });

          await sendEmail({
            to: recipient,
            subject: subject.trim(),
            html,
          });
        } catch (mailErr) {
          console.error(`Failed to deliver to ${recipient}:`, mailErr);
          failedEmails.push(recipient);
        }
      }

      const deliveredCount = recipients.length - failedEmails.length;
      emailDeliverySuccess = deliveredCount > 0;
      deliveryMessage = `Successfully delivered to ${deliveredCount} of ${recipients.length} subscriber Gmail inboxes.`;
      if (failedEmails.length > 0) {
        deliveryMessage += ` (${failedEmails.length} delivery failures).`;
      }
    } else {
      deliveryMessage = `Dispatch saved to archive. Notice: Real inbox delivery was skipped because Gmail SMTP is not yet configured. Please set your Gmail in the 'Email & Gmail Settings' tab.`;
    }

    // Persist dispatch record in database
    const dispatch = await prisma.subscriberDispatch.create({
      data: {
        subject: subject.trim(),
        messageType,
        content: content.trim(),
        deckTitle: deckTitle?.trim() || null,
        deckUrl: deckUrl?.trim() || null,
        deckDescription: deckDescription?.trim() || null,
        recipientCount: recipients.length,
        recipientsJson: JSON.stringify(recipients),
        status: smtpConfig.isConfigured ? 'DELIVERED' : 'SAVED_UNCONFIGURED_SMTP',
      },
    });

    return NextResponse.json({
      success: true,
      dispatch,
      recipientCount: recipients.length,
      smtpConfigured: smtpConfig.isConfigured,
      message: deliveryMessage,
    });
  } catch (error) {
    console.error('Send dispatch error:', error);
    return NextResponse.json({ error: 'Failed to send dispatch' }, { status: 500 });
  }
}
