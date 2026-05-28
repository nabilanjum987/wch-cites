'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface CityFact {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

interface WikipediaData {
  population?: string;
  area?: string;
  elevation?: string;
  founded?: string;
  timezone?: string;
  sisterCities?: string[];
}

const DEFAULT_FACTS: Record<string, Partial<WikipediaData>> = {
  lahore: {
    population: '11,000,000',
    area: '1,772',
    elevation: '217',
    founded: 'c. 1000 CE',
    timezone: 'PKT (UTC+5)',
    sisterCities: ['Istanbul', 'Xi\'an', 'Cologne', 'Samarkand'],
  },
  karachi: {
    population: '14,900,000',
    area: '3,780',
    elevation: '10',
    founded: '1729',
    timezone: 'PKT (UTC+5)',
    sisterCities: ['Shanghai', 'Jeddah', 'Istanbul'],
  },
  islamabad: {
    population: '1,100,000',
    area: '906',
    elevation: '508',
    founded: '1960',
    timezone: 'PKT (UTC+5)',
    sisterCities: ['Ankara', 'Beijing', 'Jakarta'],
  },
};

async function fetchWikipediaData(
  cityName: string
): Promise<WikipediaData | null> {
  try {
    const encoded = encodeURIComponent(cityName.replace(/\s+/g, '_'));
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`
    );

    if (!response.ok) return null;
    const data = await response.json();

    const extract = data.extract || '';

    let population: string | undefined;
    const popMatch = extract.match(
      /population[^.]*?(\d[\d,]+\d|\d+\.\d+\s*million)/i
    );
    if (popMatch) population = popMatch[1];

    let area: string | undefined;
    const areaMatch = extract.match(
      /area[^.]*?(\d[\d,]+\d)\s*(?:km|square)/i
    );
    if (areaMatch) area = areaMatch[1];

    let elevation: string | undefined;
    const elevMatch = extract.match(
      /elevation[^.]*?(\d[\d,]*\d)\s*m/i
    );
    if (elevMatch) elevation = elevMatch[1];

    return { population, area, elevation };
  } catch {
    return null;
  }
}

function FactCard({ fact, index }: { fact: CityFact; index: number }) {
  return (
    <motion.div
      className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: fact.color + '20' }}
        >
          <span className="text-xl">{fact.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {fact.label}
          </p>
          <p className="font-bold text-gray-900 text-lg mt-0.5" style={{ color: fact.color }}>
            {fact.value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function CityFacts({ city }: { city: City }) {
  const [facts, setFacts] = useState<CityFact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const defaults = DEFAULT_FACTS[city.city_slug] || DEFAULT_FACTS[city.name.toLowerCase()] || {};

      const wikiData = await fetchWikipediaData(city.name);
      const data = { ...defaults, ...wikiData };

      const factsList: CityFact[] = [];

      if (data.population) {
        factsList.push({
          label: 'Population',
          value: data.population,
          icon: '👥',
          color: '#3b82f6',
        });
      }

      if (data.area) {
        factsList.push({
          label: 'Area',
          value: `${data.area} km²`,
          icon: '📐',
          color: '#10b981',
        });
      }

      if (data.elevation) {
        factsList.push({
          label: 'Elevation',
          value: `${data.elevation} m`,
          icon: '🏔️',
          color: '#8b5cf6',
        });
      }

      if (data.founded) {
        factsList.push({
          label: 'Founded',
          value: data.founded,
          icon: '📜',
          color: '#f59e0b',
        });
      }

      if (data.timezone) {
        factsList.push({
          label: 'Time Zone',
          value: data.timezone,
          icon: '🕐',
          color: '#ec4899',
        });
      }

      if (data.sisterCities && data.sisterCities.length > 0) {
        factsList.push({
          label: 'Sister Cities',
          value: data.sisterCities.slice(0, 4).join(', '),
          icon: '🌍',
          color: '#06b6d4',
        });
      }

      if (factsList.length === 0) {
        factsList.push(
          {
            label: 'Location',
            value: `${city.lat.toFixed(2)}°N, ${city.lng.toFixed(2)}°E`,
            icon: '📍',
            color: '#3b82f6',
          },
          {
            label: 'Region',
            value: city.province,
            icon: '🗺️',
            color: '#10b981',
          },
          {
            label: 'Country',
            value: city.country,
            icon: '🏳️',
            color: '#8b5cf6',
          }
        );
      }

      setFacts(factsList);
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
        <span className="text-2xl">📊</span>
        City Facts & Figures
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {facts.map((fact, idx) => (
            <FactCard key={fact.label} fact={fact} index={idx} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
