import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import BookEditorForm from '../BookEditorForm';

export default function NewBookPage() {
  return (
    <div className="space-y-8">
      <AdminHeader
        title="Add New Book"
        subtitle="Publish a new novel or poetry volume into the author catalog."
      />
      <BookEditorForm />
    </div>
  );
}
