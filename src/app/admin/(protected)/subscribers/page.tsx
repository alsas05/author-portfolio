import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import SubscribersClient from './SubscribersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: 'desc' },
  });

  const dispatches = await prisma.subscriberDispatch.findMany({
    orderBy: { sentAt: 'desc' },
  });

  // Map to plain objects so date serialization across server-client boundary is clean
  const serializedSubscribers = subscribers.map((sub) => ({
    ...sub,
    subscribedAt: sub.subscribedAt.toISOString(),
  }));

  const serializedDispatches = dispatches.map((d) => ({
    ...d,
    sentAt: d.sentAt.toISOString(),
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <AdminHeader
        title="Newsletter Subscribers &amp; Dispatches"
        subtitle="Manage reader subscribers, broadcast personal letters, and share presentation or pitch decks."
      />

      <SubscribersClient
        subscribers={serializedSubscribers}
        dispatches={serializedDispatches}
      />
    </div>
  );
}
