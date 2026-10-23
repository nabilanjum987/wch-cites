import { gnewsSearch } from '@/lib/apis/news';
import NewsTabs, { type NewsCategoryData } from './NewsTabs';

// News panel (§14) — SERVER component. Fetches a GNews headline list
// per frozen category (30-minute Next cache keeps the free quota
// sane) and hands them to the tab switcher. A category whose feed
// returns nothing renders an honest quiet note, never filler stories.

const CATEGORIES: { slug: string; label: string; query: string }[] = [
  { slug: 'world', label: 'World', query: 'world news' },
  { slug: 'pakistan', label: 'Pakistan', query: 'Pakistan' },
  { slug: 'finance', label: 'Finance', query: 'stock markets economy finance' },
  { slug: 'crypto', label: 'Crypto', query: 'cryptocurrency bitcoin' },
  { slug: 'health', label: 'Health', query: 'health medicine' },
  { slug: 'science', label: 'Science', query: 'science discovery' },
  { slug: 'technology', label: 'Technology', query: 'technology' },
  { slug: 'sports', label: 'Sports', query: 'sports' },
];

export default async function NewsPanel() {
  const categories: NewsCategoryData[] = await Promise.all(
    CATEGORIES.map(async (c) => {
      const articles = await gnewsSearch(c.query, 'en', 4, c.slug, '', 1800).catch(() => []);
      return {
        slug: c.slug,
        label: c.label,
        headlines: articles.map((a) => ({
          title: a.title,
          source: typeof a.source === 'string' ? a.source : (a.source as any)?.name ?? 'Wire',
        })),
      };
    }),
  );
  return <NewsTabs categories={categories} />;
}
