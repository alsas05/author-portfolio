'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Bell, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#EAE2D8]">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-[#1A1715]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#8C7A65] mt-1 font-sans">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
        {action && (
          <Link
            href={action.href}
            className="px-4 py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#8C6D3B] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-sm flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{action.label}</span>
          </Link>
        )}

        <div className="flex items-center space-x-3 pl-2 border-l border-[#EAE2D8]">
          <div className="w-8 h-8 rounded-full bg-[#F4EFEA] border border-[#EAE2D8] flex items-center justify-center text-[#5A544C]">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-[#1A1715] hidden md:inline">
            Alsa.S (Admin)
          </span>
        </div>
      </div>
    </header>
  );
}
