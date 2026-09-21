import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Feather, Compass } from 'lucide-react';
import prisma from '@/lib/prisma';
import { DEFAULT_ABOUT_DATA } from '@/lib/about';

export const metadata = {
  title: 'About the Author',
  description:
    'Biography, writing philosophy, publishing journey, and creative horizons of author and poet Alsa.S.',
};

export const revalidate = 0;

export default async function AboutPage() {
  let data = DEFAULT_ABOUT_DATA;

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'about_page_data' },
    });

    if (setting) {
      data = { ...DEFAULT_ABOUT_DATA, ...JSON.parse(setting.value) };
    }
  } catch (err) {
    console.error('Failed to load dynamic about data, using fallback defaults:', err);
  }

  return (
    <div className="py-16 sm:py-24 px-6 sm:px-8 max-w-5xl mx-auto w-full space-y-24">
      {/* 1. Header & Author Bio */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-64 h-80 sm:w-80 sm:h-[420px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#EAE2D8]">
            <Image
              src={data.portraitImage}
              alt="Alsa.S writing in her sanctuary"
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 300px, 400px"
              className="object-cover filter sepia-[0.15] contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 inset-x-4 text-center">
              <span className="font-serif italic text-sm text-[#FAF8F5]">
                {data.portraitCaption || 'Alsa.S at her desk'}
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059]">
            <Feather className="w-3.5 h-3.5" />
            <span>{data.tagline || 'Author · Poet · Storyteller'}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#1A1715] leading-tight">
            {data.heading || 'About Alsa.S'}
          </h1>

          <div className="w-16 h-0.5 bg-[#C5A059]" />

          <div className="font-serif text-lg sm:text-xl text-[#2B2621] leading-relaxed space-y-4 pretty-prose">
            {data.bioParagraph1 && <p>{data.bioParagraph1}</p>}
            {data.bioParagraph2 && <p>{data.bioParagraph2}</p>}
            {data.bioParagraph3 && (
              <p className="text-[#5A544C] text-base font-sans font-light">
                {data.bioParagraph3}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Writing Philosophy */}
      {data.philosophy && data.philosophy.length > 0 && (
        <section id="philosophy" className="bg-[#F5EFEB] rounded-2xl border border-[#EAE2D8] p-8 sm:p-14 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059]">
              Creative North Star
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1715]">
              The Writing Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {data.philosophy.map((pillar, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-[#EAE2D8] space-y-3">
                <span className="text-xs font-mono text-[#C5A059] block font-bold">
                  0{idx + 1}
                </span>
                <h3 className="font-serif text-xl font-medium text-[#1A1715]">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A544C] leading-relaxed font-sans font-light">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. The Journey Timeline */}
      {data.timeline && data.timeline.length > 0 && (
        <section id="journey" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059]">
              Milestones
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1715]">
              The Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#8C7A65]">
              Key milestones in the path of the written word.
            </p>
          </div>

          <div className="relative border-l border-[#C5A059]/40 ml-4 sm:ml-32 pl-6 sm:pl-10 space-y-12">
            {data.timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[47px] top-0 w-4 h-4 rounded-full bg-[#C5A059] border-4 border-white shadow-sm" />
                <span className="sm:absolute sm:-left-28 sm:top-0 font-serif font-semibold text-sm sm:text-base text-[#8C6D3B] block mb-1 sm:mb-0">
                  {item.year}
                </span>

                <div className="bg-white p-6 rounded-xl border border-[#EAE2D8] hover:border-[#C5A059] transition-all shadow-sm">
                  <h3 className="font-serif text-xl font-medium text-[#1A1715] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A544C] leading-relaxed font-sans font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Beyond Writing */}
      {data.beyondWriting && (
        <section className="bg-white rounded-2xl border border-[#EAE2D8] p-8 sm:p-12 space-y-4">
          <div className="flex items-center space-x-2 text-[#C5A059]">
            <Compass className="w-4 h-4" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold">
              Beyond the Page
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1715]">
            Curiosity &amp; Disciplines
          </h2>
          <p className="text-sm sm:text-base text-[#5A544C] leading-relaxed font-sans font-light pretty-prose max-w-3xl">
            {data.beyondWriting}
          </p>
        </section>
      )}

      {/* 5. Closing CTA */}
      <div className="text-center pt-8 border-t border-[#EAE2D8] space-y-4">
        <h3 className="font-serif text-2xl font-medium text-[#1A1715]">
          {data.ctaHeading || 'Step Into the Stories'}
        </h3>
        <p className="text-xs sm:text-sm text-[#8C7A65]">
          {data.ctaSubheading || 'Explore the catalog or reach out for inquiries, readings, and correspondence.'}
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/books"
            className="px-6 py-3 rounded-full bg-[#1A1715] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold transition-all"
          >
            Explore Books
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full border border-[#EAE2D8] hover:border-[#C5A059] text-[#1A1715] text-xs uppercase tracking-widest font-semibold transition-all"
          >
            Contact the Author
          </Link>
        </div>
      </div>
    </div>
  );
}
