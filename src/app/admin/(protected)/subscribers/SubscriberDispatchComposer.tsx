'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  Feather,
  Presentation,
  BookOpen,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Users,
  Mail,
  FileText,
  X,
  Settings,
} from 'lucide-react';

interface SubscriberDispatchComposerProps {
  activeCount: number;
  onDispatchSuccess?: () => void;
  onOpenSettings?: () => void;
}

type MessageType = 'LETTER' | 'DECK' | 'ANNOUNCEMENT' | 'EXCERPT';

export default function SubscriberDispatchComposer({
  activeCount,
  onDispatchSuccess,
  onOpenSettings,
}: SubscriberDispatchComposerProps) {
  const [subject, setSubject] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('LETTER');
  const [content, setContent] = useState('');
  const [attachDeck, setAttachDeck] = useState(false);
  const [deckTitle, setDeckTitle] = useState('');
  const [deckUrl, setDeckUrl] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [audience, setAudience] = useState<'ALL' | 'TEST'>('ALL');
  const [testEmail, setTestEmail] = useState('');

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');
  const [isSmtpConfigured, setIsSmtpConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/admin/subscribers/smtp')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.config) {
          setIsSmtpConfigured(data.config.isConfigured);
        }
      })
      .catch(() => setIsSmtpConfigured(false));
  }, []);

  const handleTypeSelect = (type: MessageType) => {
    setMessageType(type);
    if (type === 'DECK') {
      setAttachDeck(true);
      if (!subject) setSubject('Exclusive Reading Deck & Visual Lookbook');
    } else if (type === 'EXCERPT') {
      if (!subject) setSubject('An Early Excerpt from the Study');
    } else if (type === 'ANNOUNCEMENT') {
      if (!subject) setSubject('Important Announcement regarding Upcoming Works');
    }
  };

  const handleSend = async () => {
    setIsConfirmOpen(false);
    setStatus('sending');
    setFeedback('');

    try {
      const res = await fetch('/api/admin/subscribers/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          messageType,
          content,
          deckTitle: attachDeck ? deckTitle : null,
          deckUrl: attachDeck ? deckUrl : null,
          deckDescription: attachDeck ? deckDescription : null,
          audience,
          testEmail: audience === 'TEST' ? testEmail : null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFeedback(data.message || 'Dispatch has been successfully delivered!');
        // Reset form
        setSubject('');
        setContent('');
        setDeckTitle('');
        setDeckUrl('');
        setDeckDescription('');
        setAttachDeck(false);
        if (onDispatchSuccess) {
          onDispatchSuccess();
        }
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to dispatch message. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setFeedback('A network error occurred while dispatching the message.');
    }
  };

  const canSubmit =
    subject.trim() !== '' &&
    content.trim() !== '' &&
    (!attachDeck || deckUrl.trim() !== '') &&
    (audience !== 'TEST' || (testEmail.trim() !== '' && testEmail.includes('@')));

  return (
    <div className="space-y-8">
      {status === 'success' && (
        <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <div className="flex-1 font-medium">{feedback}</div>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs uppercase tracking-wider text-emerald-900 font-semibold underline hover:no-underline"
          >
            Compose Another
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <div className="flex-1 font-medium">{feedback}</div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 space-y-8 shadow-sm">
        {/* Gmail Delivery Status Bar */}
        <div className="p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5] border-[#EAE2D8]">
          <div className="flex items-center space-x-2.5">
            <Mail className="w-4 h-4 text-[#C5A059]" />
            <div>
              <div className="text-xs font-semibold text-[#1A1715] flex items-center space-x-2">
                <span>Real Gmail Delivery:</span>
                <span
                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isSmtpConfigured
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSmtpConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span>{isSmtpConfigured ? 'Active & Ready' : 'Setup Required'}</span>
                </span>
              </div>
              <p className="text-[11px] text-[#8C7A65] mt-0.5">
                {isSmtpConfigured
                  ? 'Dispatches will be delivered straight into your readers’ real Gmail inboxes.'
                  : 'To send real emails to your subscribers’ Gmail, enter your Gmail & 16-character App Password in Settings.'}
              </p>
            </div>
          </div>

          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#EAE2D8] hover:border-[#C5A059] text-xs font-semibold text-[#5A544C] hover:text-[#1A1715] bg-white transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isSmtpConfigured ? 'Manage Gmail' : 'Configure Gmail Now'}</span>
            </button>
          )}
        </div>

        {/* Step 1: Category Selector */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-3">
            1. Select Dispatch Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => handleTypeSelect('LETTER')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                messageType === 'LETTER'
                  ? 'border-[#C5A059] bg-[#FAF6EB] text-[#1A1715] shadow-sm'
                  : 'border-[#EAE2D8] hover:border-[#C5A059]/50 text-[#5A544C]'
              }`}
            >
              <Feather className="w-5 h-5 text-[#C5A059]" />
              <div>
                <span className="font-serif font-medium block text-sm">Author Note</span>
                <span className="text-[11px] text-[#8C7A65]">Personal literary letter</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeSelect('DECK')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                messageType === 'DECK'
                  ? 'border-[#C5A059] bg-[#FAF6EB] text-[#1A1715] shadow-sm'
                  : 'border-[#EAE2D8] hover:border-[#C5A059]/50 text-[#5A544C]'
              }`}
            >
              <Presentation className="w-5 h-5 text-[#C5A059]" />
              <div>
                <span className="font-serif font-medium block text-sm">Presentation Deck</span>
                <span className="text-[11px] text-[#8C7A65]">Lookbook, slides, or PDF</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeSelect('ANNOUNCEMENT')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                messageType === 'ANNOUNCEMENT'
                  ? 'border-[#C5A059] bg-[#FAF6EB] text-[#1A1715] shadow-sm'
                  : 'border-[#EAE2D8] hover:border-[#C5A059]/50 text-[#5A544C]'
              }`}
            >
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <div>
                <span className="font-serif font-medium block text-sm">Announcement</span>
                <span className="text-[11px] text-[#8C7A65]">Launch or tour news</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeSelect('EXCERPT')}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                messageType === 'EXCERPT'
                  ? 'border-[#C5A059] bg-[#FAF6EB] text-[#1A1715] shadow-sm'
                  : 'border-[#EAE2D8] hover:border-[#C5A059]/50 text-[#5A544C]'
              }`}
            >
              <BookOpen className="w-5 h-5 text-[#C5A059]" />
              <div>
                <span className="font-serif font-medium block text-sm">Early Excerpt</span>
                <span className="text-[11px] text-[#8C7A65]">Sneak peek or chapter</span>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Target Audience */}
        <div className="border-t border-[#EAE2D8] pt-6">
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-3">
            2. Recipient Audience
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                audience === 'ALL'
                  ? 'border-[#C5A059] bg-[#FAF6EB]/70'
                  : 'border-[#EAE2D8] hover:bg-[#FAF8F5]'
              }`}
            >
              <input
                type="radio"
                name="audience"
                checked={audience === 'ALL'}
                onChange={() => setAudience('ALL')}
                className="mt-1 text-[#C5A059] focus:ring-[#C5A059]"
              />
              <div>
                <span className="text-sm font-medium text-[#1A1715] flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#C5A059]" />
                  <span>All Active Subscribers</span>
                </span>
                <span className="text-xs text-[#8C7A65] block mt-0.5">
                  Delivers to all {activeCount} subscribed readers.
                </span>
              </div>
            </label>

            <label
              className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                audience === 'TEST'
                  ? 'border-[#C5A059] bg-[#FAF6EB]/70'
                  : 'border-[#EAE2D8] hover:bg-[#FAF8F5]'
              }`}
            >
              <input
                type="radio"
                name="audience"
                checked={audience === 'TEST'}
                onChange={() => setAudience('TEST')}
                className="mt-1 text-[#C5A059] focus:ring-[#C5A059]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-[#1A1715] flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#C5A059]" />
                  <span>Send Test Email</span>
                </span>
                <span className="text-xs text-[#8C7A65] block mt-0.5">
                  Send a single preview copy to yourself before mass sending.
                </span>
              </div>
            </label>
          </div>

          {audience === 'TEST' && (
            <div className="mt-3 animate-fadeIn">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter test email address (e.g. author@example.com)"
                className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
              />
            </div>
          )}
        </div>

        {/* Step 3: Subject & Letter Content */}
        <div className="border-t border-[#EAE2D8] pt-6 space-y-6">
          <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold">
            3. Letter &amp; Subject Details
          </label>

          <div>
            <label className="block text-xs text-[#5A544C] mb-1 font-medium">
              Subject Line <span className="text-[#C5A059]">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., A slow November note, and an early look at Like the Moon to the Tide..."
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] font-serif font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs text-[#5A544C] font-medium">
                Message Body <span className="text-[#C5A059]">*</span>
              </label>
              <span className="text-[11px] text-[#8C7A65] font-mono">
                Paragraph breaks will be preserved
              </span>
            </div>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Dearest Reader,\n\nWriting to you this evening as the rain tapers off along the slate roofs. I wanted to share a few quiet thoughts and an early presentation deck that traces the architecture of my next book...\n\nWith gratitude,\nAlsa.S`}
              className="w-full px-4 py-3.5 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] font-serif leading-relaxed"
            />
          </div>
        </div>

        {/* Step 4: Deck & Materials Attachment */}
        <div className="border-t border-[#EAE2D8] pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Presentation className="w-5 h-5 text-[#C5A059]" />
              <span className="text-xs uppercase tracking-wider text-[#5A544C] font-semibold">
                4. Presentation Deck / Reading Material
              </span>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={attachDeck}
                onChange={(e) => setAttachDeck(e.target.checked)}
                className="rounded border-[#EAE2D8] text-[#C5A059] focus:ring-[#C5A059]"
              />
              <span className="text-xs font-medium text-[#1A1715]">
                Attach a Deck or Link
              </span>
            </label>
          </div>

          {attachDeck && (
            <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#EAE2D8] space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#5A544C] mb-1 font-medium">
                    Deck Title / Document Name <span className="text-[#C5A059]">*</span>
                  </label>
                  <input
                    type="text"
                    value={deckTitle}
                    onChange={(e) => setDeckTitle(e.target.value)}
                    placeholder="e.g. Chronicles of Heart — Aesthetic Lookbook & Reader Deck"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#5A544C] mb-1 font-medium">
                    Deck URL (Slides / PDF / Drive / Canva) <span className="text-[#C5A059]">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={deckUrl}
                      onChange={(e) => setDeckUrl(e.target.value)}
                      placeholder="https://slides.google.com/... or https://canva.com/..."
                      className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] font-mono"
                    />
                    {deckUrl && (
                      <a
                        href={deckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-white border border-[#EAE2D8] hover:border-[#C5A059] rounded-lg text-xs text-[#C5A059] flex items-center justify-center transition-colors"
                        title="Test deck URL in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#5A544C] mb-1 font-medium">
                  Deck Overview / Reader Note (Optional)
                </label>
                <input
                  type="text"
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  placeholder="e.g., An 18-slide visual presentation featuring setting inspirations, mood board photography, and early verse drafts."
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="border-t border-[#EAE2D8] pt-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-[#EAE2D8] hover:border-[#C5A059] text-xs uppercase tracking-wider font-semibold text-[#5A544C] hover:text-[#1A1715] transition-colors"
          >
            <Eye className="w-4 h-4 text-[#C5A059]" />
            <span>Preview Email Letter</span>
          </button>

          <button
            type="button"
            disabled={!canSubmit || status === 'sending'}
            onClick={() => setIsConfirmOpen(true)}
            className="px-8 py-3 rounded-xl bg-[#1A1715] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center space-x-2 disabled:opacity-40"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>
                  {audience === 'ALL'
                    ? `Dispatch to ${activeCount} Reader${activeCount === 1 ? '' : 's'}`
                    : 'Send Test Dispatch'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 max-w-md w-full space-y-6 shadow-2xl animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-[#FAF6EB] text-[#C5A059] flex items-center justify-center mx-auto border border-[#C5A059]/30">
              <Send className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif text-2xl font-medium text-[#1A1715]">
                Confirm Dispatch
              </h3>
              <p className="text-xs text-[#5A544C] leading-relaxed">
                {audience === 'ALL'
                  ? `Are you sure you want to broadcast this message to all ${activeCount} active newsletter subscribers?`
                  : `Are you ready to send a test copy to ${testEmail}?`}
              </p>
            </div>

            <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#EAE2D8] text-xs space-y-1.5 font-sans">
              <p className="text-[#8C7A65]">
                <strong className="text-[#1A1715]">Subject:</strong> {subject}
              </p>
              <p className="text-[#8C7A65]">
                <strong className="text-[#1A1715]">Type:</strong> {messageType}
              </p>
              {attachDeck && (
                <p className="text-[#8C7A65]">
                  <strong className="text-[#1A1715]">Deck Attached:</strong>{' '}
                  {deckTitle || 'Custom Deck Link'}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#EAE2D8] text-xs font-semibold text-[#5A544C] hover:bg-[#FAF8F5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#b08e4c] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE2D8] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 bg-white border-b border-[#EAE2D8] flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-[#C5A059]">
                <Eye className="w-4 h-4" />
                <span>Subscriber Email Preview</span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-lg text-[#8C7A65] hover:text-[#1A1715] hover:bg-[#FAF8F5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Email Envelope */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-8">
              <div className="max-w-xl mx-auto bg-white rounded-xl border border-[#EAE2D8] p-8 sm:p-10 shadow-sm space-y-8">
                {/* Header Branding */}
                <div className="text-center space-y-2 border-b border-[#EAE2D8] pb-6">
                  <div className="w-8 h-8 rounded-full bg-[#1A1715] text-[#C5A059] flex items-center justify-center mx-auto">
                    <Feather className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg tracking-widest font-semibold text-[#1A1715]">
                    ALSA.S
                  </h4>
                  <p className="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-sans">
                    Letters from the Studio
                  </p>
                </div>

                {/* Subject Preview */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#8C7A65] mb-1 font-sans">
                    Subject Line
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#1A1715]">
                    {subject || 'No Subject Defined Yet'}
                  </h3>
                </div>

                {/* Email Body */}
                <div className="font-serif text-sm text-[#3A3531] leading-relaxed space-y-4 whitespace-pre-wrap">
                  {content ||
                    'Dearest Reader,\n\nYour formatted letter text will appear here with literary cadence and natural line breaks...'}
                </div>

                {/* Deck Card (if attached) */}
                {attachDeck && (
                  <div className="p-6 bg-[#FAF6EB] rounded-xl border border-[#EAE2D8] space-y-4">
                    <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-[#C5A059]">
                      <Presentation className="w-4 h-4" />
                      <span>Attached Presentation Deck</span>
                    </div>

                    <h4 className="font-serif text-lg font-medium text-[#1A1715]">
                      {deckTitle || 'Presentation & Lookbook'}
                    </h4>

                    {deckDescription && (
                      <p className="text-xs text-[#5A544C] leading-relaxed font-sans">
                        {deckDescription}
                      </p>
                    )}

                    <div className="pt-2">
                      <a
                        href={deckUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1A1715] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold transition-colors"
                      >
                        <span>Open Presentation Deck</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Signature */}
                <div className="pt-4 border-t border-[#EAE2D8] font-serif italic text-sm text-[#5A544C]">
                  <p>With quiet devotion,</p>
                  <p className="text-[#1A1715] font-normal not-italic font-serif text-base mt-1">
                    Alsa.S
                  </p>
                </div>
              </div>

              {/* Unsubscribe Footer Simulation */}
              <div className="text-center text-[10px] text-[#8C7A65] space-y-1 font-sans">
                <p>
                  You received this dispatch because you subscribed to &lsquo;Letters from Alsa.S&rsquo;.
                </p>
                <p className="underline hover:text-[#1A1715] cursor-pointer">
                  Unsubscribe from this list
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
