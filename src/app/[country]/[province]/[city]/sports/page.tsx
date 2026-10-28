import type { Metadata } from 'next';
import SportsPage from './SportsClient';
import CityPageImage from '@/components/city/CityPageImage';
import { getCityData } from '@/lib/getCityData';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, cityJsonLd, citySubpageCrumbs, titleCaseSlug } from '@/lib/seo/breadcrumbs';

// Server wrapper: the interactive sports page lives in SportsClient.tsx
// (a client component). Metadata must be exported from a server
// component, so it lives here — every city gets its own unique title,
// description and self-referencing canonical.

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

const titleCase = (s: string) =>
  s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const city = titleCase(p.city);
  const province = titleCase(p.province);
  const country = titleCase(p.country);
  // A6 (final30): the primary sports keyword "cricket live score today"
  // targets exactly ONE page — Lahore sports (one keyword → one page).
  // Karachi and every other city keep the generic sports title.
  const isLahore = p.city === 'lahore';
  const title = isLahore
    ? `Cricket Live Score Today — Lahore Sports | WorldCityHub`
    : `${city} Sports — Fixtures & Results | WorldCityHub`;
  const description = isLahore
    ? `Cricket live score today in Lahore: live scores, fixtures and results, plus Gaddafi Stadium Lahore, home of Lahore Qalandars.`
    : `${city} sports: teams, fixtures, results, stadiums and athletes from ${city}, ${province}, ${country} — updated daily.`;
  const canonical = `https://worldcityhub.vercel.app/${p.country}/${p.province}/${p.city}/sports`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

export default async function Page({ params }: PageProps) {
  const p = await params;
  const initialCity = await getCityData(p.country, p.province, p.city);
  // P6: subpages had no JSON-LD — BreadcrumbList + City (name/URL only).
  const cityName = initialCity?.name ?? titleCaseSlug(p.city);
  const provinceName = initialCity?.province ?? titleCaseSlug(p.province);
  const countryName = initialCity?.country ?? titleCaseSlug(p.country);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(citySubpageCrumbs(countryName, p.country, provinceName, p.province, cityName, p.city, 'Sports', 'sports'))} />
      <JsonLd data={cityJsonLd(cityName, p.city, provinceName, p.province, countryName, p.country)} />
      <CityPageImage citySlug={p.city} variant="sports" />
      <SportsPage initialCity={initialCity} />
    </>
  );
}
