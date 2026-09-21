import React from 'react';
import Link from 'next/link';
import {
  Book,
  Feather,
  BookOpen,
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [
    bookCount,
    writingCount,
    blogCount,
    subscriberCount,
    messageCount,
    unreadMessageCount,
    purchaseLinks,
    recentMessages,
    recentBooks,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.writing.count(),
    prisma.blogPost.count(),
    prisma.newsletterSubscriber.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.purchaseLink.findMany({ select: { clickCount: true } }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: { purchaseLinks: true },
    }),
  ]);

  const totalBuyClicks = purchaseLinks.reduce((acc, p) => acc + p.clickCount, 0);

  const METRICS = [
    {
      label: 'Published Books',
      value: bookCount,
      icon: Book,
      href: '/admin/books',
      color: 'text-[#C5A059]',
    },
    {
      label: 'Creative Pieces',
      value: writingCount,
      icon: Feather,
      href: '/admin/writings',
      color: 'text-purple-600',
    },
    {
      label: 'Journal Essays',
      value: blogCount,
      icon: BookOpen,
      href: '/admin/blog',
      color: 'text-amber-600',
    },
    {
      label: 'Newsletter Readers',
      value: subscriberCount,
      icon: Users,
      href: '/admin/subscribers',
      color: 'text-emerald-600',
    },
    {
      label: 'Inquiries Received',
      value: `${messageCount} (${unreadMessageCount} unread)`,
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'text-blue-600',
    },
    {
      label: 'Buy Link Clicks',
      value: totalBuyClicks,
      icon: TrendingUp,
      href: '/admin/books',
      color: 'text-rose-600',
    },
  ];

  return (
    <div className="space-y-10">
      <AdminHeader
        title="Author Studio Overview"
        subtitle="Manage published literature, creative fragments, journal essays, and reader correspondence."
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {METRICS.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Link
              key={idx}
              href={metric.href}
              className="bg-white p-6 rounded-xl border border-[#EAE2D8] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#8C7A65] block font-semibold mb-1">
                  {metric.label}
                </span>
                <span className="font-serif text-3xl font-semibold text-[#1A1715] group-hover:text-[#8C6D3B] transition-colors">
                  {metric.value}
                </span>
              </div>
              <div className={`p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE2D8] ${metric.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Publishing Actions */}
      <div className="bg-[#FAF6EB]/60 rounded-xl border border-[#EAE2D8] p-6 sm:p-8">
        <h3 className="font-serif text-xl font-medium text-[#1A1715] mb-4">
          Quick Publishing Actions
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/books/new"
            className="px-5 py-2.5 rounded-lg bg-[#1A1715] hover:bg-[#C5A059] text-white text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </Link>
          <Link
            href="/admin/writings/new"
            className="px-5 py-2.5 rounded-lg bg-white border border-[#EAE2D8] hover:border-[#C5A059] text-[#1A1715] text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Publish Poem / Story</span>
          </Link>
          <Link
            href="/admin/blog/new"
            className="px-5 py-2.5 rounded-lg bg-white border border-[#EAE2D8] hover:border-[#C5A059] text-[#1A1715] text-xs uppercase tracking-wider font-semibold transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>Write Journal Essay</span>
          </Link>
        </div>
      </div>

      {/* Recent Messages & Current Books */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl border border-[#EAE2D8] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
            <h3 className="font-serif text-xl font-medium text-[#1A1715]">
              Recent Reader Notes
            </h3>
            <Link
              href="/admin/messages"
              className="text-xs uppercase tracking-wider text-[#8C6D3B] hover:text-[#1A1715] font-semibold"
            >
              View All
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-xs text-[#8C7A65] italic py-4">
              No inquiries received yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                    !msg.isRead
                      ? 'bg-[#FAF6EB] border-[#C5A059]/40 text-[#1A1715]'
                      : 'bg-[#FAF8F5] border-[#EAE2D8] text-[#5A544C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1A1715]">{msg.name}</span>
                    <span className="text-[10px] text-[#8C7A65]">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="font-medium text-[#8C6D3B]">{msg.subject}</p>
                  <p className="line-clamp-2 text-[#5A544C]">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Catalog Preview */}
        <div className="bg-white rounded-xl border border-[#EAE2D8] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D8]">
            <h3 className="font-serif text-xl font-medium text-[#1A1715]">
              Current Bookshelf
            </h3>
            <Link
              href="/admin/books"
              className="text-xs uppercase tracking-wider text-[#8C6D3B] hover:text-[#1A1715] font-semibold"
            >
              Manage Books
            </Link>
          </div>

          <div className="space-y-3">
            {recentBooks.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE2D8]"
              >
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#1A1715]">
                    {b.title}
                  </h4>
                  <span className="text-[11px] text-[#8C7A65]">
                    {b.genre} · {b.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-[#8C6D3B] font-mono">
                    {b.purchaseLinks.reduce((sum, l) => sum + l.clickCount, 0)} clicks
                  </span>
                  <Link
                    href={`/admin/books/${b.id}`}
                    className="text-xs px-2.5 py-1 rounded bg-white border border-[#EAE2D8] hover:border-[#C5A059] font-medium text-[#1A1715]"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
