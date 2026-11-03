import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import { notFound } from 'next/navigation';
import EventsPageClient from '@/components/events/EventsPageClient';
import CityPageImage from '@/components/city/CityPageImage';

import { getApprovedEvents, mapDbEventToCityEvent } from '@/lib/events';
import EventsServerSummary, { eventsFaq } from './EventsServerSummary';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, cityJsonLd, citySubpageCrumbs, titleCaseSlug } from '@/lib/seo/breadcrumbs';

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  const cityName = cityData?.name ?? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${cityName} Events: Things to Do | WorldCityHub`,
    description: `Discover events in ${cityName}, ${countryName}. Sports, music, culture, food festivals, religious events, conferences and more, from local to global.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/events` },
  };
}

export default async function EventsPage({ params }: PageProps) {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  if (!cityData) notFound();

  // P2: server-side verified listings (own events table, approved + verified
  // + future only, enforced in getApprovedEvents). Without Supabase env or
  // with the table unapplied this is [] and the page renders its honest
  // parked state; nothing is fabricated to fill the gap.
  const approved = await getApprovedEvents({ citySlug: city, includeNational: true, limit: 100 });
  const cityRows = approved.filter((r) => r.city_slug === city);
  const nationalRows = approved.filter((r) => !r.city_slug);
  const initialDbEvents = approved.map((r) => mapDbEventToCityEvent(r, cityData.name, cityData.country));

  // P6: subpages had no JSON-LD, BreadcrumbList + City (name/URL only).
  const cityName = cityData?.name ?? titleCaseSlug(city);
  const provinceName = cityData?.province ?? titleCaseSlug(province);
  const countryName = cityData?.country ?? titleCaseSlug(country);
  // E2 (subpages fix B): FAQPage from the same Q&A array the server
  // summary renders visibly, plus one Event node per rendered verified
  // event (city and national rows, exactly the rows the page shows).
  const faq = eventsFaq(cityData.name, countryName, cityRows, nationalRows);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  const eventJsonLd = approved.length > 0 ? {
    '@context': 'https://schema.org',
    '@graph': approved.map((ev) => ({
      '@type': 'Event',
      name: ev.title,
      startDate: ev.starts_at,
      ...(ev.ends_at ? { endDate: ev.ends_at } : {}),
      ...(ev.description ? { description: ev.description } : {}),
      location: {
        '@type': 'Place',
        name: ev.venue || cityData.name,
        address: ev.city_slug ? cityData.name : countryName,
      },
      ...(ev.source_url && (ev.source_url.startsWith('https://') || ev.source_url.startsWith('http://')) ? { url: ev.source_url } : {}),
    })),
  } : null;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(citySubpageCrumbs(countryName, country, provinceName, province, cityName, city, 'Events', 'events'))} />
      <JsonLd data={cityJsonLd(cityName, city, provinceName, province, countryName, country)} />
      <JsonLd data={faqJsonLd} />
      {eventJsonLd && <JsonLd data={eventJsonLd} />}
      <CityPageImage citySlug={city} variant="events" />
      <EventsServerSummary
        cityName={cityData.name}
        countryName={countryName}
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
