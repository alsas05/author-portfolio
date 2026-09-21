'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Feather, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@alsas.com');
  const [password, setPassword] = useState('AlsaAuthor2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#12100E] text-[#FAF8F5] p-6">
      <div className="w-full max-w-md bg-[#1A1715] rounded-2xl border border-[#2A2521] p-8 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
        {/* Author Studio Emblem */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#C5A059] flex items-center justify-center text-white mx-auto shadow-md">
            <Feather className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-white tracking-wide">
            ALSA.S
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
            Author Studio Portal
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-xs text-red-300 bg-red-950/50 p-3.5 rounded-lg border border-red-900/60">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A9A59F] font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7F7970] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alsas.com"
                className="w-full pl-10 pr-4 py-3 bg-[#221E1A] border border-[#3A352F] rounded-lg text-sm text-white placeholder-[#7F7970] focus:outline-none focus:border-[#C5A059] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#A9A59F] font-medium mb-2">
              Secret Passphrase
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7F7970] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#221E1A] border border-[#3A352F] rounded-lg text-sm text-white placeholder-[#7F7970] focus:outline-none focus:border-[#C5A059] transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-[#C5A059] hover:bg-[#8C6D3B] text-[#12100E] hover:text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entering Sanctuary...</span>
                </>
              ) : (
                <span>Unlock Author Studio</span>
              )}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-[#2A2521] text-center">
          <p className="text-[11px] text-[#7F7970]">
            Pre-seeded credentials: <span className="text-[#DFC07C]">admin@alsas.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
