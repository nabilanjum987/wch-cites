import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import EconomyPageClient from '@/components/economy/EconomyPageClient';
import { fetchWorldBankLatest, buildMiseryIndex, MISERY_META, countrySlugToIso2, type WBValues } from '@/lib/apis/worldbank';

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  const cityName = cityData?.name ?? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${cityName} Economy — GDP, Inflation & Jobs | WorldCityHub`,
    description: `${cityName} economy data: GDP, inflation, jobs, purchasing power, trade and financial intelligence for ${cityName}, ${countryName}.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/economy` },
  };
}

export default async function EconomyPage({ params }: PageProps) {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);

  // Real indicators from the World Bank (Batch 3b) — replaces the static
  // COUNTRY_ECONOMY snapshot table. Country code comes from the city
  // record (ISO2); the misery comparison needs the other countries too,
  // fetched in the same batched call set.
  const iso2 = (cityData?.country_code as string | undefined) ?? countrySlugToIso2(country);
  let wb: WBValues | null = null;
  let miseryData = null as ReturnType<typeof buildMiseryIndex> | null;
  try {
    const codes = Array.from(new Set([iso2, ...MISERY_META.map(m => m.iso2)]));
    const map = await fetchWorldBankLatest(codes);
    wb = map[iso2] ?? null;
    const rows = buildMiseryIndex(map);
    miseryData = rows.length > 0 ? rows : null;
  } catch { /* WB unavailable — client shows an honest reduced page */ }

  return (
    <EconomyPageClient
      country={country}
      province={province}
      citySlug={city}
      cityData={cityData}
      wb={wb}
      miseryData={miseryData}
    />
  );
}
