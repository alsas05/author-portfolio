import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Author Studio | ALSA.S',
  description: 'Administrative Content Studio for Alsa.S',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      {children}
    </div>
  );
}
