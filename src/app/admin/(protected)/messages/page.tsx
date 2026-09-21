import React from 'react';
import { MessageSquare, Mail } from 'lucide-react';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import MessageActions from './MessageActions';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Reader Correspondence"
        subtitle="Review notes, event inquiries, and reader messages submitted through the contact desk."
      />

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
