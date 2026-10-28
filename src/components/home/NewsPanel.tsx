import { gnewsSearch } from '@/lib/apis/news';
import NewsTabs, { type NewsCategoryData } from './NewsTabs';

// News panel (§14) — SERVER component. Fetches a GNews headline list
// per frozen category (30-minute Next cache keeps the free quota
// sane) and hands them to the tab switcher. A category whose feed
// returns nothing renders an honest quiet note, never filler stories.
// Homepage-imagery pass (2026-10-28): headlines now carry the
// thumbnail the GNews API provides for that article (its own
// publisher image URL — the API's thumbnail, not a vendored file, and
// not a new hotlink invented by this PR: the /news hub already renders
// these same URLs). Cards whose article provides no thumbnail stay
// text cards, and the section always has one real banner image: a
// historic newspaper front page (New York Times, 11 Nov 1918, public
// domain, vendored under public/images/home28/; record in
// docs/media-registry/subjects/homepage-imagery-2026-10-28.json),
// captioned with its date so it is never mistaken for today's news.

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
          image: typeof a.image === 'string' && a.image.startsWith('http') ? a.image : undefined,
        })),
      };
    }),
  );
  return (
    <div>
      <figure className="relative h-40 sm:h-48 overflow-hidden rounded-2xl border t-border mb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/home28/news-banner.webp" alt="The front page of the New York Times, 11 November 1918" width={900} height={400} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
        <figcaption className="absolute bottom-0 right-0 bg-black/60 text-white/70 text-[11px] px-2.5 py-1 rounded-tl-lg">
          A newspaper front page, 11 Nov 1918 — public domain
        </figcaption>
      </figure>
      <NewsTabs categories={categories} />
    </div>
  );
}
