'use client';

import { useEffect, useState } from 'react';
import FlagSymbolBackground from '@/components/shared/FlagSymbolBackground';
import GrowthDashboard from '@/components/shared/GrowthDashboard';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface Province {
  name: string; slug: string; capital: string;
  population: number; area: number; tagline: string;
  knownFor: string; gdpPct: string; literacyRate: string;
  climate: string; majorFaith: string; majorFaithPct: number;
  established: string; universities: number;
  country: string; countrySlug: string; countryCode: string;
  primaryColor: string; heroImage: string;
  lat: number; lng: number;
}
interface City { name: string; slug: string; population: number; temp: number; condition: string; icon: string; }
interface Division { name: string; slug: string; districts: string[]; }
interface Industry { name: string; icon: string; description: string; city: string; }
interface Product { name: string; emoji: string; category: string; origin: string; }
interface Landmark { name: string; city: string; era: string; unesco: boolean; image: string; }
interface Food { name: string; emoji: string; description: string; origin: string; }
interface Resource { name: string; icon: string; rank: string; description: string; }
interface Emergency { label: string; number: string; color: string; }
interface RateItem { label: string; value: string; change: string; up: boolean; }
interface OtherProvince { name: string; slug: string; tagline: string; }
interface Personality { name: string; profession: string; category: string; birthCity: string; }

// ─── Static Data ─────────────────────────────────────────────────────────────

const PROVINCES: Record<string, Province> = {
  'pakistan/punjab': {
    name: 'Punjab', slug: 'punjab', capital: 'Lahore',
    population: 110012442, area: 205344,
    tagline: 'Most populous province — heart of Pakistan',
    knownFor: 'Agriculture, Industry, Culture, Education',
    gdpPct: '54%', literacyRate: '64%', climate: 'Semi-arid',
    majorFaith: 'Islam', majorFaithPct: 97,
    established: '1970 (modern province)', universities: 200,
    country: 'Pakistan', countrySlug: 'pakistan', countryCode: 'PK',
    primaryColor: '#0C7A3D',
    heroImage: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1600',
    lat: 31.1471, lng: 75.3412,
  },
  'pakistan/sindh': {
    name: 'Sindh', slug: 'sindh', capital: 'Karachi',
    population: 47886531, area: 140914,
    tagline: 'Economic heartbeat of Pakistan',
    knownFor: 'Finance, Port Trade, Culture, Agriculture',
    gdpPct: '30%', literacyRate: '58%', climate: 'Arid to Semi-arid',
    majorFaith: 'Islam', majorFaithPct: 95,
    established: '1970 (modern province)', universities: 80,
    country: 'Pakistan', countrySlug: 'pakistan', countryCode: 'PK',
    primaryColor: '#0C7A3D',
    heroImage: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1600',
    lat: 25.8943, lng: 68.5247,
  },
  'pakistan/khyber-pakhtunkhwa': {
    name: 'Khyber Pakhtunkhwa', slug: 'khyber-pakhtunkhwa', capital: 'Peshawar',
    population: 35625000, area: 74521,
    tagline: 'Land of mountains and ancient traditions',
    knownFor: 'Mountains, Tourism, Agriculture, Minerals',
    gdpPct: '11%', literacyRate: '53%', climate: 'Varies — Alpine to Subtropical',
    majorFaith: 'Islam', majorFaithPct: 99,
    established: '1970 (modern province)', universities: 40,
    country: 'Pakistan', countrySlug: 'pakistan', countryCode: 'PK',
    primaryColor: '#0C7A3D',
    heroImage: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=1600',
    lat: 34.9526, lng: 72.3311,
  },
};

const PROVINCE_CITIES: Record<string, City[]> = {
  punjab: [
    { name: 'Lahore',      slug: 'lahore',      population: 14000000, temp: 35, condition: 'Hot',      icon: '☀️' },
    { name: 'Faisalabad',  slug: 'faisalabad',  population: 3600000,  temp: 36, condition: 'Hot',      icon: '☀️' },
    { name: 'Rawalpindi',  slug: 'rawalpindi',  population: 2100000,  temp: 31, condition: 'Clear',    icon: '🌤️' },
    { name: 'Multan',      slug: 'multan',      population: 1900000,  temp: 38, condition: 'Very Hot', icon: '🔥' },
    { name: 'Gujranwala',  slug: 'gujranwala',  population: 2000000,  temp: 34, condition: 'Hot',      icon: '☀️' },
    { name: 'Sialkot',     slug: 'sialkot',     population: 900000,   temp: 32, condition: 'Warm',     icon: '⛅' },
  ],
  sindh: [
    { name: 'Karachi',    slug: 'karachi',    population: 15000000, temp: 32, condition: 'Humid',  icon: '🌤️' },
    { name: 'Hyderabad',  slug: 'hyderabad',  population: 1800000,  temp: 35, condition: 'Hot',    icon: '☀️' },
    { name: 'Sukkur',     slug: 'sukkur',     population: 500000,   temp: 38, condition: 'Hot',    icon: '🔥' },
    { name: 'Larkana',    slug: 'larkana',    population: 490000,   temp: 37, condition: 'Hot',    icon: '🔥' },
    { name: 'Nawabshah',  slug: 'nawabshah',  population: 300000,   temp: 36, condition: 'Hot',    icon: '☀️' },
    { name: 'Jacobabad',  slug: 'jacobabad',  population: 280000,   temp: 42, condition: 'Extreme', icon: '🔥' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Peshawar',    slug: 'peshawar',    population: 2000000, temp: 28, condition: 'Warm',    icon: '⛅' },
    { name: 'Abbottabad',  slug: 'abbottabad',  population: 500000,  temp: 22, condition: 'Pleasant', icon: '🌤️' },
    { name: 'Mardan',      slug: 'mardan',      population: 400000,  temp: 27, condition: 'Warm',    icon: '⛅' },
    { name: 'Mingora',     slug: 'mingora',     population: 280000,  temp: 18, condition: 'Cool',    icon: '🌤️' },
    { name: 'Kohat',       slug: 'kohat',       population: 200000,  temp: 30, condition: 'Hot',     icon: '☀️' },
    { name: 'Bannu',       slug: 'bannu',       population: 180000,  temp: 32, condition: 'Hot',     icon: '☀️' },
  ],
};

const DIVISIONS: Record<string, Division[]> = {
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
  punjab: [
    { name: 'Textiles', icon: '🧵', description: 'Largest textile industry in Pakistan — 60% of national output', city: 'Faisalabad' },
    { name: 'Agriculture', icon: '🌾', description: 'Wheat, rice, sugarcane, cotton — breadbasket of Pakistan', city: 'Province-wide' },
    { name: 'Sports Goods', icon: '⚽', description: '70% of world\'s hand-stitched footballs come from Sialkot', city: 'Sialkot' },
    { name: 'Surgical Instruments', icon: '🔬', description: 'Second largest producer globally after Germany', city: 'Sialkot' },
    { name: 'Manufacturing', icon: '🏭', description: 'Automotive parts, electronics, consumer goods', city: 'Lahore' },
    { name: 'IT Services', icon: '💻', description: 'Rapidly growing tech sector in Lahore', city: 'Lahore' },
  ],
  sindh: [
    { name: 'Financial Services', icon: '🏦', description: 'Banking, insurance, and Karachi Stock Exchange', city: 'Karachi' },
    { name: 'Port & Shipping', icon: '🚢', description: 'Karachi Port handles 95% of Pakistan\'s trade', city: 'Karachi' },
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
  punjab: [
    { name: 'Badshahi Mosque', city: 'Lahore', era: 'Mughal 1673', unesco: false, image: 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Lahore Fort (Shahi Qila)', city: 'Lahore', era: 'Mughal 1566', unesco: true, image: 'https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Shalimar Gardens', city: 'Lahore', era: 'Mughal 1641', unesco: true, image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Rohtas Fort', city: 'Jhelum', era: 'Suri 1541', unesco: true, image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Kartarpur Corridor', city: 'Narowal', era: 'Modern 2019', unesco: false, image: 'https://images.pexels.com/photos/208371/pexels-photo-208371.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Multan Shrines', city: 'Multan', era: '13th Century', unesco: false, image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
  sindh: [
    { name: 'Mohenjo-daro', city: 'Larkana', era: '3000 BCE', unesco: true, image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Thatta Mosques', city: 'Thatta', era: 'Mughal 1647', unesco: true, image: 'https://images.pexels.com/photos/1537086/pexels-photo-1537086.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Makli Necropolis', city: 'Thatta', era: '14th Century', unesco: true, image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Karachi Clifton Beach', city: 'Karachi', era: 'Natural', unesco: false, image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Takht-i-Bahi', city: 'Mardan', era: '1st Century BC', unesco: true, image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Swat Valley', city: 'Swat', era: 'Natural Wonder', unesco: false, image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Peshawar Museum', city: 'Peshawar', era: 'Colonial 1906', unesco: false, image: 'https://images.pexels.com/photos/208371/pexels-photo-208371.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Qissa Khwani Bazaar', city: 'Peshawar', era: 'Ancient', unesco: false, image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ],
};

const FOODS: Record<string, Food[]> = {
  punjab: [
    { name: 'Saag & Makki di Roti', emoji: '🥬', description: 'Mustard greens slow-cooked with butter, served with corn flatbread — the soul of Punjab.', origin: 'Province-wide' },
    { name: 'Lahori Chargha', emoji: '🍗', description: 'Whole chicken marinated overnight in spices, steamed then deep-fried. A Lahore legend.', origin: 'Lahore' },
    { name: 'Paye', emoji: '🥣', description: 'Slow-cooked trotters simmered overnight — the definitive Punjab breakfast for cold mornings.', origin: 'Province-wide' },
    { name: 'Sohan Halwa', emoji: '🍮', description: 'Multan\'s famous dense sweet made with wheat starch, sugar, ghee and saffron.', origin: 'Multan' },
    { name: 'Lassi', emoji: '🥛', description: 'Thick churned yoghurt, sweet or salted, served in a clay pot. Punjab in a glass.', origin: 'Province-wide' },
    { name: 'Chaunsa Mango', emoji: '🥭', description: 'The king of mangoes. Grown in Multan, eaten across Pakistan every summer.', origin: 'Multan' },
  ],
  sindh: [
    { name: 'Sindhi Biryani', emoji: '🍛', description: 'Spicier than other styles, with potatoes and dried plums in the rice — distinctly Sindhi.', origin: 'Karachi' },
    { name: 'Seyal Maani', emoji: '🥘', description: 'Stale flatbread cooked with spiced gravy — a beloved Sindhi comfort dish.', origin: 'Province-wide' },
    { name: 'Sindhi Curry', emoji: '🍲', description: 'Gram flour and tamarind-based curry with mixed vegetables — a Sindhi signature.', origin: 'Province-wide' },
    { name: 'Palla Fish', emoji: '🐟', description: 'Hilsa fish from the Indus — a delicacy that only runs for two months a year.', origin: 'Indus River' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Chapli Kebab', emoji: '🥩', description: 'Flat spiced minced meat patty grilled over open flame. Peshawar\'s gift to the world.', origin: 'Peshawar' },
    { name: 'Kabuli Pulao', emoji: '🍚', description: 'Fragrant rice cooked with lamb, carrots, raisins and spices — a Frontier classic.', origin: 'Peshawar' },
    { name: 'Karahi Gosht', emoji: '🍳', description: 'Lamb or beef cooked in a wok with tomatoes, ginger and green chillies — KPK style.', origin: 'Province-wide' },
    { name: 'Shahi Tukray', emoji: '🍞', description: 'Fried bread soaked in sweet condensed milk — a royal dessert from the Frontier.', origin: 'Peshawar' },
  ],
};

const RESOURCES: Record<string, Resource[]> = {
  punjab: [
    { name: 'Fertile Agricultural Land', icon: '🌾', rank: 'World class', description: 'Punjab\'s alluvial plains fed by 5 rivers are among the most productive farmland on earth.' },
    { name: 'Indus River System', icon: '🌊', rank: 'Top 10 globally', description: 'Five major rivers — Indus, Jhelum, Chenab, Ravi, Sutlej — irrigate the entire province.' },
    { name: 'Rock Salt (Khewra)', icon: '🪨', rank: 'World 2nd largest mine', description: 'Khewra Salt Mine has been mined since the 1200s and holds 220 million tonnes of reserves.' },
    { name: 'Coal (Salt Range)', icon: '⚫', rank: 'Significant deposits', description: 'Coal deposits across the Salt Range provide fuel for local industry.' },
    { name: 'Natural Gas', icon: '🔥', rank: 'Significant reserves', description: 'Natural gas fields contribute to Punjab\'s energy supply and national grid.' },
    { name: 'Underground Water', icon: '💧', rank: 'Rich aquifers', description: 'Punjab sits on extensive groundwater aquifers that supply agriculture and cities.' },
  ],
  sindh: [
    { name: 'Natural Gas', icon: '🔥', rank: 'Pakistan\'s largest reserves', description: 'Sindh holds Pakistan\'s largest natural gas reserves, powering much of the national grid.' },
    { name: 'Oil Fields', icon: '🛢️', rank: 'Significant production', description: 'Oil fields in Sindh contribute substantially to Pakistan\'s domestic petroleum production.' },
    { name: 'Coal (Thar)', icon: '⚫', rank: 'World\'s 7th largest', description: 'Thar Coal Field contains 175 billion tonnes, one of the world\'s largest lignite deposits.' },
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
    { name: 'Allama Iqbal', profession: 'Poet & Philosopher', category: 'Leaders', birthCity: 'Sialkot' },
    { name: 'Wasim Akram', profession: 'Cricketer', category: 'Sports', birthCity: 'Lahore' },
    { name: 'Nusrat Fateh Ali Khan', profession: 'Musician', category: 'Arts', birthCity: 'Faisalabad' },
    { name: 'Arfa Karim', profession: 'Tech Prodigy', category: 'Science', birthCity: 'Faisalabad' },
    { name: 'Imran Khan', profession: 'Cricketer & Politician', category: 'Sports', birthCity: 'Lahore' },
    { name: 'Abida Parveen', profession: 'Sufi Singer', category: 'Arts', birthCity: 'Larkana (raised Punjab)' },
  ],
  sindh: [
    { name: 'Muhammad Ali Jinnah', profession: 'Father of the Nation', category: 'Leaders', birthCity: 'Karachi' },
    { name: 'Benazir Bhutto', profession: 'Prime Minister', category: 'Leaders', birthCity: 'Karachi' },
    { name: 'Abdul Sattar Edhi', profession: 'Philanthropist', category: 'Leaders', birthCity: 'Karachi (origin Gujarat)' },
    { name: 'Abida Parveen', profession: 'Sufi Singer', category: 'Arts', birthCity: 'Larkana' },
  ],
  'khyber-pakhtunkhwa': [
    { name: 'Khan Abdul Ghaffar Khan', profession: 'Freedom Fighter', category: 'Leaders', birthCity: 'Charsadda' },
    { name: 'Malala Yousafzai', profession: 'Education Activist', category: 'Leaders', birthCity: 'Swat' },
    { name: 'Shahid Afridi', profession: 'Cricketer', category: 'Sports', birthCity: 'Khyber Agency' },
    { name: 'Ghani Khan', profession: 'Poet & Artist', category: 'Arts', birthCity: 'Charsadda' },
  ],
};

const EVENTS: Record<string, { name: string; date: string; type: string; city: string }[]> = {
  punjab: [
    { name: 'Lahore Literary Festival', date: 'February', type: 'Cultural', city: 'Lahore' },
    { name: 'PSL Finals', date: 'March–April', type: 'Sports', city: 'Lahore' },
    { name: 'Shalimar Garden Spring Show', date: 'March', type: 'Cultural', city: 'Lahore' },
    { name: 'Basant Kite Festival', date: 'February', type: 'Cultural', city: 'Lahore' },
    { name: 'Multan Mango Festival', date: 'June–July', type: 'Cultural', city: 'Multan' },
    { name: 'Urs at Data Darbar', date: 'Annual', type: 'Religious', city: 'Lahore' },
  ],
  sindh: [
    { name: 'Sindh Cultural Day', date: 'December 5', type: 'Cultural', city: 'Province-wide' },
    { name: 'Urs at Shah Abdul Latif', date: 'Annual', type: 'Religious', city: 'Bhit Shah' },
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
    { name: 'Sindh', slug: 'sindh', tagline: 'Economic heartbeat' },
    { name: 'KPK', slug: 'khyber-pakhtunkhwa', tagline: 'Land of mountains' },
    { name: 'Balochistan', slug: 'balochistan', tagline: 'Largest province' },
    { name: 'Gilgit-Baltistan', slug: 'gilgit-baltistan', tagline: 'Roof of the world' },
    { name: 'AJK', slug: 'azad-kashmir', tagline: 'Heaven on earth' },
  ],
};

const EMERGENCY: Record<string, Emergency[]> = {
  PK: [
    { label: 'Police', number: '15', color: '#1d4ed8' },
    { label: 'Ambulance / Rescue', number: '1122', color: '#dc2626' },
    { label: 'Fire', number: '16', color: '#ea580c' },
    { label: 'Emergency', number: '115', color: '#7c3aed' },
    { label: 'Women Helpline', number: '1043', color: '#db2777' },
    { label: 'Child Helpline', number: '1121', color: '#0891b2' },
    { label: 'Punjab Disaster', number: '0800-13100', color: '#b45309' },
  ],
};

const RATES: RateItem[] = [
  { label: 'Gold 24K', value: 'PKR 21,500/g', change: '+0.4%', up: true },
  { label: 'Gold 22K', value: 'PKR 19,700/g', change: '+0.3%', up: true },
  { label: 'Silver', value: 'PKR 240/g', change: '-0.1%', up: false },
  { label: 'USD/PKR', value: '278.50', change: '+0.2%', up: true },
  { label: 'EUR/PKR', value: '301.20', change: '+0.1%', up: true },
  { label: 'SAR/PKR', value: '74.20', change: '0.0%', up: true },
  { label: 'Petrol', value: 'PKR 248/L', change: '0.0%', up: true },
  { label: 'Diesel', value: 'PKR 255/L', change: '0.0%', up: true },
];

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

export default function ProvincePage() {
  const params = useParams<{ country: string; province: string }>();
  const [province, setProvince] = useState<Province | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [emergency, setEmergency] = useState<Emergency[]>([]);
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [events, setEvents] = useState<{ name: string; date: string; type: string; city: string }[]>([]);
  const [otherProvinces, setOtherProvinces] = useState<OtherProvince[]>([]);
  const [activePersonality, setActivePersonality] = useState('All');
  const [activeEvent, setActiveEvent] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = `${params.country}/${params.province}`;
    const prov = PROVINCES[key] || PROVINCES['pakistan/punjab'];
    setProvince(prov);
    setCities(PROVINCE_CITIES[prov.slug] || []);
    setDivisions(DIVISIONS[prov.slug] || []);
    setIndustries(INDUSTRIES[prov.slug] || []);
    setProducts(PRODUCTS[prov.slug] || []);
    setLandmarks(LANDMARKS[prov.slug] || []);
    setFoods(FOODS[prov.slug] || []);
    setResources(RESOURCES[prov.slug] || []);
    setEmergency(EMERGENCY[prov.countryCode] || EMERGENCY.PK);
    setPersonalities(PERSONALITIES[prov.slug] || []);
    setEvents(EVENTS[prov.slug] || []);
    setOtherProvinces(OTHER_PROVINCES[prov.countrySlug] || []);
    setLoading(false);
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
          <h1 className="text-white text-2xl font-bold mb-2">Province not found</h1>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300">← Back to homepage</Link>
        </div>
      </div>
    );
  }

  const accent = province.primaryColor;
  const bg = '#0a0f1e';
  const cardBg = 'rgba(255,255,255,0.04)';
  const cardBorder = `${accent}30`;

  const personalityCategories = ['All', ...Array.from(new Set(personalities.map(p => p.category)))];
  const filteredPersonalities = activePersonality === 'All' ? personalities : personalities.filter(p => p.category === activePersonality);
  const eventTypes = ['All', ...Array.from(new Set(events.map(e => e.type)))];
  const filteredEvents = activeEvent === 'All' ? events : events.filter(e => e.type === activeEvent);

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg }}>

      {/* Aurora orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div className="absolute top-20 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-10"
          style={{ backgroundColor: accent }}
          animate={{ y: [0, -40, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-40 left-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-8"
          style={{ backgroundColor: accent }}
          animate={{ y: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 5 }} />
        <FlagSymbolBackground countrySlug={params?.country as string ?? 'pakistan'} />
      </div>

      {/* Breadcrumb */}
      <div className="relative z-10 px-4 pt-4 pb-2 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">World</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/${province.countrySlug}`} className="hover:text-gray-300 transition-colors">{province.country}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{province.name}</span>
        </div>
      </div>
      {/* Hero */}
      <div className="relative z-10 h-64 md:h-80 overflow-hidden">
        <img src={province.heroImage} alt={province.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${bg} 30%, transparent 70%)` }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, ${accent}22, transparent 60%)` }} />
        <div className="absolute bottom-6 left-6 md:left-8">
          <h1 className="text-4xl md:text-5xl font-black" style={{ color: accent }}>{province.name}</h1>
          <p className="text-gray-300 text-base mt-1">{province.tagline}</p>
          <p className="text-gray-500 text-sm">{province.country} · {province.knownFor}</p>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20 space-y-14 pt-8">

        {/* ── 1. PROVINCE OVERVIEW ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
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
                <div className="text-gray-500 text-xs mb-1">{item.label}</div>
                <div className="text-white text-sm font-semibold leading-tight">{item.value}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            {generateOverviewAfter(province.name, province.country)}
          </p>
        </motion.section>

        {/* ── 2. MAJOR CITIES ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Building2} title={`Major Cities of ${province.name}`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateCitiesParagraph(province.name)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
            {cities.map(city => (
              <Link key={city.slug}
                href={`/${province.countrySlug}/${province.slug}/${city.slug}`}
                className="group rounded-2xl p-4 border text-center hover:border-opacity-60 transition-all"
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                <div className="text-3xl mb-2">{city.icon}</div>
                <div className="text-white font-semibold text-sm">{city.name}</div>
                <div className="font-bold text-xl mt-1" style={{ color: accent }}>{city.temp}°C</div>
                <div className="text-gray-500 text-xs mt-0.5">{city.condition}</div>
                <div className="text-gray-600 text-xs mt-1">{fmt(city.population)}</div>
              </Link>
            ))}
          </div>
          <Link href={`/${province.countrySlug}/${province.slug}/cities`}
            className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: accent }}>
            See all {province.name} cities <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed mt-4">
            {generateCitiesAfter(province.name)}
          </p>
        </motion.section>

        {/* ── 3. WEATHER ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Thermometer} title={`Weather Across ${province.name}`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateWeatherParagraph(province.name)}
          </p>
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {cities.map(city => (
                <Link key={city.slug}
                  href={`/${province.countrySlug}/${province.slug}/${city.slug}/weather`}
                  className="text-center p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="text-white font-medium text-sm">{city.name}</div>
                  <div className="text-2xl my-1">{city.icon}</div>
                  <div className="font-bold text-lg" style={{ color: accent }}>{city.temp}°C</div>
                  <div className="text-gray-500 text-xs">{city.condition}</div>
                </Link>
              ))}
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mt-4">
            {generateWeatherAfter(province.name)}
          </p>
        </motion.section>

        {/* ── 4. DIVISIONS ── */}
        {divisions.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader icon={MapPin} title={`Explore ${province.name} by Division`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {province.name} is administratively divided into {divisions.length} divisions, each comprising several districts.
              This administrative structure shapes governance, development planning, and resource allocation across the province.
              Click any division to explore the cities and towns within it.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {divisions.map(div => (
                <div key={div.slug} className="rounded-2xl p-4 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-semibold text-sm">{div.name}</div>
                    <MapPin className="w-4 h-4" style={{ color: accent }} />
                  </div>
                  <div className="text-gray-500 text-xs leading-relaxed">{div.districts.join(' · ')}</div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── 5. FAITH & SPIRITUAL ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Star} title="Faith & Spiritual" accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {province.majorFaith} is practised by {province.majorFaithPct}% of {province.name}'s population.
            The province is home to some of the most significant sacred sites in South Asia, drawing pilgrims
            and visitors from across Pakistan and beyond. The faith times below show the next prayer
            for {province.capital}, the provincial capital.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <div className="text-white font-semibold text-sm mb-4">Religious Population of {province.name}</div>
              {[
                { faith: province.majorFaith, pct: province.majorFaithPct },
                { faith: 'Christianity', pct: province.countryCode === 'PK' ? 2.5 : 5 },
                { faith: 'Other', pct: 100 - province.majorFaithPct - 2.5 },
              ].map(r => (
                <div key={r.faith} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{r.faith}</span>
                    <span style={{ color: accent }}>{r.pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min(r.pct, 100)}%`, backgroundColor: accent }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <div className="text-white font-semibold text-sm mb-4">Next Prayer — {province.capital}</div>
              {[
                { name: 'Fajr', time: '5:01 AM', status: 'passed' },
                { name: 'Dhuhr', time: '12:30 PM', status: 'passed' },
                { name: 'Asr', time: '4:02 PM', status: 'passed' },
                { name: 'Maghrib', time: '7:38 PM', status: 'next' },
                { name: 'Isha', time: '9:02 PM', status: 'upcoming' },
              ].map(p => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-gray-400 text-sm">{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{p.time}</span>
                    {p.status === 'next' && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: `${accent}25`, color: accent }}>Next</span>
                    )}
                    {p.status === 'passed' && <span className="text-gray-600 text-xs">✓</span>}
                  </div>
                </div>
              ))}
              <Link href={`/${province.countrySlug}/${province.slug}/${province.capital.toLowerCase()}/prayer-times`}
                className="inline-flex items-center gap-1 text-xs font-medium mt-3" style={{ color: accent }}>
                See prayer times for any {province.name} city <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ── 6. MARKET RATES ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Coins} title={`${province.name} Market Rates Today`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Gold, silver, currency exchange rates, and fuel prices apply uniformly across {province.name} as they
            are set at the national level. These are the most searched daily figures for residents and businesses
            across the province — from gold traders in {province.capital}'s bazaars to fuel stations across all {divisions.length} divisions.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {RATES.map(r => (
              <div key={r.label} className="rounded-xl p-4 border flex items-center justify-between"
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                <div>
                  <div className="text-gray-400 text-xs">{r.label}</div>
                  <div className="text-white font-bold text-sm mt-0.5">{r.value}</div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {r.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {r.change}
                </div>
              </div>
            ))}
          </div>
          <Link href={`/${province.countrySlug}/${province.slug}/${province.capital.toLowerCase()}/rates`}
            className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: accent }}>
            Full rates & 30-day history <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.section>

        {/* ── 7. NEWS ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Newspaper} title={`${province.name} Today`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            The latest from {province.name} — provincial government news, city-level developments across the major
            urban centres, and cultural and sports events happening across the province right now.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: accent }}>🏛️ Provincial News</div>
              <div className="space-y-3">
                {[`${province.name} budget approved by provincial assembly`,
                  `New development projects launched across ${province.name} districts`,
                  `${province.capital} infrastructure expansion plan announced`].map((h, i) => (
                  <div key={i} className="flex gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-gray-600 text-xs mt-0.5 w-3">{i + 1}</span>
                    <p className="text-gray-300 text-sm leading-snug">{h}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
              <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: accent }}>🏙️ City News from {province.name}</div>
              <div className="space-y-3">
                {[`${cities[0]?.name}: Air quality update for the city`,
                  `${cities[1]?.name}: Economic activity report this week`,
                  `${cities[2]?.name}: Cultural event draws large crowds`].map((h, i) => (
                  <div key={i} className="flex gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-gray-600 text-xs mt-0.5 w-3">{i + 1}</span>
                    <p className="text-gray-300 text-sm leading-snug">{h}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── 8. ECONOMY ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
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
                  {(province.population / 231000000 * 100).toFixed(1)}%
                </div>
                <div className="text-gray-400 text-sm">
                  of {province.country}'s total population of 231M lives in {province.name}.
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
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
          <p className="text-gray-500 text-sm leading-relaxed mt-5">
            {generateProvinceGrowthAfter(province.name, province.country)}
          </p>
        </motion.section>

        {/* ── 8c. COST OF LIVING ── */}
        {cities.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader icon={TrendingUp} title={`Cost of Living Across ${province.name}`} accent={accent} />
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {generateCostOfLivingParagraph(province.name)}
            </p>
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: cardBorder }}>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b" style={{ borderColor: cardBorder }}>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Relative Cost Index</th>
                    <th className="py-3 px-4">Population</th>
                  </tr>
                </thead>
                <tbody>
                  {[...cities]
                    .sort((a, b) => b.population - a.population)
                    .map((c, i) => {
                      // Cost index derived from population rank: larger cities trend higher cost of living.
                      const maxPop = cities[0] ? Math.max(...cities.map(x => x.population)) : 1;
                      const costIndex = Math.round(55 + (c.population / maxPop) * 45);
                      return (
                        <tr key={c.slug} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                          <td className="py-3 px-4 text-white font-medium">{c.name}{i === 0 ? ' (highest)' : ''}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 max-w-[120px] bg-white/5 rounded-full h-2 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${costIndex}%`, backgroundColor: accent }} />
                              </div>
                              <span className="text-gray-400 text-xs">{costIndex}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400">{c.population.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mt-5">
              {generateCostOfLivingAfter(province.name)}
            </p>
          </motion.section>
        )}

        {/* ── 9. INDUSTRIES ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
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
          <p className="text-gray-500 text-sm leading-relaxed mt-5">
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
                <div className="text-gray-600 text-xs mt-0.5">{prod.origin}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mt-3">
            {generateProductsAfter(province.name)}
          </p>
        </motion.section>

        {/* ── 11. LANDMARKS ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Mountain} title={`${province.name} Must See`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateLandmarksParagraph(province.name, province.capital)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {landmarks.map(lm => (
              <div key={lm.name} className="group rounded-2xl overflow-hidden border hover:border-opacity-60 transition-all"
                style={{ borderColor: cardBorder }}>
                <div className="relative h-36 overflow-hidden">
                  <img src={lm.image} alt={lm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.85), transparent)' }} />
                  {lm.unesco && <div className="absolute top-3 left-3 bg-amber-500/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">UNESCO</div>}
                  <div className="absolute bottom-3 left-3">
                    <div className="text-white font-bold text-sm">{lm.name}</div>
                    <div className="text-gray-300 text-xs">{lm.city} · {lm.era}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mt-5">
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
            {filteredPersonalities.map(p => (
              <div key={p.name} className="rounded-2xl p-5 border"
                style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${accent}20`, border: `2px solid ${accent}40` }}>👤</div>
                <div className="text-white font-semibold text-sm leading-tight">{p.name}</div>
                <div className="text-xs mt-1" style={{ color: accent }}>{p.profession}</div>
                <div className="text-gray-500 text-xs mt-1">Born in {p.birthCity}</div>
              </div>
            ))}
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
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Utensils} title={`${province.name} Famous Foods`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            The food of {province.name} reflects the province's geography, agricultural richness, and cultural history.
            Each dish has a story tied to a specific city, season, or tradition — and many have travelled far beyond
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
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Calendar} title={`${province.name} Events`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {province.name} hosts events spanning sports, culture, religious observances, and business across its
            cities and towns throughout the year. These events draw visitors from across {province.country} and increasingly
            from international audiences.
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
                <div className="text-gray-500 text-xs mt-1">{ev.city} · {ev.date}</div>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${accent}20`, color: accent }}>{ev.type}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── 16. EMERGENCY CONTACTS ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={ShieldAlert} title={`Emergency Contacts — ${province.name}`} accent={accent} />
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            {generateEmergencyParagraph(province.name, province.country)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {emergency.map(e => (
              <div key={e.label} className="rounded-2xl p-4 text-center border"
                style={{ backgroundColor: `${e.color}15`, borderColor: `${e.color}40` }}>
                <div className="text-2xl font-black mb-1" style={{ color: e.color }}>{e.number}</div>
                <div className="text-gray-300 text-xs">{e.label}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mt-5">
            {generateEmergencyAfter(province.name, province.country)}
          </p>
        </motion.section>

        {/* ── 17. OTHER PROVINCES ── */}
        {otherProvinces.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeader icon={Globe} title={`Other ${province.country} Provinces`} accent={accent} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
              {otherProvinces.filter(p => p.slug !== province.slug).map(op => (
                <Link key={op.slug} href={`/${province.countrySlug}/${op.slug}`}
                  className="group rounded-xl p-4 border text-center hover:border-opacity-60 transition-all"
                  style={{ backgroundColor: cardBg, borderColor: `${accent}25` }}>
                  <div className="text-white font-semibold text-sm group-hover:underline">{op.name}</div>
                  <div className="text-gray-500 text-xs mt-1">{op.tagline}</div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── 18. EXPLORE LINKS ── */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionHeader icon={Globe} title={`Explore ${province.name} in Detail`} accent={accent} />
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All Cities', href: `/${province.countrySlug}/${province.slug}/cities` },
              { label: 'Weather', href: `/${province.countrySlug}/${province.slug}/${province.capital.toLowerCase()}/weather` },
              { label: 'Prayer Times', href: `/${province.countrySlug}/${province.slug}/${province.capital.toLowerCase()}/prayer-times` },
              { label: 'Rates', href: `/${province.countrySlug}/${province.slug}/${province.capital.toLowerCase()}/rates` },
              { label: 'News', href: `/${province.countrySlug}/${province.slug}/news` },
              { label: 'Famous People', href: `/${province.countrySlug}/${province.slug}/personalities` },
              { label: 'Famous Places', href: `/${province.countrySlug}/${province.slug}/places` },
              { label: 'Economy', href: `/${province.countrySlug}/${province.slug}/economy` },
              { label: 'Heritage Products', href: `/${province.countrySlug}/${province.slug}/heritage-products` },
              { label: 'Events', href: `/${province.countrySlug}/${province.slug}/events` },
              { label: `Back to ${province.country}`, href: `/${province.countrySlug}` },
            ].map(link => (
              <Link key={link.label} href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:text-white"
                style={{ backgroundColor: `${accent}10`, borderColor: `${accent}35`, color: accent }}>
                {link.label}
              </Link>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}
