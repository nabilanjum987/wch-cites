import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import EconomyPageClient from '@/components/economy/EconomyPageClient';
import CityPageImage from '@/components/city/CityPageImage';

import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, cityJsonLd, citySubpageCrumbs, titleCaseSlug } from '@/lib/seo/breadcrumbs';
import { getCountryEconomy, resolveIso2, type WBValues } from '@/lib/apis/worldbank';

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  const cityName = cityData?.name ?? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${cityName} Economy — GDP & Inflation | WorldCityHub`,
    description: `${cityName} economy data: GDP, inflation, jobs, purchasing power, trade and financial intelligence for ${cityName}, ${countryName}.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/economy` },
  };
}

export default async function EconomyPage({ params }: PageProps) {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);

  // Real indicators from the World Bank (Batch 3b) — replaces the static
  // COUNTRY_ECONOMY snapshot table. PC1 fix: the ISO2 code is resolved
  // canonically from the country slug (the explicit map wins over any
  // stored/fallback record's country_code — the pre-fix order let a
  // generated "PA" (Panama) code through for Islamabad), and the page's
  // values AND its Misery table come from ONE cached dataset
  // (getCountryEconomy), so the meter can never contradict the table.
  const iso2 = resolveIso2(country, cityData?.country_code as string | undefined);
  let wb: WBValues | null = null;
  let miseryData = null as Awaited<ReturnType<typeof getCountryEconomy>>['misery'] | null;
  try {
    const eco = await getCountryEconomy(iso2);
    wb = Object.keys(eco.values).length > 0 ? eco.values : null;
    miseryData = eco.misery.length > 0 ? eco.misery : null;
  } catch { /* WB unavailable — client shows an honest reduced page */ }

  // P6: subpages had no JSON-LD — BreadcrumbList + City (name/URL only).
  const cityName = cityData?.name ?? titleCaseSlug(city);
  const provinceName = cityData?.province ?? titleCaseSlug(province);
  const countryName = cityData?.country ?? titleCaseSlug(country);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(citySubpageCrumbs(countryName, country, provinceName, province, cityName, city, 'Economy', 'economy'))} />
      <JsonLd data={cityJsonLd(cityName, city, provinceName, province, countryName, country)} />
      <CityPageImage citySlug={city} variant="economy" />
      <EconomyPageClient
        country={country}
        province={province}
        citySlug={city}
        cityData={cityData}
        wb={wb}
        miseryData={miseryData}
      />
    </>
  );
}
