import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import EconomyPageClient from '@/components/economy/EconomyPageClient';

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

  return (
    <EconomyPageClient
      country={country}
      province={province}
      citySlug={city}
      cityData={cityData}
    />
  );
}
