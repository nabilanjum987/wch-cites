'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

// === TYPES ===
interface Province {
  name: string;
  slug: string;
  capital: string;
  population: number;
  area: number;
  country: string;
  countryCode: string;
  countrySlug: string;
  gdpContribution: string;
  primaryColor: string;
}

interface City {
  name: string;
  slug: string;
  population: number;
  temp: number;
  condition: string;
  icon: string;
}

interface Industry {
  name: string;
  description: string;
  icon: string;
}

interface Product {
  name: string;
  category: string;
  famous: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// === MOCK DATA ===
const PROVINCES: Record<string, Province> = {
  'pakistan/punjab': {
    name: 'Punjab',
    slug: 'punjab',
    capital: 'Lahore',
    population: 110012442,
    area: 205344,
    country: 'Pakistan',
    countryCode: 'PK',
    countrySlug: 'pakistan',
    gdpContribution: '52%',
    primaryColor: '#01411C',
  },
  'pakistan/sindh': {
    name: 'Sindh',
    slug: 'sindh',
    capital: 'Karachi',
    population: 47886531,
    area: 140914,
    country: 'Pakistan',
    countryCode: 'PK',
    countrySlug: 'pakistan',
    gdpContribution: '30%',
    primaryColor: '#01411C',
  },
  'india/maharashtra': {
    name: 'Maharashtra',
    slug: 'maharashtra',
    capital: 'Mumbai',
    population: 112374333,
    area: 307713,
    country: 'India',
    countryCode: 'IN',
    countrySlug: 'india',
    gdpContribution: '14%',
    primaryColor: '#FF9933',
  },
  'united-states/california': {
    name: 'California',
    slug: 'california',
    capital: 'Sacramento',
    population: 39538223,
    area: 423967,
    country: 'United States',
    countryCode: 'US',
    countrySlug: 'united-states',
    gdpContribution: '14%',
    primaryColor: '#B22234',
  },
};

const PROVINCE_CITIES: Record<string, City[]> = {
  punjab: [
    { name: 'Lahore', slug: 'lahore', population: 13095038, temp: 35, condition: 'Hot', icon: '☀️' },
    { name: 'Faisalabad', slug: 'faisalabad', population: 3203726, temp: 36, condition: 'Hot', icon: '☀️' },
    { name: 'Rawalpindi', slug: 'rawalpindi', population: 2140959, temp: 31, condition: 'Clear', icon: '🌤️' },
    { name: 'Multan', slug: 'multan', population: 1873402, temp: 38, condition: 'Very Hot', icon: '🔥' },
    { name: 'Gujranwala', slug: 'gujranwala', population: 2026565, temp: 34, condition: 'Hot', icon: '☀️' },
    { name: 'Sialkot', slug: 'sialkot', population: 892602, temp: 32, condition: 'Warm', icon: '⛅' },
  ],
  sindh: [
    { name: 'Karachi', slug: 'karachi', population: 14910352, temp: 32, condition: 'Humid', icon: '🌤️' },
    { name: 'Hyderabad', slug: 'hyderabad', population: 1733893, temp: 35, condition: 'Hot', icon: '☀️' },
    { name: 'Sukkur', slug: 'sukkur', population: 500000, temp: 38, condition: 'Hot', icon: '🔥' },
    { name: 'Larkana', slug: 'larkana', population: 485000, temp: 37, condition: 'Hot', icon: '🔥' },
  ],
  maharashtra: [
    { name: 'Mumbai', slug: 'mumbai', population: 12442373, temp: 32, condition: 'Humid', icon: '🌤️' },
    { name: 'Pune', slug: 'pune', population: 3124458, temp: 28, condition: 'Pleasant', icon: '⛅' },
    { name: 'Nagpur', slug: 'nagpur', population: 2405665, temp: 36, condition: 'Hot', icon: '☀️' },
    { name: 'Nashik', slug: 'nashik', population: 1486053, temp: 30, condition: 'Warm', icon: '🌤️' },
  ],
  california: [
    { name: 'Los Angeles', slug: 'los-angeles', population: 3979576, temp: 26, condition: 'Sunny', icon: '☀️' },
    { name: 'San Francisco', slug: 'san-francisco', population: 873965, temp: 18, condition: 'Cool', icon: '🌤️' },
    { name: 'San Diego', slug: 'san-diego', population: 1423851, temp: 24, condition: 'Sunny', icon: '☀️' },
    { name: 'San Jose', slug: 'san-jose', population: 1021795, temp: 22, condition: 'Clear', icon: '⛅' },
  ],
};

const PROVINCE_INDUSTRIES: Record<string, Industry[]> = {
  punjab: [
    { name: 'Textiles', description: 'Largest textile industry in Pakistan', icon: '🧵' },
    { name: 'Agriculture', description: 'Wheat, rice, sugarcane production', icon: '🌾' },
    { name: 'Manufacturing', description: 'Automotive and electronics', icon: '🏭' },
    { name: 'Sports Goods', description: 'Sialkot sports equipment export', icon: '⚽' },
  ],
  sindh: [
    { name: 'Financial Services', description: 'Banking and stock exchange', icon: '🏦' },
    { name: 'Port & Shipping', description: 'Karachi Port - major trade hub', icon: '🚢' },
    { name: 'IT & Technology', description: 'Growing tech sector', icon: '💻' },
    { name: 'Oil & Gas', description: 'Energy production', icon: '⛽' },
  ],
  maharashtra: [
    { name: 'Bollywood', description: 'Indian film industry hub', icon: '🎬' },
    { name: 'Finance', description: 'Mumbai Stock Exchange', icon: '📈' },
    { name: 'IT & Tech', description: 'Pune tech hub', icon: '💻' },
    { name: 'Manufacturing', description: 'Automotive and pharma', icon: '🏭' },
  ],
  california: [
    { name: 'Technology', description: 'Silicon Valley tech giants', icon: '💻' },
    { name: 'Entertainment', description: 'Hollywood film industry', icon: '🎬' },
    { name: 'Agriculture', description: 'Central Valley farming', icon: '🌾' },
    { name: 'Aerospace', description: 'Space and aviation', icon: '🚀' },
  ],
};

const PROVINCE_PRODUCTS: Record<string, Product[]> = {
  punjab: [
    { name: 'Basmati Rice', category: 'Food', famous: true },
    { name: 'Chikan Embroidery', category: 'Textiles', famous: true },
    { name: 'Khussa Shoes', category: 'Footwear', famous: true },
    { name: 'Sports Equipment', category: 'Sports', famous: true },
    { name: 'Mangoes', category: 'Fruit', famous: true },
  ],
  sindh: [
    { name: 'Ajrak Print', category: 'Textiles', famous: true },
    { name: 'Pottery', category: 'Artisan', famous: true },
    { name: 'Camel Skin Lamps', category: 'Decor', famous: false },
    { name: 'Dates', category: 'Food', famous: true },
  ],
  maharashtra: [
    { name: 'Sarees', category: 'Textiles', famous: true },
    { name: 'Alphonso Mangoes', category: 'Fruit', famous: true },
    { name: 'Chikki', category: 'Food', famous: false },
    { name: 'Warli Art', category: 'Art', famous: true },
  ],
  california: [
    { name: 'Wine', category: 'Beverage', famous: true },
    { name: 'Avocados', category: 'Food', famous: true },
    { name: 'Almonds', category: 'Nuts', famous: true },
    { name: 'Tech Products', category: 'Electronics', famous: true },
  ],
};

const EMERGENCY_NUMBERS: Record<string, Record<string, string>> = {
  PK: { police: '15', ambulance: '1122', fire: '16' },
  IN: { police: '100', ambulance: '108', fire: '101' },
  US: { police: '911', ambulance: '911', fire: '911' },
};

function formatNumber(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className || ''}`} />;
}

export default function ProvincePage() {
  const params = useParams<{ country: string; province: string }>();
  const [province, setProvince] = useState<Province | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [emergency, setEmergency] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = `${params.country}/${params.province}`;
    const provData = PROVINCES[key] || PROVINCES['pakistan/punjab'];

    setProvince(provData);
    setCities(PROVINCE_CITIES[provData.slug] || []);
    setIndustries(PROVINCE_INDUSTRIES[provData.slug] || []);
    setProducts(PROVINCE_PRODUCTS[provData.slug] || []);
    setEmergency(EMERGENCY_NUMBERS[provData.countryCode] || EMERGENCY_NUMBERS.US);

    setLoading(false);
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-40 animate-pulse bg-gray-300" />
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  if (!province) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🗺️</span>
          <h2 className="text-2xl font-bold mt-4">Province not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="relative overflow-hidden" style={{ backgroundColor: province.primaryColor }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 60%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-8">
          <nav className="text-sm mb-4 flex items-center gap-1.5 flex-wrap">
            <a href="/" className="text-white/70 hover:text-white">World</a>
            <span className="text-white/40">›</span>
            <a href={`/${province.countrySlug}`} className="text-white/70 hover:text-white">{province.country}</a>
            <span className="text-white/40">›</span>
            <span className="text-white font-medium">{province.name}</span>
          </nav>

          <h1 className="text-4xl font-bold text-white">{province.name}</h1>
          <p className="text-white/70 mt-1">{province.country}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
            <span>Capital: {province.capital}</span>
            <span>Population: {formatNumber(province.population)}</span>
            <span>Area: {formatNumber(province.area)} km²</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Province Facts */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Province Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm text-gray-400">Capital</p>
              <p className="text-xl font-bold text-gray-900">{province.capital}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm text-gray-400">Population</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(province.population)}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm text-gray-400">Area</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(province.area)} km²</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm text-gray-400">GDP Contribution</p>
              <p className="text-xl font-bold text-gray-900">{province.gdpContribution}</p>
            </div>
          </div>
        </motion.section>

        {/* Cities Grid */}
        {cities.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Major Cities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.map(city => (
                <a
                  key={city.slug}
                  href={`/${province.countrySlug}/${province.slug}/${city.slug}`}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{city.name}</h3>
                    <span className="text-2xl">{city.icon}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-700 mt-2">{city.temp}°</p>
                  <p className="text-sm text-gray-400">{city.condition}</p>
                  <p className="text-xs text-gray-400 mt-1">Population: {formatNumber(city.population)}</p>
                </a>
              ))}
            </div>
          </motion.section>
        )}

        {/* Multi-City Weather */}
        {cities.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Weather Across Province</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {cities.slice(0, 6).map(city => (
                  <div key={city.slug} className="text-center p-2 rounded-lg bg-gray-50">
                    <p className="font-medium text-gray-900 text-sm">{city.name}</p>
                    <span className="text-2xl">{city.icon}</span>
                    <p className="text-lg font-bold text-gray-700">{city.temp}°</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Province Economy */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Province Economy</h2>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">GDP Contribution to {province.country}</p>
                <p className="text-4xl font-bold">{province.gdpContribution}</p>
                <p className="text-gray-300 mt-2">
                  {province.name} contributes significantly to the national economy through major industries and exports.
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Population Share</p>
                <p className="text-4xl font-bold">
                  {((province.population / 1000000000) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Famous Industries */}
        {industries.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Major Industries</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {industries.map(ind => (
                <div key={ind.name} className="bg-white rounded-xl border border-gray-100 p-4">
                  <span className="text-4xl">{ind.icon}</span>
                  <h3 className="font-bold text-gray-900 mt-2">{ind.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{ind.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Province Products */}
        {products.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Famous Products</h2>
            <div className="flex flex-wrap gap-3">
              {products.map(p => (
                <div
                  key={p.name}
                  className={`rounded-xl px-4 py-2 ${
                    p.famous ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <span className="font-medium text-gray-900">{p.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{p.category}</span>
                  {p.famous && <span className="text-xs text-amber-600 ml-1">★</span>}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Province Landmarks */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Notable Landmarks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center text-4xl">🕌</div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm">Historic Mosque</h3>
                <p className="text-xs text-gray-400">{province.capital}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center text-4xl">🏛️</div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm">Government Building</h3>
                <p className="text-xs text-gray-400">{province.capital}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center text-4xl">🌳</div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm">Public Park</h3>
                <p className="text-xs text-gray-400">{province.capital}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gray-200 flex items-center justify-center text-4xl">🏛️</div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm">Museum</h3>
                <p className="text-xs text-gray-400">{province.capital}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Emergency Contacts */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Emergency Contacts</h2>
          <div className="grid grid-cols-3 gap-4">
            <a href={`tel:${emergency.police}`} className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-4 text-center transition-colors">
              <span className="text-3xl">🚔</span>
              <p className="font-bold mt-2">Police</p>
              <p className="text-2xl font-bold">{emergency.police}</p>
            </a>
            <a href={`tel:${emergency.ambulance}`} className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl p-4 text-center transition-colors">
              <span className="text-3xl">🚑</span>
              <p className="font-bold mt-2">Ambulance</p>
              <p className="text-2xl font-bold">{emergency.ambulance}</p>
            </a>
            <a href={`tel:${emergency.fire}`} className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl p-4 text-center transition-colors">
              <span className="text-3xl">🚒</span>
              <p className="font-bold mt-2">Fire</p>
              <p className="text-2xl font-bold">{emergency.fire}</p>
            </a>
          </div>
        </motion.section>

        {/* Back to Country */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <a
            href={`/${province.countrySlug}`}
            className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow text-center"
          >
            <span className="text-gray-400">← Back to</span>
            <span className="font-bold text-gray-900 ml-1">{province.country}</span>
          </a>
        </motion.section>
      </main>
    </div>
  );
}
