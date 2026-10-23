import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { fetchWorldNews, timeAgo, regionForCountry } from '@/lib/apis/news';

// Homepage world-news section — SERVER component rendering REAL
// aggregated headlines (GNews.io top stories).
// The previous version hard-coded eight invented headlines with fake
// timestamps attributed to real publishers (Reuters, Dawn, BBC...) —
// removed under the same fix as the /news page. When the feed is
// unavailable the section shows an honest note instead of fiction.

const regionColors: Record<string, string> = {
  'Middle East': 'text-amber-400 bg-amber-400/10',
  'Asia':        'text-cyan-400 bg-cyan-400/10',
  'Europe':      'text-blue-400 bg-blue-400/10',
  'Americas':    'text-red-400 bg-red-400/10',
  'Africa':      'text-emerald-400 bg-emerald-400/10',
  'Oceania':     'text-teal-400 bg-teal-400/10',
};

export default async function WorldNewsSection() {
  const articles = await fetchWorldNews(6);
  const items = articles.map((a) => ({
    region: regionForCountry(a.country || ''),
    headline: a.title,
    source: typeof a.source === 'string' ? a.source : a.source.name,
    time: timeAgo(a.publishedAt),
    url: a.url,
  }));

  return (
    <div className="mb-4">
      {/* SEO Paragraph */}
      <p className="sub-desc mb-8 max-w-4xl">
        Stay on top of what is happening across the world right now. WorldCityHub pulls together
        news from Asia, the Middle East, Europe, the Americas, Africa, and Oceania, covering
        politics, economy, culture, and society. Every headline links to the original publisher,
        and the full news page lets you browse the latest stories by region.
      </p>

      {items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center mb-6">
          <p className="sub-desc">
            Live headlines are unavailable right now — we never fill this space with placeholder
            stories. City news pages carry the latest local coverage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all group no-underline"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${regionColors[item.region] || 'text-gray-400 bg-gray-400/10'}`}>
                    {item.region}
                  </span>
                  <span className="text-gray-500 text-xs">{item.time}</span>
                </div>
                <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
                  {item.headline}
                </p>
                <p className="text-gray-500 text-xs mt-2">{item.source}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1 group-hover:text-indigo-400 transition-colors" />
            </a>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Link
          href="/news"
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all hover:border-indigo-400/50"
        >
          Browse world news by region
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
