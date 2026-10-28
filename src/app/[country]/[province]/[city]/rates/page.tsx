import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import RatesPageClient from '@/components/rates/RatesPageClient';
import CityPageImage from '@/components/city/CityPageImage';

import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, cityJsonLd, citySubpageCrumbs, titleCaseSlug } from '@/lib/seo/breadcrumbs';
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
  const { country, province, city } = await params;
  // Server-fetch the real gold (gold-api XAU spot; CoinGecko PAXG for
  // history/change only) + crypto data so the raw HTML carries live
  // rates; the client still refreshes on mount as before.
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
  // P6: subpages had no JSON-LD — BreadcrumbList + City (name/URL only).
  // This template fetches no city record, so names come from the route
  // slugs, the same derivation the other templates use as their fallback.
  const cityName = titleCaseSlug(city);
  const provinceName = titleCaseSlug(province);
  const countryName = titleCaseSlug(country);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(citySubpageCrumbs(countryName, country, provinceName, province, cityName, city, 'Rates', 'rates'))} />
      <JsonLd data={cityJsonLd(cityName, city, provinceName, province, countryName, country)} />
      <CityPageImage citySlug={city} variant="rates" />
      <RatesPageClient
        countrySlug={country}
        initialRates={initialRates}
        initialCrypto={initialCrypto}
      />
    </>
  );
}
