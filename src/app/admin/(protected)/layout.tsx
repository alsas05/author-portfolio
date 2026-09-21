import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex w-full min-h-screen bg-[#FAF8F5]">
      <AdminSidebar />
      <main className="flex-1 p-8 sm:p-12 overflow-y-auto max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
