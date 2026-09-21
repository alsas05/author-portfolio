import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import BlogEditorForm from '../BlogEditorForm';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title={`Edit: ${post.title}`}
        subtitle="Update article content, images, category, and publication status."
      />
      <BlogEditorForm initialPost={post} />
    </div>
  );
}
