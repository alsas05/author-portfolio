import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Edit, ExternalLink } from 'lucide-react';
import prisma from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import DeleteBlogButton from './DeleteBlogButton';
import { formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Journal Management"
        subtitle="Manage long-form editorial essays, writing journey notes, and book updates."
        action={{ label: 'New Article', href: '/admin/blog/new' }}
      />

      <div className="bg-white rounded-xl border border-[#EAE2D8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5A544C]">
            <thead className="bg-[#FAF8F5] uppercase tracking-wider text-[#8C7A65] border-b border-[#EAE2D8] font-semibold">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D8]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="px-6 py-4">
                    {post.featuredImage ? (
                      <div className="relative w-14 h-10 rounded overflow-hidden bg-[#1A1715]">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-10 rounded bg-[#FAF8F5] flex items-center justify-center text-[#8C7A65]">
                        <BookOpen className="w-4 h-4" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-serif text-sm font-semibold text-[#1A1715]">
                      {post.title}
                    </div>
                    <div className="text-xs text-[#8C7A65] line-clamp-1 font-sans">
                      {post.excerpt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded bg-[#FAF6EB] text-[#8C6D3B] border border-[#C5A059]/30 font-medium">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDate(post.publishedAt)}</td>
                  <td className="px-6 py-4 font-mono">{post.views}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        post.published
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-[#F4EFEA] text-[#8C7A65] hover:text-[#1A1715]"
                        title="View live article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="p-1.5 rounded hover:bg-[#F4EFEA] text-[#8C7A65] hover:text-[#C5A059]"
                        title="Edit article"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteBlogButton postId={post.id} postTitle={post.title} />
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
