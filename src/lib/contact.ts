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
  rightsAgencyLabel: 'Author herself',
  rightsEmail: 'alsawritesofus@gmail.com',
  rightsAgencyDetails: 'Alsa.S',

  directMailTitle: 'Direct Mail',
  directMailDescription: 'Readers wishing to write directly can address:',
  directEmail: 'alsawritesofus@gmail.com',

  socialTitle: 'Digital Sanctuaries',
  socialDescription:
    'Follow along for visual excerpts, reading recommendations, and tour announcements.',
  instagramUrl:
    'https://www.instagram.com/mysteries_in_life_?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
  instagramHandle: '@mysteries_in_life_ on Instagram',
  twitterUrl: '',
  twitterHandle: '',
  goodreadsUrl: '',
  goodreadsHandle: '',
};
