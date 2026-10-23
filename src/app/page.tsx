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

// ── Structured data (CARD A, 2026-10-23) ──────────────────────────────────
// The homepage carried NO JSON-LD. Organization + WebSite below are
// built only from the site's real identity data (the same name, URL
// and description as the page metadata above). SearchAction is
// deliberately NOT included: the site has no search-results URL —
// the header SearchBar is a typeahead that navigates straight to a
// city/country page (window.location.href = selected.href), so a
// SearchAction urlTemplate would fabricate an endpoint that does not
// exist. It can be added the day a real /search route ships.
const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'WorldCityHub',
      url: 'https://worldcityhub.vercel.app',
      description:
        'Every city, live: real weather, prayer times, gold and currency rates, news and events for cities worldwide — starting with Pakistan, free forever.',
    },
    {
      '@type': 'WebSite',
      name: 'WorldCityHub',
      url: 'https://worldcityhub.vercel.app',
      inLanguage: 'en',
      publisher: {
        '@type': 'Organization',
        name: 'WorldCityHub',
        url: 'https://worldcityhub.vercel.app',
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
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
    </>
  );
}
