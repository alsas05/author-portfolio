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

export const DEFAULT_SMTP_CONFIG: SmtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  user: '',
  pass: '',
  fromName: 'Alsa.S',
  fromEmail: '',
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
        user: parsed.user || process.env.SMTP_USER || '',
        pass: parsed.pass || process.env.SMTP_PASS || '',
        fromName: parsed.fromName || process.env.SMTP_FROM_NAME || 'Alsa.S',
        fromEmail: parsed.fromEmail || parsed.user || process.env.SMTP_USER || '',
        isConfigured,
      };
    }
  } catch (err) {
    console.error('Error reading SMTP settings from DB:', err);
  }

  // Fallback to environment variables
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const isConfigured = Boolean(user && pass);

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
