import type { Metadata } from 'next';
import NewsClient, { type WorldNewsItem } from './NewsClient';
import { fetchWorldNews, timeAgo, regionForCountry } from '@/lib/apis/news';

// Server wrapper for the global news page. The old page hard-coded twelve
// invented headlines with fake timestamps attributed to real publishers —
// a direct violation of the locked news spec (aggregate only, real
// sources, refresh every 15 minutes). It now renders real NewsData.io top
// headlines fetched on the server, or an honest unavailable state.

export const metadata: Metadata = {
  title: 'World News — Top Stories by City & Country | WorldCityHub',
  description:
    'Aggregated world news by country and city: top stories, business, sports and culture from trusted publishers, refreshed every 15 minutes.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/news' },
  openGraph: {
    title: 'World News — Top Stories by City & Country | WorldCityHub',
    description:
      'Aggregated world news by country and city from trusted publishers, refreshed every 15 minutes.',
    url: 'https://worldcityhub.vercel.app/news',
    siteName: 'WorldCityHub',
    type: 'website',
  },
};

export default async function Page() {
  const articles = await fetchWorldNews(12);
  const items: WorldNewsItem[] = articles.map((a) => ({
    region: regionForCountry(a.country || ''),
    headline: a.title,
    source: typeof a.source === 'string' ? a.source : a.source.name,
    time: timeAgo(a.publishedAt),
    url: a.url,
  }));
  return <NewsClient items={items} />;
}
