'use client';

import React, { useState } from 'react';
import {
  Mail,
  Feather,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { ContactPageData, DEFAULT_CONTACT_DATA } from '@/lib/contact';
import Link from 'next/link';

interface ContactEditorFormProps {
  initialData: ContactPageData;
}

export default function ContactEditorForm({ initialData }: ContactEditorFormProps) {
  const [formData, setFormData] = useState<ContactPageData>(initialData);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status === 'error' || status === 'success') {
      setStatus('idle');
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Reset all Contact page fields to their default literary values? Unsaved changes will be lost.'
      )
    ) {
      setFormData(DEFAULT_CONTACT_DATA);
      setStatus('idle');
      setFeedback('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setFeedback('');

    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFeedback('Contact page content has been successfully updated and published!');
        if (data.contact) {
          setFormData(data.contact);
        }
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to save changes. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setFeedback('A network error occurred while updating the Contact page.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-16">
      {/* Status banner */}
      {status === 'success' && (
        <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <div className="flex-1 font-medium">{feedback}</div>
          <Link
            href="/contact"
            target="_blank"
            className="inline-flex items-center space-x-1.5 text-xs text-emerald-900 font-semibold underline hover:no-underline ml-4"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <div className="flex-1 font-medium">{feedback}</div>
        </div>
      )}

      {/* 1. Header & Quote Section */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#EAE2D8] pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#1A1715] flex items-center space-x-2">
              <Mail className="w-5 h-5 text-[#C5A059]" />
              <span>Page Header &amp; Literary Quote</span>
            </h2>
            <p className="text-xs text-[#5A544C] mt-1 font-sans">
              Define the introductory headline and opening quote greeting your readers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Category Badge
            </label>
            <input
              type="text"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="Correspondence"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Page Heading
            </label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              placeholder="Reach the Author"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Literary Quote / Subtitle
          </label>
          <textarea
            name="quote"
            rows={3}
            value={formData.quote}
            onChange={handleChange}
            placeholder="Letters are slow conversations..."
            className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] font-serif italic"
          />
        </div>
      </div>

      {/* 2. Professional & Rights Inquiries */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#EAE2D8] pb-4">
          <h2 className="font-serif text-xl font-medium text-[#1A1715] flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <span>Professional &amp; Rights Inquiries Card</span>
          </h2>
          <p className="text-xs text-[#5A544C] mt-1 font-sans">
            Information for literary agents, translations, publishers, and speaking engagements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Card Title
            </label>
            <input
              type="text"
              name="rightsTitle"
              value={formData.rightsTitle}
              onChange={handleChange}
              placeholder="Professional & Rights Inquiries"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Agency Contact Email
            </label>
            <input
              type="email"
              name="rightsEmail"
              value={formData.rightsEmail}
              onChange={handleChange}
              placeholder="rights@alsas.com"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Scope &amp; Description
          </label>
          <textarea
            name="rightsDescription"
            rows={2}
            value={formData.rightsDescription}
            onChange={handleChange}
            placeholder="For dramatic rights, foreign translations, anthology permissions..."
            className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Agency / Representation Label
            </label>
            <input
              type="text"
              name="rightsAgencyLabel"
              value={formData.rightsAgencyLabel}
              onChange={handleChange}
              placeholder="Literary Representation:"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Agency Name / Details
            </label>
            <input
              type="text"
              name="rightsAgencyDetails"
              value={formData.rightsAgencyDetails}
              onChange={handleChange}
              placeholder="c/o Veritas & Quill Literary Agency"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>
        </div>
      </div>

      {/* 3. Direct Mail Card */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#EAE2D8] pb-4">
          <h2 className="font-serif text-xl font-medium text-[#1A1715] flex items-center space-x-2">
            <Feather className="w-5 h-5 text-[#C5A059]" />
            <span>Direct Mail Card</span>
          </h2>
          <p className="text-xs text-[#5A544C] mt-1 font-sans">
            Direct correspondence details for readers wishing to write letters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Card Title
            </label>
            <input
              type="text"
              name="directMailTitle"
              value={formData.directMailTitle}
              onChange={handleChange}
              placeholder="Direct Mail"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Direct Mail Email Address
            </label>
            <input
              type="email"
              name="directEmail"
              value={formData.directEmail}
              onChange={handleChange}
              placeholder="correspondence@alsas.com"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Description
          </label>
          <input
            type="text"
            name="directMailDescription"
            value={formData.directMailDescription}
            onChange={handleChange}
            placeholder="Readers wishing to write directly can address:"
            className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
          />
        </div>
      </div>

      {/* 4. Digital Sanctuaries (Social Channels) */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#EAE2D8] pb-4">
          <h2 className="font-serif text-xl font-medium text-[#1A1715] flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-[#C5A059]" />
            <span>Digital Sanctuaries (Social Channels)</span>
          </h2>
          <p className="text-xs text-[#5A544C] mt-1 font-sans">
            Manage links and display handles for your social and literary communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Section Title
            </label>
            <input
              type="text"
              name="socialTitle"
              value={formData.socialTitle}
              onChange={handleChange}
              placeholder="Digital Sanctuaries"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Section Description
            </label>
            <input
              type="text"
              name="socialDescription"
              value={formData.socialDescription}
              onChange={handleChange}
              placeholder="Follow along for visual excerpts..."
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>
        </div>

        {/* Instagram */}
        <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE2D8] space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
            Instagram Channel
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#5A544C] mb-1 font-medium">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/alsas.author"
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5A544C] mb-1 font-medium">
                Display Text / Handle
              </label>
              <input
                type="text"
                name="instagramHandle"
                value={formData.instagramHandle}
                onChange={handleChange}
                placeholder="@alsas.author on Instagram"
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
              />
            </div>
          </div>
        </div>

        {/* X / Twitter */}
        <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE2D8] space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
            X (Twitter) Channel
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#5A544C] mb-1 font-medium">
                X / Twitter URL
              </label>
              <input
                type="url"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleChange}
                placeholder="https://x.com/alsas_writes"
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5A544C] mb-1 font-medium">
                Display Text / Handle
              </label>
              <input
                type="text"
                name="twitterHandle"
                value={formData.twitterHandle}
                onChange={handleChange}
                placeholder="@alsas_writes on X"
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
              />
            </div>
          </div>
        </div>

        {/* Goodreads */}
        <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE2D8] space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
            Goodreads Profile
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#5A544C] mb-1 font-medium">
                Goodreads URL
              </label>
              <input
                type="url"
                name="goodreadsUrl"
                value={formData.goodreadsUrl}
                onChange={handleChange}
                placeholder="https://goodreads.com/alsas"
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#5A544C] mb-1 font-medium">
                Display Text / Handle
              </label>
              <input
                type="text"
                name="goodreadsHandle"
                value={formData.goodreadsHandle}
                onChange={handleChange}
                placeholder="Alsa.S on Goodreads"
                className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-4 z-10 bg-[#1A1715]/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-[#2A2521]">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="flex items-center space-x-2 text-xs text-[#C5A059] hover:text-white px-3 py-2 rounded-lg transition-colors font-sans"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>

        <div className="flex items-center space-x-4">
          <Link
            href="/contact"
            target="_blank"
            className="flex items-center space-x-1.5 text-xs text-[#A9A59F] hover:text-white transition-colors"
          >
            <span>Preview Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="submit"
            disabled={status === 'saving'}
            className="px-6 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#b08e4c] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
          >
            {status === 'saving' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Contact Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
