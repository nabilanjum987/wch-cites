import type { Metadata } from 'next';
import Link from 'next/link';
import NewsClient, { type WorldNewsItem } from './NewsClient';
import JsonLd from '@/components/seo/JsonLd';
import { hubBreadcrumbJsonLd, hubWebPageJsonLd } from '@/lib/seo/hub';
import { HubQuestions, type AeoFaq } from '@/components/aeo/HubQuestions';
import { fetchWorldNews, gnewsSearch, timeAgo, regionForCountry, type NewsArticle } from '@/lib/apis/news';

const DESCRIPTION =
  'Aggregated world news by country and city: top stories, business, sports and culture from trusted publishers, refreshed every 15 minutes.';

// AEO questions (hubs family fix, 3 Nov 2026): composed only from this
// hub's own stated method and its own category list, as described in
// NewsClient's intro copy. The same array renders visibly and emits
// the FAQPage schema (HubQuestions).
const NEWS_FAQS: AeoFaq[] = [
  {
    q: 'Where do the headlines on this page come from?',
    a: 'Every headline here is aggregated from established publishers through GNews and links straight to the original story at its source. The page shows the headline, the publisher and the time, refreshed every 15 minutes, with nothing rewritten and nothing invented.',
  },
  {
    q: 'Does WorldCityHub write its own news?',
    a: 'No. WorldCityHub writes no news of its own and fills this page with no placeholder stories. When the feed is unavailable, the page says so plainly, and the city news pages for Lahore and Karachi carry the latest local coverage in the meantime.',
  },
  {
    q: 'What news categories can I follow here?',
    a: 'The hub carries eight category streams: World, Pakistan, Finance, Crypto, Health, Discoveries & Science, Technology and Sports, selected from the category bar above the headlines. Local coverage runs on the city news pages, including Lahore and Karachi.',
  },
];

// News hub categories (news system spec, Sayyed's list). The hub's
// categorized view lives on this page via ?category=, the pattern the
// frozen link map (§14) sanctions. Per-category PAGES (/news/<category>)
// are a separate stack (Q13); nothing here links to them until they
// render real content (Link Laws L1/L6). Feeds use the existing GNews
// functions only; a category whose feed is empty shows the hub's honest
// unavailable state, never invented headlines.
const HUB_CATEGORIES = [
  { slug: 'world', label: 'World' },
  { slug: 'pakistan', label: 'Pakistan' },
  { slug: 'finance', label: 'Finance' },
  { slug: 'crypto', label: 'Crypto' },
  { slug: 'health', label: 'Health' },
  { slug: 'science', label: 'Discoveries & Science' },
  { slug: 'technology', label: 'Technology' },
  { slug: 'sports', label: 'Sports' },
] as const;

type HubCategory = (typeof HUB_CATEGORIES)[number]['slug'];

async function fetchHubCategory(slug: HubCategory): Promise<NewsArticle[]> {
  switch (slug) {
    case 'world':
      return fetchWorldNews(24);
    case 'pakistan':
      return gnewsSearch('Pakistan', 'en', 10, 'all', 'PK');
    case 'finance':
      return gnewsSearch('stock market finance economy', 'en', 10, 'finance', '');
    case 'crypto':
      return gnewsSearch('bitcoin cryptocurrency', 'en', 10, 'finance', '');
    case 'health':
      return gnewsSearch('health medicine', 'en', 10, 'health', '');
    case 'science':
      return gnewsSearch('science discovery research', 'en', 10, 'tech', '');
    case 'technology':
      return gnewsSearch('technology', 'en', 10, 'tech', '');
    case 'sports':
      return gnewsSearch('sports', 'en', 10, 'sports', '');
  }
}

// Server wrapper for the global news page. The old page hard-coded twelve
// invented headlines with fake timestamps attributed to real publishers,
// a direct violation of the locked news spec (aggregate only, real
// sources, refresh every 15 minutes). It now renders real GNews.io top
// headlines fetched on the server, or an honest unavailable state.

export const metadata: Metadata = {
  title: 'World News: Top Stories by City & Country | WorldCityHub',
  description: DESCRIPTION,
  alternates: { canonical: 'https://worldcityhub.vercel.app/news' },
  openGraph: {
    title: 'World News: Top Stories by City & Country | WorldCityHub',
    description:
      'Aggregated world news by country and city from trusted publishers, refreshed every 15 minutes.',
    url: 'https://worldcityhub.vercel.app/news',
    siteName: 'WorldCityHub',
    type: 'website',
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active: HubCategory =
    HUB_CATEGORIES.find((c) => c.slug === category)?.slug ?? 'world';
  const articles = await fetchHubCategory(active);
  const items: WorldNewsItem[] = articles.map((a) => ({
    region: regionForCountry(a.country || ''),
    headline: a.title,
    source: typeof a.source === 'string' ? a.source : a.source.name,
    time: timeAgo(a.publishedAt),
    url: a.url,
  }));
  return (
    <>
      <JsonLd data={hubWebPageJsonLd('World News: Top Stories by City & Country', '/news', DESCRIPTION)} />
      <JsonLd data={hubBreadcrumbJsonLd('News', '/news')} />
      <nav
        aria-label="News categories"
        className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pt-6"
      >
        {HUB_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={c.slug === 'world' ? '/news' : `/news?category=${c.slug}`}
            aria-current={active === c.slug ? 'page' : undefined}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              active === c.slug
                ? 'border-cyan-400/60 bg-cyan-400/15 font-semibold text-cyan-200'
                : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </nav>
      <NewsClient items={items} />
      <div className="bg-[#0a0e1a] px-6 pb-16 text-white">
        <div className="mx-auto max-w-5xl">
          <HubQuestions
            faqs={NEWS_FAQS}
            source="Answers composed from this page's own description of its aggregation method and category list (GNews, refreshed every 15 minutes)."
          />
        </div>
      </div>
    </>
  );
}
