'use client';

import { useEffect, useState } from 'react';
import type { SiteItem } from '@/lib/tickers';

// Ticker 2 — the website-live ticker's rotating stage (WP2 Slice 1).
// Items are generated SERVER-side from published pages only
// (src/lib/tickers.ts) and ALL of them are rendered here in the server
// HTML; this component only crossfades between them and pauses on
// hover/touch. Max 10 items (enforced server-side).
export default function Ticker2Rotator({ items }: { items: SiteItem[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (!items.length) return null;

  return (
    <div
      className="border-y border-emerald-300/15 bg-gradient-to-r from-emerald-950 via-[#06231c] to-emerald-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
        <div className="relative h-6 flex-1 overflow-hidden">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              aria-hidden={i !== idx}
              tabIndex={i !== idx ? -1 : undefined}
              className={`absolute inset-0 flex items-center text-sm text-emerald-50 transition-opacity duration-500 ${
                i === idx ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <span className="truncate">
                {item.text} <span className="text-emerald-300">→</span>
              </span>
            </a>
          ))}
        </div>
        <span className="hidden shrink-0 text-[11px] font-medium uppercase tracking-wider text-emerald-200/50 sm:block">
          WorldCityHub Live
        </span>
      </div>
    </div>
  );
}
