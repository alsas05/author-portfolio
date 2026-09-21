'use client';

import React, { useState } from 'react';
import {
  Users,
  Send,
  History,
  Download,
  Search,
  Mail,
  Settings,
} from 'lucide-react';
import DeleteSubscriberButton from './DeleteSubscriberButton';
import SubscriberDispatchComposer from './SubscriberDispatchComposer';
import DispatchesHistory, { DispatchItem } from './DispatchesHistory';
import SmtpSettingsForm from './SmtpSettingsForm';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface SubscriberItem {
  id: string;
  email: string;
  status: string;
  subscribedAt: string | Date;
}

interface SubscribersClientProps {
  subscribers: SubscriberItem[];
  dispatches: DispatchItem[];
}

export default function SubscribersClient({
  subscribers,
  dispatches,
}: SubscribersClientProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'compose' | 'history' | 'smtp'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const activeSubscribersCount = subscribers.filter((s) => s.status === 'ACTIVE').length;

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      alert('No subscribers to export.');
      return;
    }

    const headers = 'Email,Status,Date Subscribed\n';
    const rows = subscribers
      .map(
        (s) =>
          `"${s.email}","${s.status}","${new Date(s.subscribedAt).toISOString()}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `alsa_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDispatchSuccess = () => {
    router.refresh();
    setActiveTab('history');
  };

  return (
    <div className="space-y-8">
      {/* Top Segmented Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE2D8] pb-4">
        <div className="flex flex-wrap items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#EAE2D8]">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'list'
                ? 'bg-[#1A1715] text-white shadow-sm'
                : 'text-[#5A544C] hover:text-[#1A1715]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Readers List ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'compose'
                ? 'bg-[#C5A059] text-white shadow-sm'
                : 'text-[#5A544C] hover:text-[#1A1715]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Compose Message / Deck</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'history'
                ? 'bg-[#1A1715] text-white shadow-sm'
                : 'text-[#5A544C] hover:text-[#1A1715]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Sent Dispatches ({dispatches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('smtp')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'smtp'
                ? 'bg-[#1A1715] text-white shadow-sm'
                : 'text-[#5A544C] hover:text-[#1A1715]'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Gmail / Email Delivery</span>
          </button>
        </div>

        {activeTab === 'list' && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-[#EAE2D8] hover:border-[#C5A059] text-xs font-medium text-[#5A544C] hover:text-[#1A1715] bg-white transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setActiveTab('compose')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#b08e4c] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message or Deck</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Subscribers List */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#8C7A65] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reader emails..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#EAE2D8] rounded-xl focus:outline-none focus:border-[#C5A059] text-[#1A1715]"
              />
            </div>
            <div className="text-xs text-[#8C7A65] font-medium">
              Showing {filteredSubscribers.length} of {subscribers.length} subscribers
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE2D8] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#5A544C]">
                <thead className="bg-[#FAF8F5] uppercase tracking-wider text-[#8C7A65] border-b border-[#EAE2D8] font-semibold">
                  <tr>
                    <th className="px-6 py-4">Subscriber Email</th>
                    <th className="px-6 py-4">Date Joined</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D8]">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-[#8C7A65]">
                        No subscribers found matching &ldquo;{searchQuery}&rdquo;.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <tr
                        key={sub.id}
                        className="hover:bg-[#FAF8F5]/80 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono font-medium text-[#1A1715]">
                          {sub.email}
                        </td>
                        <td className="px-6 py-4 text-[#8C7A65]">
                          {formatDate(sub.subscribedAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              sub.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DeleteSubscriberButton id={sub.id} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Compose Message / Deck */}
      {activeTab === 'compose' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-medium text-[#1A1715]">
              Compose Dispatch or Presentation Deck
            </h2>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs text-[#8C6D3B] hover:underline font-medium"
            >
              View Previous Dispatches &rarr;
            </button>
          </div>
          <SubscriberDispatchComposer
            activeCount={activeSubscribersCount}
            onDispatchSuccess={handleDispatchSuccess}
            onOpenSettings={() => setActiveTab('smtp')}
          />
        </div>
      )}

      {/* Tab 3: Sent Dispatches History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-medium text-[#1A1715]">
              Sent Dispatches Archive
            </h2>
            <button
              onClick={() => setActiveTab('compose')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#C5A059] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#b08e4c] transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>Compose New</span>
            </button>
          </div>
          <DispatchesHistory dispatches={dispatches} />
        </div>
      )}

      {/* Tab 4: Gmail & SMTP Settings */}
      {activeTab === 'smtp' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-medium text-[#1A1715]">
              Gmail &amp; Real Email Delivery
            </h2>
            <button
              onClick={() => setActiveTab('compose')}
              className="text-xs text-[#8C6D3B] hover:underline font-medium"
            >
              Back to Composer &rarr;
            </button>
          </div>
          <SmtpSettingsForm />
        </div>
      )}
    </div>
  );
}
