export interface ContactPageData {
  badge: string;
  heading: string;
  quote: string;

  // Professional / Agency Inquiries
  rightsTitle: string;
  rightsDescription: string;
  rightsAgencyLabel: string;
  rightsEmail: string;
  rightsAgencyDetails: string;

  // Direct Mail
  directMailTitle: string;
  directMailDescription: string;
  directEmail: string;

  // Social Channels
  socialTitle: string;
  socialDescription: string;
  instagramUrl: string;
  instagramHandle: string;
  twitterUrl: string;
  twitterHandle: string;
  goodreadsUrl: string;
  goodreadsHandle: string;
}

export const DEFAULT_CONTACT_DATA: ContactPageData = {
  badge: 'Correspondence',
  heading: 'Reach the Author',
  quote:
    '“Letters are slow conversations. Every note from a reader is read with gratitude and care.”',

  rightsTitle: 'Professional & Rights Inquiries',
  rightsDescription:
    'For dramatic rights, foreign translations, anthology permissions, or academic event invitations, please direct formal queries to:',
  rightsAgencyLabel: 'Literary Representation:',
  rightsEmail: 'rights@alsas.com',
  rightsAgencyDetails: 'c/o Veritas & Quill Literary Agency',

  directMailTitle: 'Direct Mail',
  directMailDescription: 'Readers wishing to write directly can address:',
  directEmail: 'correspondence@alsas.com',

  socialTitle: 'Digital Sanctuaries',
  socialDescription:
    'Follow along for visual excerpts, reading recommendations, and tour announcements.',
  instagramUrl: 'https://instagram.com',
  instagramHandle: '@alsas.author on Instagram',
  twitterUrl: 'https://x.com',
  twitterHandle: '@alsas_writes on X',
  goodreadsUrl: 'https://goodreads.com',
  goodreadsHandle: 'Alsa.S on Goodreads',
};
