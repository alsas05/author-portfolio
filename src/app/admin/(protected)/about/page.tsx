import React from 'react';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import AboutEditorForm from './AboutEditorForm';
import { DEFAULT_ABOUT_DATA, mergeTimelineWithBooks } from '@/lib/about';

export const revalidate = 0;

export default async function AdminAboutPage() {
  const [setting, books] = await Promise.all([
    prisma.siteSetting.findUnique({
      where: { key: 'about_page_data' },
    }),
    prisma.book.findMany({
      where: { status: { not: 'ARCHIVED' } },
      orderBy: { order: 'asc' },
    }),
  ]);

  let initialData = DEFAULT_ABOUT_DATA;
  if (setting) {
    try {
      initialData = { ...DEFAULT_ABOUT_DATA, ...JSON.parse(setting.value) };
    } catch {
      // Fallback
    }
  }

  // Pre-sync any books from catalog so they are visible and editable in the studio
  initialData.timeline = mergeTimelineWithBooks(initialData.timeline || [], books);

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
