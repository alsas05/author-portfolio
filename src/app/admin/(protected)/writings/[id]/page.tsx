import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import WritingEditorForm from '../WritingEditorForm';

interface EditWritingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWritingPage({ params }: EditWritingPageProps) {
  const { id } = await params;

  const writing = await prisma.writing.findUnique({
    where: { id },
  });

  if (!writing) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title={`Edit: ${writing.title}`}
        subtitle="Refine verses, prose paragraphs, categorization, and publication settings."
      />
      <WritingEditorForm initialWriting={writing} />
    </div>
  );
}
