import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import { notFound } from 'next/navigation';
import EventsPageClient from '@/components/events/EventsPageClient';
import { getApprovedEvents, mapDbEventToCityEvent } from '@/lib/events';
import EventsServerSummary from './EventsServerSummary';

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  const cityName = cityData?.name ?? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${cityName} Events — Things to Do | WorldCityHub`,
    description: `Discover events in ${cityName}, ${countryName}. Sports, music, culture, food festivals, religious events, conferences and more — local to global.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/events` },
  };
}

export default async function EventsPage({ params }: PageProps) {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  if (!cityData) notFound();

  // P2: server-side verified listings (own events table, approved + verified
  // + future only — enforced in getApprovedEvents). Without Supabase env or
  // with the table unapplied this is [] and the page renders its honest
  // parked state; nothing is fabricated to fill the gap.
  const approved = await getApprovedEvents({ citySlug: city, includeNational: true, limit: 100 });
  const cityRows = approved.filter((r) => r.city_slug === city);
  const nationalRows = approved.filter((r) => !r.city_slug);
  const initialDbEvents = approved.map((r) => mapDbEventToCityEvent(r, cityData.name, cityData.country));

  return (
    <>
      <EventsServerSummary
        cityName={cityData.name}
        cityEvents={cityRows}
        nationalEvents={nationalRows}
      />
      <EventsPageClient
        city={cityData}
        country={country}
        province={province}
        citySlug={city}
        initialDbEvents={initialDbEvents}
      />
    </>
  );
}
