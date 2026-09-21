'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // anti-spam
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error');
      setFeedback('Please complete all required fields.');
      return;
    }

    setStatus('submitting');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFeedback(
          data.message || 'Your message has been sent. Thank you for reaching out.'
        );
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          honeypot: '',
        });
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to deliver message. Please try again.');
      }
    } catch {
      setStatus('error');
      setFeedback('A network error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 sm:p-12 shadow-sm">
      {status === 'success' ? (
        <div className="py-12 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-[#FAF6EB] text-[#C5A059] flex items-center justify-center mx-auto border border-[#C5A059]/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#1A1715]">
            Message Received
          </h3>
          <p className="text-sm text-[#5A544C] max-w-md mx-auto leading-relaxed">
            {feedback}
          </p>
          <div className="pt-4">
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-2.5 rounded-full bg-[#1A1715] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold transition-all"
            >
              Send Another Note
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot for bot traps */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              value={formData.honeypot}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2"
              >
                Your Name <span className="text-[#C5A059]">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Eleanor Vance"
                className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2"
              >
                Your Email <span className="text-[#C5A059]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="eleanor@example.com"
                className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2"
            >
              Subject <span className="text-[#C5A059]">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="Reading inquiry, book club note, or correspondence..."
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2"
            >
              Message <span className="text-[#C5A059]">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your note to Alsa.S..."
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] transition-colors resize-y font-serif"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1A1715] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
