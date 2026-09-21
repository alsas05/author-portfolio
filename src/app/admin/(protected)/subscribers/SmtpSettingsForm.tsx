'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  ShieldCheck,
  Save,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Key,
} from 'lucide-react';

export default function SmtpSettingsForm() {
  const [formData, setFormData] = useState({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    user: '',
    pass: '',
    fromName: 'Alsa.S',
    fromEmail: '',
  });

  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testRecipient, setTestRecipient] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/subscribers/smtp');
      const data = await res.json();
      if (res.ok && data.config) {
        setFormData({
          host: data.config.host || 'smtp.gmail.com',
          port: data.config.port || 465,
          secure: data.config.secure !== undefined ? data.config.secure : true,
          user: data.config.user || '',
          pass: data.config.pass || '',
          fromName: data.config.fromName || 'Alsa.S',
          fromEmail: data.config.fromEmail || '',
        });
        setIsConfigured(data.config.isConfigured);
        if (data.config.user && !testRecipient) {
          setTestRecipient(data.config.user);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setStatusMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/subscribers/smtp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: data.message });
        setIsConfigured(Boolean(formData.user && formData.pass));
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save settings.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'A network error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!testRecipient || !testRecipient.includes('@')) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid email address to receive the test message.',
      });
      return;
    }

    setTesting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/subscribers/smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testRecipient }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: data.message });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Test email failed to send.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Network error while testing connection.' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#8C7A65]">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C5A059]" />
        <span>Loading email configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {statusMessage && (
        <div
          className={`flex items-center space-x-3 p-4 rounded-xl text-sm animate-fadeIn border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          )}
          <div className="flex-1 font-medium">{statusMessage.text}</div>
        </div>
      )}

      {/* Gmail Configuration Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#EAE2D8] pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1A1715] flex items-center space-x-2">
              <Mail className="w-5 h-5 text-[#C5A059]" />
              <span>Gmail &amp; Real Email Delivery Settings</span>
            </h3>
            <p className="text-xs text-[#5A544C] mt-1">
              Configure your Gmail account so that when you compose dispatches, they are sent directly to your subscribers&rsquo; Gmail inboxes.
            </p>
          </div>

          <div>
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>{isConfigured ? 'Gmail Delivery Active' : 'Not Yet Connected'}</span>
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Your Gmail Address <span className="text-[#C5A059]">*</span>
            </label>
            <input
              type="email"
              required
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="e.g. author.alsa@gmail.com"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Google App Password (16 Letters) <span className="text-[#C5A059]">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                name="pass"
                value={formData.pass}
                onChange={handleChange}
                placeholder="abcd efgh ijkl mnop"
                className="w-full pl-4 pr-10 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715] font-mono text-xs"
              />
              <Key className="w-4 h-4 text-[#8C7A65] absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Author Display Name
            </label>
            <input
              type="text"
              name="fromName"
              value={formData.fromName}
              onChange={handleChange}
              placeholder="Alsa.S"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#5A544C] font-semibold mb-2">
              Sender Email (Optional Custom Reply-To)
            </label>
            <input
              type="email"
              name="fromEmail"
              value={formData.fromEmail}
              onChange={handleChange}
              placeholder="Leave blank to use Gmail address above"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#EAE2D8] rounded-lg focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
            />
          </div>
        </div>

        {/* How to get a Google App Password Guide */}
        <div className="p-5 bg-[#FAF6EB] rounded-xl border border-[#EAE2D8] text-xs text-[#5A544C] space-y-3">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-[#8C6D3B]">
            <HelpCircle className="w-4 h-4 text-[#C5A059]" />
            <span>How to generate your 16-character Google App Password (Takes 60 seconds):</span>
          </div>

          <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#5A544C] leading-relaxed">
            <li>
              Go to your Google Account:{' '}
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8C6D3B] underline font-medium hover:text-[#1A1715]"
              >
                myaccount.google.com/security <ExternalLink className="inline w-3 h-3" />
              </a>{' '}
              and verify that <strong>2-Step Verification</strong> is ON.
            </li>
            <li>
              Open Google App Passwords:{' '}
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8C6D3B] underline font-medium hover:text-[#1A1715]"
              >
                myaccount.google.com/apppasswords <ExternalLink className="inline w-3 h-3" />
              </a>
            </li>
            <li>
              Type App Name: <em>Author Studio</em>, click <strong>Create</strong>, and paste the generated 16-character code into the password box above.
            </li>
          </ol>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#b08e4c] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Email Settings</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Test Connection Card */}
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-8 space-y-6 shadow-sm">
        <div className="border-b border-[#EAE2D8] pb-4">
          <h3 className="font-serif text-xl font-medium text-[#1A1715] flex items-center space-x-2">
            <Send className="w-5 h-5 text-[#C5A059]" />
            <span>Send Test Email to Your Gmail</span>
          </h3>
          <p className="text-xs text-[#5A544C] mt-1">
            Send an instant test letter to verify that your Gmail connection is working and inspect the email design.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={testRecipient}
            onChange={(e) => setTestRecipient(e.target.value)}
            placeholder="Enter your personal Gmail (e.g. author@gmail.com)"
            className="flex-1 px-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#EAE2D8] rounded-xl focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
          />

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing || !formData.user}
            className="px-6 py-2.5 rounded-xl bg-[#1A1715] hover:bg-[#C5A059] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-40"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Test...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Test Email</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
