import Link from 'next/link';
import { Thermometer, Droplets, Wind, ArrowRight } from 'lucide-react';

const hottest = [
  { city: 'Multan', country: 'PK', temp: 44, flag: '🇵🇰', slug: '/pakistan/punjab/multan' },
  { city: 'Kuwait City', country: 'KW', temp: 43, flag: '🇰🇼', slug: '/kuwait/kuwait/kuwait-city' },
  { city: 'Riyadh', country: 'SA', temp: 42, flag: '🇸🇦', slug: '/saudi-arabia/riyadh/riyadh' },
];

const coldest = [
  { city: 'Yakutsk', country: 'RU', temp: -8, flag: '🇷🇺', slug: '/russia/sakha/yakutsk' },
  { city: 'Ulaanbaatar', country: 'MN', temp: -4, flag: '🇲🇳', slug: '/mongolia/ulaanbaatar/ulaanbaatar' },
  { city: 'Reykjavik', country: 'IS', temp: 5, flag: '🇮🇸', slug: '/iceland/capital/reykjavik' },
];

const rainiest = [
  { city: 'Mumbai', country: 'IN', rain: '38mm', flag: '🇮🇳', slug: '/india/maharashtra/mumbai' },
  { city: 'Dhaka', country: 'BD', rain: '32mm', flag: '🇧🇩', slug: '/bangladesh/dhaka/dhaka' },
  { city: 'Jakarta', country: 'ID', rain: '28mm', flag: '🇮🇩', slug: '/indonesia/jakarta/jakarta' },
];

export default function WorldWeatherExtremes() {
  return (
    <div className="mb-4">
      {/* SEO Paragraph */}
      <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
        Right now, somewhere on earth it is hitting 44 degrees, and somewhere else it is well below
        freezing. WorldCityHub tracks today's temperature extremes and rainfall across thousands of
        cities, updated throughout the day. Whether you are tracking a heatwave, planning around
        monsoon season, or just curious which city is the coldest on earth today, this section gives
        you a live snapshot of the world's weather in one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Hottest */}
        <div className="rounded-2xl bg-gradient-to-br from-red-500/15 to-orange-500/15 border border-red-400/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-5 h-5 text-red-400" />
            <span className="text-white font-bold">Hottest Today</span>
          </div>
          <div className="space-y-3">
            {hottest.map((c, i) => (
              <Link key={c.city} href={c.slug} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs w-4">{i + 1}</span>
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="text-white text-sm font-medium group-hover:text-red-300 transition-colors">{c.city}</span>
                </div>
                <span className="text-red-400 font-bold text-sm">{c.temp}°C</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Coldest */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border border-blue-400/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wind className="w-5 h-5 text-blue-400" />
            <span className="text-white font-bold">Coldest Today</span>
          </div>
          <div className="space-y-3">
            {coldest.map((c, i) => (
              <Link key={c.city} href={c.slug} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs w-4">{i + 1}</span>
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="text-white text-sm font-medium group-hover:text-blue-300 transition-colors">{c.city}</span>
                </div>
                <span className="text-blue-400 font-bold text-sm">{c.temp}°C</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Rainiest */}
        <div className="rounded-2xl bg-gradient-to-br from-teal-500/15 to-emerald-500/15 border border-teal-400/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-teal-400" />
            <span className="text-white font-bold">Rainiest Today</span>
          </div>
          <div className="space-y-3">
            {rainiest.map((c, i) => (
              <Link key={c.city} href={c.slug} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs w-4">{i + 1}</span>
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="text-white text-sm font-medium group-hover:text-teal-300 transition-colors">{c.city}</span>
                </div>
                <span className="text-teal-400 font-bold text-sm">{c.rain}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          href="/weather"
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all hover:border-teal-400/50"
        >
          Explore world weather
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
