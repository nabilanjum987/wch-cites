import type { Metadata } from 'next';
import WorldRatesPage from './RatesClient';

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

export default function Page() {
  return <WorldRatesPage />;
}
