import { useState } from 'react';
import WorldRatesPage from './app/rates/page';
import CountryRatesPage from './app/country/rates/page';

const COUNTRIES = [
  'pakistan', 'india', 'saudi-arabia', 'uae', 'turkey',
  'uk', 'usa', 'japan', 'china', 'iran', 'malaysia', 'egypt',
];

export default function App() {
  const [view, setView] = useState<'world' | 'country'>('world');
  const [country, setCountry] = useState('pakistan');

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Demo nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center gap-3 flex-wrap">
        <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest mr-2">
          WorldCityHub
        </span>
        <button
          onClick={() => setView('world')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            view === 'world'
              ? 'bg-amber-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          /rates (World)
        </button>
        <button
          onClick={() => setView('country')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            view === 'country'
              ? 'bg-amber-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          /[country]/rates
        </button>
        {view === 'country' && (
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </nav>

      <div className="pt-12">
        {view === 'world' ? (
          <WorldRatesPage />
        ) : (
          <CountryRatesPage countrySlug={country} />
        )}
      </div>
    </div>
  );
}
