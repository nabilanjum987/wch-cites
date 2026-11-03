'use client';

// News panel tabs (§14) — category switching over headline lists the
// server fetched from GNews (NewsPanel). Headlines link to the /news
// hub (link map §14: we do not link out to publishers from the
// homepage; the hub carries the source links).
//
// Stage 2 (owner ruling, 2026-11-03): the fixed "Pakistan" tab is
// replaced by two PERSONAL tabs that appear once the visitor has
// used My Location (the shared opt-in state): "Your Country" and
// "Your City". Both fetch from the same GNews feed, client-side with
// the site's public GNews key — the exact pattern the My City panel
// already uses for its city headlines. The visitor's country is read
// from the same keyless IP lookup the location fallback uses
// (ipwho.is). A personal tab whose feed returns nothing shows the
// same honest quiet note as any other category; nothing is invented
// to fill it, and without opt-in the tabs simply are not offered.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useVisitorCity } from './useVisitorCity';

export interface NewsCategoryData {
  slug: string;
  label: string;
  // `image` is the thumbnail URL the GNews API supplied for that
  // article (publisher image); absent when the API provides none,
  // in which case the card stays a text card.
  headlines: { title: string; source: string; image?: string }[];
}

interface DynState { loading: boolean; headlines: NewsCategoryData['headlines']; query: string }

async function gnewsClient(query: string): Promise<NewsCategoryData['headlines']> {
  const key = process.env.NEXT_PUBLIC_GNEWS_KEY ?? '';
  if (!key || !query) return [];
  try {
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=4&sortby=publishedAt&apikey=${key}`,
      { signal: AbortSignal.timeout(6000) },
    );
    if (!res.ok) return [];
    const d = await res.json();
    const articles = Array.isArray(d?.articles) ? d.articles : [];
    return articles.map((a: any) => ({
      title: String(a?.title ?? ''),
      source: typeof a?.source === 'string' ? a.source : (a?.source?.name ?? 'Wire'),
      image: typeof a?.image === 'string' && a.image.startsWith('http') ? a.image : undefined,
    })).filter((h: { title: string }) => h.title);
  } catch {
    return [];
  }
}

export default function NewsTabs({ categories }: { categories: NewsCategoryData[] }) {
  const [active, setActive] = useState(0);
  const { visitor } = useVisitorCity();
  const [country, setCountry] = useState<string | null>(null);
  const [dyn, setDyn] = useState<Record<string, DynState>>({});

  // Resolve the visitor's country (name only) from the same keyless
  // IP lookup the location fallback uses. Runs only after opt-in.
  useEffect(() => {
    if (!visitor || country) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(6000) });
        if (!res.ok) return;
        const d = await res.json();
        if (!cancelled && d?.success && d?.country) setCountry(String(d.country));
      } catch { /* country stays unknown; the tab shows the quiet note */ }
    })();
    return () => { cancelled = true; };
  }, [visitor, country]);

  const tabs: (NewsCategoryData & { dynamic?: 'country' | 'city' })[] = [...categories];
  if (visitor) {
    tabs.push({
      slug: 'your-country',
      label: country ? `Your Country: ${country}` : 'Your Country',
      headlines: [],
      dynamic: 'country',
    });
    tabs.push({
      slug: 'your-city',
      label: `Your City: ${visitor.name}`,
      headlines: [],
      dynamic: 'city',
    });
  }
  const current = tabs[Math.min(active, tabs.length - 1)];

  // Lazy-fetch a personal tab's headlines the first time it opens,
  // keyed by the query so a country that resolves late refetches.
  useEffect(() => {
    if (!current?.dynamic) return;
    const slug = current.slug;
    const query = current.dynamic === 'country' ? (country ?? '') : (visitor?.name ?? '');
    if (!query) return;
    if (dyn[slug]?.query === query) return;
    setDyn((s) => ({ ...s, [slug]: { loading: true, headlines: [], query } }));
    gnewsClient(query).then((headlines) => {
      setDyn((s) => (s[slug]?.query === query ? { ...s, [slug]: { loading: false, headlines, query } } : s));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.slug, current?.dynamic, country]);

  const currentHeadlines = current?.dynamic ? (dyn[current.slug]?.headlines ?? []) : (current?.headlines ?? []);
  const currentLoading = current?.dynamic
    ? (dyn[current.slug]?.loading ?? (current.dynamic === 'country' && !country))
    : false;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="News categories">
        {tabs.map((c, i) => (
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
      {currentLoading ? (
        <p className="sub-desc">Loading the latest headlines…</p>
      ) : currentHeadlines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentHeadlines.map((h, i) => (
            <Link key={i} href="/news" className="rounded-xl t-card border t-border px-4 py-3 t-border-hover-25 transition-colors no-underline flex gap-3 items-start">
              {h.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={h.image} alt="" aria-hidden="true" width={96} height={64} loading="lazy" decoding="async" className="w-24 h-16 shrink-0 rounded-lg object-cover" />
              )}
              <div className="min-w-0">
                <div className="t-text-90 font-medium text-sm leading-snug">{h.title}</div>
                <div className="sub-desc mt-1">{h.source} · read on the news page</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="sub-desc">
          This category's feed is quiet right now. The news page carries the full wire.
        </p>
      )}
    </div>
  );
}
