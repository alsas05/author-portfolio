import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Book, Plus, Edit, Star, ExternalLink } from 'lucide-react';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import DeleteBookButton from './DeleteBookButton';

export const revalidate = 0;

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { order: 'asc' },
    include: { purchaseLinks: true },
  });

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Book Management"
        subtitle="Manage novel titles, cover artwork, synopsis, excerpts, and external purchase platform links."
        action={{ label: 'Add New Book', href: '/admin/books/new' }}
      />

      <div className="bg-white rounded-xl border border-[#EAE2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5A544C]">
            <thead className="bg-[#FAF8F5] uppercase tracking-wider text-[#8C7A65] border-b border-[#EAE2D8] font-semibold">
              <tr>
                <th className="px-6 py-4">Cover</th>
                <th className="px-6 py-4">Title &amp; Subtitle</th>
                <th className="px-6 py-4">Genre</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Purchase Links</th>
                <th className="px-6 py-4">Buy Clicks</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D8]">
              {books.map((book) => {
                const totalClicks = book.purchaseLinks.reduce((sum, l) => sum + l.clickCount, 0);
                return (
                  <tr key={book.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-16 rounded overflow-hidden bg-[#1A1715] shadow">
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-serif text-sm font-semibold text-[#1A1715]">
                        {book.title}
                      </div>
                      {book.subtitle && (
                        <div className="font-serif italic text-xs text-[#8C7A65]">
                          {book.subtitle}
                        </div>
                      )}
                      {book.featured && (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-[#C5A059] font-semibold mt-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Featured Spotlight</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{book.genre}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          book.status === 'UPCOMING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {book.purchaseLinks.map((p) => (
                          <span
                            key={p.id}
                            className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#EAE2D8] text-[10px]"
                          >
                            {p.platform}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[#8C6D3B]">
                      {totalClicks}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/books/${book.slug}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-[#F4EFEA] text-[#8C7A65] hover:text-[#1A1715]"
                          title="View on public site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/books/${book.id}`}
                          className="p-1.5 rounded hover:bg-[#F4EFEA] text-[#8C7A65] hover:text-[#C5A059]"
                          title="Edit book"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteBookButton bookId={book.id} bookTitle={book.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
