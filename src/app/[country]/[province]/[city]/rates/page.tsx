import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import RatesPageClient from '@/components/rates/RatesPageClient';

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  const cityName = cityData?.name ?? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${cityName} Rates — Gold, Currency, Crypto, Oil & Fuel Prices | WorldCityHub`,
    description: `Live gold rates, currency exchange, crypto prices, oil & fuel costs in ${cityName}, ${countryName}. Open market vs interbank, Zakat nisab, remittance calculator.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/rates` },
  };
}

export default async function CityRatesPage({ params }: PageProps) {
  const { country } = await params;
  return <RatesPageClient countrySlug={country} />;
}
