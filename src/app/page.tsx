import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import WorldNewsSection from '@/components/home/WorldNewsSection';
import WebsiteTicker from '@/components/home/WebsiteTicker';

// Server wrapper for the homepage: the interactive page lives in
// HomeClient.tsx, metadata lives here, and the (server-rendered, real
// data) world news section is passed in as a slot.

export const metadata: Metadata = {
  title: 'WorldCityHub — Every City, Live: Weather, Prayer & Rates',
  description:
    'Every city, live: real weather, prayer times, gold and currency rates, news and events for cities worldwide — starting with Pakistan, free forever.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/' },
  openGraph: {
    title: 'WorldCityHub — Every City, Live: Weather, Prayer & Rates',
    description:
      'Real weather, prayer times, rates, news and events for cities worldwide — free forever.',
    url: 'https://worldcityhub.vercel.app/',
    siteName: 'WorldCityHub',
    type: 'website',
  },
};

export default function Page() {
  return <HomeClient newsSlot={<WorldNewsSection />} ticker2Slot={<WebsiteTicker />} />;
}
