import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [books, writings, posts] = await Promise.all([
    prisma.book.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.writing.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes = [
    '',
    '/books',
    '/writings',
    '/blog',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const bookRoutes = books.map((book) => ({
    url: `${baseUrl}/books/${book.slug}`,
    lastModified: book.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const writingRoutes = writings.map((writing) => ({
    url: `${baseUrl}/writings/${writing.slug}`,
    lastModified: writing.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...bookRoutes, ...writingRoutes, ...blogRoutes];
}
