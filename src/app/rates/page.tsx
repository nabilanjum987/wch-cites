import type { Metadata } from 'next';
import WorldRatesPage from './RatesClient';
import JsonLd from '@/components/seo/JsonLd';
import { hubBreadcrumbJsonLd, hubWebPageJsonLd } from '@/lib/seo/hub';
import { fetchGoldRates, fetchSilverRates, fetchCryptoData, fetchCurrencyPairs } from '@/lib/apis/rates';

const DESCRIPTION =
  'Live world rates: gold and silver prices, Bitcoin and crypto, oil and currency exchange rates for every country and city, updated daily.';

// Server wrapper: the interactive world rates page lives in
// RatesClient.tsx. Static metadata lives here (Page 7A, World Rates).

export const metadata: Metadata = {
  title: 'World Rates: Gold, Crypto & Currencies | WorldCityHub',
  description: DESCRIPTION,
  alternates: { canonical: 'https://worldcityhub.vercel.app/rates' },
  openGraph: {
    title: 'World Rates: Gold, Crypto & Currencies | WorldCityHub',
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
  // visible answer layer inside RatesClient (its FaqBlock, which is
  // also this page's Questions block for the hubs family pass: question
  // headings with direct answers composed from this page's live gold
  // and USD/PKR figures, FAQPage schema emitted from the same array),
  // so exactly one FAQPage remains after the merge. This branch's
  // schema-only emission was removed.
  // WebPage + BreadcrumbList (hubs family fix, 3 Nov 2026) are added
  // here in the server wrapper, alongside that existing FAQPage.
  return (
    <>
      <JsonLd data={hubWebPageJsonLd('World Rates: Gold, Crypto & Currencies', '/rates', DESCRIPTION)} />
      <JsonLd data={hubBreadcrumbJsonLd('Rates', '/rates')} />
      <WorldRatesPage
        initialRates={initialRates}
        initialSilver={initialSilver}
        initialCrypto={initialCrypto}
        initialPairs={initialPairs}
      />
    </>
  );
}
