import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import RatesPageClient from '@/components/rates/RatesPageClient';
import CityGoldSeo from '@/components/rates/CityGoldSeo';
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
  // A4: the city rates page carries its city's gold keyword in the
  // title (the old "Gold & Currency Rates" title carried no keyword).
  // Lahore 41 chars, Karachi 42, Islamabad 44 — all within ≤60. The
  // description names the live gold figure's source (F4 canonical).
  return {
    title: `Gold Price in ${cityName} Today | WorldCityHub`,
    description: `Gold price in ${cityName} today: live 24K per gram and per tola in PKR from the gold-api XAU spot, plus dollar and currency rates.`,
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
      {/* A4: city gold answer, fed by this page's own server-fetched
          gold rates so it can never disagree with the hero strip. */}
      <CityGoldSeo
        cityName={cityName}
        perGram={initialRates?.per_gram ?? null}
        perTola={initialRates?.per_tola ?? null}
        spotSource={initialRates?.spot_source ?? null}
        lastUpdated={initialRates?.last_updated ?? null}
      />
    </>
  );
}
