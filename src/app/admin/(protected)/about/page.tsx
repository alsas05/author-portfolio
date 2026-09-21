import React from 'react';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import AboutEditorForm from './AboutEditorForm';
import { DEFAULT_ABOUT_DATA } from '@/lib/about';

export const revalidate = 0;

export default async function AdminAboutPage() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'about_page_data' },
  });

  let initialData = DEFAULT_ABOUT_DATA;
  if (setting) {
    try {
      initialData = { ...DEFAULT_ABOUT_DATA, ...JSON.parse(setting.value) };
    } catch {
      // Fallback
    }
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="About Page Studio"
        subtitle="Manage the author's biography, portrait photography, philosophy, and journey timeline."
      />
      <AboutEditorForm initialData={initialData} />
    </div>
  );
}
