'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

// === TYPES ===
interface Country {
  name: string;
  code: string;
  slug: string;
  flag: string;
  region: string;
  continent: string;
  population: number;
  area: number;
  capital: string;
  currency: string;
  languages: string[];
  government: string;
  primaryColor: string;
  secondaryColor: string;
}

interface CityWeather {
  name: string;
  slug: string;
  temp: number;
  condition: string;
  icon: string;
}

interface Province {
  name: string;
  slug: string;
  capital: string;
  population: number;
  area: number;
}

interface Personality {
  id: string;
  name: string;
  profession: string;
  photo: string;
  birthYear: number;
  achievements: string;
}

interface Landmark {
  id: string;
  name: string;
  type: string;
  city: string;
  image: string;
  unesco: boolean;
}

interface Economy {
  gdp: string;
  growth: string;
  inflation: string;
  unemployment: string;
  currencyRate: string;
}

interface NationalTeam {
  sport: string;
  name: string;
  ranking: string;
  achievements: string[];
}

interface Holiday {
  name: string;
  date: string;
  type: string;
}

interface Neighbor {
  name: string;
  slug: string;
  flag: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// === MOCK DATA ===
const COUNTRIES: Record<string, Country> = {
  pakistan: {
    name: 'Pakistan',
    code: 'PK',
    slug: 'pakistan',
    flag: '🇵🇰',
    region: 'South Asia',
    continent: 'Asia',
    population: 231402117,
    area: 881913,
    capital: 'Islamabad',
    currency: 'Pakistani Rupee (PKR)',
    languages: ['Urdu', 'English', 'Punjabi', 'Pashto', 'Sindhi', 'Balochi'],
    government: 'Federal Parliamentary Republic',
    primaryColor: '#01411C',
    secondaryColor: '#FFFFFF',
  },
  india: {
    name: 'India',
    code: 'IN',
    slug: 'india',
    flag: '🇮🇳',
    region: 'South Asia',
    continent: 'Asia',
    population: 1428627663,
    area: 3287263,
    capital: 'New Delhi',
    currency: 'Indian Rupee (INR)',
    languages: ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil'],
    government: 'Federal Parliamentary Republic',
    primaryColor: '#FF9933',
    secondaryColor: '#138808',
  },
  'united-states': {
    name: 'United States',
    code: 'US',
    slug: 'united-states',
    flag: '🇺🇸',
    region: 'North America',
    continent: 'Americas',
    population: 331893745,
    area: 9833520,
    capital: 'Washington D.C.',
    currency: 'US Dollar (USD)',
    languages: ['English', 'Spanish'],
    government: 'Federal Presidential Republic',
    primaryColor: '#B22234',
    secondaryColor: '#3C3B6E',
  },
};

const MAJOR_CITIES: Record<string, CityWeather[]> = {
  PK: [
    { name: 'Karachi', slug: 'karachi', temp: 32, condition: 'Partly Cloudy', icon: '⛅' },
    { name: 'Lahore', slug: 'lahore', temp: 35, condition: 'Hot', icon: '☀️' },
    { name: 'Islamabad', slug: 'islamabad', temp: 30, condition: 'Clear', icon: '🌤️' },
    { name: 'Faisalabad', slug: 'faisalabad', temp: 36, condition: 'Hot', icon: '☀️' },
    { name: 'Rawalpindi', slug: 'rawalpindi', temp: 31, condition: 'Clear', icon: '🌤️' },
    { name: 'Multan', slug: 'multan', temp: 38, condition: 'Very Hot', icon: '🔥' },
  ],
  IN: [
    { name: 'Mumbai', slug: 'mumbai', temp: 32, condition: 'Humid', icon: '🌤️' },
    { name: 'Delhi', slug: 'delhi', temp: 38, condition: 'Hot', icon: '☀️' },
    { name: 'Bangalore', slug: 'bangalore', temp: 28, condition: 'Pleasant', icon: '⛅' },
    { name: 'Chennai', slug: 'chennai', temp: 34, condition: 'Humid', icon: '🌤️' },
    { name: 'Kolkata', slug: 'kolkata', temp: 35, condition: 'Warm', icon: '⛅' },
    { name: 'Hyderabad', slug: 'hyderabad', temp: 36, condition: 'Hot', icon: '☀️' },
  ],
  US: [
    { name: 'New York', slug: 'new-york', temp: 22, condition: 'Clear', icon: '☀️' },
    { name: 'Los Angeles', slug: 'los-angeles', temp: 26, condition: 'Sunny', icon: '☀️' },
    { name: 'Chicago', slug: 'chicago', temp: 18, condition: 'Cloudy', icon: '☁️' },
    { name: 'Houston', slug: 'houston', temp: 30, condition: 'Warm', icon: '🌤️' },
    { name: 'Phoenix', slug: 'phoenix', temp: 38, condition: 'Hot', icon: '🔥' },
    { name: 'Philadelphia', slug: 'philadelphia', temp: 20, condition: 'Pleasant', icon: '⛅' },
  ],
};

const PROVINCES: Record<string, Province[]> = {
  PK: [
    { name: 'Punjab', slug: 'punjab', capital: 'Lahore', population: 110012442, area: 205344 },
    { name: 'Sindh', slug: 'sindh', capital: 'Karachi', population: 47886531, area: 140914 },
    { name: 'Khyber Pakhtunkhwa', slug: 'khyber-pakhtunkhwa', capital: 'Peshawar', population: 35625000, area: 74521 },
    { name: 'Balochistan', slug: 'balochistan', capital: 'Quetta', population: 12344408, area: 347190 },
    { name: 'Gilgit-Baltistan', slug: 'gilgit-baltistan', capital: 'Gilgit', population: 1800000, area: 72497 },
    { name: 'Azad Kashmir', slug: 'azad-kashmir', capital: 'Muzaffarabad', population: 4045000, area: 13297 },
  ],
  IN: [
    { name: 'Maharashtra', slug: 'maharashtra', capital: 'Mumbai', population: 112374333, area: 307713 },
    { name: 'Uttar Pradesh', slug: 'uttar-pradesh', capital: 'Lucknow', population: 199812341, area: 240928 },
    { name: 'Karnataka', slug: 'karnataka', capital: 'Bangalore', population: 61095248, area: 191791 },
    { name: 'Tamil Nadu', slug: 'tamil-nadu', capital: 'Chennai', population: 72147030, area: 130058 },
    { name: 'Gujarat', slug: 'gujarat', capital: 'Ahmedabad', population: 60439692, area: 196244 },
    { name: 'Rajasthan', slug: 'rajasthan', capital: 'Jaipur', population: 68548437, area: 342239 },
  ],
  US: [
    { name: 'California', slug: 'california', capital: 'Sacramento', population: 39538223, area: 423967 },
    { name: 'Texas', slug: 'texas', capital: 'Austin', population: 29145505, area: 695662 },
    { name: 'Florida', slug: 'florida', capital: 'Tallahassee', population: 21538187, area: 170312 },
    { name: 'New York', slug: 'new-york', capital: 'Albany', population: 20201249, area: 141297 },
    { name: 'Illinois', slug: 'illinois', capital: 'Springfield', population: 12812508, area: 149997 },
    { name: 'Pennsylvania', slug: 'pennsylvania', capital: 'Harrisburg', population: 13002700, area: 119280 },
  ],
};

const PERSONALITIES: Record<string, Personality[]> = {
  PK: [
    { id: '1', name: 'Abdul Sattar Edhi', profession: 'Philanthropist', photo: '', birthYear: 1928, achievements: 'Founded Edhi Foundation, largest volunteer ambulance service' },
    { id: '2', name: 'Malala Yousafzai', profession: 'Activist', photo: '', birthYear: 1997, achievements: 'Nobel Peace Prize winner, education advocate' },
    { id: '3', name: 'Imran Khan', profession: 'Cricketer & Politician', photo: '', birthYear: 1952, achievements: 'World Cup winning captain, Prime Minister' },
    { id: '4', name: 'Abdus Salam', profession: 'Physicist', photo: '', birthYear: 1926, achievements: 'Nobel Prize in Physics 1979' },
  ],
  IN: [
    { id: '1', name: 'Mahatma Gandhi', profession: 'Freedom Fighter', photo: '', birthYear: 1869, achievements: 'Leader of Indian independence movement' },
    { id: '2', name: 'A.P.J. Abdul Kalam', profession: 'President & Scientist', photo: '', birthYear: 1931, achievements: 'Missile Man of India, President' },
    { id: '3', name: 'Sachin Tendulkar', profession: 'Cricketer', photo: '', birthYear: 1973, achievements: 'Greatest batsman, 100 international centuries' },
    { id: '4', name: 'Ratan Tata', profession: 'Industrialist', photo: '', birthYear: 1937, achievements: 'Chairman of Tata Group, philanthropist' },
  ],
  US: [
    { id: '1', name: 'Barack Obama', profession: 'Politician', photo: '', birthYear: 1961, achievements: '44th US President, Nobel Peace Prize' },
    { id: '2', name: 'Elon Musk', profession: 'Entrepreneur', photo: '', birthYear: 1971, achievements: 'Founder of SpaceX, Tesla, X' },
    { id: '3', name: 'Michael Jordan', profession: 'Basketball', photo: '', birthYear: 1963, achievements: '6x NBA Champion, GOAT' },
    { id: '4', name: 'Oprah Winfrey', profession: 'Media Personality', photo: '', birthYear: 1954, achievements: 'Media mogul, philanthropist' },
  ],
};

const LANDMARKS: Record<string, Landmark[]> = {
  PK: [
    { id: '1', name: 'Badshahi Mosque', type: 'Religious', city: 'Lahore', image: '', unesco: false },
    { id: '2', name: 'Mohenjo-daro', type: 'Archaeological', city: 'Sindh', image: '', unesco: true },
    { id: '3', name: 'K2', type: 'Mountain', city: 'Gilgit-Baltistan', image: '', unesco: false },
    { id: '4', name: 'Shalimar Gardens', type: 'Gardens', city: 'Lahore', image: '', unesco: true },
  ],
  IN: [
    { id: '1', name: 'Taj Mahal', type: 'Monument', city: 'Agra', image: '', unesco: true },
    { id: '2', name: 'Red Fort', type: 'Fort', city: 'Delhi', image: '', unesco: true },
    { id: '3', name: 'Gateway of India', type: 'Arch', city: 'Mumbai', image: '', unesco: false },
    { id: '4', name: 'Hawa Mahal', type: 'Palace', city: 'Jaipur', image: '', unesco: false },
  ],
  US: [
    { id: '1', name: 'Statue of Liberty', type: 'Monument', city: 'New York', image: '', unesco: true },
    { id: '2', name: 'Grand Canyon', type: 'Natural', city: 'Arizona', image: '', unesco: true },
    { id: '3', name: 'Golden Gate Bridge', type: 'Bridge', city: 'San Francisco', image: '', unesco: false },
    { id: '4', name: 'Mount Rushmore', type: 'Monument', city: 'South Dakota', image: '', unesco: false },
  ],
};

const ECONOMIES: Record<string, Economy> = {
  PK: { gdp: '$376B', growth: '5.7%', inflation: '28.2%', unemployment: '6.2%', currencyRate: '1 USD = 278 PKR' },
  IN: { gdp: '$3.73T', growth: '7.2%', inflation: '5.4%', unemployment: '4.8%', currencyRate: '1 USD = 83 INR' },
  US: { gdp: '$25.5T', growth: '2.1%', inflation: '3.2%', unemployment: '3.8%', currencyRate: 'Base Currency' },
};

const NATIONAL_TEAMS: Record<string, NationalTeam[]> = {
  PK: [
    { sport: 'Cricket', name: 'Pakistan Cricket Team', ranking: 'World #4', achievements: ['T20 World Cup 2009', 'Champions Trophy 2017', 'Asia Cup 2022'] },
    { sport: 'Hockey', name: 'Pakistan Hockey Team', ranking: 'World #16', achievements: ['4x World Cup Winner', '3x Olympic Gold', '4x Asian Games Gold'] },
    { sport: 'Squash', name: 'Pakistan Squash', ranking: 'Historically #1', achievements: ['Jahangir Khan 555 consecutive wins', 'Jansher Khan 8x World Champion'] },
  ],
  IN: [
    { sport: 'Cricket', name: 'India Cricket Team', ranking: 'World #1', achievements: ['2x ODI World Cup', '2x Champions Trophy', 'T20 World Cup 2007'] },
    { sport: 'Hockey', name: 'India Hockey Team', ranking: 'World #4', achievements: ['8x Olympic Gold', 'Asian Cup 2023', 'Commonwealth Games 2022'] },
    { sport: 'Badminton', name: 'India Badminton', ranking: 'Top 10', achievements: ['Olympic Medals', 'World Championships', 'Thomas Cup 2022'] },
  ],
  US: [
    { sport: 'Basketball', name: 'USA Basketball', ranking: 'World #1', achievements: ['17x Olympic Gold', '5x FIBA World Cup'] },
    { sport: 'Soccer', name: 'USMNT', ranking: 'World #13', achievements: ['CONCACAF Gold Cup 2021', 'World Cup R16 2022'] },
    { sport: 'Swimming', name: 'USA Swimming', ranking: 'World #1', achievements: ['Most Olympic medals in swimming'] },
  ],
};

const HOLIDAYS: Record<string, Holiday[]> = {
  PK: [
    { name: 'Pakistan Day', date: 'March 23', type: 'National' },
    { name: 'Independence Day', date: 'August 14', type: 'National' },
    { name: 'Defence Day', date: 'September 6', type: 'National' },
    { name: 'Iqbal Day', date: 'November 9', type: 'National' },
    { name: 'Quaid-e-Azam Day', date: 'December 25', type: 'National' },
  ],
  IN: [
    { name: 'Republic Day', date: 'January 26', type: 'National' },
    { name: 'Independence Day', date: 'August 15', type: 'National' },
    { name: 'Gandhi Jayanti', date: 'October 2', type: 'National' },
    { name: 'Holi', date: 'March (varies)', type: 'Religious' },
    { name: 'Diwali', date: 'October (varies)', type: 'Religious' },
  ],
  US: [
    { name: 'Independence Day', date: 'July 4', type: 'National' },
    { name: 'Thanksgiving', date: 'November (varies)', type: 'National' },
    { name: 'Memorial Day', date: 'May (varies)', type: 'National' },
    { name: 'Veterans Day', date: 'November 11', type: 'National' },
    { name: 'Labor Day', date: 'September (varies)', type: 'National' },
  ],
};

const NEIGHBORS: Record<string, Neighbor[]> = {
  PK: [
    { name: 'India', slug: 'india', flag: '🇮🇳' },
    { name: 'Afghanistan', slug: 'afghanistan', flag: '🇦🇫' },
    { name: 'Iran', slug: 'iran', flag: '🇮🇷' },
    { name: 'China', slug: 'china', flag: '🇨🇳' },
  ],
  IN: [
    { name: 'Pakistan', slug: 'pakistan', flag: '🇵🇰' },
    { name: 'China', slug: 'china', flag: '🇨🇳' },
    { name: 'Nepal', slug: 'nepal', flag: '🇳🇵' },
    { name: 'Bangladesh', slug: 'bangladesh', flag: '🇧🇩' },
    { name: 'Sri Lanka', slug: 'sri-lanka', flag: '🇱🇰' },
  ],
  US: [
    { name: 'Canada', slug: 'canada', flag: '🇨🇦' },
    { name: 'Mexico', slug: 'mexico', flag: '🇲🇽' },
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

function getRandomPersonalities(code: string): Personality[] {
  const list = PERSONALITIES[code] || PERSONALITIES.US;
  const month = new Date().getMonth();
  return list.slice(0, 4);
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className || ''}`} />;
}

export default function CountryPage() {
  const params = useParams<{ country: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [economy, setEconomy] = useState<Economy | null>(null);
  const [teams, setTeams] = useState<NationalTeam[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [emergency, setEmergency] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.country as string;
    const key = slug.toLowerCase().replace(/-/g, '');
    const countryData = COUNTRIES[key] || COUNTRIES[Object.keys(COUNTRIES).find(k => slug.includes(k)) || 'pakistan'] || COUNTRIES.pakistan;

    setCountry(countryData);
    setCities(MAJOR_CITIES[countryData.code] || []);
    setProvinces(PROVINCES[countryData.code] || []);
    setPersonalities(getRandomPersonalities(countryData.code));
    setLandmarks(LANDMARKS[countryData.code] || []);
    setEconomy(ECONOMIES[countryData.code] || ECONOMIES.US);
    setTeams(NATIONAL_TEAMS[countryData.code] || []);
    setHolidays(HOLIDAYS[countryData.code] || []);
    setNeighbors(NEIGHBORS[countryData.code] || []);
    setEmergency(EMERGENCY_NUMBERS[countryData.code] || EMERGENCY_NUMBERS.US);

    setLoading(false);
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-48 animate-pulse bg-gray-300" />
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🌍</span>
          <h2 className="text-2xl font-bold mt-4">Country not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="relative overflow-hidden" style={{ backgroundColor: country.primaryColor }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 60%)' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <nav className="text-sm mb-4 flex items-center gap-1.5">
            <a href="/" className="text-white/70 hover:text-white">World</a>
            <span className="text-white/40">›</span>
            <span className="text-white font-medium">{country.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-6xl">{country.flag}</span>
            <div>
              <h1 className="text-4xl font-bold text-white">{country.name}</h1>
              <p className="text-white/70 mt-1">{country.region} · {country.continent}</p>
              <div className="flex gap-4 mt-2 text-sm text-white/60">
                <span>Capital: {country.capital}</span>
                <span>Population: {formatNumber(country.population)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Multi-City Weather */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Major Cities Weather</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {cities.map(city => (
              <a
                key={city.slug}
                href={`/${country.slug}/${provinces[0]?.slug || 'province'}/${city.slug}`}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow text-center"
              >
                <span className="text-3xl">{city.icon}</span>
                <p className="font-semibold text-gray-900 mt-2">{city.name}</p>
                <p className="text-2xl font-bold text-gray-700">{city.temp}°</p>
                <p className="text-xs text-gray-400">{city.condition}</p>
              </a>
            ))}
          </div>
        </motion.section>

        {/* Country Facts */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Country Facts</h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <p className="text-sm text-gray-400">Population</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(country.population)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Area</p>
                <p className="text-xl font-bold text-gray-900">{formatNumber(country.area)} km²</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Capital</p>
                <p className="text-xl font-bold text-gray-900">{country.capital}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Currency</p>
                <p className="text-xl font-bold text-gray-900">{country.currency.split(' ')[0]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Languages</p>
                <p className="text-xl font-bold text-gray-900">{country.languages[0]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Government</p>
                <p className="text-sm font-bold text-gray-900">{country.government}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Live Data Strip */}
        {economy && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Currency</p>
                  <p className="text-sm font-bold text-white">{economy.currencyRate}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">GDP</p>
                  <p className="text-sm font-bold text-white">{economy.gdp}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Inflation</p>
                  <p className="text-sm font-bold text-white">{economy.inflation}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Next Prayer (Capital)</p>
                <p className="text-sm font-bold text-amber-400">Maghrib 6:45 PM</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Provinces/States */}
        {provinces.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">States / Provinces</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {provinces.map(prov => (
                <a
                  key={prov.slug}
                  href={`/${country.slug}/${prov.slug}`}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-gray-900">{prov.name}</h3>
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p>Capital: {prov.capital}</p>
                    <p>Population: {formatNumber(prov.population)}</p>
                    <p>Area: {formatNumber(prov.area)} km²</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.section>
        )}

        {/* Famous Personalities */}
        {personalities.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Famous Personalities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {personalities.map(p => (
                <a
                  key={p.id}
                  href={`/personalities/${p.id}`}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl mx-auto">
                    👤
                  </div>
                  <h3 className="font-semibold text-gray-900 text-center mt-3">{p.name}</h3>
                  <p className="text-sm text-gray-500 text-center">{p.profession}</p>
                  <p className="text-xs text-gray-400 text-center mt-1 line-clamp-2">{p.achievements}</p>
                </a>
              ))}
            </div>
          </motion.section>
        )}

        {/* Famous Places */}
        {landmarks.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Famous Places</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {landmarks.map(l => (
                <div key={l.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center text-4xl">
                    {l.type === 'Mountain' ? '🏔️' : l.type === 'Religious' ? '🕌' : l.type === 'Natural' ? '🌄' : '🏛️'}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{l.name}</h3>
                    <p className="text-sm text-gray-500">{l.city}</p>
                    {l.unesco && <span className="text-xs text-blue-600 font-semibold">UNESCO Site</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Economy Dashboard */}
        {economy && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Economy Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">GDP</p>
                <p className="text-2xl font-bold text-blue-600">{economy.gdp}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Growth</p>
                <p className="text-2xl font-bold text-green-600">{economy.growth}</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Inflation</p>
                <p className="text-2xl font-bold text-orange-600">{economy.inflation}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Unemployment</p>
                <p className="text-2xl font-bold text-red-600">{economy.unemployment}</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Sports Section */}
        {teams.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">National Teams</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {teams.map(team => (
                <div key={team.sport} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{team.name}</h3>
                    <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">{team.sport}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{team.ranking}</p>
                  <div className="space-y-1">
                    {team.achievements.slice(0, 3).map((a, i) => (
                      <p key={i} className="text-xs text-gray-600 flex items-center gap-1">
                        <span>🏆</span> {a}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* National Holidays */}
        {holidays.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">National Holidays & Events</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {holidays.map((h, i) => (
                <div key={i} className={`flex items-center justify-between p-4 ${i !== holidays.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div>
                    <h3 className="font-semibold text-gray-900">{h.name}</h3>
                    <p className="text-sm text-gray-500">{h.type}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{h.date}</span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

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

        {/* Neighboring Countries */}
        {neighbors.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Neighboring Countries</h2>
            <div className="flex flex-wrap gap-3">
              {neighbors.map(n => (
                <a
                  key={n.slug}
                  href={`/${n.slug}`}
                  className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-2 hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">{n.flag}</span>
                  <span className="font-medium text-gray-900">{n.name}</span>
                </a>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
