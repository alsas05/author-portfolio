'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface PhilosophyPillar {
  title: string;
  description: string;
}

interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
}

interface AboutData {
  portraitImage: string;
  portraitCaption: string;
  tagline: string;
  heading: string;
  bioParagraph1: string;
  bioParagraph2: string;
  bioParagraph3: string;
  philosophy: PhilosophyPillar[];
  timeline: TimelineMilestone[];
  beyondWriting: string;
  ctaHeading: string;
  ctaSubheading: string;
}

export default function AboutEditorForm({ initialData }: { initialData: AboutData }) {
  const router = useRouter();
  const [formData, setFormData] = useState<AboutData>(initialData);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Philosophy handlers
  const updatePhilosophy = (index: number, field: keyof PhilosophyPillar, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.philosophy];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, philosophy: updated };
    });
  };

  // Timeline handlers
  const addTimelineMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        { year: new Date().getFullYear().toString(), title: 'New Milestone', description: '' },
      ],
    }));
  };

  const removeTimelineMilestone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const updateTimelineMilestone = (
    index: number,
    field: keyof TimelineMilestone,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.timeline];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, timeline: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('About page changes saved and published successfully!');
        router.refresh();
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to save changes.');
      }
    } catch {
      setStatus('error');
      setMessage('A network error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl">
      {/* Action Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#EAE2D8]">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#1A1715]">
            Edit About Page Content
          </h2>
          <p className="text-xs text-[#8C7A65] mt-1">
            Modify author biography, writing philosophy, milestone timeline, and portrait.
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#8C6D3B] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish</span>
            </>
          )}
        </button>
      </div>

      {status === 'success' && (
        <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* 1. Portrait & Author Headline */}
      <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <h3 className="font-serif text-xl font-medium text-[#1A1715] border-b border-[#EAE2D8] pb-3">
          1. Author Portrait &amp; Headers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Author Portrait Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.portraitImage}
              onChange={(e) => setFormData({ ...formData, portraitImage: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Image Caption
            </label>
            <input
              type="text"
              value={formData.portraitCaption}
              onChange={(e) => setFormData({ ...formData, portraitCaption: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Tagline Pill
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Main Page Heading
            </label>
            <input
              type="text"
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>

      {/* 2. Biography Paragraphs */}
      <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <h3 className="font-serif text-xl font-medium text-[#1A1715] border-b border-[#EAE2D8] pb-3">
          2. Biography Narrative
        </h3>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Paragraph 1 (Introduction &amp; Atmosphere) *
          </label>
          <textarea
            required
            rows={3}
            value={formData.bioParagraph1}
            onChange={(e) => setFormData({ ...formData, bioParagraph1: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] font-serif leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Paragraph 2 (Study, Desk &amp; Intent)
          </label>
          <textarea
            rows={3}
            value={formData.bioParagraph2}
            onChange={(e) => setFormData({ ...formData, bioParagraph2: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] font-serif leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Paragraph 3 (Reader Connection)
          </label>
          <textarea
            rows={3}
            value={formData.bioParagraph3}
            onChange={(e) => setFormData({ ...formData, bioParagraph3: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] font-serif leading-relaxed"
          />
        </div>
      </div>

      {/* 3. Writing Philosophy */}
      <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <h3 className="font-serif text-xl font-medium text-[#1A1715] border-b border-[#EAE2D8] pb-3">
          3. The Writing Philosophy (3 Pillars)
        </h3>

        <div className="space-y-4">
          {formData.philosophy.map((pillar, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-[#FAF8F5] border border-[#EAE2D8] space-y-3">
              <span className="text-[10px] uppercase font-mono font-bold text-[#C5A059]">
                Pillar 0{idx + 1}
              </span>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8C7A65] font-semibold mb-1">
                  Pillar Title
                </label>
                <input
                  type="text"
                  value={pillar.title}
                  onChange={(e) => updatePhilosophy(idx, 'title', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#EAE2D8] rounded focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#8C7A65] font-semibold mb-1">
                  Pillar Description
                </label>
                <textarea
                  rows={2}
                  value={pillar.description}
                  onChange={(e) => updatePhilosophy(idx, 'description', e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. The Journey Milestones Timeline */}
      <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#EAE2D8] pb-3">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1A1715]">
              4. The Journey Milestones
            </h3>
            <p className="text-xs text-[#8C7A65]">
              Add, edit, or reorder significant milestones in the author&apos;s literary career.
            </p>
          </div>
          <button
            type="button"
            onClick={addTimelineMilestone}
            className="px-3.5 py-1.5 rounded-md bg-[#FAF6EB] text-[#8C6D3B] border border-[#C5A059]/40 hover:bg-[#C5A059] hover:text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.timeline.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[#FAF8F5] border border-[#EAE2D8] space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="w-32">
                  <label className="block text-[10px] uppercase tracking-wider text-[#8C7A65] font-semibold mb-1">
                    Year / Era
                  </label>
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => updateTimelineMilestone(idx, 'year', e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#EAE2D8] rounded focus:outline-none focus:border-[#C5A059] font-semibold text-[#8C6D3B]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTimelineMilestone(idx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  title="Remove milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8C7A65] font-semibold mb-1">
                  Milestone Title
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateTimelineMilestone(idx, 'title', e.target.value)}
                  placeholder="Milestone headline..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded focus:outline-none focus:border-[#C5A059] font-medium text-[#1A1715]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8C7A65] font-semibold mb-1">
                  Milestone Narrative
                </label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => updateTimelineMilestone(idx, 'description', e.target.value)}
                  placeholder="Description of the milestone..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#EAE2D8] rounded focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Beyond Writing & Closing */}
      <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <h3 className="font-serif text-xl font-medium text-[#1A1715] border-b border-[#EAE2D8] pb-3">
          5. Beyond Writing &amp; Bottom Callout
        </h3>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
            Beyond the Page / Curiosities
          </label>
          <textarea
            rows={3}
            value={formData.beyondWriting}
            onChange={(e) => setFormData({ ...formData, beyondWriting: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] font-sans"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Closing CTA Title
            </label>
            <input
              type="text"
              value={formData.ctaHeading}
              onChange={(e) => setFormData({ ...formData, ctaHeading: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Closing CTA Subtitle
            </label>
            <input
              type="text"
              value={formData.ctaSubheading}
              onChange={(e) => setFormData({ ...formData, ctaSubheading: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
