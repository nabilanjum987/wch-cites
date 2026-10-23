import type { Metadata } from 'next';
import RatesPageClient from '@/components/rates/RatesPageClient';
import { COUNTRY_CURRENCIES } from '@/types/city';
import { fetchGoldRates, fetchCryptoData, fetchCurrencyPairs, type GoldRates, type CryptoData, type CryptoMarket } from '@/lib/apis/rates';

interface PageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const countryName = country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${countryName} Rates — Gold, Currency & Crypto | WorldCityHub`,
    description: `Live gold, currency, crypto, oil and fuel rates for ${countryName}. Open market vs interbank, Zakat nisab calculator, remittance tools.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/rates` },
  };
}

export default async function CountryRatesPage({ params }: PageProps) {
  const { country } = await params;
  // Server-props routing (Round 2 R1 — resolves the Q11 routed item):
  // RatesPageClient already accepted initialRates/initialCrypto, but
  // this page never passed them, so the country rates page rendered a
  // loading skeleton and fetched everything client-side. The server
  // now resolves the country's currency, takes its LIVE per-USD rate
  // from fetchCurrencyPairs (never the static rate field in
  // COUNTRY_CURRENCIES, which is a stale snapshot), and pre-fetches
  // gold + crypto in that currency. Unknown currency or a failed FX
  // fetch -> no props, and the client behaves exactly as before.
  const currency = COUNTRY_CURRENCIES[country];
  let initialRates: GoldRates | null = null;
  let initialCrypto: { cryptos: CryptoData[]; market: CryptoMarket } | null = null;
  if (currency) {
    const pairs = await fetchCurrencyPairs().catch(() => []);
    const pair = pairs.find((p) => p.code === currency.code);
    const rate = pair?.rate ?? (currency.code === 'USD' ? 1 : null);
    if (rate) {
      [initialRates, initialCrypto] = await Promise.all([
        fetchGoldRates(rate, currency.code, currency.symbol),
        fetchCryptoData(rate, currency.code, currency.symbol),
      ]);
    }
  }
  return (
    <RatesPageClient
      countrySlug={country}
      initialRates={initialRates}
      initialCrypto={initialCrypto}
    />
  );
}
