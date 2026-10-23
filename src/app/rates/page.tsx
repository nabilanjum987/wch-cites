import type { Metadata } from 'next';
import WorldRatesPage from './RatesClient';
import { fetchGoldRates, fetchSilverRates, fetchCryptoData, fetchCurrencyPairs } from '@/lib/apis/rates';

// Server wrapper: the interactive world rates page lives in
// RatesClient.tsx. Static metadata lives here (Page 7A — World Rates).

export const metadata: Metadata = {
  title: 'World Rates — Gold, Crypto & Currencies | WorldCityHub',
  description:
    'Live world rates: gold and silver prices, Bitcoin and crypto, oil and currency exchange rates for every country and city, updated daily.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/rates' },
  openGraph: {
    title: 'World Rates — Gold, Crypto & Currencies | WorldCityHub',
    description:
      'Live world rates: gold, crypto, oil and currency exchange rates for every country and city.',
    url: 'https://worldcityhub.vercel.app/rates',
    siteName: 'WorldCityHub',
    type: 'website',
  },
};

export default async function Page() {
  // Server-fetch the real USD gold, crypto and FX data so the raw HTML
  // carries live rates; the client still refreshes on mount as before.
  const [initialRates, initialSilver, initialCrypto, initialPairs] = await Promise.all([
    fetchGoldRates(1, 'USD', '$'),
    fetchSilverRates(1, 'USD', '$'),
    fetchCryptoData(1, 'USD', '$'),
    fetchCurrencyPairs(),
  ]);

  // No FAQPage schema here (merge prep, billi's merge rule): on the
  // rates page the surviving FAQPage is the one emitted from PR #85's
  // visible answer layer, so exactly one FAQPage remains after the
  // merge. This branch's schema-only emission was removed.
  return (
    <WorldRatesPage
      initialRates={initialRates}
      initialSilver={initialSilver}
      initialCrypto={initialCrypto}
      initialPairs={initialPairs}
    />
  );
}
