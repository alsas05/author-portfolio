'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, CheckCircle, Mail, Loader2, Eye } from 'lucide-react';

interface MessageActionsProps {
  message: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: string | Date;
  };
}

export default function MessageActions({ message }: MessageActionsProps) {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const toggleRead = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: message.id, isRead: !message.isRead }),
      });
      router.refresh();
    } catch {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete message from ${message.name}?`)) return;
    setLoading(true);
    try {
      await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: message.id }),
      });
      router.refresh();
    } catch {
      alert('Failed to delete message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={() => {
            setModalOpen(true);
            if (!message.isRead) {
              toggleRead();
            }
          }}
          className="p-1.5 rounded hover:bg-[#F4EFEA] text-[#8C7A65] hover:text-[#1A1715]"
          title="Read full note"
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={toggleRead}
          disabled={loading}
          className={`p-1.5 rounded hover:bg-[#F4EFEA] transition-colors ${
            message.isRead ? 'text-[#8C7A65]' : 'text-[#C5A059] font-bold'
          }`}
          title={message.isRead ? 'Mark as Unread' : 'Mark as Read'}
        >
          <CheckCircle className="w-4 h-4" />
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-1.5 rounded hover:bg-red-50 text-[#8C7A65] hover:text-red-600"
          title="Delete message"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#EAE2D8] max-w-lg w-full p-8 shadow-2xl space-y-6">
            <div className="border-b border-[#EAE2D8] pb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#8C7A65] block mb-1">
                Reader Correspondence
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#1A1715]">
                {message.subject}
              </h3>
              <div className="text-xs text-[#5A544C] mt-2 space-y-0.5">
                <p>
                  From: <span className="font-semibold text-[#1A1715]">{message.name}</span> ({message.email})
                </p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-5 rounded-lg border border-[#EAE2D8] text-sm text-[#2B2621] font-serif leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto">
              {message.message}
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                className="px-5 py-2 rounded-lg bg-[#C5A059] hover:bg-[#8C6D3B] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Reply via Email
              </a>
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 rounded-lg border border-[#EAE2D8] text-[#1A1715] hover:bg-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                Close Note
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
