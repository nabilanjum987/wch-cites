import { getCityData } from '@/lib/getCityData';
import { TickerBar } from '@/components/city/TickerBar';
import { CityHeader } from '@/components/city/CityHeader';
import { CityTabs } from '@/components/city/CityTabs';
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
import type { Metadata } from 'next';
import type { City } from '@/types/city';

interface PageProps {
  params: Promise<{
    country: string;
    province: string;
    city: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, province, city } = await params;

  try {
    const cityData = await getCityData(country, province, city);
    const cityName = cityData?.name || city.replace(/-/g, ' ');
    const countryName = cityData?.country || country.replace(/-/g, ' ');

    return {
      title: `${cityName} - Weather, Prayer Times, Gold Rates | WorldCityHub`,
      description: `Live weather, prayer times, gold rates, news and events for ${cityName}, ${countryName}.`,
      keywords: [
        `${cityName} weather`,
        `${cityName} prayer times`,
        `${cityName} gold rate`,
      ],
    };
  } catch (error) {
    const cityName = city.replace(/-/g, ' ');
    const countryName = country.replace(/-/g, ' ');

    return {
      title: `${cityName} - Weather, Prayer Times, Gold Rates | WorldCityHub`,
      description: `Live weather, prayer times, gold rates, news and events for ${cityName}, ${countryName}.`,
      keywords: [
        `${cityName} weather`,
        `${cityName} prayer times`,
        `${cityName} gold rate`,
      ],
    };
  }
}

function generateJSONLD(city: City) {
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
  const { country, province, city: citySlug } = await params;
  const city = await getCityData(country, province, citySlug);

  if (!city || !city.is_active) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-4">🌍 City Coming Soon</h1>
          <p className="text-slate-400">We are adding this city to our database.</p>
          <a href="/" className="mt-6 inline-block text-[#6366f1] hover:underline">← Back to Home</a>
        </div>
      </div>
    );
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
        <CityTabs />

        <section className="max-w-5xl mx-auto px-4 py-6">
          <div id="weather">
            <WeatherSnapshot city={city} />
            <AirQuality city={city} />
          </div>
          <div id="prayer-times">
            <PrayerAndFaith city={city} />
          </div>
          <TimeAndCosmos city={city} />
          <CityFacts city={city} />
          <div id="news">
            <NewsToday city={city} />
          </div>
          <div id="events">
            <EventsSection city={city} />
          </div>
          <div id="rates">
            <RatesSnapshot city={city} />
          </div>
          <CostOfLiving city={city} />
          <div id="economy">
            <EconomySection city={city} />
          </div>
          <div id="sports">
            <SportsSection city={city} />
          </div>
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
