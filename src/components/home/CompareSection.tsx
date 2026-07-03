'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const COMPARE_CITIES = [
  'Lahore, Pakistan', 'Karachi, Pakistan', 'Islamabad, Pakistan',
  'Mumbai, India', 'Delhi, India', 'Dubai, UAE',
  'London, UK', 'Istanbul, Turkey', 'Cairo, Egypt',
  'New York, USA', 'Tokyo, Japan', 'Mecca, Saudi Arabia',
];

const CITY_SLUGS: Record<string, string> = {
  'Lahore, Pakistan':      'lahore',
  'Karachi, Pakistan':     'karachi',
  'Islamabad, Pakistan':   'islamabad',
  'Mumbai, India':         'mumbai',
  'Delhi, India':          'delhi',
  'Dubai, UAE':            'dubai',
  'London, UK':            'london',
  'Istanbul, Turkey':      'istanbul',
  'Cairo, Egypt':          'cairo',
  'New York, USA':         'new-york',
  'Tokyo, Japan':          'tokyo',
  'Mecca, Saudi Arabia':   'mecca',
};

const COMPARE_COUNTRIES = [
  'Pakistan', 'India', 'Saudi Arabia', 'UAE',
  'United States', 'United Kingdom', 'Turkey', 'Egypt',
  'Indonesia', 'Nigeria', 'Brazil', 'Japan',
];

const COUNTRY_SLUGS: Record<string, string> = {
  'Pakistan': 'pakistan', 'India': 'india', 'Saudi Arabia': 'saudi-arabia',
  'UAE': 'united-arab-emirates', 'United States': 'united-states',
  'United Kingdom': 'united-kingdom', 'Turkey': 'turkey', 'Egypt': 'egypt',
  'Indonesia': 'indonesia', 'Nigeria': 'nigeria', 'Brazil': 'brazil', 'Japan': 'japan',
};

function Select({ options, value, onChange, placeholder }: {
  options: string[]; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl px-4 py-3 text-white text-sm font-medium border outline-none"
      style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}>
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o} value={o} style={{ backgroundColor: '#0a0f1e' }}>{o}</option>)}
    </select>
  );
}

export default function CompareSection() {
  const router = useRouter();
  const [cityA, setCityA] = useState('');
  const [cityB, setCityB] = useState('');
  const [countryA, setCountryA] = useState('');
  const [countryB, setCountryB] = useState('');

  const handleCityCompare = () => {
    if (!cityA || !cityB) return;
    const slugA = CITY_SLUGS[cityA];
    const slugB = CITY_SLUGS[cityB];
    router.push(`/compare/${slugA}-vs-${slugB}`);
  };

  const handleCountryCompare = () => {
    if (!countryA || !countryB) return;
    const slugA = COUNTRY_SLUGS[countryA];
    const slugB = COUNTRY_SLUGS[countryB];
    router.push(`/compare/${slugA}-vs-${slugB}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Compare Cities */}
      <div className="rounded-2xl border p-6 space-y-4"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), #0a0f1e)', borderColor: 'rgba(99,102,241,0.25)' }}>
        <div>
          <div className="text-white font-bold text-lg mb-1">🏙️ Compare Two Cities</div>
          <div className="text-white/40 text-sm">Weather, cost of living, prayer times, economy — side by side</div>
        </div>
        <Select options={COMPARE_CITIES} value={cityA} onChange={setCityA} placeholder="Select first city" />
        <div className="text-center text-white/30 text-sm font-bold">VS</div>
        <Select options={COMPARE_CITIES.filter(c => c !== cityA)} value={cityB} onChange={setCityB} placeholder="Select second city" />
        <button onClick={handleCityCompare} disabled={!cityA || !cityB}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          style={{ background: cityA && cityB ? 'linear-gradient(90deg, #6366f1, #06b6d4)' : 'rgba(255,255,255,0.08)' }}>
          Compare Cities →
        </button>
      </div>

      {/* Compare Countries */}
      <div className="rounded-2xl border p-6 space-y-4"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), #0a0f1e)', borderColor: 'rgba(16,185,129,0.25)' }}>
        <div>
          <div className="text-white font-bold text-lg mb-1">🌍 Compare Two Countries</div>
          <div className="text-white/40 text-sm">GDP, population, inflation, trade, culture — head to head</div>
        </div>
        <Select options={COMPARE_COUNTRIES} value={countryA} onChange={setCountryA} placeholder="Select first country" />
        <div className="text-center text-white/30 text-sm font-bold">VS</div>
        <Select options={COMPARE_COUNTRIES.filter(c => c !== countryA)} value={countryB} onChange={setCountryB} placeholder="Select second country" />
        <button onClick={handleCountryCompare} disabled={!countryA || !countryB}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          style={{ background: countryA && countryB ? 'linear-gradient(90deg, #10b981, #06b6d4)' : 'rgba(255,255,255,0.08)' }}>
          Compare Countries →
        </button>
      </div>
    </div>
  );
}
