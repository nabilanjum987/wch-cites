import type { Metadata } from 'next';
import NewsClient, { type WorldNewsItem } from './NewsClient';
import { fetchWorldNews, timeAgo } from '@/lib/apis/news';

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

const REGION_BY_COUNTRY: Record<string, string> = {};
for (const c of ['Pakistan', 'India', 'Bangladesh', 'Sri Lanka', 'China', 'Japan', 'Indonesia', 'Malaysia', 'Singapore', 'Philippines', 'Thailand', 'Vietnam', 'Nepal', 'Myanmar']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Asia';
for (const c of ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman', 'Iraq', 'Iran', 'Israel', 'Jordan', 'Lebanon', 'Bahrain', 'Yemen']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Middle East';
for (const c of ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Poland', 'Ukraine', 'Russia', 'Switzerland', 'Belgium', 'Austria', 'Greece', 'Portugal', 'Denmark', 'Finland', 'Ireland', 'Czech Republic', 'Romania', 'Hungary']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Europe';
for (const c of ['United States of America', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Americas';
for (const c of ['Egypt', 'Nigeria', 'South Africa', 'Kenya', 'Ethiopia', 'Morocco', 'Algeria', 'Ghana', 'Tanzania', 'Sudan']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Africa';
for (const c of ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Oceania';

export default async function Page() {
  const articles = await fetchWorldNews(12);
  const items: WorldNewsItem[] = articles.map((a) => ({
    region: REGION_BY_COUNTRY[(a.country || '').toLowerCase()] || 'All',
    headline: a.title,
    source: typeof a.source === 'string' ? a.source : a.source.name,
    time: timeAgo(a.publishedAt),
    url: a.url,
  }));
  return <NewsClient items={items} />;
}
