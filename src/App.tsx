import { useState } from 'react';
import EventsPage from './app/[country]/[province]/[city]/events/EventsPage';
import HoroscopePage from './app/horoscope/HoroscopePage';
import type { City } from './types/city';

const demoCity: City = {
  name: 'Karachi',
  city_slug: 'karachi',
  country: 'Pakistan',
  country_code: 'PK',
  country_slug: 'pakistan',
  province: 'Sindh',
  province_slug: 'sindh',
  lat: 24.8607,
  lng: 67.0011,
  population: 14910352,
  timezone: 'Asia/Karachi',
  major_religion: 'Islam',
  religion_percent: 96,
  primary_color: '#01411C',
  secondary_color: '#FFFFFF',
  famous_for: 'Port city, financial hub',
  famous_products: 'Textiles, seafood',
  emergency_police: '15',
  emergency_ambulance: '1122',
  emergency_fire: '16',
  region: 'South Asia',
  is_active: true,
};

type Page = 'events' | 'horoscope';

function App() {
  const [page, setPage] = useState<Page>('horoscope');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple nav bar to switch between pages */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-lg border border-gray-200 px-2 py-1.5 flex gap-1">
        <button
          onClick={() => setPage('events')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            page === 'events' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setPage('horoscope')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            page === 'horoscope' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Horoscope
        </button>
      </nav>

      {page === 'events' && <EventsPage city={demoCity} />}
      {page === 'horoscope' && <HoroscopePage />}
    </div>
  );
}

export default App;
