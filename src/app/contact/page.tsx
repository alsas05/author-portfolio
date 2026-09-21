import React from 'react';
import { Mail, Feather, Instagram, Twitter, BookMarked } from 'lucide-react';
import ContactForm from './ContactForm';
import { prisma } from '@/lib/prisma';
import { DEFAULT_CONTACT_DATA, ContactPageData } from '@/lib/contact';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact & Inquiries',
  description:
    'Send a message to author and poet Alsa.S for literary correspondence, speaking engagements, and press inquiries.',
};

export default async function ContactPage() {
  let contactData: ContactPageData = DEFAULT_CONTACT_DATA;

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'contact_page_data' },
    });

    if (setting) {
      contactData = { ...DEFAULT_CONTACT_DATA, ...JSON.parse(setting.value) };
    }
  } catch (error) {
    console.error('Failed to load dynamic contact data:', error);
  }

  return (
    <div className="py-16 sm:py-24 px-6 sm:px-8 max-w-7xl mx-auto w-full">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059]">
          <Mail className="w-3.5 h-3.5" />
          <span>{contactData.badge}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#1A1715]">
          {contactData.heading}
        </h1>

        <div className="w-16 h-0.5 bg-[#C5A059] mx-auto my-4" />

        <p className="font-serif italic text-lg sm:text-xl text-[#5A544C] leading-relaxed">
          &ldquo;{contactData.quote.replace(/^[“"']+|[”"']+$/g, '')}&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        {/* Right Column: Literary Inquiries & Social Channels */}
        <div className="lg:col-span-5 space-y-8">
          {/* Professional Guidance */}
          <div className="bg-[#FAF6EB]/60 rounded-2xl border border-[#EAE2D8] p-8 space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1A1715]">
              {contactData.rightsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A544C] leading-relaxed font-sans font-light">
              {contactData.rightsDescription}
            </p>
            <div className="pt-2 text-xs space-y-1.5 font-sans">
              <p className="text-[#1A1715] font-medium">{contactData.rightsAgencyLabel}</p>
              <a
                href={`mailto:${contactData.rightsEmail}`}
                className="text-[#8C6D3B] hover:underline block"
              >
                {contactData.rightsEmail}
              </a>
              <p className="text-[#8C7A65]">{contactData.rightsAgencyDetails}</p>
            </div>
          </div>

          {/* Direct Email */}
          <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 space-y-4">
            <div className="flex items-center space-x-3 text-[#C5A059]">
              <Feather className="w-5 h-5" />
              <h3 className="font-serif text-xl font-medium text-[#1A1715]">
                {contactData.directMailTitle}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5A544C] leading-relaxed font-sans font-light">
              {contactData.directMailDescription}
            </p>
            <a
              href={`mailto:${contactData.directEmail}`}
              className="inline-block font-mono text-sm text-[#8C6D3B] hover:underline"
            >
              {contactData.directEmail}
            </a>
          </div>

          {/* Social Presence */}
          <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1A1715]">
              {contactData.socialTitle}
            </h3>
            <p className="text-xs text-[#8C7A65]">
              {contactData.socialDescription}
            </p>

            <div className="space-y-3 pt-2">
              {contactData.instagramUrl && (
                <a
                  href={contactData.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-xs text-[#5A544C] hover:text-[#1A1715] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#C5A059] border border-[#EAE2D8]">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                  <span>{contactData.instagramHandle || 'Instagram'}</span>
                </a>
              )}

              {contactData.twitterUrl && (
                <a
                  href={contactData.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-xs text-[#5A544C] hover:text-[#1A1715] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#C5A059] border border-[#EAE2D8]">
                    <Twitter className="w-3.5 h-3.5" />
                  </div>
                  <span>{contactData.twitterHandle || 'X / Twitter'}</span>
                </a>
              )}

              {contactData.goodreadsUrl && (
                <a
                  href={contactData.goodreadsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-xs text-[#5A544C] hover:text-[#1A1715] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#C5A059] border border-[#EAE2D8]">
                    <BookMarked className="w-3.5 h-3.5" />
                  </div>
                  <span>{contactData.goodreadsHandle || 'Goodreads'}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
