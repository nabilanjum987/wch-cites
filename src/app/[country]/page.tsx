import type { Metadata } from 'next';
import { Suspense } from 'react';
import CountryPage from './CountryClient';
import CountryInventory from '@/components/shared/CountryInventory';
import ImproveCTA from '@/components/shared/ImproveCTA';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, countryCrumbs, countryJsonLd, titleCaseSlug } from '@/lib/seo/breadcrumbs';
import { fetchWorldBankLatest, countrySlugToIso2, type WBValues } from '@/lib/apis/worldbank';
import { gnewsSearch, type NewsArticle } from '@/lib/apis/news';

// Server wrapper: the interactive country page lives in CountryClient.tsx.
// Metadata must be exported from a server component, so it lives here —
// every country gets its own unique title, description and canonical.

interface PageProps {
  params: Promise<{ country: string }>;
}

const titleCase = (s: string) =>
  s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const country = titleCase(p.country);
  const title = `${country} — Cities, Weather & Prayer | WorldCityHub`;
  const description = `${country}: provinces and cities with live weather, prayer times, gold & currency rates, news, economy and culture — the ${country} guide.`;
  const canonical = `https://worldcityhub.vercel.app/${p.country}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

export default async function Page({ params }: PageProps) {
  const p = await params;
  // FIX-POP1: population comes from the World Bank (SP.POP.TOTL, latest
  // year) via the same worldbank.ts path as the economy data — never a
  // hard-coded figure. Null when the WB is unreachable; the client then
  // falls back to its dated static value.
  const iso2 = countrySlugToIso2(p.country);
  const countryName = titleCaseSlug(p.country);
  // Speed pass (2026-11-03): the World Bank figures and the GNews list
  // are independent of each other, so they are fetched in parallel
  // instead of two sequential round-trips. (The news gating is
  // unchanged: only the three template countries fetch, to stay inside
  // the free plan's daily quota.)
  const [wb, news] = await Promise.all([
    fetchWorldBankLatest([iso2]),
    ['pakistan', 'india', 'united-states'].includes(p.country)
      ? gnewsSearch(countryName, 'en', 6, 'all', countryName, 3600)
      : Promise.resolve([] as NewsArticle[]),
  ]);
  const wbPopulation = wb[iso2]?.population ?? null;
  // Economy figures come from the SAME World Bank result (one consistent
  // source for the whole page): the client renders these with their data
  // years and hides any figure the Bank did not return, instead of the
  // old undated static table (Pakistan inflation 28.2%, a 2023 figure
  // that read as current).
  const wbAll = wb[iso2] ?? {};
  const wbEconomy: WBValues = {};
  for (const key of ['gdpUsd', 'gdpGrowth', 'inflation', 'unemployment'] as const) {
    if (wbAll[key]) wbEconomy[key] = wbAll[key];
  }
  // News: the same GNews plumbing that powers the homepage and city
  // pages (gnewsSearch), fetched in the parallel batch above; an empty
  // result renders an honest empty state in the client, never sample
  // headlines.
  // P6: country pages had no JSON-LD at all — BreadcrumbList + Country.
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(countryCrumbs(countryName, p.country))} />
      <JsonLd data={countryJsonLd(countryName, p.country)} />
      <CountryPage wbPopulation={wbPopulation} wbEconomy={wbEconomy} news={news} />
      {/* Speed pass (2026-11-03): the coverage inventory is a
          below-the-fold Supabase read; it streams in behind Suspense
          (null fallback, the root layout's ticker pattern) instead of
          holding the whole page's first byte. */}
      <Suspense fallback={null}>
        <CountryInventory countrySlug={p.country} />
      </Suspense>
      <ImproveCTA country={p.country} label={titleCase(p.country)} />
    </>
  );
}
