'use client';

import { useEffect, useState } from 'react';
import FlagSymbolBackground from '@/components/shared/FlagSymbolBackground';
import GrowthDashboard from '@/components/shared/GrowthDashboard';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import CityAssistant from '@/components/shared/CityAssistant';
import { CENSUS_2023_POPULATION, censusPopulationOr } from '@/lib/census2023';
import { PAKISTAN_PROVINCE_TOTAL } from '@/lib/census2023-splits';
import {
  ChevronRight, TrendingUp, TrendingDown, ArrowRight,
  Globe, Users, Coins, Calendar, ShieldAlert, Utensils,
  Leaf, Trophy, Mountain, Thermometer, Star, Newspaper,
  Gem, MapPin, Building2,
} from 'lucide-react';
import {
  generateOverviewParagraph, generateOverviewAfter,
  generateCitiesParagraph, generateCitiesAfter,
  generateWeatherParagraph, generateWeatherAfter,
  generateEconomyParagraph, generateEconomyAfter,
  generateProvinceGrowthParagraph, generateProvinceGrowthAfter,
  generateCostOfLivingParagraph, generateCostOfLivingAfter,
  generateIndustriesParagraph, generateIndustriesAfter,
  generateProductsParagraph, generateProductsAfter,
  generateLandmarksParagraph, generateLandmarksAfter,
  generateEmergencyParagraph, generateEmergencyAfter,
} from '@/lib/paragraphs/province';

// ─── Live data (server-fetched in page.tsx, passed as props) ─────────────
// Prayer (Aladhan, capital), market rates (gold-api / PAXG + gold-api
// XAG + open.er-api, the site's canonical helpers), weather (OpenWeather
// per major city) and news (GNews) are all fetched live on the server.
// Nothing in this file stores a prayer time, a rate, a temperature or a
// headline: when a feed fails, the section renders without the figure
// rather than falling back to a stored one.

export interface ProvinceLiveData {
  prayer: { timings: Record<string, string> } | null;
  rates: {
    goldPerGram: number;
    goldPerTola: number;
    goldChangePct: number | null;
    silverPerTola: number;
    usdPkr: number;
    updatedAt: string | null;
  } | null;
  weather: Record<string, { temp: number; condition: string; icon: string }>;
  news: { title: string; url: string; source: string; publishedAt: string }[];
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FaithSlice { faith: string; pct: number; }
interface Province {
  name: string; slug: string; capital: string;
  population: number; area: number; tagline: string;
  knownFor: string; gdpPct: string; literacyRate: string;
  climate: string; majorFaith: string; majorFaithPct: number;
  faithSlices: FaithSlice[];
  established: string; universities: number;
  country: string; countrySlug: string; countryCode: string;
  primaryColor: string; heroImage: string; heroAlt: string; heroCredit: string;
  lat: number; lng: number;
}
// City rows carry no temperature: weather is live data (see
// ProvinceLiveData above) and is merged in at render time by slug.
interface City { name: string; slug: string; population: number; }
interface SupabaseCity { name: string; city_slug: string; population: number; primary_color: string | null; famous_for: string | null; }
interface Division { name: string; slug: string; districts: string[]; }
interface Industry { name: string; icon: string; description: string; city: string; }
interface Product { name: string; emoji: string; category: string; origin: string; }
interface Landmark { name: string; city: string; era: string; unesco: boolean; image: string | null; credit?: string; alt?: string; }
interface Food { name: string; emoji: string; description: string; origin: string; }
interface Resource { name: string; icon: string; rank: string; description: string; }
interface Emergency { label: string; number: string; color: string; }
interface OtherProvince { name: string; slug: string; tagline: string; }
interface Personality { name: string; profession: string; category: string; birthCity: string; photo?: string; credit?: string; slug?: string; pos?: string; }

// ─── Static Data ─────────────────────────────────────────────────────────────

const PROVINCES: Record<string, Province> = {
  'pakistan/punjab': {
    name: 'Punjab', slug: 'punjab', capital: 'Lahore',
    // Population: PBS Census 2023, Table 1. Faith: PBS Census 2023,
    // Table 9 (shares of enumerated responses: Muslim 124,462,897,
    // Christian 2,458,924, Hindu 249,716, Ahmadi 140,512).
    population: 127688922, area: 205344,
    tagline: 'Most populous province: heart of Pakistan',
    knownFor: 'Agriculture, Industry, Culture, Education',
    gdpPct: '54%', literacyRate: '64%', climate: 'Semi-arid',
    majorFaith: 'Islam', majorFaithPct: 97.75,
    faithSlices: [
      { faith: 'Islam', pct: 97.75 },
      { faith: 'Christianity', pct: 1.93 },
      { faith: 'Hinduism', pct: 0.20 },
      { faith: 'Ahmadiyya', pct: 0.11 },
    ],
    established: '1970 (modern province)', universities: 200,
    country: 'Pakistan', countrySlug: 'pakistan', countryCode: 'PK',
    primaryColor: '#0C7A3D',
    heroImage: '/images/cities/lahore-hero.webp',
    heroAlt: 'Badshahi Mosque, Lahore',
    heroCredit: 'Photo: Romero Maia · CC BY-SA 4.0',
    lat: 31.1471, lng: 75.3412,
  },
  'pakistan/sindh': {
    name: 'Sindh', slug: 'sindh', capital: 'Karachi',
    // Population: PBS Census 2023, Table 1. Faith: PBS Census 2023,
    // Table 9 (Muslim 50,126,428 = 90.09% of responses; Hindu 4,901,407
    // = 8.81%, Jati + Scheduled Castes combined; Christian 546,968).
    population: 55696147, area: 140914,
    tagline: 'Economic heartbeat of Pakistan',
    knownFor: 'Finance, Port Trade, Culture, Agriculture',
    gdpPct: '30%', literacyRate: '58%', climate: 'Arid to Semi-arid',
    majorFaith: 'Islam', majorFaithPct: 90.09,
    faithSlices: [
      { faith: 'Islam', pct: 90.09 },
      { faith: 'Hinduism', pct: 8.81 },
      { faith: 'Christianity', pct: 0.98 },
    ],
    established: '1970 (modern province)', universities: 80,
    country: 'Pakistan', countrySlug: 'pakistan', countryCode: 'PK',
    primaryColor: '#0C7A3D',
    heroImage: '/images/cities/karachi-hero.webp',
    heroAlt: 'Mazar-e-Quaid, Karachi',
    heroCredit: 'Photo: Jan Kranendonk · CC BY-SA 4.0',
    lat: 25.8943, lng: 68.5247,
  },
  'pakistan/khyber-pakhtunkhwa': {
    name: 'Khyber Pakhtunkhwa', slug: 'khyber-pakhtunkhwa', capital: 'Peshawar',
    // Population and area: PBS Census 2023 (the 101,741 km² area is the
    // post-merger province, including the former tribal districts).
    // Faith: PBS Census 2023, Table 9 (Muslim 40,486,153 = 99.62% of
    // responses; Christian 134,884 = 0.33%; Hindu 6,102 = 0.02%).
    population: 40856097, area: 101741,
    tagline: 'Land of mountains and ancient traditions',
    knownFor: 'Mountains, Tourism, Agriculture, Minerals',
    gdpPct: '11%', literacyRate: '53%', climate: 'Varies: Alpine to Subtropical',
    majorFaith: 'Islam', majorFaithPct: 99.62,
    faithSlices: [
      { faith: 'Islam', pct: 99.62 },
      { faith: 'Christianity', pct: 0.33 },
      { faith: 'Hinduism', pct: 0.02 },
    ],
    established: '1970 (modern province)', universities: 40,
    country: 'Pakistan', countrySlug: 'pakistan', countryCode: 'PK',
    primaryColor: '#0C7A3D',
    heroImage: '/images/cities/peshawar-hero.webp',
    heroAlt: 'Islamia College, Peshawar',
    heroCredit: 'Photo: Saadkhan12345 · CC0',
    lat: 34.9526, lng: 72.3311,
  },
  // Added in Q11: this entry was MISSING, and the lookup below silently
  // fell back to Punjab, so /pakistan/islamabad-capital-territory
  // rendered Punjab's name, capital and stats under an ICT URL.
  // Population: 2023 census (PBS). Area: 906 km² (capital territory).
  'pakistan/islamabad-capital-territory': {
    name: 'Islamabad Capital Territory', slug: 'islamabad-capital-territory', capital: 'Islamabad',
    population: 2363863, area: 906,
    tagline: 'Federal capital territory: seat of government',
    knownFor: 'Government, Diplomacy, Margalla Hills, Education',
    gdpPct: 'Not published', literacyRate: '89%', climate: 'Humid subtropical',
    // Faith: PBS Census 2023, Table 9, ICT row (Muslim 2,181,663 =
    // 95.55% of responses; Christian 97,281 = 4.26%; Ahmadi 2,398;
    // Hindu 884). Same row as census2023-splits.ts.
    majorFaith: 'Islam', majorFaithPct: 95.55,
    faithSlices: [
      { faith: 'Islam', pct: 95.55 },
      { faith: 'Christianity', pct: 4.26 },
      { faith: 'Ahmadiyya', pct: 0.11 },
      { faith: 'Hinduism', pct: 0.04 },
    ],
    established: '1960 (capital territory)', universities: 30,
    country: 'Pakistan', countrySlug: 'pakistan', countryCode: 'PK',
    primaryColor: '#0C7A3D',
    heroImage: '/images/cities/islamabad-hero.webp',
    heroAlt: 'Faisal Mosque, Islamabad',
    heroCredit: 'Photo: Guilhem Vellut · CC BY 2.0',
    lat: 33.7294, lng: 73.0931,
  },
};

const PROVINCE_CITIES: Record<string, City[]> = {
  'islamabad-capital-territory': [
    // F3: fallback figures for the census cities are the PBS
    // Census-2023 totals from the single source in @/lib/census2023.
    { name: 'Islamabad', slug: 'islamabad', population: CENSUS_2023_POPULATION['pakistan/islamabad-capital-territory/islamabad'] },
  ],
  punjab: [
    { name: 'Lahore',      slug: 'lahore',      population: CENSUS_2023_POPULATION['pakistan/punjab/lahore'] },
    { name: 'Faisalabad',  slug: 'faisalabad',  population: CENSUS_2023_POPULATION['pakistan/punjab/faisalabad'] },
    { name: 'Rawalpindi',  slug: 'rawalpindi',  population: 2100000 },
    { name: 'Multan',      slug: 'multan',      population: CENSUS_2023_POPULATION['pakistan/punjab/multan'] },
    { name: 'Gujranwala',  slug: 'gujranwala',  population: 2000000 },
    { name: 'Sialkot',     slug: 'sialkot',     population: 900000 },
  ],
  sindh: [
    { name: 'Karachi',    slug: 'karachi',    population: CENSUS_2023_POPULATION['pakistan/sindh/karachi'] },
    { name: 'Hyderabad',  slug: 'hyderabad',  population: 1800000 },
    { name: 'Sukkur',     slug: 'sukkur',     population: 500000 },
    { name: 'Larkana',    slug: 'larkana',    population: 490000 },
    { name: 'Nawabshah',  slug: 'nawabshah',  population: 300000 },
    { name: 'Jacobabad',  slug: 'jacobabad',  population: 280000 },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Peshawar',    slug: 'peshawar',    population: CENSUS_2023_POPULATION['pakistan/khyber-pakhtunkhwa/peshawar'] },
    { name: 'Abbottabad',  slug: 'abbottabad',  population: 500000 },
    { name: 'Mardan',      slug: 'mardan',      population: 400000 },
    { name: 'Mingora',     slug: 'mingora',     population: 280000 },
    { name: 'Kohat',       slug: 'kohat',       population: 200000 },
    { name: 'Bannu',       slug: 'bannu',       population: 180000 },
  ],
};

const DIVISIONS: Record<string, Division[]> = {
  'islamabad-capital-territory': [
    { name: 'Islamabad Zones', slug: 'zones', districts: ['Zone I', 'Zone II', 'Zone III', 'Zone IV', 'Zone V'] },
    { name: 'Rural Islamabad', slug: 'rural-islamabad', districts: ['Bhara Kahu', 'Tarlai', 'Sihala', 'Nilore'] },
  ],
  punjab: [
    { name: 'Lahore Division',      slug: 'lahore-division',      districts: ['Lahore', 'Sheikhupura', 'Kasur', 'Nankana Sahib'] },
    { name: 'Faisalabad Division',  slug: 'faisalabad-division',  districts: ['Faisalabad', 'Jhang', 'Toba Tek Singh', 'Chiniot'] },
    { name: 'Rawalpindi Division',  slug: 'rawalpindi-division',  districts: ['Rawalpindi', 'Attock', 'Chakwal', 'Jhelum'] },
    { name: 'Multan Division',      slug: 'multan-division',      districts: ['Multan', 'Khanewal', 'Vehari', 'Lodhran'] },
    { name: 'Gujranwala Division',  slug: 'gujranwala-division',  districts: ['Gujranwala', 'Sialkot', 'Gujrat', 'Hafizabad'] },
    { name: 'Sargodha Division',    slug: 'sargodha-division',    districts: ['Sargodha', 'Bhakkar', 'Khushab', 'Mianwali'] },
    { name: 'Sahiwal Division',     slug: 'sahiwal-division',     districts: ['Sahiwal', 'Pakpattan', 'Okara'] },
    { name: 'DG Khan Division',     slug: 'dg-khan-division',     districts: ['DG Khan', 'Rajanpur', 'Muzaffargarh', 'Layyah'] },
    { name: 'Bahawalpur Division',  slug: 'bahawalpur-division',  districts: ['Bahawalpur', 'Bahawalnagar', 'Rahim Yar Khan'] },
  ],
  sindh: [
    { name: 'Karachi Division',   slug: 'karachi-division',   districts: ['Karachi East', 'Karachi West', 'Karachi South', 'Karachi Central'] },
    { name: 'Hyderabad Division', slug: 'hyderabad-division', districts: ['Hyderabad', 'Jamshoro', 'Matiari', 'Tando Allahyar'] },
    { name: 'Sukkur Division',    slug: 'sukkur-division',    districts: ['Sukkur', 'Khairpur', 'Ghotki'] },
    { name: 'Larkana Division',   slug: 'larkana-division',   districts: ['Larkana', 'Jacobabad', 'Shikarpur', 'Kashmore'] },
    { name: 'Shaheed Benazirabad', slug: 'shaheed-division',  districts: ['Nawabshah', 'Sanghar', 'Naushahro Feroze'] },
    { name: 'Mirpur Khas Division', slug: 'mirpur-division',  districts: ['Mirpur Khas', 'Umerkot', 'Tharparkar'] },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Peshawar Division',   slug: 'peshawar-division',   districts: ['Peshawar', 'Nowshera', 'Charsadda', 'Khyber'] },
    { name: 'Mardan Division',     slug: 'mardan-division',     districts: ['Mardan', 'Swabi'] },
    { name: 'Malakand Division',   slug: 'malakand-division',   districts: ['Swat', 'Dir', 'Buner', 'Shangla', 'Chitral'] },
    { name: 'Hazara Division',     slug: 'hazara-division',     districts: ['Abbottabad', 'Mansehra', 'Haripur', 'Battagram'] },
    { name: 'Kohat Division',      slug: 'kohat-division',      districts: ['Kohat', 'Hangu', 'Karak', 'Orakzai'] },
    { name: 'Bannu Division',      slug: 'bannu-division',      districts: ['Bannu', 'Lakki Marwat', 'North Waziristan'] },
  ],
};

const INDUSTRIES: Record<string, Industry[]> = {
  'islamabad-capital-territory': [
    { name: 'Government & Administration', icon: '🏛️', description: 'Federal ministries, parliament, the judiciary and foreign missions are headquartered in the capital.', city: 'Islamabad' },
    { name: 'Information Technology', icon: '💻', description: 'A growing software and telecom sector, anchored by the National Incubation Center and IT parks.', city: 'Islamabad' },
    { name: 'Education & Research', icon: '🎓', description: 'Quaid-i-Azam University, NUST, COMSATS and IIUI anchor a dense higher-education cluster.', city: 'Islamabad' },
    { name: 'Pharmaceuticals', icon: '💊', description: 'National pharmaceutical manufacturers operate plants in the territory\'s industrial zones.', city: 'Islamabad' },
    { name: 'Tourism & Hospitality', icon: '🏨', description: 'Margalla Hills trailheads, Saidpur Village and Daman-e-Koh draw visitors year-round.', city: 'Islamabad' },
  ],
  punjab: [
    { name: 'Textiles', icon: '🧵', description: 'Largest textile industry in Pakistan, centred on Faisalabad\'s mills', city: 'Faisalabad' },
    { name: 'Agriculture', icon: '🌾', description: 'Wheat, rice, sugarcane, cotton: the breadbasket of Pakistan', city: 'Province-wide' },
    { name: 'Sports Goods', icon: '⚽', description: 'An estimated 70% of the world\'s hand-stitched footballs come from Sialkot (industry estimate)', city: 'Sialkot' },
    { name: 'Surgical Instruments', icon: '🔬', description: 'One of the world\'s leading surgical-instrument centres, exporting to hospitals worldwide', city: 'Sialkot' },
    { name: 'Manufacturing', icon: '🏭', description: 'Automotive parts, electronics, consumer goods', city: 'Lahore' },
    { name: 'IT Services', icon: '💻', description: 'Rapidly growing tech sector in Lahore', city: 'Lahore' },
  ],
  sindh: [
    { name: 'Financial Services', icon: '🏦', description: 'Banking, insurance, and Karachi Stock Exchange', city: 'Karachi' },
    { name: 'Port & Shipping', icon: '🚢', description: 'Karachi\'s ports handle an estimated 95% of Pakistan\'s foreign trade (commonly cited estimate)', city: 'Karachi' },
    { name: 'Oil & Gas', icon: '⛽', description: 'Major natural gas production and refining', city: 'Hyderabad' },
    { name: 'Agriculture', icon: '🌾', description: 'Cotton, sugar cane, wheat and rice production', city: 'Province-wide' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Tourism', icon: '🏔️', description: 'Swat, Kaghan, Chitral attract millions of visitors', city: 'Province-wide' },
    { name: 'Agriculture', icon: '🌾', description: 'Fruit orchards, tobacco, wheat and maize', city: 'Province-wide' },
    { name: 'Minerals', icon: '💎', description: 'Emeralds, chromite, marble and gemstones', city: 'Various' },
    { name: 'Hydro Power', icon: '⚡', description: 'Major contributor to Pakistan\'s electricity', city: 'Swat Valley' },
  ],
};

const PRODUCTS: Record<string, Product[]> = {
  punjab: [
    { name: 'Khussa Shoes', emoji: '👞', category: 'Leather', origin: 'Lahore' },
    { name: 'Phulkari Embroidery', emoji: '🪡', category: 'Textile', origin: 'Province-wide' },
    { name: 'Sports Goods', emoji: '⚽', category: 'Manufacturing', origin: 'Sialkot' },
    { name: 'Surgical Instruments', emoji: '🔬', category: 'Manufacturing', origin: 'Sialkot' },
    { name: 'Basmati Rice', emoji: '🍚', category: 'Agriculture', origin: 'Province-wide' },
    { name: 'Chaunsa Mango', emoji: '🥭', category: 'Fruit', origin: 'Multan' },
    { name: 'Multan Blue Pottery', emoji: '🏺', category: 'Pottery', origin: 'Multan' },
    { name: 'Truck Art', emoji: '🎨', category: 'Folk Art', origin: 'Province-wide' },
  ],
  sindh: [
    { name: 'Ajrak Print', emoji: '🧣', category: 'Textile', origin: 'Thatta' },
    { name: 'Sindhi Topi', emoji: '🎩', category: 'Handicraft', origin: 'Province-wide' },
    { name: 'Rilli Quilt', emoji: '🛏️', category: 'Textile', origin: 'Province-wide' },
    { name: 'Camel Skin Lamps', emoji: '🪔', category: 'Handicraft', origin: 'Karachi' },
    { name: 'Sindhi Dates', emoji: '🌴', category: 'Agriculture', origin: 'Khairpur' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Peshawari Chappal', emoji: '👡', category: 'Leather', origin: 'Peshawar' },
    { name: 'Chapli Kebab', emoji: '🥩', category: 'Food', origin: 'Peshawar' },
    { name: 'Emeralds', emoji: '💎', category: 'Gemstone', origin: 'Swat' },
    { name: 'Wooden Crafts', emoji: '🪵', category: 'Handicraft', origin: 'Swat' },
    { name: 'Chitrali Wool', emoji: '🧶', category: 'Textile', origin: 'Chitral' },
  ],
};

const LANDMARKS: Record<string, Landmark[]> = {
  // Photo standard (owner rulebook G3/G5, 3 Nov 2026): every photo is a
  // real, licence-verified photo of the named subject, held locally,
  // with its credit printed BELOW the photo. A landmark whose subject
  // has no verified photo in the repo renders as a text card
  // (image: null): a missing photo is honest, a wrong photo is not.
  // The previous build reused a handful of stock photos across many
  // different subjects (a New York skyscraper photo served as both the
  // Sindh hero and a Multan shrine); those are all removed.
  'islamabad-capital-territory': [
    { name: 'Faisal Mosque', city: 'Islamabad', era: 'Modern 1986', unesco: false, image: '/images/cities/islamabad-hero.webp', alt: 'Faisal Mosque, Islamabad', credit: 'Photo: Guilhem Vellut · CC BY 2.0' },
    { name: 'Pakistan Monument', city: 'Islamabad', era: 'Modern 2007', unesco: false, image: '/images/cities/islamabad-events.webp', alt: 'Pakistan Monument, Islamabad, at blue hour', credit: 'Photo: Muhammad Ashar · CC BY-SA 4.0' },
    { name: 'Margalla Hills National Park', city: 'Islamabad', era: 'Natural', unesco: false, image: '/images/places/margalla-hills.webp', alt: 'Margalla Hills above Islamabad', credit: 'Photo: Zain.3nov · CC BY-SA 4.0' },
    { name: 'Daman-e-Koh', city: 'Islamabad', era: 'Viewpoint', unesco: false, image: '/images/cities/islamabad-news.webp', alt: 'Islamabad cityscape from Daman-e-Koh', credit: 'Photo: Zeeshanhkofficial · CC BY-SA 4.0' },
    { name: 'Rawal Lake', city: 'Islamabad', era: '1960s', unesco: false, image: '/images/places/rawal-lake.webp', alt: 'Rawal Lake, Islamabad', credit: 'Photo: XnShAnoo · CC BY-SA 4.0' },
    { name: 'Lok Virsa Museum', city: 'Islamabad', era: '1974', unesco: false, image: '/images/places/lok-virsa-museum.webp', alt: 'Lok Virsa Museum facade, Islamabad', credit: 'Photo: Ymblanter · CC BY-SA 4.0' },
  ],
  punjab: [
    { name: 'Badshahi Mosque', city: 'Lahore', era: 'Mughal 1673', unesco: false, image: '/images/places/cards/badshahi-mosque.webp', alt: 'Courtyard of Badshahi Mosque, Lahore', credit: 'Photo: Zapata1000 · CC BY-SA 4.0' },
    { name: 'Lahore Fort (Shahi Qila)', city: 'Lahore', era: 'Mughal 1566', unesco: true, image: '/images/places/cards/lahore-fort.webp', alt: 'Alamgiri Gate of Lahore Fort', credit: 'Photo: Rohaan Bhatti · CC BY-SA 3.0' },
    { name: 'Shalimar Gardens', city: 'Lahore', era: 'Mughal 1641', unesco: true, image: '/images/places/cards/shalimar-gardens.webp', alt: 'Shalimar Gardens, Lahore', credit: 'Photo: M Umair Astro · CC BY-SA 4.0' },
    { name: 'Rohtas Fort', city: 'Jhelum', era: 'Suri 1541', unesco: true, image: '/images/places/rohtas-fort.webp', alt: 'Rohtas Fort, Jhelum', credit: 'Photo: Guilhem Vellut · CC BY 2.0' },
    { name: 'Kartarpur Corridor', city: 'Narowal', era: 'Modern 2019', unesco: false, image: '/images/places/kartarpur-corridor.webp', alt: 'Gurdwara Darbar Sahib, Kartarpur', credit: 'Photo: Shahzaib Damn Cruze · CC BY-SA 4.0' },
    { name: 'Multan Shrines', city: 'Multan', era: '13th Century', unesco: false, image: '/images/cities/multan-hero.webp', alt: 'Shah Rukn-e-Alam Shrine, Multan', credit: 'Photo: Tahsin Shah · CC BY-SA 4.0' },
  ],
  sindh: [
    { name: 'Mohenjo-daro', city: 'Larkana', era: '3000 BCE', unesco: true, image: '/images/places/mohenjo-daro.webp', alt: 'Excavated ruins of Mohenjo-daro, with the Great Bath in the foreground', credit: 'Photo: Saqib Qayyum · CC BY-SA 3.0' },
    { name: 'Thatta Mosques', city: 'Thatta', era: 'Mughal 1647', unesco: true, image: '/images/places/shah-jahan-mosque-thatta.webp', alt: 'Shah Jahan Mosque, Thatta', credit: 'Photo: Naseerullah0862 · CC BY-SA 3.0' },
    { name: 'Makli Necropolis', city: 'Thatta', era: '14th Century', unesco: true, image: '/images/places/makli-necropolis.webp', alt: 'Tombs at Makli Necropolis, Thatta', credit: 'Photo: Nadirkhanbrahui · CC BY-SA 4.0' },
    { name: 'Karachi Clifton Beach', city: 'Karachi', era: 'Natural', unesco: false, image: '/images/places/clifton-beach.webp', alt: 'Clifton Beach, Karachi', credit: 'Photo: Nomi887 · CC BY-SA 4.0' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Takht-i-Bahi', city: 'Mardan', era: '1st Century BC', unesco: true, image: '/images/places/takht-i-bahi.webp', alt: 'Ruins of Takht-i-Bahi, Mardan', credit: 'Photo: Hidayat-ur-Rehman · CC BY-SA 4.0' },
    { name: 'Swat Valley', city: 'Swat', era: 'Natural Wonder', unesco: false, image: '/images/places/swat-valley.webp', alt: 'Swat River at Kalam, Swat Valley', credit: 'Photo: Mian Saqib Asif · CC BY-SA 4.0' },
    { name: 'Peshawar Museum', city: 'Peshawar', era: 'Colonial 1906', unesco: false, image: '/images/places/peshawar-museum.webp', alt: 'Peshawar Museum building', credit: 'Photo: Khalid Mahmood · CC BY-SA 3.0' },
    { name: 'Qissa Khwani Bazaar', city: 'Peshawar', era: 'Ancient', unesco: false, image: '/images/places/qissa-khwani-bazaar.webp', alt: 'Heritage building and bookshops in Qissa Khwani Bazaar, Peshawar', credit: 'Photo: franek2 · CC BY-SA 3.0' },
  ],
};

const FOODS: Record<string, Food[]> = {
  'islamabad-capital-territory': [
    { name: 'Savour Pulao', emoji: '🍚', description: 'The city\'s signature pulao kabab with raita and salad, an Islamabad institution.', origin: 'Islamabad' },
    { name: 'Kabab & Tikka', emoji: '🍢', description: 'Charcoal-grilled kababs and tikkas at the Jinnah Super and F-7 food streets.', origin: 'Islamabad' },
    { name: 'Saidpur Village Dining', emoji: '🍽️', description: 'Traditional and continental restaurants in a restored village at the foot of the Margalla Hills.', origin: 'Saidpur, Islamabad' },
  ],
  punjab: [
    { name: 'Saag & Makki di Roti', emoji: '🥬', description: 'Mustard greens slow-cooked with butter, served with corn flatbread: the soul of Punjab.', origin: 'Province-wide' },
    { name: 'Lahori Chargha', emoji: '🍗', description: 'Whole chicken marinated overnight in spices, steamed then deep-fried. A Lahore legend.', origin: 'Lahore' },
    { name: 'Paye', emoji: '🥣', description: 'Slow-cooked trotters simmered overnight: the definitive Punjab breakfast for cold mornings.', origin: 'Province-wide' },
    { name: 'Sohan Halwa', emoji: '🍮', description: 'Multan\'s famous dense sweet made with wheat starch, sugar, ghee and saffron.', origin: 'Multan' },
    { name: 'Lassi', emoji: '🥛', description: 'Thick churned yoghurt, sweet or salted, served in a clay pot. Punjab in a glass.', origin: 'Province-wide' },
    { name: 'Chaunsa Mango', emoji: '🥭', description: 'The king of mangoes. Grown in Multan, eaten across Pakistan every summer.', origin: 'Multan' },
  ],
  sindh: [
    { name: 'Sindhi Biryani', emoji: '🍛', description: 'Spicier than other styles, with potatoes and dried plums in the rice, distinctly Sindhi.', origin: 'Karachi' },
    { name: 'Seyal Maani', emoji: '🥘', description: 'Stale flatbread cooked with spiced gravy, a beloved Sindhi comfort dish.', origin: 'Province-wide' },
    { name: 'Sindhi Curry', emoji: '🍲', description: 'Gram flour and tamarind-based curry with mixed vegetables, a Sindhi signature.', origin: 'Province-wide' },
    { name: 'Palla Fish', emoji: '🐟', description: 'Hilsa fish from the Indus, a delicacy that only runs for two months a year.', origin: 'Indus River' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Chapli Kebab', emoji: '🥩', description: 'Flat spiced minced meat patty grilled over open flame. Peshawar\'s gift to the world.', origin: 'Peshawar' },
    { name: 'Kabuli Pulao', emoji: '🍚', description: 'Fragrant rice cooked with lamb, carrots, raisins and spices, a Frontier classic.', origin: 'Peshawar' },
    { name: 'Karahi Gosht', emoji: '🍳', description: 'Lamb or beef cooked in a wok with tomatoes, ginger and green chillies, KPK style.', origin: 'Province-wide' },
    { name: 'Shahi Tukray', emoji: '🍞', description: 'Fried bread soaked in sweet condensed milk, a royal dessert from the Frontier.', origin: 'Peshawar' },
  ],
};

const RESOURCES: Record<string, Resource[]> = {
  'islamabad-capital-territory': [
    { name: 'Margalla Hills National Park', icon: '🌲', rank: 'Protected national park', description: 'A protected Himalayan-foothill ecosystem of forest, trails and wildlife directly behind the capital.' },
    { name: 'Limestone & Marble', icon: '🪨', rank: 'Quarried locally', description: 'Margalla limestone feeds the capital region\'s cement and construction industry.' },
    { name: 'Rawal Lake Water', icon: '💧', rank: 'Reservoir', description: 'The Rawal Dam reservoir supplies drinking water to Islamabad and Rawalpindi.' },
    { name: 'Urban Forest Cover', icon: '🌳', rank: 'Among Pakistan\'s greenest cities', description: 'Planned green belts, the Margalla forest and tree-lined sectors give the territory exceptional green cover.' },
  ],
  punjab: [
    { name: 'Fertile Agricultural Land', icon: '🌾', rank: 'Alluvial plains', description: 'Punjab\'s alluvial plains, fed by 5 rivers, are among the most productive farmland in the region.' },
    { name: 'Indus River System', icon: '🌊', rank: 'Five major rivers', description: 'Five major rivers, the Indus, Jhelum, Chenab, Ravi and Sutlej, irrigate the entire province.' },
    { name: 'Rock Salt (Khewra)', icon: '🪨', rank: 'World 2nd largest mine', description: 'Khewra Salt Mine has been mined since the 1200s and holds 220 million tonnes of reserves.' },
    { name: 'Coal (Salt Range)', icon: '⚫', rank: 'Significant deposits', description: 'Coal deposits across the Salt Range provide fuel for local industry.' },
    { name: 'Natural Gas', icon: '🔥', rank: 'Significant reserves', description: 'Natural gas fields contribute to Punjab\'s energy supply and national grid.' },
    { name: 'Underground Water', icon: '💧', rank: 'Rich aquifers', description: 'Punjab sits on extensive groundwater aquifers that supply agriculture and cities.' },
  ],
  sindh: [
    { name: 'Natural Gas', icon: '🔥', rank: 'Pakistan\'s largest reserves', description: 'Sindh holds Pakistan\'s largest natural gas reserves, powering much of the national grid.' },
    { name: 'Oil Fields', icon: '🛢️', rank: 'Significant production', description: 'Oil fields in Sindh contribute substantially to Pakistan\'s domestic petroleum production.' },
    { name: 'Coal (Thar)', icon: '⚫', rank: 'Among the world\'s largest lignite deposits', description: 'The Thar Coal Field contains an estimated 175 billion tonnes of lignite (Geological Survey of Pakistan estimate), one of the world\'s largest deposits of its kind.' },
    { name: 'Arabian Sea Fisheries', icon: '🐟', rank: 'Major resource', description: 'Karachi\'s fishing industry harvests one of the region\'s richest marine zones.' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Emeralds', icon: '💎', rank: 'World top 3 producer', description: 'Swat Valley produces some of the world\'s finest emeralds, exported globally.' },
    { name: 'Chromite', icon: '🪨', rank: 'Major deposits', description: 'KPK holds significant chromite deposits used in steel and metallurgy.' },
    { name: 'Marble', icon: '🗿', rank: 'Pakistan\'s largest reserves', description: 'KPK holds 300 billion cubic feet of marble reserves of various colours and grades.' },
    { name: 'Hydro Power', icon: '⚡', rank: 'Pakistan\'s largest potential', description: 'The province\'s fast rivers generate significant hydro electricity for the national grid.' },
  ],
};

const PERSONALITIES: Record<string, Personality[]> = {
  punjab: [
    { name: 'Allama Iqbal', profession: 'Poet & Philosopher', category: 'Leaders', birthCity: 'Sialkot', photo: '/images/home28/pers-iqbal.webp', credit: 'Photo: Iqbal Academy Pakistan · Public domain', slug: 'allama-iqbal' },
    { name: 'Wasim Akram', profession: 'Cricketer', category: 'Sports', birthCity: 'Lahore', photo: '/images/personalities/wasim-akram.webp', credit: 'Photo: Arijit Basak · CC BY 2.0', slug: 'wasim-akram' },
    { name: 'Nusrat Fateh Ali Khan', profession: 'Musician', category: 'Arts', birthCity: 'Faisalabad', photo: '/images/personalities/nusrat-fateh-ali-khan.webp', credit: 'Photo: Thomas Rome · CC BY 2.0', slug: 'nusrat-fateh-ali-khan', pos: '80% 0%' },
    { name: 'Arfa Karim', profession: 'Tech Prodigy', category: 'Science', birthCity: 'Faisalabad', photo: '/images/personalities/arfa-karim.webp', credit: 'Photo: Muhammad Imran Saeed · CC BY 2.0' },
    { name: 'Imran Khan', profession: 'Cricketer & Politician', category: 'Sports', birthCity: 'Lahore', photo: '/images/personalities/imran-khan.webp', credit: 'Photo: World Economic Forum · CC BY-SA 2.0', slug: 'imran-khan' },
    { name: 'Abida Parveen', profession: 'Sufi Singer', category: 'Arts', birthCity: 'Larkana (raised Punjab)', photo: '/images/personalities/abida-parveen.webp', credit: 'Photo: Hammad Khan · CC BY 2.0' },
  ],
  sindh: [
    { name: 'Muhammad Ali Jinnah', profession: 'Father of the Nation', category: 'Leaders', birthCity: 'Karachi', photo: '/images/personalities/muhammad-ali-jinnah.webp', credit: 'Photo: Ministry of Information & Broadcasting, Government of Pakistan · Public domain', slug: 'quaid-e-azam-jinnah' },
    { name: 'Benazir Bhutto', profession: 'Prime Minister', category: 'Leaders', birthCity: 'Karachi', photo: '/images/personalities/benazir-bhutto.webp', credit: 'Photo: Oliver Mark · CC BY-SA 4.0', slug: 'benazir-bhutto' },
    { name: 'Abdul Sattar Edhi', profession: 'Philanthropist', category: 'Leaders', birthCity: 'Karachi (origin Gujarat)', photo: '/images/personalities/abdul-sattar-edhi.webp', credit: 'Photo: Hussain · CC BY-SA 3.0', slug: 'abdul-sattar-edhi' },
    { name: 'Abida Parveen', profession: 'Sufi Singer', category: 'Arts', birthCity: 'Larkana', photo: '/images/personalities/abida-parveen.webp', credit: 'Photo: Hammad Khan · CC BY 2.0' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Khan Abdul Ghaffar Khan', profession: 'Freedom Fighter', category: 'Leaders', birthCity: 'Charsadda', photo: '/images/personalities/khan-abdul-ghaffar-khan.webp', credit: 'Photo: British India · Public domain' },
    { name: 'Malala Yousafzai', profession: 'Education Activist', category: 'Leaders', birthCity: 'Swat', photo: '/images/personalities/malala-yousafzai.webp', credit: 'Photo: flowcomm · CC BY 2.0', slug: 'malala-yousafzai' },
    { name: 'Shahid Afridi', profession: 'Cricketer', category: 'Sports', birthCity: 'Khyber Agency', photo: '/images/personalities/shahid-afridi.webp', credit: 'Photo: Shehbaz Sharif · CC BY 2.0' },
    { name: 'Ghani Khan', profession: 'Poet & Artist', category: 'Arts', birthCity: 'Charsadda', photo: '/images/personalities/ghani-khan-card.webp', credit: 'Photo: Ahmad Ali Khan · Public domain' },
  ],
};

const EVENTS: Record<string, { name: string; date: string; type: string; city: string }[]> = {
  'islamabad-capital-territory': [
    { name: 'Pakistan Day Parade', date: '23 March', type: 'National', city: 'Islamabad' },
    { name: 'Islamabad Literature Festival', date: 'April', type: 'Cultural', city: 'Islamabad' },
    { name: 'Lok Virsa Folk Festival', date: 'Annual', type: 'Cultural', city: 'Islamabad' },
    { name: 'Islamabad Marathon', date: 'January', type: 'Sports', city: 'Islamabad' },
  ],
  punjab: [
    { name: 'Lahore Literary Festival', date: 'February', type: 'Cultural', city: 'Lahore' },
    { name: 'PSL Finals', date: 'March–April', type: 'Sports', city: 'Lahore' },
    { name: 'Shalimar Garden Spring Show', date: 'March', type: 'Cultural', city: 'Lahore' },
    { name: 'Basant Kite Festival', date: 'February', type: 'Cultural', city: 'Lahore' },
    { name: 'Multan Mango Festival', date: 'June–July', type: 'Cultural', city: 'Multan' },
    { name: 'Urs at Data Darbar', date: 'Rabi al-Awwal (Islamic calendar)', type: 'Religious', city: 'Lahore' },
  ],
  sindh: [
    { name: 'Sindh Cultural Day', date: 'December 5', type: 'Cultural', city: 'Province-wide' },
    { name: 'Urs at Shah Abdul Latif', date: 'Safar (Islamic calendar)', type: 'Religious', city: 'Bhit Shah' },
    { name: 'Karachi Literature Festival', date: 'February', type: 'Cultural', city: 'Karachi' },
    { name: 'Indus Marathon', date: 'March', type: 'Sports', city: 'Karachi' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Shandur Polo Festival', date: 'July', type: 'Sports', city: 'Chitral' },
    { name: 'Swat Literary Festival', date: 'August', type: 'Cultural', city: 'Swat' },
    { name: 'KPK Aman Jirga', date: 'Annual', type: 'Cultural', city: 'Peshawar' },
    { name: 'Pakhtun Cultural Day', date: 'November', type: 'Cultural', city: 'Province-wide' },
  ],
};

const OTHER_PROVINCES: Record<string, OtherProvince[]> = {
  pakistan: [
    { name: 'Punjab', slug: 'punjab', tagline: 'Most populous province' },
    { name: 'Sindh', slug: 'sindh', tagline: 'Economic heartbeat' },
    { name: 'KPK', slug: 'khyber-pakhtunkhwa', tagline: 'Land of mountains' },
    { name: 'Islamabad Capital Territory', slug: 'islamabad-capital-territory', tagline: 'Federal capital territory' },
    { name: 'Balochistan', slug: 'balochistan', tagline: 'Largest province' },
    { name: 'Gilgit-Baltistan', slug: 'gilgit-baltistan', tagline: 'Roof of the world' },
    { name: 'AJK', slug: 'azad-kashmir', tagline: 'Heaven on earth' },
  ],
};

// National numbers (police, ambulance/rescue, fire, Edhi, women and
// child helplines) work across Pakistan. Disaster response is provincial:
// the only province disaster line held anywhere on this site is PDMA
// Punjab's 1129 (the city template's figure), so it is shown on the
// Punjab page only, under Punjab's name. The old shared entry labelled
// "Punjab Disaster 0800-13100" was rendered on every province and is
// removed: a Punjab number must not appear as Sindh's or KPK's.
const EMERGENCY_NATIONAL: Emergency[] = [
  { label: 'Police', number: '15', color: '#1d4ed8' },
  { label: 'Ambulance / Rescue', number: '1122', color: '#dc2626' },
  { label: 'Fire', number: '16', color: '#ea580c' },
  { label: 'Edhi Ambulance', number: '115', color: '#7c3aed' },
  { label: 'Women Helpline', number: '1043', color: '#db2777' },
  { label: 'Child Helpline', number: '1121', color: '#0891b2' },
];

const EMERGENCY_PROVINCE_EXTRA: Record<string, Emergency[]> = {
  punjab: [
    { label: 'PDMA Punjab Disaster Line', number: '1129', color: '#b45309' },
  ],
};



// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
}

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

function SectionHeader({ icon: Icon, title, accent }: { icon: any; title: string; accent: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-1.5 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProvincePage({ wbCountryPopulation, live }: { wbCountryPopulation?: { value: number; year: number } | null; live?: ProvinceLiveData } = {}) {
  const params = useParams<{ country: string; province: string }>();
  // Same pattern as the country page: local synchronous template data is
  // initialized up front so the server render is the full page, not a
  // "Loading..." shell. The effect below still handles navigation.
  // Q11 fix: an unregistered province must NOT silently render another
  // province's data (that is how ICT showed Punjab). It now lands on
  // the honest "guide in preparation" state below. initialProv is kept
  // only to initialise the section hooks safely.
  const requestedProv = PROVINCES[`${params.country}/${params.province}`];
  const initialProv = requestedProv ?? PROVINCES['pakistan/punjab'];
  const [province, setProvince] = useState<Province | null>(requestedProv ?? null);
  const [cities, setCities] = useState<City[]>(PROVINCE_CITIES[initialProv.slug] || []);
  const [liveCities, setLiveCities] = useState<SupabaseCity[]>([]);
  const [divisions, setDivisions] = useState<Division[]>(DIVISIONS[initialProv.slug] || []);
  const [industries, setIndustries] = useState<Industry[]>(INDUSTRIES[initialProv.slug] || []);
  const [products, setProducts] = useState<Product[]>(PRODUCTS[initialProv.slug] || []);
  const [landmarks, setLandmarks] = useState<Landmark[]>(LANDMARKS[initialProv.slug] || []);
  const [foods, setFoods] = useState<Food[]>(FOODS[initialProv.slug] || []);
  const [resources, setResources] = useState<Resource[]>(RESOURCES[initialProv.slug] || []);
  const [emergency, setEmergency] = useState<Emergency[]>([...EMERGENCY_NATIONAL, ...(EMERGENCY_PROVINCE_EXTRA[initialProv.slug] || [])]);
  const [personalities, setPersonalities] = useState<Personality[]>(PERSONALITIES[initialProv.slug] || []);
  const [events, setEvents] = useState<{ name: string; date: string; type: string; city: string }[]>(EVENTS[initialProv.slug] || []);
  const [otherProvinces, setOtherProvinces] = useState<OtherProvince[]>(OTHER_PROVINCES[initialProv.countrySlug] || []);
  // PKT clock for the live prayer card: statuses and the countdown are
  // computed on the client against Asia/Karachi time (the city
  // template's pattern). Null until mount, so server-rendered HTML
  // carries the real times without any status claim.
  const [pktNow, setPktNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setPktNow(new Date());
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  const [activePersonality, setActivePersonality] = useState('All');
  const [activeEvent, setActiveEvent] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const key = `${params.country}/${params.province}`;
    const prov = PROVINCES[key];
    if (!prov) { setProvince(null); return; }
    setProvince(prov);
    setCities(PROVINCE_CITIES[prov.slug] || []);
    setDivisions(DIVISIONS[prov.slug] || []);
    setIndustries(INDUSTRIES[prov.slug] || []);
    setProducts(PRODUCTS[prov.slug] || []);
    setLandmarks(LANDMARKS[prov.slug] || []);
    setFoods(FOODS[prov.slug] || []);
    setResources(RESOURCES[prov.slug] || []);
    setEmergency([...EMERGENCY_NATIONAL, ...(EMERGENCY_PROVINCE_EXTRA[prov.slug] || [])]);
    setPersonalities(PERSONALITIES[prov.slug] || []);
    setEvents(EVENTS[prov.slug] || []);
    setOtherProvinces(OTHER_PROVINCES[prov.countrySlug] || []);
    setLoading(false);
  }, [params]);

  // Real Supabase-backed cities for THIS country/province URL pair: works
  // for any province in any country as soon as rows exist in `cities`,
  // independent of the hardcoded PROVINCE_CITIES fallback data above.
  useEffect(() => {
    const countrySlug = (params.country as string || '').toLowerCase();
    const provinceSlug = (params.province as string || '').toLowerCase();
    if (!countrySlug || !provinceSlug) return;
    let cancelled = false;

    (async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('cities')
          .select('name, city_slug:slug, population, primary_color, famous_for:tagline')
          .eq('country_slug', countrySlug)
          .eq('province_slug', provinceSlug)
          .order('population', { ascending: false })
          .limit(6);

        if (!cancelled) {
          if (error) {
            console.warn(`Live cities query error for ${countrySlug}/${provinceSlug}:`, error.message);
            setLiveCities([]);
          } else {
            // F3: canonical override: a stale live `cities` row must
            // not outrank the census figure on the province page.
            setLiveCities(((data || []) as SupabaseCity[]).map((row) => ({
              ...row,
              population: censusPopulationOr(`${countrySlug}/${provinceSlug}/${row.city_slug}`, row.population),
            })));
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error('Live cities fetch failed:', err?.message);
          setLiveCities([]);
        }
      } finally {
        // The static fallback grid stays on screen until live rows
        // replace it: no skeleton state gates this section.
      }
    })();

    return () => { cancelled = true; };
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0f1e' }}>
        <div className="animate-pulse text-white text-lg">Loading...</div>
      </div>
    );
  }
  if (!province) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0f1e' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h1 className="text-white text-2xl font-bold mb-2">Province guide in preparation</h1>
          <p className="text-white/60 mb-4">The full guide for this province is being built. Explore the live provinces on the Pakistan country page.</p>
          <Link href="/pakistan" className="text-indigo-400 hover:text-indigo-300">← Back to Pakistan</Link>
        </div>
      </div>
    );
  }

  const accent = province.primaryColor;
  // FIX-POP1 (billi audit): the population-share denominator is the World
  // Bank's latest SP.POP.TOTL for the country (server-fetched, same path
  // as the economy data). Pakistan's dated fallback (255,219,554,
  // WB 2025, verified 2026-10-22) applies only for PK when the live
  // value is absent; with no total at all the share is not shown.
  const countryTotal = wbCountryPopulation?.value ?? (province.countryCode === 'PK' ? 255219554 : null);
  const countryTotalYear = wbCountryPopulation?.year ?? 2025;
  const bg = '#0a0f1e';
  const cardBg = 'rgba(255,255,255,0.04)';
  const cardBorder = `${accent}30`;

  const personalityCategories = ['All', ...Array.from(new Set(personalities.map(p => p.category)))];
  const filteredPersonalities = activePersonality === 'All' ? personalities : personalities.filter(p => p.category === activePersonality);
  const eventTypes = ['All', ...Array.from(new Set(events.map(e => e.type)))];
  const filteredEvents = activeEvent === 'All' ? events : events.filter(e => e.type === activeEvent);

  // ── Derived live views ──────────────────────────────────────────────
  // Faith bars: the province's sourced PBS Census-2023 (Table 9) slices
  // plus a computed remainder, shown only when it is positive: the
  // remainder is arithmetic on sourced figures, never an invented split.
  const faithNamedTotal = province.faithSlices.reduce((a, r) => a + r.pct, 0);
  const faithRemainder = Math.round((100 - faithNamedTotal) * 100) / 100;
  const faithRows: FaithSlice[] = [
    ...province.faithSlices,
    ...(faithRemainder > 0 ? [{ faith: 'Other faiths', pct: faithRemainder }] : []),
  ];
  const fmtPct = (n: number) => `${parseFloat(n.toFixed(2))}%`;

  // Population share on the Census-2023 national total (item: shares
  // recomputed from PBS figures), World Bank only as a non-PK fallback.
  const censusSharePct = province.countryCode === 'PK'
    ? (province.population / PAKISTAN_PROVINCE_TOTAL * 100).toFixed(1)
    : null;

  // Weather: only cities whose live fetch returned data are listed.
  const weatherCities = cities.filter(c => live?.weather?.[c.slug]);

  // Prayer card view: rows always render from the live timings; the
  // next/passed statuses and countdown appear once the client clock is
  // mounted (pktNow), computed in Asia/Karachi time.
  const prayerView = (() => {
    const timings = live?.prayer?.timings;
    if (!timings) return null;
    const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const fmt12 = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
    };
    const rows = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(name => ({
      name, time: timings[name], mins: toMin(timings[name]),
    }));
    let nextName: string | null = null;
    let countdown: string | null = null;
    const passed = new Set<string>();
    if (pktNow) {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Karachi', hour12: false,
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }).formatToParts(pktNow);
      const get = (t: string) => Number(parts.find(x => x.type === t)?.value ?? 0);
      const nowMin = get('hour') * 60 + get('minute') + get('second') / 60;
      const next = rows.find(r => r.mins > nowMin);
      if (next) {
        nextName = next.name;
        rows.forEach(r => { if (r.mins <= nowMin) passed.add(r.name); });
        const diff = Math.ceil(next.mins - nowMin);
        countdown = diff >= 60 ? `${Math.floor(diff / 60)}h ${diff % 60}m` : `${diff}m`;
      } else {
        nextName = 'Fajr';
        rows.forEach(r => passed.add(r.name));
        const diff = Math.ceil(1440 - nowMin + rows[0].mins);
        countdown = diff >= 60 ? `${Math.floor(diff / 60)}h ${diff % 60}m` : `${diff}m`;
      }
    }
    return { rows, nextName, countdown, passed, fmt12 };
  })();

  // AEO question block: answers built only from this page's own sourced
  // data (Census-2023 population and area, capital, largest city,
  // known-for list, divisions and landmarks held on the page).
  const largestCity = cities.length > 0 ? [...cities].sort((a, b) => b.population - a.population)[0] : null;
  const density = Math.round(province.population / province.area).toLocaleString();
  const qaItems: { q: string; a: string }[] = [
    {
      q: `What is the population of ${province.name}?`,
      a: `According to the Pakistan Bureau of Statistics Census 2023, ${province.name} has a population of ${province.population.toLocaleString()}${censusSharePct ? `, which is ${censusSharePct}% of Pakistan's total of 241,499,431` : ''}. With an area of ${province.area.toLocaleString()} km², that works out to roughly ${density} people per km².`,
    },
    {
      q: `What is the capital of ${province.name}?`,
      a: largestCity && largestCity.name === province.capital
        ? `${province.capital} is the capital of ${province.name} and also its largest city, with a population of ${largestCity.population.toLocaleString()}. It is the seat of the provincial government and the province's main commercial centre.`
        : `${province.capital} is the capital of ${province.name} and the seat of its provincial government.${largestCity ? ` The province's largest city is ${largestCity.name}, with a population of ${largestCity.population.toLocaleString()}.` : ''}`,
    },
    {
      q: `How big is ${province.name}?`,
      a: `${province.name} covers ${province.area.toLocaleString()} km²${divisions.length > 0 ? ` and is administered through ${divisions.length} divisions: ${divisions.map(d => d.name.replace(' Division', '')).join(', ')}` : ''}. Its population of ${province.population.toLocaleString()} (Census 2023) makes it one of Pakistan's principal provinces.`,
    },
    {
      q: `What is ${province.name} known for?`,
      a: `${province.name} is known for ${province.knownFor.toLowerCase()}.${landmarks.length > 0 ? ` Its best-known landmarks include ${landmarks.slice(0, 2).map(l => `${l.name} in ${l.city}`).join(' and ')}.` : ''}${products.length > 0 ? ` Signature products include ${products.slice(0, 2).map(x => x.name).join(' and ')}.` : ''}`,
    },
    ...(largestCity ? [{
      q: `What is the largest city in ${province.name}?`,
      a: `${largestCity.name} is the largest city in ${province.name}, with a population of ${largestCity.population.toLocaleString()}.${largestCity.name === province.capital ? ` It is also the provincial capital.` : ` The provincial capital is ${province.capital}.`} Its full guide, with live weather, prayer times, rates and news, is linked from the Major Cities section of this page.`,
    }] : []),
  ];

  // ── B9: Punjab Assistant (Phase 1) snapshot ─────────────────────────
  // ONLY this page's own data: capital/divisions/cities (page dataset),
  // emergency numbers (page panel), events (page list). Prayer, weather
  // and rates now arrive as live server props (see `live`), but the
  // snapshot keeps its original contract and does not relay them; those
  // fields stay null and the bot answers "I don't have that yet" plus
  // the real section anchor. Population is also deliberately NOT a
  // fact here: population questions fall through to the
  // glance-section link. (The glance panel itself now carries the PBS
  // Census-2023 figure, 127,688,922 for Punjab: fixed in the province
  // template pass of 3 Nov 2026.)
  const punjabAssistantSnapshot = province
    ? {
        scopeName: 'Punjab',
        countryCode: 'PK',
        basePath: '/pakistan/punjab',
        prayerTimes: null,
        temp: null,
        feelsLike: null,
        weatherDesc: null,
        rainMm: null,
        goldPerGram: null,
        goldPerTola: null,
        police: emergency.find((e) => e.label === 'Police')?.number ?? '15',
        ambulance: emergency.find((e) => e.label === 'Ambulance / Rescue')?.number ?? '1122',
        fire: emergency.find((e) => e.label === 'Fire')?.number ?? '16',
        eventsCount: events.length,
        links: {
          prayerTimes: { label: 'Faith & spiritual section', href: '#faith' },
          weather: { label: 'Weather across Punjab section', href: '#weather' },
          rates: { label: 'Market rates section', href: '#rates' },
          events: { label: 'Events section', href: '#events' },
          emergency: { label: 'Emergency contacts section', href: '#emergency' },
        },
        topics: 'emergency numbers, events, its capital, cities and divisions',
        extraFacts: [
          {
            keywords: ['capital'],
            answer: `${province.capital} is the capital of Punjab.`,
            link: { label: 'Lahore city guide', href: '/pakistan/punjab/lahore' },
          },
          {
            keywords: ['division'],
            answer: `Punjab's divisions on this page are: ${divisions.map((d) => d.name).join(', ')}.`,
            link: { label: 'Divisions section', href: '#divisions' },
          },
          {
            keywords: ['cities', 'major cities'],
            answer: `The major cities of Punjab on this page are: ${cities.map((c) => c.name).join(', ')}.`,
            link: { label: 'Major cities section', href: '#cities' },
          },
        ],
        sectionLinks: {
          news: { label: 'News section', href: '#news' },
          sports: { label: 'Major cities section', href: '#cities' },
          economy: { label: 'Economy section', href: '#economy' },
          places: { label: 'Must-see section', href: '#places' },
          food: { label: 'Famous foods section', href: '#foods' },
          jobs: { label: 'Major industries section', href: '#industries' },
          holidays: { label: 'Events section', href: '#events' },
          glance: { label: 'At a glance section', href: '#glance' },
        },
      }
    : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>

      {/* Aurora orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div className="absolute top-20 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-10"
          style={{ backgroundColor: accent }}
          animate={{ y: [0, -40, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-40 left-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-5"
          style={{ backgroundColor: accent }}
          animate={{ y: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 5 }} />
        <FlagSymbolBackground countrySlug={params?.country as string ?? 'pakistan'} />
      </div>

      {/* Breadcrumb */}
      <div className="relative z-10 px-4 pt-4 pb-2 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-300 transition-colors">World</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${province.countrySlug}`} className="hover:text-gray-300 transition-colors">{province.country}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{province.name}</span>
        </div>
      </div>
      {/* Hero: the photo stands alone (no title, tagline or gradient
          overlaid on it, per the owner's photo rules) and its credit
          line sits below it; the title block follows underneath. */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-2">
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: cardBorder }}>
          <img src={province.heroImage} alt={province.heroAlt} fetchPriority="high" className="w-full h-56 md:h-80 object-cover" />
        </div>
        <p className="text-gray-400 text-xs mt-2">{province.heroAlt}. {province.heroCredit}</p>
        <div className="mt-5">
          <h1 className="text-4xl md:text-5xl font-black" style={{ color: accent }}>{province.name}</h1>
          <p className="text-gray-300 text-base mt-1">{province.tagline}</p>
          <p className="text-gray-400 text-sm mt-0.5">{province.country} · {province.knownFor}</p>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20 space-y-14 pt-8">

        {/* ── 1. PROVINCE OVERVIEW ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="glance">
          <SectionHeader icon={Globe} title={`${province.name} at a Glance`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateOverviewParagraph(province.name, province.country, province.capital)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
            {[
              { label: 'Capital', value: province.capital, icon: '🏛️' },
              { label: 'Population', value: fmt(province.population), icon: '👥' },
              { label: 'Area', value: `${fmt(province.area)} km²`, icon: '🗺️' },
              { label: 'GDP Share', value: province.gdpPct, icon: '💵' },
              { label: 'Literacy Rate', value: province.literacyRate, icon: '📚' },
              { label: 'Major Faith', value: `${province.majorFaith} ${province.majorFaithPct}%`, icon: '🕌' },
              { label: 'Climate', value: province.climate, icon: '🌡️' },
              { label: 'Universities', value: `${province.universities}+`, icon: '🎓' },
              { label: 'Established', value: province.established, icon: '📅' },
              { label: 'Known For', value: province.knownFor.split(',')[0].trim(), icon: '⭐' },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-4 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                <div className="text-lg mb-1">{item.icon}</div>
                <div className="text-gray-400 text-xs mb-1">{item.label}</div>
                <div className="text-white text-sm font-semibold leading-tight">{item.value}</div>
              </div>
            ))}
          </div>
          {province.countryCode === 'PK' && (
            <p className="text-gray-400 text-xs mb-5">
              Population and area: Pakistan Bureau of Statistics, Census 2023 (Table 1). Faith shares: Census 2023 (Table 9).
            </p>
          )}
          <p className="text-gray-400 text-sm leading-relaxed">
            {generateOverviewAfter(province.name, province.country)}
          </p>
        </motion.section>

        {/* ── 1b. QUESTIONS & ANSWERS (AEO) ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="questions">
          <SectionHeader icon={Globe} title={`Questions About ${province.name}`} accent={accent} />
          <div className="space-y-5">
            {qaItems.map(item => (
              <div key={item.q}>
                <h3 className="text-white font-semibold text-base mb-1.5">{item.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 2. MAJOR CITIES ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="cities">
          <SectionHeader icon={Building2} title={`Major Cities of ${province.name}`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateCitiesParagraph(province.name)}
          </p>
          {liveCities.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              {liveCities.map(city => (
                <Link key={city.city_slug}
                  href={`/${province.countrySlug}/${province.slug}/${city.city_slug}`}
                  className="group rounded-2xl p-4 border text-center hover:border-opacity-60 transition-all"
                  style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                  <div className="text-2xl mb-2">🏙️</div>
                  <div className="text-white font-semibold text-sm">{city.name}</div>
                  <div className="font-bold text-sm mt-1" style={{ color: city.primary_color || accent }}>
                    {fmt(city.population)}
                  </div>
                  <div className="text-gray-400 text-xs mt-1 line-clamp-1">{city.famous_for || 'Explore city'}</div>
                </Link>
              ))}
            </div>
          ) : cities.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              {cities.map(city => (
                <Link key={city.slug}
                  href={`/${province.countrySlug}/${province.slug}/${city.slug}`}
                  className="group rounded-2xl p-4 border text-center hover:border-opacity-60 transition-all"
                  style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                  <div className="text-3xl mb-2">🏙️</div>
                  <div className="text-white font-semibold text-sm">{city.name}</div>
                  <div className="font-bold text-sm mt-1" style={{ color: accent }}>{fmt(city.population)}</div>
                  <div className="text-gray-400 text-xs mt-1">residents</div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-4">
              City data for {province.name} is being added. Check back soon.
            </p>
          )}
          <p className="text-gray-400 text-sm leading-relaxed mt-4">
            {generateCitiesAfter(province.name)}
          </p>
        </motion.section>

        {/* ── 3. WEATHER ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="weather">
          <SectionHeader icon={Thermometer} title={`Weather Across ${province.name}`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateWeatherParagraph(province.name)}
          </p>
          {weatherCities.length > 0 ? (
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {weatherCities.map(city => {
                  const w = live!.weather[city.slug];
                  return (
                    <Link key={city.slug}
                      href={`/${province.countrySlug}/${province.slug}/${city.slug}/weather`}
                      className="text-center p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="text-white font-medium text-sm">{city.name}</div>
                      <div className="text-2xl my-1">{w.icon}</div>
                      <div className="font-bold text-lg" style={{ color: accent }}>{w.temp}°C</div>
                      <div className="text-gray-400 text-xs">{w.condition}</div>
                    </Link>
                  );
                })}
              </div>
              <p className="text-gray-400 text-xs mt-3">Live conditions from OpenWeather, refreshed hourly.</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Live weather for {province.name}'s cities is unavailable right now. Each city's own weather page carries its full forecast.
            </p>
          )}
          <p className="text-gray-400 text-sm leading-relaxed mt-4">
            {generateWeatherAfter(province.name)}
          </p>
        </motion.section>

        {/* ── 4. DIVISIONS ── */}
        {divisions.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="divisions">
            <SectionHeader icon={MapPin} title={`Divisions of ${province.name}`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {province.name} is administratively divided into {divisions.length} divisions, each comprising several districts.
              This administrative structure shapes governance, development planning, and resource allocation across the province.
              Each card below lists the districts that make up the division.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {divisions.map(div => (
                <div key={div.slug} className="rounded-2xl p-4 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-semibold text-sm">{div.name}</div>
                    <MapPin className="w-4 h-4" style={{ color: accent }} />
                  </div>
                  <div className="text-gray-400 text-xs leading-relaxed">{div.districts.join(' · ')}</div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── 5. FAITH & SPIRITUAL ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="faith">
          <SectionHeader icon={Star} title="Faith & Spiritual" accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {province.majorFaith} is practised by {fmtPct(province.majorFaithPct)} of {province.name}'s population
            (Pakistan Bureau of Statistics, Census 2023). The province is home to some of the most significant
            sacred sites in South Asia, drawing pilgrims and visitors from across Pakistan and beyond.
            {live?.prayer ? <> The prayer times below are today's live times for {province.capital}, the provincial capital.</> : null}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <div className="text-white font-semibold text-sm mb-4">Religious Population of {province.name}</div>
              {faithRows.map(r => (
                <div key={r.faith} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{r.faith}</span>
                    <span style={{ color: accent }}>{fmtPct(r.pct)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(r.pct, 100)}%`, backgroundColor: accent }} />
                  </div>
                </div>
              ))}
              <p className="text-gray-400 text-xs mt-4">
                Source: Pakistan Bureau of Statistics, Census 2023, Table 9 (population by religion).
                Shares are of enumerated responses; the remainder covers smaller faiths and responses not recorded.
              </p>
            </div>
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <div className="text-white font-semibold text-sm mb-4">Prayer Times Today: {province.capital}</div>
              {prayerView ? (
                <>
                  {prayerView.rows.map(r => (
                    <div key={r.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-gray-400 text-sm">{r.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{prayerView.fmt12(r.time)}</span>
                        {prayerView.nextName === r.name && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ backgroundColor: `${accent}25`, color: accent }}>Next</span>
                        )}
                        {prayerView.passed.has(r.name) && prayerView.nextName !== r.name && (
                          <span className="text-gray-400 text-xs">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {prayerView.countdown && prayerView.nextName && (
                    <p className="text-gray-400 text-xs mt-3">
                      Next prayer: {prayerView.nextName}, in {prayerView.countdown} ({province.capital} time).
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-400 text-sm leading-relaxed">
                  Live prayer times for {province.capital} are unavailable right now. The full prayer page
                  for the capital carries the complete monthly calendar.
                </p>
              )}
              <Link href={`/${province.countrySlug}/${province.slug}/${province.capital.toLowerCase()}/prayer-times`}
                className="inline-flex items-center gap-1 text-xs font-medium mt-3" style={{ color: accent }}>
                See prayer times for any {province.name} city <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ── 6. MARKET RATES ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="rates">
          <SectionHeader icon={Coins} title={`${province.name} Market Rates Today`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Gold, silver, and currency exchange rates apply uniformly across {province.name} as they
            are set on national markets. These are the most searched daily figures for residents and businesses
            across the province, from gold traders in {province.capital}'s bazaars to workshops across all {divisions.length} divisions.
          </p>
          {live?.rates ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Gold 24K (per tola)', value: `PKR ${Math.round(live.rates.goldPerTola).toLocaleString()}` },
                  { label: 'Gold 24K (per gram)', value: `PKR ${Math.round(live.rates.goldPerGram).toLocaleString()}` },
                  { label: 'Silver (per tola)', value: `PKR ${Math.round(live.rates.silverPerTola).toLocaleString()}` },
                  { label: 'USD / PKR (1 USD)', value: `PKR ${live.rates.usdPkr.toFixed(2)}` },
                ].map(r => (
                  <div key={r.label} className="rounded-xl p-4 border"
                    style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                    <div className="text-gray-400 text-xs">{r.label}</div>
                    <div className="text-white font-bold text-sm mt-0.5">{r.value}</div>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs mb-4">
                Live spot prices (gold-api.com spot, converted at the live USD/PKR rate)
                {live.rates.goldChangePct != null
                  ? ` · Gold 24h change: ${live.rates.goldChangePct >= 0 ? '+' : ''}${live.rates.goldChangePct.toFixed(2)}%`
                  : ''}
                {live.rates.updatedAt
                  ? ` · Updated ${new Date(live.rates.updatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                  : ''}
                . Fuel prices are not shown here: there is no live official feed for them.
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-sm mb-4">
              Live market rates are unavailable right now. The full rates page carries gold, silver, and
              currency prices with 30-day history.
            </p>
          )}
          <Link href={`/${province.countrySlug}/${province.slug}/${province.capital.toLowerCase()}/rates`}
            className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: accent }}>
            Full rates & 30-day history <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.section>

        {/* ── 7. NEWS ── */}
        {live && live.news.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="news">
            <SectionHeader icon={Newspaper} title={`${province.name} Today`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Recent headlines from {province.name}: provincial government news, city-level developments
              across the major urban centres, and cultural and sports coverage from across the province.
            </p>
            <div className="rounded-2xl p-5 border mb-4" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <div className="space-y-3">
                {live.news.map((a, i) => (
                  <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer"
                    className="flex gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0 group">
                    <span className="text-gray-400 text-xs mt-0.5 w-3">{i + 1}</span>
                    <span>
                      <span className="block text-gray-200 text-sm leading-snug group-hover:underline">{a.title}</span>
                      <span className="block text-gray-400 text-xs mt-1">
                        {a.source} · {new Date(a.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── 8. ECONOMY ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="economy">
          <SectionHeader icon={TrendingUp} title={`${province.name} Economy`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateEconomyParagraph(province.name, province.country)}
          </p>
          <div className="rounded-2xl p-6 border mb-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: cardBorder }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">GDP Contribution to {province.country}</div>
                <div className="text-5xl font-black mb-2" style={{ color: accent }}>{province.gdpPct}</div>
                <div className="text-gray-400 text-sm">
                  {province.name} contributes significantly to {province.country}'s national economy through its major industries and exports.
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Population Share</div>
                <div className="text-5xl font-black mb-2" style={{ color: accent }}>
                  {censusSharePct ? `${censusSharePct}%` : countryTotal ? `${(province.population / countryTotal * 100).toFixed(1)}%` : province.population.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">
                  {censusSharePct
                    ? <>of Pakistan&rsquo;s total population of 241.5M (PBS Census 2023) lives in {province.name}.</>
                    : countryTotal
                      ? <>of {province.country}&rsquo;s total population of {(countryTotal / 1000000).toFixed(1)}M (World Bank, {countryTotalYear}) lives in {province.name}.</>
                      : <>people live in {province.name}.</>}
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {generateEconomyAfter(province.name, province.country)}
          </p>
        </motion.section>

        {/* ── 8b. GROWTH DASHBOARD ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={TrendingUp} title={`${province.country} 10-Year Growth`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateProvinceGrowthParagraph(province.name, province.country)}
          </p>
          <GrowthDashboard countryCode={province.countryCode} accentColor={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mt-5">
            {generateProvinceGrowthAfter(province.name, province.country)}
          </p>
        </motion.section>

        {/* ── 8c. CITY POPULATIONS ── */}
        {cities.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader icon={TrendingUp} title={`City Populations Across ${province.name}`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {generateCostOfLivingParagraph(province.name)}
            </p>
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: cardBorder }}>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-400 border-b" style={{ borderColor: cardBorder }}>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Population</th>
                    <th className="py-3 px-4">Share of {province.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...cities]
                    .sort((a, b) => b.population - a.population)
                    .map((c, i) => (
                      <tr key={c.slug} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <td className="py-3 px-4 text-white font-medium">{c.name}{i === 0 ? ' (largest)' : ''}</td>
                        <td className="py-3 px-4 text-gray-300">{c.population.toLocaleString()}</td>
                        <td className="py-3 px-4 text-gray-300">{(c.population / province.population * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mt-5">
              {generateCostOfLivingAfter(province.name)}
            </p>
          </motion.section>
        )}

        {/* ── 9. INDUSTRIES ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="industries">
          <SectionHeader icon={Building2} title={`Major Industries of ${province.name}`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateIndustriesParagraph(province.name)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {industries.map(ind => (
              <div key={ind.name} className="rounded-2xl p-5 border" style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                <div className="text-3xl mb-3">{ind.icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{ind.name}</div>
                <div className="text-xs mb-2 font-medium" style={{ color: accent }}>{ind.city}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{ind.description}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mt-5">
            {generateIndustriesAfter(province.name, province.country)}
          </p>
        </motion.section>

        {/* ── 10. HERITAGE PRODUCTS ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Gem} title={`${province.name} Famous Products`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateProductsParagraph(province.name)}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {products.map(prod => (
              <div key={prod.name} className="flex-shrink-0 min-w-[140px] rounded-2xl p-4 border text-center"
                style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                <div className="text-4xl mb-2">{prod.emoji}</div>
                <div className="text-white text-sm font-medium">{prod.name}</div>
                <div className="text-xs mt-1" style={{ color: accent }}>{prod.category}</div>
                <div className="text-gray-400 text-xs mt-0.5">{prod.origin}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mt-3">
            {generateProductsAfter(province.name)}
          </p>
        </motion.section>

        {/* ── 11. LANDMARKS ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="places">
          <SectionHeader icon={Mountain} title={`${province.name} Must See`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateLandmarksParagraph(province.name, province.capital)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {landmarks.map(lm => (
              <div key={lm.name} className="rounded-2xl overflow-hidden border"
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                {lm.image && (
                  <img loading="lazy" decoding="async" src={lm.image} alt={lm.alt || lm.name} className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  <div className="text-white font-bold text-sm">{lm.name}</div>
                  <div className="text-gray-300 text-xs mt-0.5">{lm.city} · {lm.era}</div>
                  {lm.unesco && <div className="text-amber-400 text-xs font-semibold mt-1.5">UNESCO World Heritage Site</div>}
                  {lm.credit && <div className="text-gray-400 text-[11px] mt-2">{lm.credit}</div>}
                  {!lm.image && <div className="text-gray-400 text-[11px] mt-2">Photo coming with the verified media batch.</div>}
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mt-5">
            {generateLandmarksAfter(province.name, province.capital)}
          </p>
        </motion.section>

        {/* ── 12. PERSONALITIES ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Users} title={`${province.name}'s Finest`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {province.name} has produced some of {province.country}'s most celebrated leaders, athletes, artists, and
            scientists. These individuals carried the province's name to national and international recognition across
            different fields and different generations.
          </p>
          <div className="flex gap-2 flex-wrap mb-5">
            {personalityCategories.map(cat => (
              <button key={cat} onClick={() => setActivePersonality(cat)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all border"
                style={activePersonality === cat
                  ? { backgroundColor: accent, color: '#fff', borderColor: accent }
                  : { backgroundColor: `${accent}15`, color: accent, borderColor: `${accent}40` }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPersonalities.map(p => {
              const body = (
                <>
                  {p.photo ? (
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.photo} alt={`Portrait of ${p.name}`} loading="lazy" decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ objectPosition: p.pos ?? '50% 0%' }} />
                    </div>
                  ) : null}
                  <div className="p-4">
                    {!p.photo && (
                      <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${accent}20`, border: `2px solid ${accent}40` }}>👤</div>
                    )}
                    <div className="text-white font-semibold text-sm leading-tight">{p.name}</div>
                    <div className="text-xs mt-1" style={{ color: accent }}>{p.profession}</div>
                    <div className="text-gray-400 text-xs mt-1">Born in {p.birthCity}</div>
                    {p.credit && <div className="text-gray-400 text-[10px] mt-2">{p.credit}</div>}
                    {p.slug && <div className="text-xs font-medium mt-2" style={{ color: accent }}>Read the full profile →</div>}
                  </div>
                </>
              );
              return p.slug ? (
                <Link key={p.name} href={`/personalities/${p.slug}`}
                  className="block rounded-2xl overflow-hidden border hover:border-opacity-60 transition-all"
                  style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                  {body}
                </Link>
              ) : (
                <div key={p.name} className="rounded-2xl overflow-hidden border"
                  style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                  {body}
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 13. NATURAL RESOURCES ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Leaf} title={`${province.name} Natural Resources`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {province.name} holds significant natural resources that underpin its economy and contribute to {province.country}'s
            national resource base. From fertile agricultural land to mineral deposits and energy resources, these assets
            have shaped the province's economic identity and continue to drive development.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {resources.map(res => (
              <div key={res.name} className="rounded-2xl p-5 border"
                style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                <div className="text-3xl mb-3">{res.icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{res.name}</div>
                <div className="text-xs mb-2 font-medium" style={{ color: accent }}>{res.rank}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{res.description}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 14. FAMOUS FOODS ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="foods">
          <SectionHeader icon={Utensils} title={`${province.name} Famous Foods`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            The food of {province.name} reflects the province's geography, agricultural richness, and cultural history.
            Each dish has a story tied to a specific city, season, or tradition, and many have travelled far beyond
            the province to become beloved across all of {province.country}.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {foods.map(food => (
              <div key={food.name} className="rounded-2xl p-5 border"
                style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                <div className="text-4xl mb-3">{food.emoji}</div>
                <div className="text-white font-semibold mb-1">{food.name}</div>
                <div className="text-xs mb-2" style={{ color: accent }}>{food.origin}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{food.description}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 15. EVENTS ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="events">
          <SectionHeader icon={Calendar} title={`${province.name} Events`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {province.name} marks a recurring annual calendar of festivals, sporting fixtures, and religious
            observances across its cities and towns. The months shown are the typical months: several observances
            follow the Islamic calendar and move each year, and fixtures such as cricket finals are confirmed
            season by season.
          </p>
          <div className="flex gap-2 flex-wrap mb-5">
            {eventTypes.map(t => (
              <button key={t} onClick={() => setActiveEvent(t)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all border"
                style={activeEvent === t
                  ? { backgroundColor: accent, color: '#fff', borderColor: accent }
                  : { backgroundColor: `${accent}15`, color: accent, borderColor: `${accent}40` }}>
                {t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredEvents.map(ev => (
              <div key={ev.name} className="rounded-xl p-4 border"
                style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                <div className="text-white text-sm font-medium">{ev.name}</div>
                <div className="text-gray-400 text-xs mt-1">{ev.city} · {ev.date}</div>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${accent}20`, color: accent }}>{ev.type}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 16. EMERGENCY CONTACTS ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} id="emergency">
          <SectionHeader icon={ShieldAlert} title={`Emergency Contacts: ${province.name}`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateEmergencyParagraph(province.name, province.country)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {emergency.map(e => (
              <a key={e.label} href={`tel:${e.number.replace(/[^0-9+]/g, '')}`}
                aria-label={`Call ${e.label} on ${e.number}`}
                className="block rounded-2xl p-4 text-center border hover:border-opacity-80 transition-all"
                style={{ backgroundColor: `${e.color}15`, borderColor: `${e.color}40` }}>
                <div className="text-2xl font-black mb-1" style={{ color: e.color }}>{e.number}</div>
                <div className="text-gray-300 text-xs">{e.label}</div>
                <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">Tap to call</div>
              </a>
            ))}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mt-5">
            {generateEmergencyAfter(province.name, province.country)}
          </p>
        </motion.section>

        {/* ── 17. OTHER PROVINCES ── */}
        {otherProvinces.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader icon={Globe} title={`Other ${province.country} Provinces`} accent={accent} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
              {otherProvinces.filter(p => p.slug !== province.slug).map(op => {
                // Link Law: only provinces with a real template page are
                // linked. Balochistan, Gilgit-Baltistan and Azad Kashmir
                // have no province data yet, so their cards render
                // without a link instead of pointing at a shell.
                const hasPage = ['punjab', 'sindh', 'khyber-pakhtunkhwa', 'islamabad-capital-territory'].includes(op.slug);
                const inner = (
                  <>
                    <div className="text-white font-semibold text-sm">{op.name}</div>
                    <div className="text-gray-400 text-xs mt-1">{op.tagline}</div>
                    {!hasPage && <div className="text-gray-400 text-[11px] mt-1.5">Guide in preparation</div>}
                  </>
                );
                return hasPage ? (
                  <Link key={op.slug} href={`/${province.countrySlug}/${op.slug}`}
                    className="group rounded-xl p-4 border text-center hover:border-opacity-60 transition-all"
                    style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                    {inner}
                  </Link>
                ) : (
                  <div key={op.slug} className="rounded-xl p-4 border text-center"
                    style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

      {/* ── B9: Punjab Assistant: floating widget only, no new page
          section (no design change). Punjab only: other provinces
          carry no verified snapshot here. */}
      {province?.countrySlug === 'pakistan' && province?.slug === 'punjab' && punjabAssistantSnapshot && (
        <CityAssistant snapshot={punjabAssistantSnapshot} />
      )}

      </div>
    </div>
  );
}
