import type { Metadata } from 'next';
import ProvincePage from './ProvinceClient';
import { fetchWorldBankLatest, countrySlugToIso2 } from '@/lib/apis/worldbank';

// Server wrapper: the interactive province page lives in
// ProvinceClient.tsx. Metadata must be exported from a server component,
// so it lives here — every province gets its own unique title,
// description and canonical.

interface PageProps {
  params: Promise<{ country: string; province: string }>;
}

const titleCase = (s: string) =>
  s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const province = titleCase(p.province);
  const country = titleCase(p.country);
  const title = `${province}, ${country} Guide | WorldCityHub`;
  const description = `${province}, ${country}: cities, live weather, famous places, food and culture — the complete guide.`;
  const canonical = `https://worldcityhub.vercel.app/${p.country}/${p.province}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

export default async function Page({ params }: PageProps) {
  const p = await params;
  // FIX-POP1: the province share math divides by the World Bank's latest
  // SP.POP.TOTL for the country (same worldbank.ts path as the economy
  // data). Null when the WB is unreachable; the client then uses its
  // dated Pakistan fallback or hides the share.
  const iso2 = countrySlugToIso2(p.country);
  const wb = await fetchWorldBankLatest([iso2]);
  return <ProvincePage wbCountryPopulation={wb[iso2]?.population ?? null} />;
}
