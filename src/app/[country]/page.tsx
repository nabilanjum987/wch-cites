import type { Metadata } from 'next';
import CountryPage from './CountryClient';
import CountryInventory from '@/components/shared/CountryInventory';
import ImproveCTA from '@/components/shared/ImproveCTA';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, countryCrumbs, countryJsonLd, titleCaseSlug } from '@/lib/seo/breadcrumbs';
import { fetchWorldBankLatest, countrySlugToIso2 } from '@/lib/apis/worldbank';

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
  const wb = await fetchWorldBankLatest([iso2]);
  const wbPopulation = wb[iso2]?.population ?? null;
  // P6: country pages had no JSON-LD at all — BreadcrumbList + Country.
  const countryName = titleCaseSlug(p.country);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(countryCrumbs(countryName, p.country))} />
      <JsonLd data={countryJsonLd(countryName, p.country)} />
      <CountryPage wbPopulation={wbPopulation} />
      <CountryInventory countrySlug={p.country} />
      <ImproveCTA country={p.country} label={titleCase(p.country)} />
    </>
  );
}
