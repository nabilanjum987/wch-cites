import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import RatesPageClient from '@/components/rates/RatesPageClient';
import CityPageImage from '@/components/city/CityPageImage';

import { fetchGoldRates, fetchCryptoData } from '@/lib/apis/rates';
import { COUNTRY_CURRENCIES, type CurrencyInfo } from '@/types/city';

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  const cityName = cityData?.name ?? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${cityName} Gold & Currency Rates Today | WorldCityHub`,
    description: `Live gold, currency and crypto rates in ${cityName}, ${countryName}: interbank rates, Zakat nisab and a remittance calculator.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/rates` },
  };
}

export default async function CityRatesPage({ params }: PageProps) {
  const { country, city } = await params;
  // Server-fetch the real gold + crypto data (CoinGecko) so the raw HTML
  // carries live rates; the client still refreshes on mount as before.
  const currency: CurrencyInfo = COUNTRY_CURRENCIES[country] ?? {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1,
    rate_to_usd: 1,
    flag: 'US',
  };
  const [initialRates, initialCrypto] = await Promise.all([
    fetchGoldRates(currency.rate_to_usd, currency.code, currency.symbol),
    fetchCryptoData(currency.rate_to_usd, currency.code, currency.symbol),
  ]);
  return (
    <>
      <CityPageImage citySlug={city} variant="rates" />
      <RatesPageClient
      countrySlug={country}
      initialRates={initialRates}
      initialCrypto={initialCrypto}
      />
    </>
  );
}
