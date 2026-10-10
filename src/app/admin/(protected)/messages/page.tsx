import React from 'react';
import Link from 'next/link';
import { MessageSquare, Mail, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import MessageActions from './MessageActions';
import { formatDate } from '@/lib/utils';
import { getSmtpConfig } from '@/lib/email';

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const [messages, smtpConfig] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    getSmtpConfig(),
  ]);

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Reader Correspondence"
        subtitle="Review notes, event inquiries, and reader messages submitted through the contact desk."
      />

      {/* Gmail Forwarding Status Card */}
      <div
        className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          smtpConfig.isConfigured
            ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
            : 'bg-[#FAF6EB] border-[#C5A059]/40 text-[#1A1715]'
        }`}
      >
        <div className="flex items-start sm:items-center space-x-3.5">
          <div
            className={`p-2.5 rounded-full shrink-0 ${
              smtpConfig.isConfigured
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-[#C5A059]/20 text-[#8C6D3B]'
            }`}
          >
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif font-semibold text-sm">
                Gmail Forwarding Target:
              </span>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white/80 border border-[#EAE2D8] text-[#1A1715]">
                alsawritesofus@gmail.com
              </span>
              {smtpConfig.isConfigured ? (
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  <span>Pending App Password</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#5A544C] mt-1">
              {smtpConfig.isConfigured
                ? 'All messages sent via the contact form are instantly forwarded to your Gmail inbox with direct reply capability.'
                : 'Messages are stored safely below. Enter your 16-character Google App Password in settings to receive instant email notifications in your inbox.'}
            </p>
          </div>
        </div>

        <Link
          href="/admin/subscribers?tab=smtp"
          className="shrink-0 inline-flex items-center space-x-1 px-4 py-2 rounded-lg bg-white border border-[#EAE2D8] hover:border-[#C5A059] text-xs font-semibold uppercase tracking-wider text-[#1A1715] hover:text-[#C5A059] transition-all shadow-sm"
        >
          <span>{smtpConfig.isConfigured ? 'Manage SMTP Settings' : 'Configure App Password'}</span>
          <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#EAE2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5A544C]">
            <thead className="bg-[#FAF8F5] uppercase tracking-wider text-[#8C7A65] border-b border-[#EAE2D8] font-semibold">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Preview</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D8]">
              {messages.map((msg) => (
                <tr
                  key={msg.id}
                  className={`hover:bg-[#FAF8F5]/80 transition-colors ${
                    !msg.isRead ? 'bg-[#FAF6EB]/40 font-medium' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        !msg.isRead
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {!msg.isRead ? 'New' : 'Read'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[#1A1715] font-medium">{msg.name}</div>
                    <div className="text-[11px] text-[#8C7A65]">{msg.email}</div>
                  </td>
                  <td className="px-6 py-4 font-serif text-sm text-[#1A1715]">
                    {msg.subject}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-[#8C7A65]">
                    {msg.message}
                  </td>
                  <td className="px-6 py-4">{formatDate(msg.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <MessageActions message={msg} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
