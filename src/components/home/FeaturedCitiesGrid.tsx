'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface FeaturedCity {
  name: string; country: string; flag: string;
  temp: string; weather: string; color: string;
  slug: string; info: string;
}

const CITIES: FeaturedCity[] = [
  { name: 'Mecca',     country: 'Saudi Arabia', flag: '🇸🇦', temp: '38°C', weather: '☀️', color: '#006C35', slug: '/saudi-arabia/makkah/mecca',         info: 'Maghrib: 7:02 PM' },
  { name: 'Vatican',   country: 'Vatican City',  flag: '🇻🇦', temp: '22°C', weather: '⛅', color: '#FFE000', slug: '/vatican/vatican/vatican',           info: 'Mass: 10:00 AM' },
  { name: 'Lahore',    country: 'Pakistan',       flag: '🇵🇰', temp: '34°C', weather: '☀️', color: '#01411C', slug: '/pakistan/punjab/lahore',           info: 'Maghrib: 7:38 PM' },
  { name: 'Mumbai',    country: 'India',          flag: '🇮🇳', temp: '32°C', weather: '🌧️', color: '#FF9933', slug: '/india/maharashtra/mumbai',         info: 'Puja: 6:30 PM' },
  { name: 'Dubai',     country: 'UAE',            flag: '🇦🇪', temp: '38°C', weather: '☀️', color: '#00732F', slug: '/uae/dubai/dubai',                 info: 'Maghrib: 6:58 PM' },
  { name: 'London',    country: 'UK',             flag: '🇬🇧', temp: '18°C', weather: '⛅', color: '#012169', slug: '/uk/england/london',               info: 'Church: 10:00 AM' },
  { name: 'New York',  country: 'USA',            flag: '🇺🇸', temp: '22°C', weather: '☀️', color: '#B22234', slug: '/usa/new-york/new-york',           info: 'Church: 9:00 AM' },
  { name: 'Tokyo',     country: 'Japan',          flag: '🇯🇵', temp: '20°C', weather: '☀️', color: '#BC002D', slug: '/japan/tokyo/tokyo',               info: 'Temple: 8:00 AM' },
  { name: 'Istanbul',  country: 'Turkey',         flag: '🇹🇷', temp: '24°C', weather: '⛅', color: '#E30A17', slug: '/turkey/istanbul/istanbul',         info: 'Maghrib: 7:15 PM' },
  { name: 'Jakarta',   country: 'Indonesia',      flag: '🇮🇩', temp: '30°C', weather: '🌧️', color: '#CE1126', slug: '/indonesia/jakarta/jakarta',       info: 'Maghrib: 5:58 PM' },
  { name: 'Cairo',     country: 'Egypt',          flag: '🇪🇬', temp: '35°C', weather: '☀️', color: '#CE1126', slug: '/egypt/cairo/cairo',               info: 'Maghrib: 6:45 PM' },
  { name: 'Karachi',   country: 'Pakistan',       flag: '🇵🇰', temp: '33°C', weather: '☀️', color: '#01411C', slug: '/pakistan/sindh/karachi',          info: 'Maghrib: 7:35 PM' },
];

export default function FeaturedCitiesGrid() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    const speed = 0.4;
    let raf: number;
    const step = () => {
      pos += speed;
      const half = track.scrollWidth / 2;
      if (pos >= half) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...CITIES, ...CITIES];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/pakistan/punjab/lahore" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 transition-colors">
          Explore All Cities →
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl">
        <div ref={trackRef} className="flex gap-4" style={{ width: 'max-content' }}>
          {doubled.map((city, i) => (
            <Link key={i} href={city.slug} className="no-underline flex-shrink-0 w-44">
              <div
                className="relative h-40 rounded-2xl overflow-hidden cursor-pointer group"
                style={{ border: `1px solid ${city.color}40` }}
              >
                {/* Flag as dimmed background */}
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
                  style={{ fontSize: '80px', opacity: 0.18, filter: 'blur(1px)' }}>
                  {city.flag}
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(180deg, ${city.color}22 0%, ${city.color}55 100%)`
                }} />
                {/* Content */}
                <div className="absolute inset-0 p-3 flex flex-col justify-between z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{city.flag}</span>
                    <span className="text-lg">{city.weather}</span>
                  </div>
                  <div>
                    <div className="text-white font-bold text-base leading-tight">{city.name}</div>
                    <div className="text-white/60 text-xs">{city.country}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white font-semibold text-sm">{city.temp}</span>
                      <span className="text-white/50 text-xs">{city.info}</span>
                    </div>
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: `${city.color}22` }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
