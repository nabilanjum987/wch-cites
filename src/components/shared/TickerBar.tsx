'use client';

import { useEffect, useState } from 'react';
import type { MarketItem } from '@/lib/tickers';

// Ticker 1 — the market ticker (WP2 Slice 1). All figures are fetched
// SERVER-side (see src/lib/tickers.ts) and arrive as props, so the real
// values are present in the server HTML. This component only animates:
// the marquee scroll, the world-population tick, and the prayer
// countdown. It never invents or fetches a figure itself.
export default function TickerBar({ items }: { items: MarketItem[] }) {
  const [paused, setPaused] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!items.length) return null;

  const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

  const renderItem = (item: MarketItem, key: number, hidden = false) => {
    let value = item.value;
    if (item.live?.type === 'population') {
      const est = Math.round(item.live.base + item.live.perSecond * ((now - item.live.at) / 1000));
      value = fmt.format(est);
    }
    if (item.live?.type === 'prayer') {
      const mins = Math.max(0, Math.round((item.live.at - now) / 60000));
      const cd = mins >= 60 ? `in ${Math.floor(mins / 60)}h ${mins % 60}m` : `in ${mins} min`;
      value = `${item.value} · ${cd}`;
    }
    return (
      <a
        key={key}
        href={item.href}
        aria-hidden={hidden || undefined}
        tabIndex={hidden ? -1 : undefined}
        className="flex items-baseline gap-1.5 text-gray-300 transition-colors hover:text-white"
      >
        <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{item.label}</span>
        <span className="font-semibold text-white">{value}</span>
        <span className="pl-4 text-gray-700">•</span>
      </a>
    );
  };

  return (
    <div
      className="relative z-40 overflow-hidden border-b border-white/10 bg-[#0b1120]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className="ticker-track flex w-max items-center gap-8 whitespace-nowrap px-4 py-1.5 text-[13px]"
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {items.map((item, i) => renderItem(item, i))}
        {items.map((item, i) => renderItem(item, items.length + i, true))}
      </div>
    </div>
  );
}
