import type { Metadata } from 'next';
import PrayerTimesPage from './PrayerTimesClient';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, cityJsonLd, citySubpageCrumbs, titleCaseSlug } from '@/lib/seo/breadcrumbs';

// Server wrapper: the interactive Spiritual & Wellness Hub lives in
// PrayerTimesClient.tsx (a client component). Metadata must be exported
// from a server component, so it lives here — every city gets its own
// unique title, description and self-referencing canonical.

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

const titleCase = (s: string) =>
  s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const city = titleCase(p.city);
  const title = `${city} Prayer Times & Faiths Guide | WorldCityHub`;
  const description = `${city} prayer times for all faiths: live countdown, mosque, church, temple, gurdwara and synagogue times, multi-faith calendar.`;
  const canonical = `https://worldcityhub.vercel.app/${p.country}/${p.province}/${p.city}/prayer-times`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

export default async function Page({ params }: PageProps) {
  // P6: subpages had no JSON-LD — BreadcrumbList + City (name/URL only).
  // Names from the route slugs, the same derivation this template's own
  // metadata title already uses; the client still resolves its own city.
  const p = await params;
  const cityName = titleCaseSlug(p.city);
  const provinceName = titleCaseSlug(p.province);
  const countryName = titleCaseSlug(p.country);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(citySubpageCrumbs(countryName, p.country, provinceName, p.province, cityName, p.city, 'Prayer Times', 'prayer-times'))} />
      <JsonLd data={cityJsonLd(cityName, p.city, provinceName, p.province, countryName, p.country)} />
      <PrayerTimesPage />
    </>
  );
}
