'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface NearbyCity {
  name: string;
  city_slug: string;
  province: string;
  country: string;
  country_code: string;
  lat: number;
  lng: number;
  distance: number;
  weather?: { temp: number; condition: string; icon: string };
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const WEATHER_ICONS: Record<string, string> = {
  Clear: '☀️',
  Sunny: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️',
};

async function fetchNearbyFromSupabase(
  lat: number,
  lng: number,
  country: string,
  currentCitySlug: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<NearbyCity[] | null> {
  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/cities?country=eq.${country}&select=name,city_slug,province,country,country_code,lat,lng,weather_temp,weather_condition&is_active=eq.true`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) return null;
    const data = await response.json();

    const nearby = data
      .filter((c: { city_slug: string }) => c.city_slug !== currentCitySlug)
      .map((c: {
        name: string;
        city_slug: string;
        province: string;
        country: string;
        country_code: string;
        lat: number;
        lng: number;
        weather_temp?: number;
        weather_condition?: string;
      }) => ({
        name: c.name,
        city_slug: c.city_slug,
        province: c.province,
        country: c.country,
        country_code: c.country_code,
        lat: c.lat,
        lng: c.lng,
        distance: calculateDistance(lat, lng, c.lat, c.lng),
        weather: c.weather_temp
          ? {
              temp: c.weather_temp,
              condition: c.weather_condition || 'Clear',
              icon: WEATHER_ICONS[c.weather_condition || 'Clear'] || '☀️',
            }
          : undefined,
      }))
      .sort((a: NearbyCity, b: NearbyCity) => a.distance - b.distance)
      .slice(0, 6);

    return nearby.length > 0 ? nearby : null;
  } catch {
    return null;
  }
}

interface DefaultNearbyCity {
  name: string;
  distance: number;
  weather?: { temp: number; condition: string; icon: string };
}

const DEFAULT_NEARBY: Record<string, DefaultNearbyCity[]> = {
  lahore: [
    { name: 'Gujranwala', distance: 67, weather: { temp: 32, condition: 'Clear', icon: '☀️' } },
    { name: 'Faisalabad', distance: 120, weather: { temp: 33, condition: 'Clear', icon: '☀️' } },
    { name: 'Sialkot', distance: 115, weather: { temp: 31, condition: 'Clouds', icon: '☁️' } },
    { name: 'Amritsar', distance: 50, weather: { temp: 34, condition: 'Clear', icon: '☀️' } },
    { name: 'Multan', distance: 260, weather: { temp: 36, condition: 'Clear', icon: '☀️' } },
    { name: 'Islamabad', distance: 280, weather: { temp: 28, condition: 'Rain', icon: '🌧️' } },
  ],
  karachi: [
    { name: 'Hyderabad', distance: 150, weather: { temp: 35, condition: 'Clear', icon: '☀️' } },
    { name: 'Thatta', distance: 100, weather: { temp: 34, condition: 'Clear', icon: '☀️' } },
    { name: 'Jamshoro', distance: 140, weather: { temp: 35, condition: 'Clear', icon: '☀️' } },
  ],
  islamabad: [
    { name: 'Rawalpindi', distance: 15, weather: { temp: 28, condition: 'Rain', icon: '🌧️' } },
    { name: 'Murree', distance: 45, weather: { temp: 18, condition: 'Rain', icon: '🌧️' } },
    { name: 'Peshawar', distance: 180, weather: { temp: 30, condition: 'Clear', icon: '☀️' } },
    { name: 'Lahore', distance: 280, weather: { temp: 32, condition: 'Clear', icon: '☀️' } },
  ],
};

function NearbyCityCard({ nearby, index }: { nearby: NearbyCity; index: number }) {
  const countrySlug = nearby.country_code.toLowerCase();
  const provinceSlug = nearby.province.toLowerCase().replace(/\s+/g, '-');
  const citySlug = nearby.city_slug || nearby.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <motion.a
      href={`/${countrySlug}/${provinceSlug}/${citySlug}`}
      className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all block"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-lg">🏙️</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{nearby.name}</p>
            <p className="text-xs text-gray-500">
              {nearby.distance.toFixed(0)} km away
            </p>
          </div>
        </div>
        {nearby.weather && (
          <div className="text-right">
            <span className="text-2xl">{nearby.weather.icon}</span>
            <p className="text-sm font-medium text-gray-700">
              {nearby.weather.temp}°C
            </p>
          </div>
        )}
      </div>
    </motion.a>
  );
}

export function NearbyCities({ city }: { city: City }) {
  const [nearbyCities, setNearbyCities] = useState<NearbyCity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const fromDB = await fetchNearbyFromSupabase(
        city.lat,
        city.lng,
        city.country,
        city.city_slug,
        supabaseUrl || '',
        supabaseKey || ''
      );

      if (fromDB && fromDB.length > 0) {
        setNearbyCities(
          fromDB.map((c) => ({
            ...c,
            city_slug: c.city_slug,
            province: c.province,
            country: c.country,
            country_code: c.country_code,
          }))
        );
      } else {
        const defaults =
          DEFAULT_NEARBY[city.city_slug] ||
          DEFAULT_NEARBY[city.name.toLowerCase()] || [];

        setNearbyCities(
          defaults.map((c) => ({
            ...c,
            city_slug: c.name.toLowerCase().replace(/\s+/g, '-'),
            province: city.province,
            country: city.country,
            country_code: city.country_code,
            lat: 0,
            lng: 0,
          }))
        );
      }

      setLoading(false);
    }

    load();
  }, [city]);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🗺️</span>
        Nearby Cities
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : nearbyCities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p className="text-3xl mb-2">🏙️</p>
          <p>No nearby cities found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nearbyCities.map((nearby, idx) => (
            <NearbyCityCard key={nearby.name} nearby={nearby} index={idx} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
