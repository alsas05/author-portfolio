'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface BuyLinkProps {
  link: {
    id: string;
    platform: string;
    displayName: string;
    url: string;
    region?: string | null;
  };
}

export default function BuyLinkTracker({ link }: BuyLinkProps) {
  const handleClick = () => {
    try {
      fetch('/api/analytics/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId: link.id }),
      });
    } catch {
      // Non-blocking tracking
    }
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex items-center justify-between p-3.5 rounded-lg bg-white border border-[#EAE2D8] hover:border-[#C5A059] shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex flex-col text-left">
        <span className="text-xs font-semibold text-[#1A1715] group-hover:text-[#8C6D3B] transition-colors">
          {link.displayName}
        </span>
        {link.region && (
          <span className="text-[10px] text-[#8C7A65] uppercase tracking-wider">
            {link.region}
          </span>
        )}
      </div>
      <ExternalLink className="w-4 h-4 text-[#8C7A65] group-hover:text-[#C5A059] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </a>
  );
}
