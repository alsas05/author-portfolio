'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2, ArrowLeft, ExternalLink, Save } from 'lucide-react';
import Link from 'next/link';

interface PurchaseLinkItem {
  id?: string;
  platform: string;
  displayName: string;
  url: string;
  region?: string | null;
}

interface BookEditorProps {
  initialBook?: {
    id: string;
    title: string;
    subtitle?: string | null;
    genre: string;
    description: string;
    synopsis: string;
    excerpt?: string | null;
    authorNote?: string | null;
    coverImage: string;
    publisher?: string | null;
    publicationDate?: string | null;
    isbn?: string | null;
    pageCount?: number | null;
    language?: string | null;
    format?: string | null;
    status: string;
    featured: boolean;
    purchaseLinks?: PurchaseLinkItem[];
  };
}

export default function BookEditorForm({ initialBook }: BookEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialBook?.id);

  const [formData, setFormData] = useState({
    title: initialBook?.title || '',
    subtitle: initialBook?.subtitle || '',
    genre: initialBook?.genre || 'Literary Fiction',
    description: initialBook?.description || '',
    synopsis: initialBook?.synopsis || '',
    excerpt: initialBook?.excerpt || '',
    authorNote: initialBook?.authorNote || '',
    coverImage:
      initialBook?.coverImage ||
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1000&auto=format&fit=crop',
    publisher: initialBook?.publisher || 'Veritas & Quill Press',
    publicationDate: initialBook?.publicationDate || '',
    isbn: initialBook?.isbn || '',
    pageCount: initialBook?.pageCount?.toString() || '',
    language: initialBook?.language || 'English',
    format: initialBook?.format || 'Hardcover, Paperback',
    status: initialBook?.status || 'PUBLISHED',
    featured: initialBook?.featured || false,
  });

  const [purchaseLinks, setPurchaseLinks] = useState<PurchaseLinkItem[]>(
    initialBook?.purchaseLinks?.length
      ? initialBook.purchaseLinks
      : [
          {
            platform: 'Amazon',
            displayName: 'Buy on Amazon',
            url: 'https://amazon.com',
            region: 'Global',
          },
        ]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addPurchaseLink = () => {
    setPurchaseLinks((prev) => [
      ...prev,
      { platform: '', displayName: '', url: '', region: 'Global' },
    ]);
  };

  const removePurchaseLink = (index: number) => {
    setPurchaseLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePurchaseLink = (
    index: number,
    field: keyof PurchaseLinkItem,
    value: string
  ) => {
    setPurchaseLinks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        purchaseLinks,
      };

      const url = isEditing
        ? `/api/admin/books/${initialBook?.id}`
        : '/api/admin/books';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/books');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save book.');
      }
    } catch {
      setError('An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-[#EAE2D8]">
        <Link
          href="/admin/books"
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
              <span>Saving Book...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Book' : 'Publish Book'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs">
          {error}
        </div>
      )}

      {/* Core Book Information */}
      <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <h3 className="font-serif text-xl font-medium text-[#1A1715] border-b border-[#EAE2D8] pb-3">
          1. Title &amp; Genre
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Book Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Subtitle / Tagline
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Genre *
            </label>
            <input
              type="text"
              required
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            >
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="UPCOMING">UPCOMING</option>
            </select>
          </div>

          <div className="flex items-center pt-6 space-x-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-[#C5A059] rounded border-[#EAE2D8]"
            />
            <label htmlFor="featured" className="text-xs uppercase tracking-wider text-[#1A1715] font-semibold">
              Featured on Homepage
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Cover Artwork Image URL *
          </label>
          <input
            type="url"
            required
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Narrative & Excerpt */}
      <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <h3 className="font-serif text-xl font-medium text-[#1A1715] border-b border-[#EAE2D8] pb-3">
          2. Synopsis &amp; Literary Excerpt
        </h3>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Short Card Description *
          </label>
          <textarea
            required
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Full Synopsis *
          </label>
          <textarea
            required
            rows={5}
            value={formData.synopsis}
            onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Reading Passage / Excerpt
          </label>
          <textarea
            rows={6}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Passage from the book for reader preview..."
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] font-serif"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Author&apos;s Note (Optional)
          </label>
          <textarea
            rows={3}
            value={formData.authorNote}
            onChange={(e) => setFormData({ ...formData, authorNote: e.target.value })}
            placeholder="Reflections on writing the piece..."
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] font-serif"
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <h3 className="font-serif text-xl font-medium text-[#1A1715] border-b border-[#EAE2D8] pb-3">
          3. Publication Metadata
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Publisher
            </label>
            <input
              type="text"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Publication Date
            </label>
            <input
              type="text"
              value={formData.publicationDate}
              onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
              placeholder="e.g. October 14, 2024"
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              ISBN
            </label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              placeholder="978-..."
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Page Count
            </label>
            <input
              type="number"
              value={formData.pageCount}
              onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Language
            </label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Formats
            </label>
            <input
              type="text"
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>

      {/* Where to Buy Links Manager */}
      <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1A1715]">
              4. Where to Buy Links
            </h3>
            <p className="text-xs text-[#8C7A65]">
              Add external purchase links for verified retailers and distributors.
            </p>
          </div>
          <button
            type="button"
            onClick={addPurchaseLink}
            className="px-3.5 py-1.5 rounded-md bg-[#FAF6EB] text-[#8C6D3B] border border-[#C5A059]/40 hover:bg-[#C5A059] hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Retailer</span>
          </button>
        </div>

        <div className="space-y-4">
          {purchaseLinks.map((link, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[#FAF8F5] border border-[#EAE2D8] grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
            >
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8C7A65] font-semibold mb-1">
                  Platform
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amazon, Waterstones"
                  value={link.platform}
                  onChange={(e) => updatePurchaseLink(idx, 'platform', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8C7A65] font-semibold mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Buy on Amazon"
                  value={link.displayName}
                  onChange={(e) => updatePurchaseLink(idx, 'displayName', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8C7A65] font-semibold mb-1">
                  External Purchase URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => updatePurchaseLink(idx, 'url', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#8C7A65] font-semibold mb-1">
                    Region
                  </label>
                  <input
                    type="text"
                    placeholder="Global, US, UK"
                    value={link.region || ''}
                    onChange={(e) => updatePurchaseLink(idx, 'region', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePurchaseLink(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                  title="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
