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

  // ── Schema (SEO completion, Batch 4 Item 1): FAQPage. Every answer
  // is a fact the page itself states — what it tracks (hero), where the
  // figures come from (section notes: gold-api.com spot, CoinGecko,
  // ExchangeRate-API, World Bank; full list on /sources), the feed-down
  // rule (hero), why silver shows no daily change (its section note),
  // and the zakat rule (the calculator's own prose). No live figure is
  // baked into schema — prices change; sources and rules do not.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does the World Rates page track?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The live gold price in every karat, silver, oil and the wider commodity board, the top cryptocurrencies, exchange rates for the currencies Pakistan trades and remits in, world stock indices and the World Bank\u2019s country indicators — one page for the numbers people check every day.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where do the prices and rates on this page come from?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every figure is fetched from a named public source: spot gold and silver via gold-api.com, cryptocurrencies live from CoinGecko, exchange rates via ExchangeRate-API, and country indicators from the World Bank. The full source list is published on the Sources page of this site.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens when a data feed is unavailable?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When a feed is down, its section is left out or reports itself unavailable instead of showing yesterday\u2019s number as today\u2019s.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why is there no daily-change figure for silver?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The source publishes spot silver only, so no daily-change figure is shown rather than an invented one.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is Zakat calculated on this page?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Zakat is charged at 2.5% on qualifying wealth held above the nisab threshold. The calculator on this page values your gold at the live price shown here and compares your total against the nisab before working out what is due.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <WorldRatesPage
        initialRates={initialRates}
        initialSilver={initialSilver}
        initialCrypto={initialCrypto}
        initialPairs={initialPairs}
      />
    </>
  );
}
