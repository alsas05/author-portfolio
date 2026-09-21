'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteBlogButton({
  postId,
  postTitle,
}: {
  postId: string;
  postTitle: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete article.');
      }
    } catch {
      alert('Error deleting article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded hover:bg-red-50 text-[#8C7A65] hover:text-red-600 transition-colors"
      title="Delete essay"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
