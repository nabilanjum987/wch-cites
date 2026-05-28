import { fetchCity } from '@/lib/getCityData';
import { TickerBar } from '@/components/city/TickerBar';
import { CityHeader } from '@/components/city/CityHeader';
import { TimeAndCosmos } from '@/components/city/TimeAndCosmos';
import { WeatherSnapshot } from '@/components/city/WeatherSnapshot';
import { PrayerAndFaith } from '@/components/city/PrayerAndFaith';
import { NewsToday } from '@/components/city/NewsToday';
import { EventsSection } from '@/components/city/EventsSection';
import { RatesSnapshot } from '@/components/city/RatesSnapshot';
import { EconomySection } from '@/components/city/EconomySection';
import { FamousPersonalities } from '@/components/city/FamousPersonalities';
import { FamousPlaces } from '@/components/city/FamousPlaces';
import { HeritageProducts } from '@/components/city/HeritageProducts';
import { StreetFood } from '@/components/city/StreetFood';
import { AirQuality } from '@/components/city/AirQuality';
import { EmergencyContacts } from '@/components/city/EmergencyContacts';
import { NearbyCities } from '@/components/city/NearbyCities';
import { CityFacts } from '@/components/city/CityFacts';
import { CostOfLiving } from '@/components/city/CostOfLiving';
import { SportsSection } from '@/components/city/SportsSection';
import { Chatbot } from '@/components/city/Chatbot';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    country: string;
    province: string;
    city: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const city = await fetchCity(params.country, params.province, params.city);
  if (!city) return {};

  return {
    title: `${city.name} City Portal: Prayer Times, Weather, News, Events & Live Data | WorldCityHub`,
    description: `Complete city guide for ${city.name}, ${city.province}, ${city.country}. Live prayer times, weather forecast, breaking news, gold rates, cost of living, events, famous places, street food, emergency contacts, and more.`,
    keywords: [
      city.name,
      city.country,
      'prayer times',
      'weather',
      'news',
      'events',
      'gold rate',
      'famous places',
      'street food',
      'cost of living',
      'city guide',
    ],
    openGraph: {
      title: `${city.name} City Portal | WorldCityHub`,
      description: `Everything about ${city.name}: live data, events, places, weather, news and more.`,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${city.name} City Portal | WorldCityHub`,
      description: `Everything about ${city.name}: live data, events, places, weather, news and more.`,
    },
    alternates: {
      canonical: `/${params.country}/${params.province}/${params.city}`,
    },
  };
}

function generateJSONLD(city: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: city.name,
    province: city.province,
    country: city.country,
    countryCode: city.country_code,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.lat,
      longitude: city.lng,
    },
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: city.province,
      containedInPlace: {
        '@type': 'Country',
        name: city.country,
      },
    },
    url: `/${city.country_code.toLowerCase()}/${city.province.toLowerCase().replace(/\s+/g, '-')}/${city.city_slug}`,
  };
}

export default async function CityPage({ params }: PageProps) {
  const city = await fetchCity(params.country, params.province, params.city);

  if (!city || !city.is_active) {
    notFound();
  }

  const jsonLd = generateJSONLD(city);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50">
        <TickerBar city={city} />
        <CityHeader city={city} />

        <section className="max-w-5xl mx-auto px-4 py-6">
          <TimeAndCosmos city={city} />
          <CityFacts city={city} />
          <WeatherSnapshot city={city} />
          <AirQuality city={city} />
          <PrayerAndFaith city={city} />
          <NewsToday city={city} />
          <EventsSection city={city} />
          <RatesSnapshot city={city} />
          <CostOfLiving city={city} />
          <EconomySection city={city} />
          <SportsSection city={city} />
          <FamousPersonalities city={city} />
          <FamousPlaces city={city} />
          <HeritageProducts city={city} />
          <StreetFood city={city} />
          <EmergencyContacts city={city} />
          <NearbyCities city={city} />
        </section>

        <Chatbot city={city} />
      </main>
    </>
  );
}
