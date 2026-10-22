// ── WorldCityHub — verified-outlet RSS layer (WP8 / marathon Q13) ──────────
// Server-side RSS reading for outlets the news spec names. Rules from
// the spec: headline + source + link + time ONLY (no full text, no
// editorialising); items are timestamped and stale items fall off in
// the category layer (src/lib/apis/news.ts).
//
// No new dependencies: a small, defensive string parser handles the
// RSS 2.0 / RDF shapes these feeds publish (CDATA + entity decoding).
// Any feed that fails returns [] — the system shows less, never fake.

export interface RssItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string; // ISO
  category: string;    // WchNewsCategory key of the owning category fn
}

export interface RssFeedDef {
  source: string;
  url: string;
  category: string;
}

// Verified outlets (all probed live 2026-10-22, HTTP 200).
export const RSS_FEEDS: RssFeedDef[] = [
  { source: 'BBC News',    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',            category: 'world' },
  { source: 'Al Jazeera',  url: 'https://www.aljazeera.com/xml/rss/all.xml',               category: 'world' },
  { source: 'UN News',     url: 'https://news.un.org/feed/subscribe/en/news/all/rss.xml',  category: 'world' },
  { source: 'Dawn',        url: 'https://www.dawn.com/feeds/home',                         category: 'pakistan' },
  { source: 'ScienceDaily', url: 'https://www.sciencedaily.com/rss/all.xml',               category: 'science' },
  { source: 'NASA',        url: 'https://www.nasa.gov/news-release/feed/',                 category: 'science' },
  { source: 'CoinDesk',    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',         category: 'crypto' },
  { source: 'WHO',         url: 'https://www.who.int/rss-feeds/news-english.xml',          category: 'health' },
];

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decodeEntities(m[1]) : '';
}

function linkOf(block: string): string {
  // RSS 2.0: <link>URL</link>. Atom-ish fallback: <link href="URL"/>.
  const plain = tag(block, 'link');
  if (plain) return plain;
  const m = block.match(/<link[^>]*href="([^"]+)"/i);
  return m ? m[1] : '';
}

export function parseRss(xml: string, feed: RssFeedDef, limit = 15): RssItem[] {
  const items: RssItem[] = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  for (const block of blocks) {
    const title = tag(block, 'title');
    const url = linkOf(block);
    if (!title || !url) continue;
    const rawDate = tag(block, 'pubDate') || tag(block, 'dc:date') || tag(block, 'date');
    const parsed = rawDate ? new Date(rawDate) : null;
    items.push({
      title,
      url,
      source: feed.source,
      publishedAt: parsed && !Number.isNaN(parsed.getTime())
        ? parsed.toISOString()
        : new Date().toISOString(),
      category: feed.category,
    });
    if (items.length >= limit) break;
  }
  return items;
}

export async function fetchRssFeed(feed: RssFeedDef, revalidate = 1800): Promise<RssItem[]> {
  try {
    const res = await fetch(feed.url, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'WorldCityHub/1.0 (+https://worldcityhub.vercel.app)' },
      next: { revalidate },
    } as RequestInit);
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRss(xml, feed);
  } catch {
    return [];
  }
}

export async function fetchRssByCategory(category: string): Promise<RssItem[]> {
  const feeds = RSS_FEEDS.filter((f) => f.category === category);
  const results = await Promise.all(feeds.map((f) => fetchRssFeed(f)));
  return results.flat();
}
