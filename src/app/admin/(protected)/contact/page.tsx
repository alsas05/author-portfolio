import React from 'react';
import { prisma } from '@/lib/prisma';
import { DEFAULT_CONTACT_DATA, ContactPageData } from '@/lib/contact';
import ContactEditorForm from './ContactEditorForm';

export const dynamic = 'force-dynamic';

export default async function AdminContactPage() {
  let initialData: ContactPageData = DEFAULT_CONTACT_DATA;

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'contact_page_data' },
    });

    if (setting) {
      initialData = { ...DEFAULT_CONTACT_DATA, ...JSON.parse(setting.value) };
    }
  } catch (err) {
    console.error('Error preloading contact settings in admin:', err);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-[#1A1715]">
          Contact Page Content
        </h1>
        <p className="text-xs sm:text-sm text-[#5A544C] mt-1 font-sans">
          Manage header text, literary agency representation, direct correspondence address, and social links.
        </p>
      </div>

      <ContactEditorForm initialData={initialData} />
    </div>
  );
}
