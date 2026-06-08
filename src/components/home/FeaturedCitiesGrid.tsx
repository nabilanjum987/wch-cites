'use client';
import Link from 'next/link';
import { useState } from 'react';

interface FeaturedCity {
  name: string;
  country: string;
  flag: string;
  temp: string;
  weather: string;
  color: string;
  slug: string;
  info: string;
}

const CITIES: FeaturedCity[] = [
  { name: 'Mecca', country: 'Saudi Arabia', flag: '🇸🇦', temp: '38°C', weather: '☀️', color: '#006C35', slug: '/saudi-arabia/makkah/mecca', info: 'Maghrib: 7:02 PM' },
  { name: 'Vatican', country: 'Vatican City', flag: '🇻🇦', temp: '22°C', weather: '⛅', color: '#FFE000', slug: '/vatican/vatican/vatican', info: 'Mass: 10:00 AM' },
  { name: 'Lahore', country: 'Pakistan', flag: '🇵🇰', temp: '34°C', weather: '☀️', color: '#01411C', slug: '/pakistan/punjab/lahore', info: 'Maghrib: 7:38 PM' },
  { name: 'Mumbai', country: 'India', flag: '🇮🇳', temp: '32°C', weather: '🌧️', color: '#FF9933', slug: '/india/maharashtra/mumbai', info: 'Puja: 6:30 PM' },
  { name: 'Dubai', country: 'UAE', flag: '🇦🇪', temp: '38°C', weather: '☀️', color: '#00732F', slug: '/uae/dubai/dubai', info: 'Maghrib: 6:58 PM' },
  { name: 'London', country: 'UK', flag: '🇬🇧', temp: '18°C', weather: '⛅', color: '#012169', slug: '/uk/england/london', info: 'Church: 10:00 AM' },
  { name: 'New York', country: 'USA', flag: '🇺🇸', temp: '22°C', weather: '☀️', color: '#B22234', slug: '/usa/new-york/new-york', info: 'Church: 9:00 AM' },
  { name: 'Tokyo', country: 'Japan', flag: '🇯🇵', temp: '20°C', weather: '☀️', color: '#BC002D', slug: '/japan/tokyo/tokyo', info: 'Temple: 8:00 AM' },
  { name: 'Istanbul', country: 'Turkey', flag: '🇹🇷', temp: '24°C', weather: '⛅', color: '#E30A17', slug: '/turkey/istanbul/istanbul', info: 'Maghrib: 7:15 PM' },
  { name: 'Jakarta', country: 'Indonesia', flag: '🇮🇩', temp: '30°C', weather: '🌧️', color: '#CE1126', slug: '/indonesia/jakarta/jakarta', info: 'Maghrib: 5:58 PM' },
  { name: 'Cairo', country: 'Egypt', flag: '🇪🇬', temp: '35°C', weather: '☀️', color: '#CE1126', slug: '/egypt/cairo/cairo', info: 'Maghrib: 6:45 PM' },
  { name: 'Karachi', country: 'Pakistan', flag: '🇵🇰', temp: '33°C', weather: '☀️', color: '#01411C', slug: '/pakistan/sindh/karachi', info: 'Maghrib: 7:35 PM' },
];

export default function FeaturedCitiesGrid() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Featured Cities</h2>
        <span className="text-gray-400">Explore world destinations</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CITIES.map((city) => (
          <Link key={city.name} href={city.slug}>
            <div
              className="relative group cursor-pointer h-full"
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <div
                className="overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 hover:border-white/40 transition-all duration-300 p-6 h-full flex flex-col justify-between group-hover:scale-105 transform"
                style={{
                  boxShadow: hoveredCity === city.name ? `0 0 20px ${city.color}40` : 'none'
                }}
              >
                {/* Flag emoji large */}
                <div className="text-6xl mb-4 text-center">{city.flag}</div>

                {/* City name bold white */}
                <h3 className="text-2xl font-bold text-white text-center mb-1">{city.name}</h3>

                {/* Country name small gray */}
                <p className="text-sm text-gray-400 text-center mb-4">{city.country}</p>

                {/* Temperature + weather emoji */}
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <span className="text-2xl">{city.weather}</span>
                  <span className="text-white font-semibold">{city.temp}</span>
                </div>

                {/* Info text (prayer/church time) */}
                <div className="text-center text-sm" style={{ color: city.color }}>
                  {city.info}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
