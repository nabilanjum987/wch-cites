'use client';

// News panel tabs (§14) — category switching over headline lists the
// server fetched from GNews (NewsPanel). Headlines link to the /news
// hub (link map §14: we do not link out to publishers from the
// homepage; the hub carries the source links).

import { useState } from 'react';
import Link from 'next/link';

export interface NewsCategoryData {
  slug: string;
  label: string;
  headlines: { title: string; source: string }[];
}

export default function NewsTabs({ categories }: { categories: NewsCategoryData[] }) {
  const [active, setActive] = useState(0);
  const current = categories[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="News categories">
        {categories.map((c, i) => (
          <button
            key={c.slug}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              i === active
                ? 'bg-cyan-500/90 t-onbrand'
                : 't-card border t-border-15 t-text-70 t-card-hover'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      {current && current.headlines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {current.headlines.map((h, i) => (
            <Link key={i} href="/news" className="rounded-xl t-card border t-border px-4 py-3 t-border-hover-25 transition-colors no-underline block">
              <div className="t-text-90 font-medium text-sm leading-snug">{h.title}</div>
              <div className="sub-desc mt-1">{h.source} · read on the news page</div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="sub-desc">
          This category's feed is quiet right now — the news page carries the full wire.
        </p>
      )}
    </div>
  );
}
