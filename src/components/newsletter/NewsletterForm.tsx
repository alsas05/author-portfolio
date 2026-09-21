'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'light' | 'dark';
}

export default function NewsletterForm({ variant = 'light' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing to Letters from Alsa.S.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Unable to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('A network error occurred. Please try again later.');
    }
  };

  const isDark = variant === 'dark';

  return (
    <div className="w-full">
      {status === 'success' ? (
        <div className={`flex items-center space-x-3 p-4 rounded-md ${
          isDark ? 'bg-[#2E2822] text-[#DFC07C] border border-[#C5A059]/40' : 'bg-[#FAF6EB] text-[#8C6D3B] border border-[#C5A059]/30'
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#C5A059]" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="Enter your email address..."
              required
              disabled={status === 'loading'}
              className={`flex-1 px-4 py-3 rounded-md text-sm transition-all outline-none ${
                isDark
                  ? 'bg-[#1A1715] text-[#FAF8F5] placeholder-[#7F7970] border border-[#3A352F] focus:border-[#C5A059]'
                  : 'bg-white text-[#1A1715] placeholder-[#8C7A65] border border-[#EAE2D8] focus:border-[#C5A059] shadow-sm'
              }`}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-md bg-[#C5A059] hover:bg-[#8C6D3B] text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </div>

          {status === 'error' && (
            <div className="flex items-center space-x-2 text-xs text-red-500 pt-1">
              <AlertCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
