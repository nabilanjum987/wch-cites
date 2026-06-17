import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';
import { notFound } from 'next/navigation';
import EventsPageClient from '@/components/events/EventsPageClient';

interface PageProps {
  params: Promise<{ country: string; province: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  const cityName = cityData?.name ?? city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${cityName} Events — Things to Do, Concerts, Sports & More | WorldCityHub`,
    description: `Discover events in ${cityName}, ${countryName}. Sports, music, culture, food festivals, religious events, conferences and more — local to global.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/${country}/${province}/${city}/events` },
  };
}

export default async function EventsPage({ params }: PageProps) {
  const { country, province, city } = await params;
  const cityData = await getCityData(country, province, city);
  if (!cityData) notFound();

  return (
    <EventsPageClient
      city={cityData}
      country={country}
      province={province}
      citySlug={city}
    />
  );
}
