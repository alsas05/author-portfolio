'use client';

import React, { useState } from 'react';
import {
  Presentation,
  Feather,
  Sparkles,
  BookOpen,
  ExternalLink,
  Users,
  Calendar,
  X,
  FileText,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface DispatchItem {
  id: string;
  subject: string;
  messageType: string;
  content: string;
  deckTitle: string | null;
  deckUrl: string | null;
  deckDescription: string | null;
  recipientCount: number;
  recipientsJson: string | null;
  status: string;
  sentAt: string | Date;
}

interface DispatchesHistoryProps {
  dispatches: DispatchItem[];
}

export default function DispatchesHistory({ dispatches }: DispatchesHistoryProps) {
  const [activeDispatch, setActiveDispatch] = useState<DispatchItem | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DECK':
        return <Presentation className="w-3.5 h-3.5 text-[#C5A059]" />;
      case 'ANNOUNCEMENT':
        return <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />;
      case 'EXCERPT':
        return <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />;
      default:
        return <Feather className="w-3.5 h-3.5 text-[#C5A059]" />;
    }
  };

  if (!dispatches || dispatches.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAE2D8] p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#FAF6EB] text-[#C5A059] flex items-center justify-center mx-auto border border-[#C5A059]/30">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-medium text-[#1A1715]">
          No Dispatches Sent Yet
        </h3>
        <p className="text-xs text-[#5A544C] max-w-sm mx-auto leading-relaxed">
          Use the Compose tab to draft your first personal author letter, reading excerpt, or presentation deck to your subscribers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EAE2D8] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#EAE2D8] flex items-center justify-between">
        <span className="font-serif text-lg font-medium text-[#1A1715]">
          Archive of Dispatched Letters &amp; Decks ({dispatches.length})
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#5A544C]">
          <thead className="bg-[#FAF8F5] uppercase tracking-wider text-[#8C7A65] border-b border-[#EAE2D8] font-semibold">
            <tr>
              <th className="px-6 py-4">Subject &amp; Type</th>
              <th className="px-6 py-4">Deck Attached</th>
              <th className="px-6 py-4">Recipients</th>
              <th className="px-6 py-4">Dispatched At</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE2D8]">
            {dispatches.map((dispatch) => (
              <tr
                key={dispatch.id}
                className="hover:bg-[#FAF8F5]/80 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <span className="font-serif font-medium text-sm text-[#1A1715] block">
                      {dispatch.subject}
                    </span>
                    <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#FAF6EB] text-[#8C6D3B] border border-[#C5A059]/20">
                      {getTypeIcon(dispatch.messageType)}
                      <span>{dispatch.messageType}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {dispatch.deckUrl ? (
                    <a
                      href={dispatch.deckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-[#8C6D3B] hover:text-[#1A1715] hover:underline font-medium"
                    >
                      <Presentation className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span className="truncate max-w-[160px]">
                        {dispatch.deckTitle || 'View Deck'}
                      </span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="text-[#A9A59F] text-xs font-mono">&mdash;</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center space-x-1 text-xs font-medium text-[#1A1715]">
                    <Users className="w-3.5 h-3.5 text-[#8C7A65]" />
                    <span>{dispatch.recipientCount} readers</span>
                  </span>
                </td>

                <td className="px-6 py-4 text-xs font-mono text-[#8C7A65]">
                  {formatDate(dispatch.sentAt)}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setActiveDispatch(dispatch)}
                    className="px-3 py-1.5 rounded-lg border border-[#EAE2D8] hover:border-[#C5A059] text-[11px] font-semibold uppercase tracking-wider text-[#5A544C] hover:text-[#1A1715] transition-colors"
                  >
                    View Letter
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dispatch Detail Modal */}
      {activeDispatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#EAE2D8] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
            {/* Header */}
            <div className="p-5 bg-white border-b border-[#EAE2D8] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#FAF6EB] text-[#8C6D3B] border border-[#C5A059]/20">
                  {getTypeIcon(activeDispatch.messageType)}
                  <span>{activeDispatch.messageType}</span>
                </span>
                <span className="text-xs text-[#8C7A65] font-mono">
                  Sent to {activeDispatch.recipientCount} readers on{' '}
                  {formatDate(activeDispatch.sentAt)}
                </span>
              </div>
              <button
                onClick={() => setActiveDispatch(null)}
                className="p-1 rounded-lg text-[#8C7A65] hover:text-[#1A1715] hover:bg-[#FAF8F5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="bg-white rounded-xl border border-[#EAE2D8] p-8 space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium text-[#1A1715]">
                    {activeDispatch.subject}
                  </h3>
                </div>

                <div className="font-serif text-sm text-[#3A3531] leading-relaxed whitespace-pre-wrap">
                  {activeDispatch.content}
                </div>

                {activeDispatch.deckUrl && (
                  <div className="p-6 bg-[#FAF6EB] rounded-xl border border-[#EAE2D8] space-y-3">
                    <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-[#C5A059]">
                      <Presentation className="w-4 h-4" />
                      <span>Attached Deck Material</span>
                    </div>

                    <h4 className="font-serif text-lg font-medium text-[#1A1715]">
                      {activeDispatch.deckTitle || 'Presentation Deck'}
                    </h4>

                    {activeDispatch.deckDescription && (
                      <p className="text-xs text-[#5A544C] leading-relaxed">
                        {activeDispatch.deckDescription}
                      </p>
                    )}

                    <div className="pt-2">
                      <a
                        href={activeDispatch.deckUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#1A1715] hover:bg-[#C5A059] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
                      >
                        <span>Open Deck Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
