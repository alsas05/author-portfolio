import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import BlogEditorForm from '../BlogEditorForm';

export default function NewBlogPage() {
  return (
    <div className="space-y-8">
      <AdminHeader
        title="Compose New Journal Article"
        subtitle="Publish long-form thoughts, writing advice, or behind-the-scenes essays."
      />
      <BlogEditorForm />
    </div>
  );
}
