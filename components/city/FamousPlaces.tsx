'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface Place {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  thumbnail?: string;
  rating: number;
  operating_hours?: string;
  lat?: number;
  lng?: number;
  wikipedia_url?: string;
}

const DEFAULT_PLACES: Record<string, Array<{ name: string; type: string; description: string; rating: number; operating_hours: string }>> = {
  lahore: [
    { name: 'Badshahi Mosque', type: 'Religious Site', description: 'Mughal-era mosque and one of the largest in the world', rating: 4.9, operating_hours: '6:00 AM - 8:00 PM' },
    { name: 'Lahore Fort', type: 'Historic Monument', description: 'UNESCO World Heritage site from the Mughal Empire', rating: 4.8, operating_hours: '9:00 AM - 5:00 PM' },
    { name: 'Minar-e-Pakistan', type: 'Monument', description: 'National monument commemorating the Lahore Resolution', rating: 4.7, operating_hours: 'Open 24 hours' },
    { name: 'Shalimar Gardens', type: 'Garden', description: 'Mughal garden complex built in 1641', rating: 4.6, operating_hours: '6:00 AM - 7:00 PM' },
    { name: 'Liberty Market', type: 'Shopping', description: 'Famous bazaar for clothes and local goods', rating: 4.2, operating_hours: '10:00 AM - 10:00 PM' },
    { name: 'Food Street', type: 'Dining', description: 'Famous street food destination on MM Alam Road', rating: 4.5, operating_hours: '6:00 PM - 2:00 AM' },
  ],
  karachi: [
    { name: 'Clifton Beach', type: 'Beach', description: 'Popular seaside destination with amusement rides', rating: 4.3, operating_hours: 'Open 24 hours' },
    { name: 'Mohatta Palace', type: 'Museum', description: 'Pink stone palace now a museum of arts', rating: 4.5, operating_hours: '10:00 AM - 5:00 PM' },
    { name: 'Frere Hall', type: 'Heritage Building', description: 'Colonial-era building with beautiful gardens', rating: 4.4, operating_hours: '8:00 AM - 6:00 PM' },
    { name: 'Empress Market', type: 'Market', description: 'Historic marketplace dating back to British Raj', rating: 4.1, operating_hours: '9:00 AM - 9:00 PM' },
    { name: 'Port Grand', type: 'Entertainment', description: 'Waterfront food and entertainment complex', rating: 4.6, operating_hours: '5:00 PM - 12:00 AM' },
    { name: 'Hawke\'s Bay', type: 'Beach', description: 'Turtle nesting beach with sand dunes', rating: 4.2, operating_hours: 'Open 24 hours' },
  ],
  islamabad: [
    { name: 'Faisal Mosque', type: 'Religious Site', description: 'Iconic mosque designed by Turkish architect', rating: 4.9, operating_hours: '6:00 AM - 9:00 PM' },
    { name: 'Daman-e-Koh', type: 'Viewpoint', description: 'Scenic viewpoint in Margalla Hills', rating: 4.7, operating_hours: '8:00 AM - 8:00 PM' },
    { name: 'Pakistan Monument', type: 'Monument', description: 'National monument shaped like a blooming flower', rating: 4.8, operating_hours: '9:00 AM - 6:00 PM' },
    { name: 'Lake View Park', type: 'Park', description: 'Recreational park on Rawal Lake', rating: 4.5, operating_hours: '8:00 AM - 9:00 PM' },
    { name: 'Saidpur Village', type: 'Heritage Village', description: 'Historic village now a cultural destination', rating: 4.6, operating_hours: '10:00 AM - 11:00 PM' },
    { name: 'Shakarparian', type: 'Park', description: 'Hillside park with gardens and views', rating: 4.4, operating_hours: '6:00 AM - 8:00 PM' },
  ],
};

async function fetchFromSupabase(
  citySlug: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<Place[] | null> {
  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/places?city_slug=eq.${citySlug}&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    return data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

async function fetchWikipediaImage(name: string): Promise<string | null> {
  try {
    const encodedName = encodeURIComponent(name.replace(/\s+/g, '_'));
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedName}`
    );

    if (!response.ok) return null;
    const data = await response.json();
    return data.thumbnail?.source || null;
  } catch {
    return null;
  }
}

function isOpenNow(operatingHours: string): { isOpen: boolean; statusText: string } {
  if (!operatingHours || operatingHours.toLowerCase().includes('24 hours')) {
    return { isOpen: true, statusText: 'Open 24 hours' };
  }

  const now = new Date();

  const timeMatch = operatingHours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi);
  if (!timeMatch || timeMatch.length < 2) {
    return { isOpen: true, statusText: 'Check timings' };
  }

  const parseTime = (timeStr: string) => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!match) return 0;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3]?.toUpperCase() || 'AM';
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const openMinutes = parseTime(timeMatch[0]);
  const closeMinutes = parseTime(timeMatch[1]);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isOpen = closeMinutes > openMinutes
    ? nowMinutes >= openMinutes && nowMinutes < closeMinutes
    : nowMinutes >= openMinutes || nowMinutes < closeMinutes;

  return {
    isOpen,
    statusText: isOpen ? 'Open Now' : 'Closed',
  };
}

function getBestVisitTime(type: string): string {
  if (type === 'Beach') return 'Early morning or sunset for best views';
  if (type === 'Religious Site') return 'Around prayer times for atmosphere';
  if (type === 'Garden' || type === 'Park') return 'Morning hours (8-10 AM) for fresh air';
  if (type === 'Historic Monument') return 'Early afternoon for best lighting';
  if (type === 'Monument') return 'Golden hour (4-6 PM) for photography';
  if (type === 'Dining' || type === 'Food Street') return 'Evening hours (7-10 PM)';
  if (type === 'Shopping' || type === 'Market') return 'Late afternoon (4-7 PM)';
  if (type === 'Viewpoint') return 'Sunset hours for spectacular views';
  return 'Check operating hours';
}

function PlaceCard({ place }: { place: Place }) {
  const { isOpen, statusText } = isOpenNow(place.operating_hours || '');
  const bestTime = getBestVisitTime(place.type);

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative h-40 bg-gray-100">
        {place.thumbnail ? (
          <img
            src={place.thumbnail}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-50 to-gray-100">
            {place.type === 'Religious Site'
              ? '🕌'
              : place.type === 'Monument' || place.type === 'Historic Monument'
              ? '🏛️'
              : place.type === 'Garden' || place.type === 'Park'
              ? '🌳'
              : place.type === 'Beach'
              ? '🏖️'
              : place.type === 'Museum'
              ? '🏛️'
              : place.type === 'Shopping' || place.type === 'Market'
              ? '🛒'
              : place.type === 'Dining'
              ? '🍽️'
              : '📍'}
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded-full text-xs font-medium">
          {place.type}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900">{place.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            <span>⭐</span>
            <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{place.description}</p>

        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              isOpen
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {statusText}
          </span>
          <span className="text-xs text-gray-400">{place.operating_hours}</span>
        </div>

        <div className="bg-emerald-50 rounded p-2 mb-3">
          <p className="text-xs text-emerald-700">
            <span className="font-medium">Best visit time:</span> {bestTime}
          </p>
        </div>

        <button className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
          Explore →
        </button>
      </div>
    </motion.div>
  );
}

function PlaceSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-40 bg-gray-200"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

export function FamousPlaces({ city }: { city: City }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const fromDb = await fetchFromSupabase(city.city_slug, supabaseUrl || '', supabaseKey || '');

      if (fromDb && fromDb.length > 0) {
        setPlaces(fromDb);
        setLoading(false);
        return;
      }

      const defaults = DEFAULT_PLACES[city.city_slug] || DEFAULT_PLACES[city.name.toLowerCase()] || [];

      const enriched: Place[] = await Promise.all(
        defaults.map(async (p, idx) => {
          const thumbnail = await fetchWikipediaImage(p.name);
          return {
            id: `place-${idx}`,
            name: p.name,
            slug: p.name.toLowerCase().replace(/\s+/g, '-'),
            type: p.type,
            description: p.description,
            thumbnail: thumbnail || undefined,
            rating: p.rating,
            operating_hours: p.operating_hours,
          };
        })
      );

      setPlaces(enriched);
      setLoading(false);
    }

    load();
  }, [city.city_slug, city.name]);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🏛️</span>
        Famous Places in {city.name}
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <PlaceSkeleton key={i} />
          ))}
        </div>
      ) : places.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
          <p className="text-4xl mb-3">📍</p>
          <p>No famous places found for this city</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
