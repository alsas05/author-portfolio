'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface WritingEditorProps {
  initialWriting?: {
    id: string;
    title: string;
    category: string;
    content: string;
    excerpt: string;
    coverImage?: string | null;
    tags?: string | null;
    published: boolean;
    publishedAt?: Date | string | null;
  };
}

const CATEGORIES = [
  'Poetry',
  'Short Stories',
  'Excerpts',
  'Letters',
  'Reflections',
];

export default function WritingEditorForm({ initialWriting }: WritingEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialWriting?.id);

  const [formData, setFormData] = useState({
    title: initialWriting?.title || '',
    category: initialWriting?.category || 'Poetry',
    publishedAt: initialWriting?.publishedAt
      ? new Date(initialWriting.publishedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    excerpt: initialWriting?.excerpt || '',
    content: initialWriting?.content || '',
    coverImage: initialWriting?.coverImage || '',
    tags: initialWriting?.tags || '',
    published: initialWriting ? initialWriting.published : true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing
        ? `/api/admin/writings/${initialWriting?.id}`
        : '/api/admin/writings';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/writings');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save piece.');
      }
    } catch {
      setError('An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#EAE2D8]">
        <Link
          href="/admin/writings"
          className="text-xs uppercase tracking-wider text-[#8C7A65] hover:text-[#1A1715] flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Cancel &amp; Return</span>
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#8C6D3B] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Piece...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Piece' : 'Publish Piece'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Tonight, Everything Glows"
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Date of Submission *
            </label>
            <input
              type="date"
              required
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Short Card Excerpt
          </label>
          <textarea
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="A single poetic line or brief synopsis..."
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Literary Content (Poetry verses or prose) *
          </label>
          <textarea
            required
            rows={14}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write poem stanzas or story paragraphs..."
            className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] font-serif leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Night, Rain, Stillness"
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="flex items-center pt-6 space-x-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-[#C5A059] rounded border-[#EAE2D8]"
            />
            <label htmlFor="published" className="text-xs uppercase tracking-wider text-[#1A1715] font-semibold">
              Published Live in Archive
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
