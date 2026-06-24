'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin, Users, Globe, Building2, Coins, Languages, Clock,
  Calendar, TrendingUp, TrendingDown, Newspaper, ShieldAlert,
  Utensils, Gem, Leaf, Flame, Trophy, Phone, ChevronRight,
  ArrowRight, Star, Mountain, Thermometer, Wind, Droplets,
} from 'lucide-react';
import { FLAG_PALETTES } from '@/lib/design/flagPalettes';
import {
  FlagAuroraBackground, FlagCard, FlagGradientText,
  FlagSectionTitle, FlagPill,
} from '@/components/shared/FlagTheme';
import {
  generateCitiesWeatherParagraph, generateCitiesWeatherAfter,
  generateFactsParagraph, generateFactsAfter,
  generateLiveDataParagraph, generateLiveDataAfter,
  generateProvincesParagraph, generateProvincesAfter,
  generatePersonalitiesParagraph, generatePersonalitiesAfter,
  generatePlacesParagraph, generatePlacesAfter,
  generateEconomyDashboardParagraph, generateEconomyDashboardAfter,
  generateTeamsParagraph, generateTeamsAfter,
  generateHolidaysParagraph, generateHolidaysAfter,
  generateEmergencyParagraph, generateEmergencyAfter,
} from '@/lib/paragraphs/country';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Country {
  name: string; code: string; slug: string; flag: string;
  region: string; continent: string; population: number;
  area: number; capital: string; currency: string;
  languages: string[]; government: string;
  timezone: string; independence: string; climate: string;
  majorFaith: string; majorFaithPct: number;
  heroImage: string;
  tagline: string;
}
interface CityWeather { name: string; slug: string; temp: number; condition: string; icon: string; provinceSlug: string; }
interface Province { name: string; slug: string; capital: string; population: number; area: number; tagline: string; cities: string[]; }
interface Personality { id: string; name: string; profession: string; category: string; photo: string; birthYear: number; achievements: string; }
interface Landmark { id: string; name: string; type: string; city: string; image: string; unesco: boolean; era: string; }
interface Economy { gdp: string; growth: string; inflation: string; unemployment: string; currencyRate: string; exports: string[]; }
interface NationalTeam { sport: string; name: string; ranking: string; achievements: string[]; }
interface Holiday { name: string; date: string; type: string; }
interface Neighbor { name: string; slug: string; flag: string; border: string; }
interface FoodItem { name: string; emoji: string; description: string; origin: string; }
interface Resource { name: string; icon: string; description: string; rank: string; }
interface RateItem { label: string; value: string; change: string; up: boolean; }

// ─── Static Data ─────────────────────────────────────────────────────────────

const COUNTRIES: Record<string, Country> = {
  pakistan: {
    name: 'Pakistan', code: 'PK', slug: 'pakistan', flag: '🇵🇰',
    region: 'South Asia', continent: 'Asia',
    population: 231402117, area: 881913,
    capital: 'Islamabad', currency: 'Pakistani Rupee (PKR)',
    languages: ['Urdu', 'English', 'Punjabi', 'Pashto', 'Sindhi', 'Balochi'],
    government: 'Federal Parliamentary Republic',
    timezone: 'PKT (UTC+5)', independence: 'August 14, 1947',
    climate: 'Varies — Desert to Alpine',
    majorFaith: 'Islam', majorFaithPct: 96,
    heroImage: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1600',
    tagline: 'Land of ancient civilisations, towering peaks, and vibrant culture.',
  },
  india: {
    name: 'India', code: 'IN', slug: 'india', flag: '🇮🇳',
    region: 'South Asia', continent: 'Asia',
    population: 1428627663, area: 3287263,
    capital: 'New Delhi', currency: 'Indian Rupee (INR)',
    languages: ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil'],
    government: 'Federal Parliamentary Republic',
    timezone: 'IST (UTC+5:30)', independence: 'August 15, 1947',
    climate: 'Varies — Tropical to Alpine',
    majorFaith: 'Hinduism', majorFaithPct: 80,
    heroImage: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1600',
    tagline: 'One billion stories. Every faith. Every landscape. Every flavour.',
  },
  'united-states': {
    name: 'United States', code: 'US', slug: 'united-states', flag: '🇺🇸',
    region: 'North America', continent: 'Americas',
    population: 331893745, area: 9833520,
    capital: 'Washington D.C.', currency: 'US Dollar (USD)',
    languages: ['English', 'Spanish'],
    government: 'Federal Presidential Republic',
    timezone: 'EST/PST (UTC-5 to UTC-8)', independence: 'July 4, 1776',
    climate: 'Varies — Arctic to Tropical',
    majorFaith: 'Christianity', majorFaithPct: 63,
    heroImage: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=1600',
    tagline: 'A nation built by dreamers from every corner of the world.',
  },
};

const MAJOR_CITIES: Record<string, CityWeather[]> = {
  PK: [
    { name: 'Karachi', slug: 'karachi', temp: 32, condition: 'Partly Cloudy', icon: '⛅', provinceSlug: 'sindh' },
    { name: 'Lahore', slug: 'lahore', temp: 35, condition: 'Hot', icon: '☀️', provinceSlug: 'punjab' },
    { name: 'Islamabad', slug: 'islamabad', temp: 30, condition: 'Clear', icon: '🌤️', provinceSlug: 'islamabad' },
    { name: 'Faisalabad', slug: 'faisalabad', temp: 36, condition: 'Hot', icon: '☀️', provinceSlug: 'punjab' },
    { name: 'Rawalpindi', slug: 'rawalpindi', temp: 31, condition: 'Clear', icon: '🌤️', provinceSlug: 'punjab' },
    { name: 'Multan', slug: 'multan', temp: 38, condition: 'Very Hot', icon: '🔥', provinceSlug: 'punjab' },
  ],
  IN: [
    { name: 'Mumbai', slug: 'mumbai', temp: 32, condition: 'Humid', icon: '🌤️', provinceSlug: 'maharashtra' },
    { name: 'Delhi', slug: 'delhi', temp: 38, condition: 'Hot', icon: '☀️', provinceSlug: 'delhi' },
    { name: 'Bangalore', slug: 'bangalore', temp: 28, condition: 'Pleasant', icon: '⛅', provinceSlug: 'karnataka' },
    { name: 'Chennai', slug: 'chennai', temp: 34, condition: 'Humid', icon: '🌤️', provinceSlug: 'tamil-nadu' },
    { name: 'Kolkata', slug: 'kolkata', temp: 35, condition: 'Warm', icon: '⛅', provinceSlug: 'west-bengal' },
    { name: 'Hyderabad', slug: 'hyderabad', temp: 36, condition: 'Hot', icon: '☀️', provinceSlug: 'telangana' },
  ],
  US: [
    { name: 'New York', slug: 'new-york', temp: 22, condition: 'Clear', icon: '☀️', provinceSlug: 'new-york' },
    { name: 'Los Angeles', slug: 'los-angeles', temp: 26, condition: 'Sunny', icon: '☀️', provinceSlug: 'california' },
    { name: 'Chicago', slug: 'chicago', temp: 18, condition: 'Cloudy', icon: '☁️', provinceSlug: 'illinois' },
    { name: 'Houston', slug: 'houston', temp: 30, condition: 'Warm', icon: '🌤️', provinceSlug: 'texas' },
    { name: 'Phoenix', slug: 'phoenix', temp: 38, condition: 'Hot', icon: '🔥', provinceSlug: 'arizona' },
    { name: 'Philadelphia', slug: 'philadelphia', temp: 20, condition: 'Pleasant', icon: '⛅', provinceSlug: 'pennsylvania' },
  ],
};

const PROVINCES: Record<string, Province[]> = {
  PK: [
    { name: 'Punjab', slug: 'punjab', capital: 'Lahore', population: 110012442, area: 205344, tagline: 'Most populous province', cities: ['Lahore', 'Multan', 'Faisalabad'] },
    { name: 'Sindh', slug: 'sindh', capital: 'Karachi', population: 47886531, area: 140914, tagline: 'Economic heartbeat', cities: ['Karachi', 'Hyderabad', 'Sukkur'] },
    { name: 'Khyber Pakhtunkhwa', slug: 'khyber-pakhtunkhwa', capital: 'Peshawar', population: 35625000, area: 74521, tagline: 'Land of mountains', cities: ['Peshawar', 'Abbottabad', 'Swat'] },
    { name: 'Balochistan', slug: 'balochistan', capital: 'Quetta', population: 12344408, area: 347190, tagline: 'Largest province', cities: ['Quetta', 'Gwadar', 'Turbat'] },
    { name: 'Gilgit-Baltistan', slug: 'gilgit-baltistan', capital: 'Gilgit', population: 1800000, area: 72497, tagline: 'Roof of the world', cities: ['Gilgit', 'Skardu', 'Hunza'] },
    { name: 'Azad Kashmir', slug: 'azad-kashmir', capital: 'Muzaffarabad', population: 4045000, area: 13297, tagline: 'Heaven on earth', cities: ['Muzaffarabad', 'Mirpur', 'Rawalakot'] },
  ],
  IN: [
    { name: 'Maharashtra', slug: 'maharashtra', capital: 'Mumbai', population: 112374333, area: 307713, tagline: 'Financial capital state', cities: ['Mumbai', 'Pune', 'Nagpur'] },
    { name: 'Uttar Pradesh', slug: 'uttar-pradesh', capital: 'Lucknow', population: 199812341, area: 240928, tagline: 'Most populous state', cities: ['Lucknow', 'Agra', 'Varanasi'] },
    { name: 'Karnataka', slug: 'karnataka', capital: 'Bangalore', population: 61095248, area: 191791, tagline: 'Silicon Valley of India', cities: ['Bangalore', 'Mysore', 'Hubli'] },
    { name: 'Tamil Nadu', slug: 'tamil-nadu', capital: 'Chennai', population: 72147030, area: 130058, tagline: 'Temple heartland', cities: ['Chennai', 'Coimbatore', 'Madurai'] },
    { name: 'Gujarat', slug: 'gujarat', capital: 'Ahmedabad', population: 60439692, area: 196244, tagline: 'Vibrant trade state', cities: ['Ahmedabad', 'Surat', 'Vadodara'] },
    { name: 'Rajasthan', slug: 'rajasthan', capital: 'Jaipur', population: 68548437, area: 342239, tagline: 'Land of kings', cities: ['Jaipur', 'Jodhpur', 'Udaipur'] },
  ],
  US: [
    { name: 'California', slug: 'california', capital: 'Sacramento', population: 39538223, area: 423967, tagline: 'Golden state', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
    { name: 'Texas', slug: 'texas', capital: 'Austin', population: 29145505, area: 695662, tagline: 'Lone star state', cities: ['Houston', 'Dallas', 'Austin'] },
    { name: 'Florida', slug: 'florida', capital: 'Tallahassee', population: 21538187, area: 170312, tagline: 'Sunshine state', cities: ['Miami', 'Orlando', 'Tampa'] },
    { name: 'New York', slug: 'new-york', capital: 'Albany', population: 20201249, area: 141297, tagline: 'Empire state', cities: ['New York City', 'Buffalo', 'Albany'] },
    { name: 'Illinois', slug: 'illinois', capital: 'Springfield', population: 12812508, area: 149997, tagline: 'Prairie state', cities: ['Chicago', 'Springfield', 'Rockford'] },
    { name: 'Pennsylvania', slug: 'pennsylvania', capital: 'Harrisburg', population: 13002700, area: 119280, tagline: 'Keystone state', cities: ['Philadelphia', 'Pittsburgh', 'Allentown'] },
  ],
};

const PERSONALITIES: Record<string, Personality[]> = {
  PK: [
    { id: '1', name: 'Quaid-e-Azam Jinnah', profession: 'Father of the Nation', category: 'Leaders', photo: '', birthYear: 1876, achievements: 'Founded Pakistan, August 14, 1947' },
    { id: '2', name: 'Allama Iqbal', profession: 'Poet of the East', category: 'Leaders', photo: '', birthYear: 1877, achievements: 'Philosophical father of Pakistan, national poet' },
    { id: '3', name: 'Imran Khan', profession: 'Cricketer & Politician', category: 'Sports', photo: '', birthYear: 1952, achievements: 'World Cup captain 1992, Prime Minister' },
    { id: '4', name: 'Wasim Akram', profession: 'Cricketer', category: 'Sports', photo: '', birthYear: 1966, achievements: 'Greatest fast bowler, 916 international wickets' },
    { id: '5', name: 'Nusrat Fateh Ali Khan', profession: 'Musician', category: 'Arts', photo: '', birthYear: 1948, achievements: 'King of Qawwali, global cultural ambassador' },
    { id: '6', name: 'Dr Abdus Salam', profession: 'Physicist', category: 'Science', photo: '', birthYear: 1926, achievements: 'Nobel Prize in Physics 1979' },
    { id: '7', name: 'Malala Yousafzai', profession: 'Activist', category: 'Leaders', photo: '', birthYear: 1997, achievements: 'Nobel Peace Prize, youngest laureate ever' },
    { id: '8', name: 'Abdul Sattar Edhi', profession: 'Philanthropist', category: 'Leaders', photo: '', birthYear: 1928, achievements: 'Founded world\'s largest volunteer ambulance network' },
  ],
  IN: [
    { id: '1', name: 'Mahatma Gandhi', profession: 'Freedom Fighter', category: 'Leaders', photo: '', birthYear: 1869, achievements: 'Father of the Indian nation' },
    { id: '2', name: 'Sachin Tendulkar', profession: 'Cricketer', category: 'Sports', photo: '', birthYear: 1973, achievements: '100 international centuries, God of Cricket' },
    { id: '3', name: 'A.R. Rahman', profession: 'Musician', category: 'Arts', photo: '', birthYear: 1967, achievements: '2x Academy Award winner' },
    { id: '4', name: 'Dr APJ Abdul Kalam', profession: 'Scientist & President', category: 'Science', photo: '', birthYear: 1931, achievements: 'Missile Man of India, 11th President' },
    { id: '5', name: 'Ratan Tata', profession: 'Industrialist', category: 'Leaders', photo: '', birthYear: 1937, achievements: 'Built Tata Group into a global conglomerate' },
    { id: '6', name: 'Milkha Singh', profession: 'Athlete', category: 'Sports', photo: '', birthYear: 1929, achievements: 'Flying Sikh, Commonwealth Games gold medallist' },
  ],
  US: [
    { id: '1', name: 'Abraham Lincoln', profession: 'President', category: 'Leaders', photo: '', birthYear: 1809, achievements: '16th President, abolished slavery' },
    { id: '2', name: 'Michael Jordan', profession: 'Athlete', category: 'Sports', photo: '', birthYear: 1963, achievements: '6x NBA Champion, greatest basketball player' },
    { id: '3', name: 'Steve Jobs', profession: 'Entrepreneur', category: 'Science', photo: '', birthYear: 1955, achievements: 'Co-founded Apple, changed personal computing' },
    { id: '4', name: 'Oprah Winfrey', profession: 'Media Personality', category: 'Arts', photo: '', birthYear: 1954, achievements: 'First Black female billionaire, media mogul' },
  ],
};

const LANDMARKS: Record<string, Landmark[]> = {
  PK: [
    { id: '1', name: 'Badshahi Mosque', type: 'Religious', city: 'Lahore', image: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: false, era: 'Mughal 1673' },
    { id: '2', name: 'Mohenjo-daro', type: 'Archaeological', city: 'Sindh', image: 'https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: true, era: '3000 BCE' },
    { id: '3', name: 'K2', type: 'Mountain', city: 'Gilgit-Baltistan', image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: false, era: 'Natural Wonder' },
    { id: '4', name: 'Shalimar Gardens', type: 'Gardens', city: 'Lahore', image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: true, era: 'Mughal 1641' },
    { id: '5', name: 'Lahore Fort', type: 'Fort', city: 'Lahore', image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: true, era: 'Mughal 1566' },
    { id: '6', name: 'Faisal Mosque', type: 'Religious', city: 'Islamabad', image: 'https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: false, era: 'Modern 1986' },
  ],
  IN: [
    { id: '1', name: 'Taj Mahal', type: 'Monument', city: 'Agra', image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: true, era: 'Mughal 1643' },
    { id: '2', name: 'Red Fort', type: 'Fort', city: 'Delhi', image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: true, era: 'Mughal 1648' },
    { id: '3', name: 'Gateway of India', type: 'Arch', city: 'Mumbai', image: 'https://images.pexels.com/photos/208371/pexels-photo-208371.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: false, era: 'Colonial 1924' },
    { id: '4', name: 'Hawa Mahal', type: 'Palace', city: 'Jaipur', image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: false, era: 'Rajput 1799' },
  ],
  US: [
    { id: '1', name: 'Statue of Liberty', type: 'Monument', city: 'New York', image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: true, era: 'Modern 1886' },
    { id: '2', name: 'Grand Canyon', type: 'Natural', city: 'Arizona', image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: true, era: 'Natural Wonder' },
    { id: '3', name: 'Golden Gate Bridge', type: 'Bridge', city: 'San Francisco', image: 'https://images.pexels.com/photos/1537086/pexels-photo-1537086.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: false, era: 'Modern 1937' },
    { id: '4', name: 'Mount Rushmore', type: 'Monument', city: 'South Dakota', image: 'https://images.pexels.com/photos/208371/pexels-photo-208371.jpeg?auto=compress&cs=tinysrgb&w=600', unesco: false, era: 'Modern 1941' },
  ],
};

const ECONOMIES: Record<string, Economy> = {
  PK: { gdp: '$376B', growth: '5.7%', inflation: '28.2%', unemployment: '6.2%', currencyRate: '1 USD = 278 PKR', exports: ['Textiles → USA, Europe, UAE', 'Rice → Middle East, Africa', 'Sports goods → Global', 'Surgical instruments → Germany, USA', 'Leather → Italy, UK'] },
  IN: { gdp: '$3.73T', growth: '7.2%', inflation: '5.4%', unemployment: '4.8%', currencyRate: '1 USD = 83 INR', exports: ['IT Services → Global', 'Pharmaceuticals → USA, Africa', 'Gems & Jewellery → USA, UAE', 'Engineering goods → USA, Europe'] },
  US: { gdp: '$25.5T', growth: '2.1%', inflation: '3.2%', unemployment: '3.8%', currencyRate: 'Base Currency (USD)', exports: ['Technology → Global', 'Aircraft → Global', 'Pharmaceuticals → Global', 'Financial services → Global'] },
};

const NATIONAL_TEAMS: Record<string, NationalTeam[]> = {
  PK: [
    { sport: 'Cricket', name: 'Pakistan Cricket Team', ranking: 'World #4', achievements: ['T20 World Cup 2009', 'Champions Trophy 2017', 'Asia Cup 2022'] },
    { sport: 'Hockey', name: 'Pakistan Hockey Team', ranking: 'World #16', achievements: ['4x World Cup Winner', '3x Olympic Gold', '4x Asian Games Gold'] },
    { sport: 'Squash', name: 'Pakistan Squash', ranking: 'Historically #1', achievements: ['Jahangir Khan 555 consecutive wins', 'Jansher Khan 8x World Champion'] },
  ],
  IN: [
    { sport: 'Cricket', name: 'India Cricket Team', ranking: 'World #1', achievements: ['2x ODI World Cup', '2x Champions Trophy', 'T20 World Cup 2007'] },
    { sport: 'Hockey', name: 'India Hockey Team', ranking: 'World #4', achievements: ['8x Olympic Gold', 'Asian Cup 2023'] },
    { sport: 'Badminton', name: 'India Badminton', ranking: 'Top 10', achievements: ['Olympic Medals', 'Thomas Cup 2022'] },
  ],
  US: [
    { sport: 'Basketball', name: 'USA Basketball', ranking: 'World #1', achievements: ['17x Olympic Gold', '5x FIBA World Cup'] },
    { sport: 'American Football', name: 'NFL', ranking: 'Domestic', achievements: ['Super Bowl — most watched sporting event'] },
    { sport: 'Swimming', name: 'USA Swimming', ranking: 'World #1', achievements: ['Most Olympic swimming medals in history'] },
  ],
};

const HOLIDAYS: Record<string, Holiday[]> = {
  PK: [
    { name: 'Pakistan Day', date: 'March 23', type: 'National' },
    { name: 'Independence Day', date: 'August 14', type: 'National' },
    { name: 'Defence Day', date: 'September 6', type: 'National' },
    { name: 'Iqbal Day', date: 'November 9', type: 'National' },
    { name: 'Quaid-e-Azam Day', date: 'December 25', type: 'National' },
    { name: 'Eid ul Fitr', date: 'Varies (Islamic)', type: 'Religious' },
    { name: 'Eid ul Adha', date: 'Varies (Islamic)', type: 'Religious' },
    { name: 'Ashura', date: 'Varies (Islamic)', type: 'Religious' },
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
  ],
};

const NEIGHBORS: Record<string, Neighbor[]> = {
  PK: [
    { name: 'India', slug: 'india', flag: '🇮🇳', border: '3,323 km' },
    { name: 'Afghanistan', slug: 'afghanistan', flag: '🇦🇫', border: '2,670 km' },
    { name: 'Iran', slug: 'iran', flag: '🇮🇷', border: '909 km' },
    { name: 'China', slug: 'china', flag: '🇨🇳', border: '599 km' },
  ],
  IN: [
    { name: 'China', slug: 'china', flag: '🇨🇳', border: '3,488 km' },
    { name: 'Bangladesh', slug: 'bangladesh', flag: '🇧🇩', border: '4,096 km' },
    { name: 'Pakistan', slug: 'pakistan', flag: '🇵🇰', border: '3,323 km' },
    { name: 'Nepal', slug: 'nepal', flag: '🇳🇵', border: '1,751 km' },
  ],
  US: [
    { name: 'Canada', slug: 'canada', flag: '🇨🇦', border: '8,891 km' },
    { name: 'Mexico', slug: 'mexico', flag: '🇲🇽', border: '3,155 km' },
  ],
};

const FOODS: Record<string, FoodItem[]> = {
  PK: [
    { name: 'Biryani', emoji: '🍛', description: 'The national obsession — fragrant basmati, tender meat, and spices layered to perfection.', origin: 'Mughal era' },
    { name: 'Nihari', emoji: '🥘', description: 'Slow-cooked beef shank simmered overnight. A Lahori Sunday morning ritual.', origin: 'Old Delhi, adopted by Lahore' },
    { name: 'Chapli Kebab', emoji: '🥩', description: 'Peshawar\'s gift to the world — flat spiced minced meat patty grilled over open flame.', origin: 'Peshawar, KPK' },
    { name: 'Halwa Puri', emoji: '🫓', description: 'Fried bread with sweet semolina halwa and spiced chana — the classic Pakistani breakfast.', origin: 'Punjab' },
    { name: 'Karahi', emoji: '🍲', description: 'Pakistan\'s most loved dish — chicken or mutton cooked fast in a wok with tomatoes and ginger.', origin: 'Nationwide' },
    { name: 'Lassi', emoji: '🥛', description: 'Punjab in a glass. Thick churned yoghurt, sweet or salted, served chilled.', origin: 'Punjab' },
  ],
  IN: [
    { name: 'Butter Chicken', emoji: '🍛', description: 'Tender chicken in a rich tomato-cream sauce. Born in Delhi, loved everywhere.', origin: 'Delhi' },
    { name: 'Masala Dosa', emoji: '🫓', description: 'Crispy fermented rice crepe filled with spiced potato. South India\'s favourite.', origin: 'Karnataka' },
    { name: 'Biryani', emoji: '🍚', description: 'Every region has its own version — Hyderabadi, Lucknowi, Kolkata. All magnificent.', origin: 'Mughal era' },
    { name: 'Samosa', emoji: '🥟', description: 'Deep fried pastry filled with spiced potatoes and peas. Street food perfection.', origin: 'North India' },
  ],
  US: [
    { name: 'Hamburger', emoji: '🍔', description: 'America\'s most iconic food export — beef patty in a bun, now eaten on every continent.', origin: 'German-American' },
    { name: 'BBQ Ribs', emoji: '🍖', description: 'Slow-smoked pork or beef ribs with regional sauces from Texas to Tennessee.', origin: 'Southern USA' },
    { name: 'Apple Pie', emoji: '🥧', description: 'As American as it gets — a cultural symbol as much as a dessert.', origin: 'Colonial America' },
    { name: 'Clam Chowder', emoji: '🍲', description: 'Creamy soup of clams, potatoes, and onions. A New England institution.', origin: 'New England' },
  ],
};

const RESOURCES: Record<string, Resource[]> = {
  PK: [
    { name: 'Natural Gas', icon: '🔥', description: 'Top 20 global reserves. Provides significant domestic energy supply.', rank: 'World top 20' },
    { name: 'Coal', icon: '⚫', description: 'Thar Coal Field — one of the largest lignite reserves in the world.', rank: '2nd largest in Asia' },
    { name: 'Copper & Gold', icon: '🟡', description: 'Reko Diq in Balochistan — one of the world\'s largest undeveloped copper-gold deposits.', rank: 'World top 5 deposit' },
    { name: 'Gemstones', icon: '💎', description: 'Emeralds, rubies, topaz, and tourmaline from the mountains of KPK and Gilgit-Baltistan.', rank: 'Globally renowned' },
    { name: 'Salt', icon: '🪨', description: 'Khewra Salt Mine — world\'s second largest and oldest salt mine, mined since the 1200s.', rank: 'World 2nd largest mine' },
    { name: 'Water', icon: '🌊', description: 'Indus River system — one of the world\'s great river systems, feeding Pakistan\'s agriculture.', rank: 'Top 10 river systems' },
  ],
  IN: [
    { name: 'Coal', icon: '⚫', description: 'Fourth largest coal reserves in the world.', rank: 'World 4th' },
    { name: 'Iron Ore', icon: '🪨', description: 'Major iron ore deposits in Jharkhand and Odisha.', rank: 'World top 5' },
    { name: 'IT & Software', icon: '💻', description: 'Bangalore is the world\'s second largest tech hub after Silicon Valley.', rank: 'World 2nd tech hub' },
    { name: 'Diamonds', icon: '💎', description: 'Historic diamond mining region — Golconda diamonds were world-famous.', rank: 'Historically significant' },
  ],
  US: [
    { name: 'Oil & Gas', icon: '🛢️', description: 'World\'s largest oil producer since 2018 through shale revolution.', rank: 'World #1 producer' },
    { name: 'Coal', icon: '⚫', description: 'Second largest coal reserves globally.', rank: 'World 2nd largest' },
    { name: 'Agriculture', icon: '🌾', description: 'World\'s largest agricultural exporter — wheat, corn, soybeans, cotton.', rank: 'World #1 exporter' },
    { name: 'Technology', icon: '💻', description: 'Silicon Valley drives global technology innovation and venture capital.', rank: 'World leader' },
  ],
};

const RATES: Record<string, RateItem[]> = {
  PK: [
    { label: 'Gold 24K (per gram)', value: 'PKR 21,500', change: '+0.4%', up: true },
    { label: 'Gold 22K (per gram)', value: 'PKR 19,700', change: '+0.3%', up: true },
    { label: 'Silver (per gram)', value: 'PKR 240', change: '-0.1%', up: false },
    { label: 'USD/PKR', value: '278.50', change: '+0.2%', up: true },
    { label: 'EUR/PKR', value: '301.20', change: '+0.1%', up: true },
    { label: 'GBP/PKR', value: '351.80', change: '-0.3%', up: false },
    { label: 'SAR/PKR', value: '74.20', change: '0.0%', up: true },
    { label: 'AED/PKR', value: '75.80', change: '+0.1%', up: true },
    { label: 'Petrol (per litre)', value: 'PKR 248', change: '0.0%', up: true },
    { label: 'Diesel (per litre)', value: 'PKR 255', change: '0.0%', up: true },
  ],
  IN: [
    { label: 'Gold 24K (per gram)', value: '₹ 6,200', change: '+0.3%', up: true },
    { label: 'USD/INR', value: '83.20', change: '-0.1%', up: false },
    { label: 'EUR/INR', value: '90.10', change: '+0.2%', up: true },
    { label: 'Petrol (per litre)', value: '₹ 96', change: '0.0%', up: true },
  ],
  US: [
    { label: 'Gold 24K (per troy oz)', value: '$2,350', change: '+0.5%', up: true },
    { label: 'Silver (per troy oz)', value: '$29.40', change: '+0.3%', up: true },
    { label: 'Oil WTI (per barrel)', value: '$82.30', change: '-0.8%', up: false },
    { label: 'Gas (per gallon)', value: '$3.45', change: '+0.2%', up: true },
  ],
};

const EMERGENCY: Record<string, { label: string; number: string; color: string }[]> = {
  PK: [
    { label: 'Police', number: '15', color: '#1d4ed8' },
    { label: 'Ambulance', number: '1122', color: '#dc2626' },
    { label: 'Fire', number: '16', color: '#ea580c' },
    { label: 'Rescue', number: '1122', color: '#16a34a' },
    { label: 'Emergency', number: '115', color: '#7c3aed' },
    { label: 'Women Helpline', number: '1043', color: '#db2777' },
    { label: 'Child Helpline', number: '1121', color: '#0891b2' },
    { label: 'Disaster', number: '1700', color: '#b45309' },
    { label: 'Edhi Foundation', number: '115', color: '#059669' },
  ],
  IN: [
    { label: 'Police', number: '100', color: '#1d4ed8' },
    { label: 'Ambulance', number: '108', color: '#dc2626' },
    { label: 'Fire', number: '101', color: '#ea580c' },
    { label: 'Women Helpline', number: '1091', color: '#db2777' },
    { label: 'Child Helpline', number: '1098', color: '#0891b2' },
  ],
  US: [
    { label: 'Emergency (all)', number: '911', color: '#dc2626' },
    { label: 'Non-emergency', number: '311', color: '#1d4ed8' },
    { label: 'Poison Control', number: '1-800-222-1222', color: '#7c3aed' },
    { label: 'Suicide Hotline', number: '988', color: '#059669' },
  ],
};

// ─── Section Title ────────────────────────────────────────────────────────────

function SectionTitle({ icon: Icon, title, subtitle, accent }: { icon: any; title: string; subtitle?: string; accent: string; }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="w-1.5 h-7 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CountryPage() {
  const params = useParams();
  const countrySlug = params?.country as string;
  const [activePersonality, setActivePersonality] = useState('All');
  const [activeHoliday, setActiveHoliday] = useState('All');

  const country = COUNTRIES[countrySlug];
  const palette = FLAG_PALETTES[countrySlug] ?? FLAG_PALETTES['pakistan'];
  const accent = palette.accent;

  const cities = MAJOR_CITIES[country?.code] ?? [];
  const provinces = PROVINCES[country?.code] ?? [];
  const personalities = PERSONALITIES[country?.code] ?? [];
  const landmarks = LANDMARKS[country?.code] ?? [];
  const economy = ECONOMIES[country?.code];
  const teams = NATIONAL_TEAMS[country?.code] ?? [];
  const holidays = HOLIDAYS[country?.code] ?? [];
  const neighbors = NEIGHBORS[country?.code] ?? [];
  const foods = FOODS[country?.code] ?? [];
  const resources = RESOURCES[country?.code] ?? [];
  const rates = RATES[country?.code] ?? [];
  const emergency = EMERGENCY[country?.code] ?? [];

  const personalityCategories = ['All', ...Array.from(new Set(personalities.map((p) => p.category)))];
  const filteredPersonalities = activePersonality === 'All' ? personalities : personalities.filter((p) => p.category === activePersonality);
  const holidayTypes = ['All', ...Array.from(new Set(holidays.map((h) => h.type)))];
  const filteredHolidays = activeHoliday === 'All' ? holidays : holidays.filter((h) => h.type === activeHoliday);

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0f1e' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-white text-2xl font-bold mb-2">Country not found</h1>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300">← Back to homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <FlagAuroraBackground palette={palette}>
      <div className="min-h-screen">

        {/* ── BREADCRUMB ── */}
        <div className="px-4 pt-4 pb-2 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-300 transition-colors">World</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{country.name}</span>
          </div>
        </div>

        {/* ── HERO ── */}
        <section className="relative h-72 md:h-96 overflow-hidden mb-0">
          <img src={country.heroImage} alt={country.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #0a0f1e 30%, transparent 70%)` }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${palette.glow[0]}22, transparent 60%)` }} />
          <div className="absolute bottom-6 left-6 md:left-8">
            <div className="flex items-center gap-4">
              <span className="text-7xl">{country.flag}</span>
              <div>
                <FlagGradientText text={country.name} palette={palette} className="text-4xl md:text-5xl font-black" as="h1" />
                <p className="text-gray-300 text-base mt-1">{country.tagline}</p>
                <p className="text-gray-500 text-sm">{country.region} · {country.continent}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 pb-20 space-y-16 pt-10">

          {/* ── AT A GLANCE ── */}
          <section>
            <SectionTitle icon={Globe} title={`${country.name} at a Glance`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              {country.name} covers {country.area.toLocaleString()} km² and is home to {(country.population / 1e6).toFixed(0)} million people as of 2025,
              making it one of the most significant nations in {country.continent}. The capital city is {country.capital},
              while {country.languages[0]} and {country.languages[1]} serve as the primary official languages.
              The country operates as a {country.government} and follows the {country.timezone} timezone.
              {country.majorFaith} is practised by {country.majorFaithPct}% of the population,
              shaping the culture, calendar, and daily rhythm of life across the country.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { label: 'Population', value: `${(country.population / 1e6).toFixed(0)}M`, icon: '👥' },
                { label: 'Area', value: `${country.area.toLocaleString()} km²`, icon: '🗺️' },
                { label: 'Capital', value: country.capital, icon: '🏛️' },
                { label: 'Currency', value: country.currency.split('(')[0].trim(), icon: '💵' },
                { label: 'Languages', value: country.languages.slice(0, 2).join(', '), icon: '🗣️' },
                { label: 'Major Faith', value: `${country.majorFaith} ${country.majorFaithPct}%`, icon: '🕌' },
                { label: 'Timezone', value: country.timezone, icon: '🕐' },
                { label: 'Independence', value: country.independence, icon: '📅' },
                { label: 'Government', value: country.government, icon: '👑' },
                { label: 'Climate', value: country.climate, icon: '🌡️' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}30` }}>
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="text-gray-500 text-xs mb-1">{item.label}</div>
                  <div className="text-white text-sm font-semibold leading-tight">{item.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── WEATHER ── */}
          <section>
            <SectionTitle icon={Thermometer} title={`${country.name} Weather Today`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              {country.name}'s geography produces dramatically different climates across its cities on any given day.
              The weather cards below show current conditions for the country's major cities, updated throughout the day.
              Temperatures and conditions vary significantly by region, season, and elevation.
              Click any city to go to its full weather page with a 7-day forecast, hourly breakdown, and air quality data.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              {cities.map((city) => (
                <Link key={city.slug} href={`/${countrySlug}/${city.provinceSlug}/${city.slug}/weather`}
                  className="group rounded-2xl p-4 border text-center hover:border-opacity-60 transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}35` }}>
                  <div className="text-3xl mb-2">{city.icon}</div>
                  <div className="text-white font-semibold text-sm">{city.name}</div>
                  <div className="font-bold text-2xl mt-1" style={{ color: accent }}>{city.temp}°C</div>
                  <div className="text-gray-500 text-xs mt-1">{city.condition}</div>
                  <div className="text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accent }}>View forecast →</div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── FAITH & SPIRITUAL ── */}
          <section>
            <SectionTitle icon={Star} title="Faith & Spiritual" subtitle={`Religion in ${country.name} today`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              {country.majorFaith} is the dominant faith in {country.name} at {country.majorFaithPct}% of the population,
              but the country is home to communities from multiple faith traditions, each observing their own calendar,
              prayer times, and sacred sites. Below you will find today's multi-faith calendar and the next prayer time
              for the most widely observed faith in {country.name}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Religious breakdown */}
              <div className="md:col-span-1 rounded-2xl p-5 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}30` }}>
                <div className="text-white font-semibold mb-4 text-sm">Religious Population</div>
                {[
                  { faith: country.majorFaith, pct: country.majorFaithPct },
                  { faith: 'Christianity', pct: country.code === 'PK' ? 2 : country.code === 'IN' ? 2.3 : 63 },
                  { faith: 'Other', pct: country.code === 'PK' ? 2 : 17.7 },
                ].map((r) => (
                  <div key={r.faith} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300">{r.faith}</span>
                      <span style={{ color: accent }}>{r.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${r.pct}%`, backgroundColor: accent }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Multi-faith calendar */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { faith: 'Islamic (Hijri)', date: '24 Dhul Hijjah 1446', event: 'Days of Tashreeq', icon: '☪️' },
                  { faith: 'Christian', date: '23 June 2026', event: 'Ordinary Time', icon: '✝️' },
                  { faith: 'Hindu (Panchang)', date: 'Ashadha Shukla Pratipada', event: 'Ashadhi Ekadashi approaching', icon: '🕉️' },
                  { faith: 'Jewish (Hebrew)', date: '17 Tammuz 5786', event: 'Fast of 17th Tammuz', icon: '✡️' },
                ].map((f) => (
                  <div key={f.faith} className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}25` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{f.icon}</span>
                      <span className="text-gray-400 text-xs">{f.faith}</span>
                    </div>
                    <div className="text-white text-sm font-medium">{f.date}</div>
                    <div className="text-gray-500 text-xs mt-1">{f.event}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <Link href={`/${countrySlug}/islamabad/prayer-times`}
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: accent }}>
                See prayer times for any {country.name} city <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* ── MARKET RATES ── */}
          <section>
            <SectionTitle icon={Coins} title={`${country.name} Market Rates Today`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              Gold, silver, currency exchange rates, and fuel prices for {country.name} as of today.
              These figures are essential daily reference points for traders, travellers, businesses,
              and households. Gold rates below are quoted in local units and currency.
              Currency rates show how the {country.currency.split('(')[0].trim()} compares against major global currencies.
              Fuel prices reflect the current pump price across the country.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {rates.map((r) => (
                <div key={r.label} className="rounded-xl p-4 border flex items-center justify-between"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}25` }}>
                  <div>
                    <div className="text-gray-400 text-xs">{r.label}</div>
                    <div className="text-white font-bold text-base mt-0.5">{r.value}</div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {r.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {r.change}
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/${countrySlug}/rates`} className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: accent }}>
              Full rates & 30-day history <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* ── NEWS ── */}
          <section>
            <SectionTitle icon={Newspaper} title={`${country.name} Today`} subtitle="Latest news and developments" accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              A summary of today's most important headlines from {country.name} and global news about the country.
              The national news covers politics, economy, sports, and culture happening inside {country.name} right now.
              The global section shows what the international media is reporting about {country.name} today.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Global news */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}30` }}>
                <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: accent }}>🌍 Global news about {country.name}</div>
                <div className="space-y-3">
                  {['IMF programme review — decision expected this month',
                    `${country.name}-related diplomatic developments in the region`,
                    `International coverage: economic outlook for ${country.name} 2025`].map((h, i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      <span className="text-gray-600 text-xs mt-0.5 w-3 flex-shrink-0">{i + 1}</span>
                      <p className="text-gray-300 text-sm leading-snug">{h}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* National news */}
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}30` }}>
                <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: accent }}>🏳️ National news</div>
                <div className="space-y-3">
                  {[`PM chairs economic committee — focus on growth targets`,
                    country.code === 'PK' ? 'PSL 2025 playoffs schedule announced' : `National sports league latest results`,
                    `New infrastructure projects approved across major cities`].map((h, i) => (
                    <div key={i} className="flex gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                      <span className="text-gray-600 text-xs mt-0.5 w-3 flex-shrink-0">{i + 1}</span>
                      <p className="text-gray-300 text-sm leading-snug">{h}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link href={`/${countrySlug}/news`} className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: accent }}>
              Full {country.name} news <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* ── PROVINCES ── */}
          <section>
            <SectionTitle icon={MapPin} title={`Explore ${country.name} by Province`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              {country.name} is divided into {provinces.length} major provinces and territories, each with its own
              capital, economic character, cultural identity, and climate. Population and area vary enormously
              across these regions. Click any province below to explore its cities, weather, and local data in detail.
              Every province page connects you directly to all cities within it.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {provinces.map((prov) => (
                <Link key={prov.slug} href={`/${countrySlug}/${prov.slug}`}
                  className="group rounded-2xl p-5 border hover:border-opacity-60 transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}30` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-white font-bold">{prov.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: accent }}>{prov.tagline}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-300 mt-1 transition-colors" />
                  </div>
                  <div className="text-gray-500 text-xs">Capital: <span className="text-gray-300">{prov.capital}</span></div>
                  <div className="text-gray-500 text-xs mt-1">Pop: <span className="text-gray-300">{(prov.population / 1e6).toFixed(1)}M</span> · Area: <span className="text-gray-300">{prov.area.toLocaleString()} km²</span></div>
                  <div className="text-gray-600 text-xs mt-2">{prov.cities.join(' · ')}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── ECONOMY ── */}
          <section>
            <SectionTitle icon={TrendingUp} title={`${country.name} Economy`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              {country.name} runs a {economy?.gdp} economy with a current growth rate of {economy?.growth}.
              The workforce spans agriculture, industry, and a rapidly growing services sector.
              Inflation stands at {economy?.inflation} while unemployment is at {economy?.unemployment}.
              The country's exports reach markets across every major continent, with the exchange rate
              sitting at {economy?.currencyRate}. These four headline figures give you a real-time
              snapshot of where {country.name}'s economy is right now.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'GDP', value: economy?.gdp, color: '#34d399', icon: '💵' },
                { label: 'Growth Rate', value: economy?.growth, color: '#60a5fa', icon: '📈' },
                { label: 'Inflation', value: economy?.inflation, color: '#f87171', icon: '🔺' },
                { label: 'Unemployment', value: economy?.unemployment, color: '#fb923c', icon: '👔' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl p-5 border text-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${stat.color}30` }}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-gray-500 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
            {economy?.exports && (
              <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}25` }}>
                <div className="text-white font-semibold text-sm mb-3">What {country.name} sells to the world</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {economy.exports.map((exp, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                      {exp}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ── PERSONALITIES ── */}
          <section>
            <SectionTitle icon={Users} title={`${country.name}'s Finest`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              Every nation is defined partly by the people it has produced — the leaders, athletes,
              artists, and scientists who shaped not just their country but the wider world.
              {country.name} has given the world Nobel laureates, world champions, revolutionary thinkers,
              and cultural icons recognised across every continent. This section brings together
              {country.name}'s most significant historical and contemporary figures by field.
            </p>
            <div className="flex gap-2 flex-wrap mb-5">
              {personalityCategories.map((cat) => (
                <FlagPill key={cat} active={activePersonality === cat} color={accent} onClick={() => setActivePersonality(cat)}>
                  {cat}
                </FlagPill>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredPersonalities.map((p) => (
                <div key={p.id} className="rounded-2xl p-5 border text-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}25` }}>
                  <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${accent}20`, border: `2px solid ${accent}40` }}>
                    👤
                  </div>
                  <div className="text-white font-semibold text-sm leading-tight">{p.name}</div>
                  <div className="text-xs mt-1" style={{ color: accent }}>{p.profession}</div>
                  <div className="text-gray-500 text-xs mt-2 leading-snug">{p.achievements}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAMOUS PLACES ── */}
          <section>
            <SectionTitle icon={Mountain} title={`${country.name} Must See`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              {country.name} is home to {landmarks.filter(l => l.unesco).length} UNESCO World Heritage Sites
              and dozens of historically and naturally significant destinations that draw millions of
              visitors every year. From ancient civilisations to Mughal-era monuments and natural wonders,
              these are the places that define {country.name}'s physical and cultural landscape.
              Each landmark links to a dedicated page with visiting information and full historical context.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {landmarks.map((lm) => (
                <div key={lm.id} className="group rounded-2xl overflow-hidden border hover:border-opacity-60 transition-all"
                  style={{ borderColor: `${accent}30` }}>
                  <div className="relative h-40 overflow-hidden">
                    <img src={lm.image} alt={lm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.8), transparent)' }} />
                    {lm.unesco && (
                      <div className="absolute top-3 left-3 bg-amber-500/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">UNESCO</div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <div className="text-white font-bold text-sm">{lm.name}</div>
                      <div className="text-gray-300 text-xs">{lm.city} · {lm.era}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── HERITAGE PRODUCTS ── */}
          <section>
            <SectionTitle icon={Gem} title={`${country.name} Heritage Products`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              The crafts and products made in {country.name} carry centuries of knowledge and skill.
              These are not mass-produced items but handcrafted works that reflect the region,
              the community, and the generation that made them. From intricate embroidery
              and pottery to sports goods and surgical instruments, {country.name}'s heritage
              products are sold in markets across the world and represent a living tradition
              as much as an economic activity.
            </p>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {[
                { name: 'Truck Art', emoji: '🎨', origin: 'Nationwide' },
                { name: 'Ajrak Sindhi', emoji: '🧣', origin: 'Sindh' },
                { name: 'Multani Pottery', emoji: '🏺', origin: 'Multan' },
                { name: 'Kashmiri Shawl', emoji: '🧤', origin: 'AJK' },
                { name: 'Peshawari Chappal', emoji: '👡', origin: 'Peshawar' },
                { name: 'Balochi Embroidery', emoji: '🪡', origin: 'Balochistan' },
                { name: 'Khussa Shoes', emoji: '👞', origin: 'Lahore' },
                { name: 'Sports Goods', emoji: '⚽', origin: 'Sialkot' },
              ].map((prod) => (
                <div key={prod.name} className="flex-shrink-0 min-w-[140px] rounded-2xl p-4 border text-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}25` }}>
                  <div className="text-4xl mb-2">{prod.emoji}</div>
                  <div className="text-white text-sm font-medium">{prod.name}</div>
                  <div className="text-gray-500 text-xs mt-1">{prod.origin}</div>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}</style>
            </div>
          </section>

          {/* ── NATURAL RESOURCES ── */}
          <section>
            <SectionTitle icon={Leaf} title={`${country.name} Natural Resources`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              {country.name} sits on substantial natural wealth that has shaped its history and
              continues to drive its economic potential. From mineral deposits and energy resources
              to river systems and agricultural land, these resources represent both the foundation
              of the current economy and the basis for long-term development. Many of these
              deposits remain underexploited, meaning {country.name}'s resource story is still
              being written.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {resources.map((res) => (
                <div key={res.name} className="rounded-2xl p-5 border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}25` }}>
                  <div className="text-3xl mb-3">{res.icon}</div>
                  <div className="text-white font-semibold text-sm mb-1">{res.name}</div>
                  <div className="text-xs mb-2 font-medium" style={{ color: accent }}>{res.rank}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{res.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── NATIONAL TEAMS ── */}
          <section>
            <SectionTitle icon={Trophy} title={`${country.name} in Sport`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              Sport is one of the most powerful expressions of national identity in {country.name}.
              The national teams compete across cricket, hockey, squash, and other disciplines,
              carrying the country's flag at world championships and Olympic stages.
              The achievements listed below represent decades of national sporting history,
              with current rankings reflecting the most recent international standings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div key={team.sport} className="rounded-2xl p-5 border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}25` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white font-bold text-sm">{team.name}</div>
                    <div className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${accent}20`, color: accent }}>{team.ranking}</div>
                  </div>
                  <ul className="space-y-1.5">
                    {team.achievements.map((ach) => (
                      <li key={ach} className="flex items-start gap-2 text-xs text-gray-400">
                        <span className="text-yellow-400 mt-0.5">🏆</span>
                        {ach}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAMOUS FOODS ── */}
          <section>
            <SectionTitle icon={Utensils} title={`${country.name} Famous Foods`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              The food of {country.name} is as varied as its geography and as layered as its history.
              Each region has developed its own flavours, cooking techniques, and signature dishes
              over centuries, shaped by trade routes, migration, climate, and agriculture.
              These are the dishes that {country.name} is known for across the world and that
              every visitor should try at least once.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {foods.map((food) => (
                <div key={food.name} className="rounded-2xl p-5 border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}25` }}>
                  <div className="text-4xl mb-3">{food.emoji}</div>
                  <div className="text-white font-semibold mb-1">{food.name}</div>
                  <div className="text-gray-500 text-xs mb-2">{food.origin}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{food.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── HOLIDAYS & EVENTS ── */}
          <section>
            <SectionTitle icon={Calendar} title={`${country.name} Holidays & Events`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              {country.name}'s national holidays and observances mark the most significant dates
              in the country's calendar — from independence and national days to religious
              celebrations observed by millions. These dates affect business hours, school
              schedules, and public life across the country. Knowing them in advance matters
              practically for anyone planning travel, business, or any activity that overlaps
              with national observance periods.
            </p>
            <div className="flex gap-2 flex-wrap mb-5">
              {holidayTypes.map((t) => (
                <FlagPill key={t} active={activeHoliday === t} color={accent} onClick={() => setActiveHoliday(t)}>{t}</FlagPill>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredHolidays.map((h) => (
                <div key={h.name} className="rounded-xl p-4 border flex items-center justify-between"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}25` }}>
                  <div>
                    <div className="text-white text-sm font-medium">{h.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{h.date}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accent}20`, color: accent }}>{h.type}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── EMERGENCY ── */}
          <section>
            <SectionTitle icon={ShieldAlert} title={`${country.name} Emergency Contacts`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              These emergency contact numbers cover police, medical services, fire response,
              and specialist helplines across {country.name}. Whether you are a resident,
              a traveller, or someone newly arrived in the country, these numbers connect
              you directly to the relevant national emergency response service.
              Save them before you need them. Some numbers vary by city or region.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {emergency.map((e) => (
                <div key={e.label} className="rounded-2xl p-4 text-center border"
                  style={{ backgroundColor: `${e.color}15`, borderColor: `${e.color}40` }}>
                  <div className="text-2xl font-black mb-1" style={{ color: e.color }}>{e.number}</div>
                  <div className="text-gray-300 text-xs">{e.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── NEIGHBOURS ── */}
          <section>
            <SectionTitle icon={Globe} title={`${country.name} Neighbouring Countries`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl">
              {country.name} shares land borders with {neighbors.length} countries,
              and these relationships shape trade, migration, politics, and daily life
              along the border regions. The shared border length gives a sense of how
              closely connected these nations are geographically. Click any neighbouring
              country to explore its own cities, culture, and data on WorldCityHub.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {neighbors.map((n) => (
                <Link key={n.slug} href={`/${n.slug}`}
                  className="group rounded-2xl p-5 border text-center hover:border-opacity-60 transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: `${accent}25` }}>
                  <div className="text-4xl mb-2">{n.flag}</div>
                  <div className="text-white font-semibold text-sm group-hover:underline">{n.name}</div>
                  <div className="text-gray-500 text-xs mt-1">Border: {n.border}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── EXPLORE LINKS STRIP ── */}
          <section>
            <SectionTitle icon={Globe} title={`Explore ${country.name} in Detail`} accent={accent} />
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Provinces', href: `/${countrySlug}` },
                { label: 'Weather', href: `/${countrySlug}/islamabad/weather` },
                { label: 'Prayer Times', href: `/${countrySlug}/islamabad/prayer-times` },
                { label: 'Rates', href: `/${countrySlug}/rates` },
                { label: 'News', href: `/${countrySlug}/news` },
                { label: 'Famous People', href: `/${countrySlug}/personalities` },
                { label: 'Famous Places', href: `/${countrySlug}/places` },
                { label: 'Economy', href: `/${countrySlug}/economy` },
                { label: 'Heritage Products', href: `/${countrySlug}/heritage-products` },
                { label: 'Events', href: `/${countrySlug}/events` },
                { label: 'Compare', href: `/compare?a=${countrySlug}` },
              ].map((link) => (
                <Link key={link.label} href={link.href}
                  className="px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:text-white"
                  style={{ backgroundColor: `${accent}10`, borderColor: `${accent}35`, color: accent }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </FlagAuroraBackground>
  );
}
