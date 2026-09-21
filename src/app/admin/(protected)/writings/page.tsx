import React from 'react';
import Link from 'next/link';
import { Feather, Edit, ExternalLink } from 'lucide-react';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import DeleteWritingButton from './DeleteWritingButton';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminWritingsPage() {
  const writings = await prisma.writing.findMany({
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Writings &amp; Creative Archive"
        subtitle="Manage poems, short stories, epistolary notes, and philosophical reflections."
        action={{ label: 'New Writing', href: '/admin/writings/new' }}
      />

      <div className="bg-white rounded-xl border border-[#EAE2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5A544C]">
            <thead className="bg-[#FAF8F5] uppercase tracking-wider text-[#8C7A65] border-b border-[#EAE2D8] font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Reading Time</th>
                <th className="px-6 py-4">Published Date</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D8]">
              {writings.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-serif text-sm font-semibold text-[#1A1715]">
                      {item.title}
                    </div>
                    <div className="font-serif italic text-xs text-[#8C7A65] line-clamp-1">
                      {item.excerpt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded bg-[#FAF6EB] text-[#8C6D3B] border border-[#C5A059]/30 font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.readingTime || '3 min read'}</td>
                  <td className="px-6 py-4">{formatDate(item.publishedAt)}</td>
                  <td className="px-6 py-4 font-mono">{item.views}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.published
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/writings/${item.slug}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-[#F4EFEA] text-[#8C7A65] hover:text-[#1A1715]"
                        title="View live piece"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/writings/${item.id}`}
                        className="p-1.5 rounded hover:bg-[#F4EFEA] text-[#8C7A65] hover:text-[#C5A059]"
                        title="Edit piece"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteWritingButton
                        writingId={item.id}
                        writingTitle={item.title}
                      />
                    </div>
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
