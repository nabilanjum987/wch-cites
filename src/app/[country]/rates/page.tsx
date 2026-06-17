import type { Metadata } from 'next';
import RatesPageClient from '@/components/rates/RatesPageClient';

interface PageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const countryName = country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${countryName} Rates — Gold, Currency, Crypto & Oil Prices | WorldCityHub`,
    description: `Live gold, currency, crypto, oil and fuel rates for ${countryName}. Open market vs interbank, Zakat nisab calculator, remittance tools.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/rates` },
  };
}

export default async function CountryRatesPage({ params }: PageProps) {
  const { country } = await params;
  return <RatesPageClient countrySlug={country} />;
}
