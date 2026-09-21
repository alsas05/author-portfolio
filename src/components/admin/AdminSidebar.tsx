'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Book,
  Feather,
  BookOpen,
  Users,
  MessageSquare,
  Globe,
  LogOut,
  User,
  Mail,
} from 'lucide-react';

const ADMIN_LINKS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Books', href: '/admin/books', icon: Book },
  { name: 'Writings', href: '/admin/writings', icon: Feather },
  { name: 'Blog Posts', href: '/admin/blog', icon: BookOpen },
  { name: 'About Page', href: '/admin/about', icon: User },
  { name: 'Contact Page', href: '/admin/contact', icon: Mail },
  { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <aside className="w-64 bg-[#1A1715] text-[#FAF8F5] flex flex-col justify-between border-r border-[#2A2521] min-h-screen">
      <div>
        {/* Author Studio Emblem */}
        <div className="p-6 border-b border-[#2A2521]">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center text-white">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-wider font-semibold text-white block">
                ALSA.S
              </span>
              <span className="text-[10px] tracking-widest text-[#C5A059] uppercase block font-medium">
                Author Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== '/admin' && pathname.startsWith(link.href));

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs uppercase tracking-wider font-medium transition-all ${
                  isActive
                    ? 'bg-[#C5A059] text-white shadow-md'
                    : 'text-[#D4D2CF] hover:bg-[#2A2521] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#2A2521] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider text-[#A9A59F] hover:text-white hover:bg-[#2A2521] transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span>View Public Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
