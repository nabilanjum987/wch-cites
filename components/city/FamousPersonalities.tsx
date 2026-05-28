'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface Personality {
  id: string;
  name: string;
  slug: string;
  profession: string;
  description: string;
  thumbnail?: string;
  wikipedia_url?: string;
}

interface WikipediaSummary {
  extract: string;
  thumbnail?: { source: string };
  content_urls?: { desktop: { page: string } };
}

const DEFAULT_PERSONALITIES: Record<string, Array<{ name: string; profession: string; description: string }>> = {
  lahore: [
    { name: 'Allama Iqbal', profession: 'Philosopher & Poet', description: 'National poet of Pakistan who envisioned the idea of Pakistan' },
    { name: 'Nusrat Fateh Ali Khan', profession: 'Qawwali Singer', description: 'King of Qawwali music who popularized the genre globally' },
    { name: 'Faiz Ahmed Faiz', profession: 'Poet', description: 'Renowned Urdu poet and Nobel Prize nominee' },
    { name: 'Imran Khan', profession: 'Cricketer & Politician', description: 'World Cup winning captain and former Prime Minister' },
  ],
  karachi: [
    { name: 'Abdul Sattar Edhi', profession: 'Philanthropist', description: 'Founder of the Edhi Foundation, the largest volunteer ambulance network' },
    { name: 'Jinnah', profession: 'Founder of Pakistan', description: 'Father of the nation and first Governor-General' },
    { name: 'Pervez Hoodbhoy', profession: 'Physicist', description: 'Prominent nuclear physicist and education advocate' },
    { name: 'Moin Akhtar', profession: 'Comedian & Actor', description: 'Legendary Pakistani comedian and television host' },
  ],
  islamabad: [
    { name: 'Jahangir Khan', profession: 'Squash Player', description: 'Greatest squash player in history with record winning streak' },
    { name: 'Malala Yousafzai', profession: 'Activist', description: 'Nobel Peace Prize laureate and education activist' },
    { name: 'Shahid Afridi', profession: 'Cricketer', description: 'Famous all-rounder known as "Boom Boom Afridi"' },
    { name: 'Shoaib Akhtar', profession: 'Cricketer', description: 'Fastest bowler in cricket history' },
  ],
  delhi: [
    { name: 'Shah Rukh Khan', profession: 'Actor', description: 'Bollywood superstar known as "King Khan"' },
    { name: 'Amitabh Bachchan', profession: 'Actor', description: 'Legendary actor and icon of Indian cinema' },
  ],
};

async function fetchFromSupabase(
  citySlug: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<Personality[] | null> {
  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/personalities?city_slug=eq.${citySlug}&select=*`,
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

async function fetchWikipediaSummary(name: string): Promise<WikipediaSummary | null> {
  try {
    const encodedName = encodeURIComponent(name.replace(/\s+/g, '_'));
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedName}`
    );

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function PersonalityCard({ personality, index }: { personality: Personality; index: number }) {
  return (
    <motion.a
      href={`/personalities/${personality.slug}`}
      className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all group block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
          {personality.thumbnail ? (
            <img
              src={personality.thumbnail}
              alt={personality.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              {personality.profession.toLowerCase().includes('poet')
                ? '✍️'
                : personality.profession.toLowerCase().includes('singer')
                ? '🎤'
                : personality.profession.toLowerCase().includes('actor')
                ? '🎭'
                : personality.profession.toLowerCase().includes('cricket')
                ? '🏏'
                : personality.profession.toLowerCase().includes('politic')
                ? '🏛️'
                : '👤'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
            {personality.name}
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">
            {personality.profession}
          </p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {personality.description}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end text-sm text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
        <span>View Profile</span>
        <span className="ml-1">→</span>
      </div>
    </motion.a>
  );
}

function PersonalitySkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

export function FamousPersonalities({ city }: { city: City }) {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const fromDb = await fetchFromSupabase(city.city_slug, supabaseUrl || '', supabaseKey || '');

      if (fromDb && fromDb.length > 0) {
        setPersonalities(fromDb);
        setLoading(false);
        return;
      }

      const defaults = DEFAULT_PERSONALITIES[city.city_slug] || DEFAULT_PERSONALITIES[city.name.toLowerCase()] || [];

      const enriched: Personality[] = await Promise.all(
        defaults.map(async (p, idx) => {
          const wikiData = await fetchWikipediaSummary(p.name);
          return {
            id: `personality-${idx}`,
            name: p.name,
            slug: p.name.toLowerCase().replace(/\s+/g, '-'),
            profession: p.profession,
            description: wikiData?.extract?.slice(0, 120) || p.description,
            thumbnail: wikiData?.thumbnail?.source,
            wikipedia_url: wikiData?.content_urls?.desktop?.page,
          };
        })
      );

      setPersonalities(enriched);
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
        <span className="text-2xl">👥</span>
        Famous Personalities from {city.name}
        <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          Updated monthly
        </span>
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <PersonalitySkeleton key={i} />
          ))}
        </div>
      ) : personalities.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
          <p className="text-4xl mb-3">👥</p>
          <p>No famous personalities found for this city</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalities.map((p, idx) => (
            <PersonalityCard key={p.id} personality={p} index={idx} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
