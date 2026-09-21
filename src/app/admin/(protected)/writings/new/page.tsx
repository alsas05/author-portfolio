import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import WritingEditorForm from '../WritingEditorForm';

export default function NewWritingPage() {
  return (
    <div className="space-y-8">
      <AdminHeader
        title="Compose New Creative Piece"
        subtitle="Write a new poem, short story, letter, or reflection for the writing room archive."
      />
      <WritingEditorForm />
    </div>
  );
}
