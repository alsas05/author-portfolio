import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Feather, BookOpen } from 'lucide-react';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    return { title: 'Essay Not Found | ALSA.S' };
  }

  return {
    title: `${post.title} | The Journal`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — Alsa.S`,
      description: post.excerpt,
      type: 'article',
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

export const revalidate = 60;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  // Increment views non-blockingly
  try {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  } catch {
    // Non-blocking
  }

  // Related posts
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      id: { not: post.id },
      category: post.category,
    },
    take: 3,
  });

  // Schema.org Article Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Alsa.S',
    },
  };

  return (
    <article className="py-12 sm:py-20 px-6 sm:px-8 max-w-4xl mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back to Journal Link */}
      <nav className="mb-10">
        <Link
          href="/blog"
          className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest font-semibold text-[#8C7A65] hover:text-[#1A1715] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </Link>
      </nav>

      {/* Article Header */}
      <header className="space-y-6 pb-10 border-b border-[#EAE2D8]">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF6EB] border border-[#C5A059]/30 text-[#8C6D3B] text-xs uppercase tracking-widest font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{post.category}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium text-[#1A1715] leading-tight text-balance">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs tracking-wider text-[#8C7A65] font-light font-sans">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-[#C5A059]" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <span>·</span>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-[#C5A059]" />
            <span>{post.readingTime || '5 min read'}</span>
          </div>
          <span>·</span>
          <span>Words by Alsa.S</span>
        </div>
      </header>

      {/* Hero Featured Image */}
      {post.featuredImage && (
        <div className="my-10 relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md bg-[#1A1715]">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
          />
        </div>
      )}

      {/* Article Rich Content */}
      <div className="prose prose-stone max-w-none font-serif text-lg sm:text-xl text-[#2B2621] leading-relaxed drop-cap space-y-6">
        {post.content.split('\n\n').map((block, idx) => {
          if (block.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1715] pt-6 pb-2 border-b border-[#EAE2D8]/60"
              >
                {block.replace('### ', '')}
              </h3>
            );
          }
          if (block.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="font-serif italic pl-6 border-l-2 border-[#C5A059] text-xl text-[#5A544C] my-6"
              >
                {block.replace('> ', '')}
              </blockquote>
            );
          }
          if (block.startsWith('1. ') || block.startsWith('- ')) {
            return (
              <div key={idx} className="font-sans text-base text-[#5A544C] space-y-2 my-4 pl-4">
                {block.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            );
          }
          return (
            <p key={idx} className="pretty-prose leading-relaxed">
              {block}
            </p>
          );
        })}
      </div>

      {/* Post Signoff & Tags */}
      <div className="mt-16 pt-8 border-t border-[#EAE2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-base font-medium text-[#1A1715] block">
              Alsa.S
            </span>
            <span className="text-[11px] text-[#8C7A65] uppercase tracking-wider block">
              Author · Poet · Storyteller
            </span>
          </div>
        </div>

        {post.tags && (
          <div className="flex flex-wrap gap-2">
            {post.tags.split(',').map((tag, i) => (
              <span
                key={i}
                className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-[#F5EFEB] text-[#8C7A65] border border-[#EAE2D8]"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Essays */}
      {relatedPosts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#EAE2D8]">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059] block mb-2">
            Further Reading
          </span>
          <h3 className="font-serif text-2xl font-medium text-[#1A1715] mb-6">
            Related Journal Notes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/blog/${rel.slug}`}
                className="group p-5 rounded-lg bg-white border border-[#EAE2D8] hover:border-[#C5A059] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A65] block mb-1">
                    {formatDate(rel.publishedAt)}
                  </span>
                  <h4 className="font-serif text-base font-medium text-[#1A1715] group-hover:text-[#8C6D3B] line-clamp-2 mb-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#5A544C] line-clamp-2 font-sans font-light">
                    {rel.excerpt}
                  </p>
                </div>
                <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8C6D3B] group-hover:text-[#1A1715] mt-4 block">
                  Read Essay &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
