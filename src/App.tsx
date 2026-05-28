import { useState } from 'react';
import { Globe } from 'lucide-react';
import TickerBar from './components/shared/TickerBar';
import Footer from './components/shared/Footer';
import SearchBar from './components/shared/SearchBar';
import LiveGlobalStats from './components/home/LiveGlobalStats';
import LivePrayerTimesStrip from './components/home/LivePrayerTimesStrip';
import GlobalMarketSnapshot from './components/home/GlobalMarketSnapshot';
import ExploreByReligion from './components/home/ExploreByReligion';
import FeaturedCitiesGrid from './components/home/FeaturedCitiesGrid';
import FeaturedWonders from './components/home/FeaturedWonders';
import OceansToday from './components/home/OceansToday';
import DidYouKnow from './components/home/DidYouKnow';
import ExploreByContinent from './components/home/ExploreByContinent';
import { CitySearchResult } from './types/city';

const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const popularCities = [
  { name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', slug: 'dubai' },
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', slug: 'london' },
  { name: 'Lahore', country: 'Pakistan', countryCode: 'PK', slug: 'lahore' },
  { name: 'Istanbul', country: 'Turkey', countryCode: 'TR', slug: 'istanbul' },
  { name: 'Mumbai', country: 'India', countryCode: 'IN', slug: 'mumbai' },
  { name: 'New York', country: 'United States', countryCode: 'US', slug: 'new-york' },
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', slug: 'tokyo' },
];

function App() {
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);

  const handleCitySelect = (city: CitySearchResult) => {
    setSelectedCity(city);
    console.log('Selected city:', city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <TickerBar />

      <main className="relative flex flex-col items-center px-4 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-slate-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mb-8 md:mb-10">
          <Globe className="w-24 h-24 md:w-28 md:h-28 text-teal-400 animate-spin-slow opacity-80" />
        </div>

        <svg
          className="absolute w-96 h-96 md:w-[600px] md:h-[600px] opacity-20 animate-spin-very-slow"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="earthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="50%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="url(#earthGradient)"
            strokeWidth="0.5"
            strokeDasharray="5 5"
          />
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#earthGradient)"
            strokeWidth="0.3"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="url(#earthGradient)"
            strokeWidth="0.5"
            strokeDasharray="3 3"
          />
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="url(#earthGradient)"
            strokeWidth="0.2"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="url(#earthGradient)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        </svg>

        <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 tracking-tight">
          Every City. Every Culture. Every Day.
        </h1>

        <p className="relative text-lg md:text-xl text-gray-300 text-center mb-10 font-light">
          Weather · Prayer · Gold · News · Events · Heritage
        </p>

        <div className="relative w-full max-w-4xl mb-16">
          <SearchBar onCitySelect={handleCitySelect} />

          <div className="relative mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-gray-400 text-sm">Popular:</span>
            {popularCities.map((city) => (
              <button
                key={city.slug}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium transition-all hover:scale-105 border border-white/20"
              >
                <span>{getCountryFlag(city.countryCode)}</span>
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto">
          <LiveGlobalStats />

          <LivePrayerTimesStrip />

          <GlobalMarketSnapshot />

          <ExploreByContinent />

          <ExploreByReligion />

          <FeaturedCitiesGrid />

          <FeaturedWonders />

          <OceansToday />

          <DidYouKnow />

          {selectedCity && (
            <div className="mt-8 bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{getCountryFlag(selectedCity.country_code)}</span>
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{selectedCity.name}</h3>
                    <p className="text-gray-500">{selectedCity.country}</p>
                  </div>
                </div>
              </div>
              {selectedCity.population > 0 && (
                <div className="mt-4 text-gray-600">
                  Population: {selectedCity.population.toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-very-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        .animate-spin-very-slow {
          animation: spin-very-slow 120s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default App;
