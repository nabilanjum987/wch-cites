'use server';

import type { Metadata } from 'next';
import { getCityData } from '@/lib/getCityData';

interface PageProps {
  params: {
    country: string;
    province: string;
    city: string;
  };
}

function formatSlug(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const city = await getCityData(params.country, params.province, params.city);
    const cityName = city?.name || formatSlug(params.city);
    const countryName = city?.country || formatSlug(params.country);

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
    const cityName = formatSlug(params.city);
    const countryName = formatSlug(params.country);

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

export default async function CityPage({ params }: PageProps) {
  const cityData = await getCityData(params.country, params.province, params.city);

  if (!cityData || !cityData.is_active) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">🌍 City Coming Soon</h1>
          <p className="text-slate-400">We are adding this city to our database.</p>
          <a href="/" className="mt-6 inline-block text-[#6366f1] hover:underline">← Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{cityData.name}</h1>
        <p className="text-slate-600 mb-6">{cityData.province}, {cityData.country}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold mb-2">Live Data</h2>
            <p className="text-slate-700">Timezone: {cityData.timezone}</p>
            <p className="text-slate-700">Population: {cityData.population.toLocaleString()}</p>
            <p className="text-slate-700">Major religion: {cityData.major_religion}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold mb-2">Local Info</h2>
            <p className="text-slate-700">Famous for: {cityData.famous_for}</p>
            <p className="text-slate-700">Famous products: {cityData.famous_products}</p>
            <p className="text-slate-700">Emergency police: {cityData.emergency_police}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
