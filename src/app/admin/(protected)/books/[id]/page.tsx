import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import BookEditorForm from '../BookEditorForm';

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id },
    include: { purchaseLinks: true },
  });

  if (!book) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title={`Edit: ${book.title}`}
        subtitle="Update book details, cover artwork, excerpts, and external purchase links."
      />
      <BookEditorForm initialBook={book} />
    </div>
  );
}
