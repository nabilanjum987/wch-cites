import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import WebsiteTicker from '@/components/home/WebsiteTicker';
import MyCitySection from '@/components/home/MyCitySection';
import TodaysWorld from '@/components/home/TodaysWorld';
import NewsPanel from '@/components/home/NewsPanel';
import FinanceFigures from '@/components/home/FinanceFigures';
import EventsPanel from '@/components/home/EventsPanel';
import EconomyPanel from '@/components/home/EconomyPanel';
import SportsPanel from '@/components/home/SportsPanel';
import ConflictsPanel from '@/components/home/ConflictsPanel';

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
  return (
    <HomeClient
      newsSlot={<NewsPanel />}
      ticker2Slot={<WebsiteTicker />}
      myCitySlot={<MyCitySection />}
      todaysWorldSlot={<TodaysWorld />}
      financeSlot={<FinanceFigures />}
      eventsSlot={<EventsPanel />}
      economySlot={<EconomyPanel />}
      sportsSlot={<SportsPanel />}
      conflictsSlot={<ConflictsPanel />}
    />
  );
}
