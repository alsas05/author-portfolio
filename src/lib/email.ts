import nodemailer from 'nodemailer';
import { prisma } from './prisma';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  isConfigured: boolean;
}

export const DEFAULT_AUTHOR_NOTIFICATION_EMAIL = 'alsawritesofus@gmail.com';

export const DEFAULT_SMTP_CONFIG: SmtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  user: 'alsawritesofus@gmail.com',
  pass: '',
  fromName: 'Alsa.S',
  fromEmail: 'alsawritesofus@gmail.com',
  isConfigured: false,
};

/**
 * Retrieve SMTP configuration from database or fallback to environment variables
 */
export async function getSmtpConfig(): Promise<SmtpConfig> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'smtp_settings' },
    });

    if (setting) {
      const parsed = JSON.parse(setting.value);
      const isConfigured = Boolean(
        (parsed.user || process.env.SMTP_USER) &&
        (parsed.pass || process.env.SMTP_PASS)
      );

      return {
        host: parsed.host || process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(parsed.port || process.env.SMTP_PORT || 465),
        secure: parsed.secure !== undefined ? Boolean(parsed.secure) : true,
        user: parsed.user || process.env.SMTP_USER || DEFAULT_AUTHOR_NOTIFICATION_EMAIL,
        pass: parsed.pass || process.env.SMTP_PASS || '',
        fromName: parsed.fromName || process.env.SMTP_FROM_NAME || 'Alsa.S',
        fromEmail: parsed.fromEmail || parsed.user || process.env.SMTP_USER || DEFAULT_AUTHOR_NOTIFICATION_EMAIL,
        isConfigured,
      };
    }
  } catch (err) {
    console.error('Error reading SMTP settings from DB:', err);
  }

  // Fallback to environment variables
  const user = process.env.SMTP_USER || DEFAULT_AUTHOR_NOTIFICATION_EMAIL;
  const pass = process.env.SMTP_PASS || '';
  const isConfigured = Boolean(process.env.SMTP_PASS);

  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE === 'true' || true,
    user,
    pass,
    fromName: process.env.SMTP_FROM_NAME || 'Alsa.S',
    fromEmail: process.env.SMTP_FROM_EMAIL || user,
    isConfigured,
  };
}

/**
 * Create a nodemailer transporter
 */
export async function getTransporter() {
  const config = await getSmtpConfig();

  if (!config.user || !config.pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export interface EmailRenderOptions {
  subject: string;
  messageType?: string;
  content: string;
  deckTitle?: string | null;
  deckUrl?: string | null;
  deckDescription?: string | null;
  siteUrl?: string;
  recipientEmail?: string;
}

/**
 * Render responsive HTML email template for Gmail / webmail clients
 */
export function renderLiteraryEmailHtml(options: EmailRenderOptions): string {
  const {
    subject,
    content,
    deckTitle,
    deckUrl,
    deckDescription,
    siteUrl = 'https://alsas.com',
    recipientEmail = '',
  } = options;

  // Convert plain text newlines into HTML paragraphs
  const paragraphs = content
    .split('\n\n')
    .filter((p) => p.trim().length > 0)
    .map(
      (p) =>
        `<p style="margin: 0 0 18px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 16px; line-height: 1.8; color: #2C2825;">${p
          .replace(/\n/g, '<br />')
          .trim()}</p>`
    )
    .join('');

  const deckHtml =
    deckUrl && deckUrl.trim()
      ? `
    <div style="margin: 32px 0; padding: 24px; background-color: #FAF6EB; border: 1px solid #EAE2D8; border-radius: 12px;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #C5A059; font-weight: 600; margin-bottom: 8px;">
        Attached Presentation Deck
      </div>
      <h3 style="margin: 0 0 8px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 20px; font-weight: 600; color: #1A1715;">
        ${deckTitle || 'Presentation & Lookbook Deck'}
      </h3>
      ${
        deckDescription
          ? `<p style="margin: 0 0 16px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #5A544C;">${deckDescription}</p>`
          : ''
      }
      <div>
        <a href="${deckUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: #1A1715; color: #FAF8F5; text-decoration: none; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em;">
          Open Presentation Deck &rarr;
        </a>
      </div>
    </div>
  `
      : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #EAE2D8; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
          
          <!-- Header Branding -->
          <tr>
            <td align="center" style="padding: 40px 32px 24px 32px; border-bottom: 1px solid #F0EAE1;">
              <div style="width: 40px; height: 40px; background-color: #1A1715; border-radius: 50%; display: inline-block; line-height: 40px; text-align: center; margin-bottom: 12px;">
                <span style="color: #C5A059; font-size: 18px; font-family: 'Georgia', serif;">&#10022;</span>
              </div>
              <div style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 22px; font-weight: 600; letter-spacing: 0.15em; color: #1A1715;">
                ALSA.S
              </div>
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; color: #C5A059; font-weight: 600; margin-top: 4px;">
                Letters from the Studio
              </div>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td style="padding: 36px 36px 24px 36px;">
              <div style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 24px; font-weight: 500; color: #1A1715; margin-bottom: 24px; line-height: 1.3;">
                ${subject}
              </div>

              ${paragraphs}

              ${deckHtml}

              <!-- Signature -->
              <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #F0EAE1;">
                <p style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-style: italic; font-size: 15px; color: #5A544C;">
                  With quiet devotion,
                </p>
                <p style="margin: 6px 0 0 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 18px; color: #1A1715;">
                  Alsa.S
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 32px; background-color: #FAF8F5; border-top: 1px solid #EAE2D8; font-size: 11px; color: #8C7A65; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;">
                You are receiving this personal literary letter because you subscribed to &ldquo;Letters from Alsa.S&rdquo;.
              </p>
              <p style="margin: 0;">
                <a href="${siteUrl}" style="color: #8C6D3B; text-decoration: none; margin-right: 12px;">Author Portfolio</a>
                &bull;
                <span style="color: #A9A59F; margin-left: 12px;">${recipientEmail ? `Sent to ${recipientEmail}` : ''}</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send real email to recipient(s)
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  const config = await getSmtpConfig();
  const transporter = await getTransporter();

  if (!transporter || !config.isConfigured) {
    throw new Error(
      'Gmail / SMTP credentials are not yet configured. Please set your Gmail address and Google App Password in the Admin Studio.'
    );
  }

  const from = `"${config.fromName}" <${config.fromEmail}>`;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text: text || html.replace(/<[^>]*>/g, ''),
    html,
  });

  return info;
}

export function renderContactNotificationHtml(options: {
  name: string;
  email: string;
  subject: string;
  message: string;
  dateStr?: string;
  siteUrl?: string;
}): string {
  const {
    name,
    email,
    subject,
    message,
    dateStr = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://author-portfolio-ashy.vercel.app',
  } = options;

  const formattedMessage = message
    .split('\n\n')
    .filter((p) => p.trim().length > 0)
    .map(
      (p) =>
        `<p style="margin: 0 0 16px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 15px; line-height: 1.8; color: #2C2825;">${p
          .replace(/\n/g, '<br />')
          .trim()}</p>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Message from ${name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #EAE2D8; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
          <tr>
            <td align="center" style="padding: 36px 32px 20px 32px; border-bottom: 1px solid #F0EAE1; background-color: #FAF6EB;">
              <div style="font-family: 'Georgia', 'Times New Roman', serif; font-size: 22px; font-weight: 600; letter-spacing: 0.15em; color: #1A1715;">
                ALSA.S
              </div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; color: #C5A059; font-weight: 600; margin-top: 6px;">
                Reader Correspondence Desk
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px;">
              <div style="display: inline-block; padding: 4px 12px; background-color: #FAF6EB; border: 1px solid #EAE2D8; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #8C6D3B; margin-bottom: 20px;">
                New Website Message
              </div>
              <h2 style="margin: 0 0 20px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 22px; font-weight: 600; color: #1A1715; line-height: 1.4;">
                ${subject}
              </h2>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF8F5; border: 1px solid #EAE2D8; border-radius: 10px; margin-bottom: 28px; padding: 16px;">
                <tr>
                  <td style="padding: 6px 12px; font-size: 12px; color: #8C7A65; width: 80px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">From:</td>
                  <td style="padding: 6px 12px; font-size: 14px; color: #1A1715; font-weight: 500;">
                    ${name} &lt;<a href="mailto:${email}" style="color: #8C6D3B; text-decoration: none;">${email}</a>&gt;
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 12px; font-size: 12px; color: #8C7A65; width: 80px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Received:</td>
                  <td style="padding: 6px 12px; font-size: 13px; color: #5A544C;">${dateStr}</td>
                </tr>
              </table>
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #8C7A65; font-weight: 600; margin-bottom: 12px;">
                Message Note:
              </div>
              <div style="padding: 20px; background-color: #FFFFFF; border-left: 3px solid #C5A059; border-radius: 4px; margin-bottom: 32px; font-size: 15px; line-height: 1.8; color: #2C2825;">
                ${formattedMessage}
              </div>
              <table border="0" cellspacing="0" cellpadding="0" style="margin-top: 12px;">
                <tr>
                  <td style="border-radius: 9999px; background-color: #1A1715;">
                    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" target="_blank" style="display: inline-block; padding: 12px 28px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; font-weight: 600; color: #FAF8F5; text-decoration: none; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 9999px;">
                      Reply directly to ${name} &rarr;
                    </a>
                  </td>
                  <td style="padding-left: 12px;">
                    <a href="${siteUrl}/admin/messages" target="_blank" style="display: inline-block; padding: 11px 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; font-weight: 600; color: #1A1715; text-decoration: none; text-transform: uppercase; letter-spacing: 0.15em; border: 1px solid #EAE2D8; border-radius: 9999px;">
                      Open Admin Portal
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 32px; background-color: #FAF8F5; border-top: 1px solid #EAE2D8; font-size: 11px; color: #8C7A65;">
              This notification was generated automatically by the contact desk on <a href="${siteUrl}" style="color: #8C6D3B; text-decoration: none;">Alsa.S Author Website</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatch real-time contact form message notification to author's Gmail
 */
export async function sendContactNotificationEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { name, email, subject, message } = data;
  const config = await getSmtpConfig();
  const transporter = await getTransporter();
  const recipient =
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    DEFAULT_AUTHOR_NOTIFICATION_EMAIL;

  let emailSent = false;

  // 1. Primary: Try Gmail SMTP if credentials (App Password) are configured
  if (transporter && config.isConfigured) {
    try {
      const from = `"${config.fromName}" <${config.fromEmail || config.user || DEFAULT_AUTHOR_NOTIFICATION_EMAIL}>`;
      const html = renderContactNotificationHtml({
        name,
        email,
        subject,
        message,
      });

      const plainText = `
New Reader Message Received on ALSA.S Author Desk

From: ${name} <${email}>
Subject: ${subject}
Date: ${new Date().toLocaleString()}

Message:
${message}

Reply to: ${email}
Admin Portal: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://author-portfolio-ashy.vercel.app'}/admin/messages
      `.trim();

      const info = await transporter.sendMail({
        from,
        to: recipient,
        replyTo: `"${name}" <${email}>`,
        subject: `[Author Correspondence] ${subject} — from ${name}`,
        text: plainText,
        html,
      });

      console.log('Successfully sent contact notification via Gmail SMTP:', info?.messageId);
      emailSent = true;
      return { success: true, method: 'smtp', messageId: info?.messageId };
    } catch (smtpErr) {
      console.warn('Gmail SMTP error, falling back to instant forwarding:', smtpErr);
    }
  }

  // 2. Secondary: Try Resend API if RESEND_API_KEY is configured
  if (!emailSent && process.env.RESEND_API_KEY) {
    try {
      const html = renderContactNotificationHtml({
        name,
        email,
        subject,
        message,
      });

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Alsa.S Contact <onboarding@resend.dev>',
          to: recipient,
          reply_to: email,
          subject: `[Author Correspondence] ${subject} — from ${name}`,
          html,
        }),
      });

      if (resendRes.ok) {
        const resendData = await resendRes.json();
        console.log('Successfully sent contact notification via Resend:', resendData);
        emailSent = true;
        return { success: true, method: 'resend', id: resendData.id };
      }
    } catch (resendErr) {
      console.warn('Resend API error:', resendErr);
    }
  }

  // 3. Fallback / Zero-Config: Forward directly to author's Gmail via FormSubmit
  if (!emailSent) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://author-portfolio-ashy.vercel.app';
      const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: siteUrl,
          Referer: `${siteUrl}/contact`,
        },
        body: JSON.stringify({
          name,
          email,
          _replyto: email,
          _subject: `[Author Website] ${subject} — from ${name}`,
          _template: 'table',
          _captcha: 'false',
          subject,
          message,
        }),
      });

      const fsData = await formSubmitRes.json();
      console.log('FormSubmit notification response:', fsData);
      return { success: true, method: 'formsubmit', details: fsData };
    } catch (fsErr) {
      console.error('Failed to forward contact notification via FormSubmit:', fsErr);
    }
  }

  return false;
}
