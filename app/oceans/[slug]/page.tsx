'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Thermometer, Waves, Wind, Anchor, Fish, Ship, AlertTriangle, Globe, TrendingUp, TrendingDown, ExternalLink, Calendar, Users, Building, Droplets, Activity, Anchor as AnchorIcon, Home } from 'lucide-react';

interface Ocean {
  name: string;
  slug: string;
  image: string;
  area: number;
  avgDepth: number;
  maxDepth: number;
  marineConditions: {
    temperature: number;
    waveHeight: number;
    windSpeed: number;
    swells: string;
    visibility: string;
    lastUpdated: string;
  };
  conditionsRating: {
    shipping: { rating: string; score: number; status: string };
    swimming: { rating: string; score: number; status: string };
    diving: { rating: string; score: number; status: string };
    fishing: { rating: string; score: number; status: string };
    boating: { rating: string; score: number; status: string };
  };
  history: string;
  geography: string;
  marineLife: {
    mammals: string[];
    fish: string[];
    endangeredSpecies: string[];
  };
  shipping: {
    importance: string;
    majorPorts: { name: string; country: string; throughput: string }[];
    majorRoutes: string[];
  };
  monsoonPatterns: {
    seasons: { name: string; months: string; description: string }[];
    impact: string;
  };
  climateChange: {
    impact: string;
    seaLevelRise: string;
    temperatureRise: string;
    effects: string[];
  };
  borderingCities: {
    name: string;
    country: string;
    slug: string;
    importance: string;
  }[];
  activities: {
    diving: string;
    cruise: string;
  };
}

const oceans: Record<string, Ocean> = {
  'pacific-ocean': {
    name: 'Pacific Ocean',
    slug: 'pacific-ocean',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600',
    area: 165250000,
    avgDepth: 4280,
    maxDepth: 11000,
    marineConditions: {
      temperature: 25,
      waveHeight: 2.1,
      windSpeed: 22,
      swells: 'Moderate to Rough (2-4m)',
      visibility: 'Good (15-25m)',
      lastUpdated: new Date().toISOString(),
    },
    conditionsRating: {
      shipping: { rating: 'Excellent', score: 95, status: 'World\'s busiest shipping routes' },
      swimming: { rating: 'Moderate', score: 60, status: 'Variable, some dangerous currents' },
      diving: { rating: 'Very Good', score: 85, status: 'Excellent biodiversity' },
      fishing: { rating: 'Very Good', score: 80, status: 'Rich fish populations' },
      boating: { rating: 'Good', score: 75, status: 'Generally manageable' },
    },
    history: 'The Pacific Ocean, covering 165 million square kilometers, is the largest body of water on Earth. Named by Ferdinand Magellan in 1521 for its apparent peacefulness, it has been a vital trade route for centuries. It witnessed the Age of Exploration, connecting Asian markets with European and American ports. The Pacific Rim has become the center of global economic activity.',
    geography: 'Bounded by Asia, Australia to the west and the Americas to the east, the Pacific Ocean is dotted with thousands of islands. It contains the Mariana Trench, the deepest part of the world\'s oceans at 11,000 meters. The Ring of Fire, a horseshoe-shaped region around the Pacific, accounts for 75% of the world\'s active volcanoes.',
    marineLife: {
      mammals: ['Blue Whale', 'Humpback Whale', 'Great White Shark', 'Sea Lion', 'Sea Otter', 'Dolphin'],
      fish: ['Tuna', 'Salmon', 'Mackerel', 'Cod', 'Snapper', 'Grouper', 'Marlin'],
      endangeredSpecies: ['Blue Whale', 'Humpback Whale', 'Sea Turtle', 'Great White Shark'],
    },
    shipping: {
      importance: 'Handles over 40% of global trade. Essential routes connect Asia-Pacific with Americas and Europe.',
      majorPorts: [
        { name: 'Singapore Port', country: 'Singapore', throughput: '37.5M TEU/year' },
        { name: 'Shanghai Port', country: 'China', throughput: '47.3M TEU/year' },
        { name: 'Los Angeles Port', country: 'USA', throughput: '9.4M TEU/year' },
        { name: 'Tokyo Port', country: 'Japan', throughput: '5.0M TEU/year' },
        { name: 'Busan Port', country: 'South Korea', throughput: '21.6M TEU/year' },
        { name: 'Hong Kong Port', country: 'Hong Kong', throughput: '19.6M TEU/year' },
      ],
      majorRoutes: ['China → USA West Coast', 'Asia → Americas → Europe', 'Australia → Asia → Middle East'],
    },
    monsoonPatterns: {
      seasons: [
        {
          name: 'Northeast Monsoon',
          months: 'November - March',
          description: 'Dry season with stable winds ideal for shipping.',
        },
        {
          name: 'Southwest Monsoon',
          months: 'June - September',
          description: 'Wet season with strong winds and occasional typhoons.',
        },
        {
          name: 'Inter-Monsoon',
          months: 'April-May, October',
          description: 'Transitional periods with variable conditions.',
        },
      ],
      impact: 'Monsoons significantly affect shipping schedules and maritime trade patterns across the Pacific.',
    },
    climateChange: {
      impact: 'Rising sea levels and ocean acidification affecting island nations and marine ecosystems.',
      seaLevelRise: 'Global mean rise of 3.4mm/year, with some Pacific islands facing existential threats.',
      temperatureRise: 'Sea surface temperature increasing 0.6°C since 1990, intensifying cyclones.',
      effects: ['Coral bleaching', 'Fish migration patterns', 'Island submersion risks', 'Severe typhoons'],
    },
    borderingCities: [
      { name: 'Tokyo', country: 'Japan', slug: 'tokyo', importance: 'Major financial and shipping hub' },
      { name: 'Shanghai', country: 'China', slug: 'shanghai', importance: 'World\'s largest port' },
      { name: 'Singapore', country: 'Singapore', slug: 'singapore', importance: 'Strategic trade hub' },
      { name: 'San Francisco', country: 'USA', slug: 'san-francisco', importance: 'Major US port' },
      { name: 'Los Angeles', country: 'USA', slug: 'los-angeles', importance: 'Largest US port' },
      { name: 'Sydney', country: 'Australia', slug: 'sydney', importance: 'Major Pacific port' },
    ],
    activities: {
      diving: 'Explore coral reefs in Fiji, French Polynesia, and the Great Barrier Reef.',
      cruise: 'Luxury cruises across the Pacific, including island-hopping in the South Pacific.',
    },
  },
  'atlantic-ocean': {
    name: 'Atlantic Ocean',
    slug: 'atlantic-ocean',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600',
    area: 106460000,
    avgDepth: 3339,
    maxDepth: 8376,
    marineConditions: {
      temperature: 18,
      waveHeight: 2.5,
      windSpeed: 25,
      swells: 'Moderate to Strong (2-4m)',
      visibility: 'Moderate (10-20m)',
      lastUpdated: new Date().toISOString(),
    },
    conditionsRating: {
      shipping: { rating: 'Excellent', score: 90, status: 'Vital transatlantic trade route' },
      swimming: { rating: 'Moderate', score: 55, status: 'Cold waters, strong currents' },
      diving: { rating: 'Good', score: 70, status: 'Wrecks and marine life' },
      fishing: { rating: 'Excellent', score: 90, status: 'Rich fishing grounds' },
      boating: { rating: 'Moderate', score: 65, status: 'Variable, storm prone' },
    },
    history: 'The Atlantic Ocean was the gateway for European exploration and colonization. It connected the Old World with the New World, transforming global politics, economics, and culture. The transatlantic slave trade, colonial empires, and industrial development all centered on Atlantic commerce.',
    geography: 'The second-largest ocean, bordered by Europe and Africa to the east and the Americas to the west. The Mid-Atlantic Ridge runs down its center, producing new ocean floor. The Gulf Stream, a powerful warm current, moderates European climate.',
    marineLife: {
      mammals: ['Humpback Whale', 'North Atlantic Right Whale', 'Dolphin', 'Seal', 'Walrus'],
      fish: ['Cod', 'Herring', 'Mackerel', 'Tuna', 'Swordfish', 'Atlantic Salmon'],
      endangeredSpecies: ['North Atlantic Right Whale', 'Bluefin Tuna', 'Sea Turtle', 'Leatherback Turtle'],
    },
    shipping: {
      importance: 'Handles transatlantic trade, connecting European ports with American and Caribbean ports.',
      majorPorts: [
        { name: 'Rotterdam Port', country: 'Netherlands', throughput: '14.3M TEU/year' },
        { name: 'Hamburg Port', country: 'Germany', throughput: '8.7M TEU/year' },
        { name: 'Port of New York', country: 'USA', throughput: '6.8M TEU/year' },
        { name: 'Liverpool Port', country: 'UK', throughput: '0.9M TEU/year' },
        { name: 'Santos Port', country: 'Brazil', throughput: '3.9M TEU/year' },
      ],
      majorRoutes: ['Europe → North America', 'South America → Europe', 'Caribbean trade routes'],
    },
    monsoonPatterns: {
      seasons: [
        {
          name: 'Summer',
          months: 'June - August',
          description: 'Best conditions for transatlantic crossings with stable weather.',
        },
        {
          name: 'Winter',
          months: 'December - February',
          description: 'Stormy season with powerful Atlantic depressions and frequent gales.',
        },
        {
          name: 'Spring/Fall',
          months: 'March-May, September-November',
          description: 'Variable conditions, occasional storms.',
        },
      ],
      impact: 'Seasonality affects shipping schedules, fishing patterns, and hurricane/storm season.',
    },
    climateChange: {
      impact: 'Changing ocean currents, warming waters affecting fisheries, increased Atlantic hurricane intensity.',
      seaLevelRise: 'Rising particularly along US East Coast, threatening coastal cities.',
      temperatureRise: 'Warming disrupting fish migrations and marine ecosystems.',
      effects: ['Changing Gulf Stream', 'Fish stock decline', 'Hurricane intensification', 'Coastal erosion'],
    },
    borderingCities: [
      { name: 'New York', country: 'USA', slug: 'new-york', importance: 'Major global port' },
      { name: 'London', country: 'UK', slug: 'london', importance: 'Historic trading port' },
      { name: 'Lagos', country: 'Nigeria', slug: 'lagos', importance: 'West African hub' },
      { name: 'Miami', country: 'USA', slug: 'miami', importance: 'Caribbean gateway' },
      { name: 'Salvador', country: 'Brazil', slug: 'salvador', importance: 'South Atlantic port' },
      { name: 'Lisbon', country: 'Portugal', slug: 'lisbon', importance: 'European Atlantic port' },
    ],
    activities: {
      diving: 'Explore shipwrecks off the Irish coast, dive sites in the Caribbean.',
      cruise: 'Transatlantic crossings, Caribbean cruises, Mediterranean connections.',
    },
  },
  'indian-ocean': {
    name: 'Indian Ocean',
    slug: 'indian-ocean',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
    area: 70560000,
    avgDepth: 3963,
    maxDepth: 7725,
    marineConditions: {
      temperature: 26,
      waveHeight: 1.8,
      windSpeed: 20,
      swells: 'Light to Moderate (1-3m)',
      visibility: 'Very Good (20-30m)',
      lastUpdated: new Date().toISOString(),
    },
    conditionsRating: {
      shipping: { rating: 'Excellent', score: 88, status: 'Strategic Middle East - Asia route' },
      swimming: { rating: 'Very Good', score: 80, status: 'Warm, tropical waters' },
      diving: { rating: 'Excellent', score: 95, status: 'World-class dive destinations' },
      fishing: { rating: 'Very Good', score: 85, status: 'Rich fishing grounds' },
      boating: { rating: 'Good', score: 78, status: 'Monsoon patterns critical' },
    },
    history: 'The Indian Ocean was the center of ancient maritime trade, connecting Africa, Asia, and Arabia. Arab and Indian merchants dominated these waters for centuries, spreading Islam and commerce. It remains vital for global trade today.',
    geography: 'Bordered by Africa, Middle East, India, and Southeast Asia. Contains numerous island nations including Madagascar, Mauritius, and the Maldives. The warmest ocean, with significant monsoon circulation.',
    marineLife: {
      mammals: ['Humpback Whale', 'Spinner Dolphin', 'Dugong', 'Indian Elephant', 'Sea Turtle'],
      fish: ['Tuna', 'Grouper', 'Coral fish', 'Barracuda', 'Shark', 'Reef fish'],
      endangeredSpecies: ['Humpback Whale', 'Dugong', 'Sea Turtles', 'Whale Shark', 'Coral Reefs'],
    },
    shipping: {
      importance: 'Critical for Middle East oil transport, connecting Persian Gulf to Asia and Europe via Suez Canal.',
      majorPorts: [
        { name: 'Port Said', country: 'Egypt', throughput: '5.9M TEU/year (Suez transit)' },
        { name: 'Dubai Ports', country: 'UAE', throughput: '15.1M TEU/year' },
        { name: 'Singapore', country: 'Singapore', throughput: '37.5M TEU/year' },
        { name: 'Colombo', country: 'Sri Lanka', throughput: '7.3M TEU/year' },
        { name: 'Port Louis', country: 'Mauritius', throughput: '0.8M TEU/year' },
      ],
      majorRoutes: ['Suez Canal to Asia', 'Middle East to Europe', 'East Africa - India - Asia'],
    },
    monsoonPatterns: {
      seasons: [
        {
          name: 'Northeast Monsoon',
          months: 'November - March',
          description: 'Dry season, ideal for shipping and sailing. Trade winds support eastbound travel.',
        },
        {
          name: 'Southwest Monsoon',
          months: 'June - September',
          description: 'Wet season with strong winds and rough seas. Historically limited shipping.',
        },
        {
          name: 'Inter-Monsoon',
          months: 'April-May, October',
          description: 'Transitional periods, variable winds and occasional cyclones.',
        },
      ],
      impact: 'Monsoons controlled historical trade patterns and still influence maritime activities.',
    },
    climateChange: {
      impact: 'Rising sea levels threatening island nations, coral bleaching, cyclone intensification.',
      seaLevelRise: 'Rising 3.3mm/year, particularly affecting small island developing states.',
      temperatureRise: 'Warming causing fish migration and ecosystem shifts.',
      effects: ['Coral bleaching', 'Island submersion', 'Cyclone intensification', 'Fish stock decline'],
    },
    borderingCities: [
      { name: 'Mumbai', country: 'India', slug: 'mumbai', importance: 'Major port city' },
      { name: 'Dubai', country: 'UAE', slug: 'dubai', importance: 'Global shipping hub' },
      { name: 'Singapore', country: 'Singapore', slug: 'singapore', importance: 'Strategic port' },
      { name: 'Colombo', country: 'Sri Lanka', slug: 'colombo', importance: 'Hub port' },
      { name: 'Dar es Salaam', country: 'Tanzania', slug: 'dar-es-salaam', importance: 'East African port' },
      { name: 'Port Elizabeth', country: 'South Africa', slug: 'port-elizabeth', importance: 'South African port' },
    ],
    activities: {
      diving: 'Maldives reef diving, Seychelles underwater exploration, Madagascar marine life.',
      cruise: 'Luxury Indian Ocean cruises, island-hopping in Maldives and Mauritius.',
    },
  },
  'arctic-ocean': {
    name: 'Arctic Ocean',
    slug: 'arctic-ocean',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
    area: 14060000,
    avgDepth: 1038,
    maxDepth: 5450,
    marineConditions: {
      temperature: -2,
      waveHeight: 1.0,
      windSpeed: 15,
      swells: 'Light (1-2m)',
      visibility: 'Poor (5-10m) due to ice',
      lastUpdated: new Date().toISOString(),
    },
    conditionsRating: {
      shipping: { rating: 'Moderate', score: 40, status: 'Emerging route, ice conditions critical' },
      swimming: { rating: 'Poor', score: 5, status: 'Extremely dangerous, severe cold' },
      diving: { rating: 'Moderate', score: 50, status: 'Technical, polar expedition diving only' },
      fishing: { rating: 'Good', score: 70, status: 'Rich Arctic fisheries' },
      boating: { rating: 'Poor', score: 20, status: 'Ice navigation required' },
    },
    history: 'The Arctic was historically remote and unexplored. The search for the Northwest and Northeast Passages drove polar exploration. Climate change is now opening the Arctic to new shipping routes and resource extraction.',
    geography: 'Centered on the North Pole, surrounded by Arctic regions of North America, Greenland, Europe, and Russia. Covered largely by sea ice that varies seasonally. The shallowest ocean, averaging just 1,038 meters.',
    marineLife: {
      mammals: ['Polar Bear', 'Arctic Seal', 'Walrus', 'Beluga Whale', 'Narwhal', 'Arctic Fox'],
      fish: ['Arctic Cod', 'Arctic Char', 'Halibut', 'Pollock', 'Greenland Shark'],
      endangeredSpecies: ['Polar Bear', 'Beluga Whale', 'Narwhal', 'Bowhead Whale', 'Walrus'],
    },
    shipping: {
      importance: 'Emerging route connecting Asia and Europe via Arctic passages, reducing voyage distances by 40%.',
      majorPorts: [
        { name: 'Murmansk', country: 'Russia', throughput: '0.5M TEU/year' },
        { name: 'Reykjavik', country: 'Iceland', throughput: '0.1M TEU/year' },
        { name: 'Tromsø', country: 'Norway', throughput: '0.05M TEU/year' },
      ],
      majorRoutes: ['Northwest Passage (Canada)', 'Northeast Passage (Russia)', 'Suez alternative'],
    },
    monsoonPatterns: {
      seasons: [
        {
          name: 'Arctic Summer',
          months: 'June - August',
          description: 'Brief ice-free season, 24-hour daylight, best navigation window.',
        },
        {
          name: 'Arctic Winter',
          months: 'November - March',
          description: 'Polar night, maximum ice coverage, navigation extremely difficult.',
        },
        {
          name: 'Transition Seasons',
          months: 'April-May, September-October',
          description: 'Ice forming/breaking, rapid weather changes.',
        },
      ],
      impact: 'Ice conditions dictate all Arctic shipping. Global warming is extending navigable seasons.',
    },
    climateChange: {
      impact: 'Rapid warming (twice global average), sea ice loss, ecosystem disruption, opening new shipping routes.',
      seaLevelRise: 'Arctic ice melt contributes to global sea level rise.',
      temperatureRise: 'Arctic warming 2-4°C faster than global average, transforming the region.',
      effects: ['Sea ice disappearance', 'Polar bear habitat loss', 'Fish migration changes', 'New shipping routes', 'Methane release'],
    },
    borderingCities: [
      { name: 'Murmansk', country: 'Russia', slug: 'murmansk', importance: 'Arctic gateway' },
      { name: 'Reykjavik', country: 'Iceland', slug: 'reykjavik', importance: 'North Atlantic hub' },
      { name: 'Tromsø', country: 'Norway', slug: 'tromso', importance: 'Northern Norway' },
      { name: 'Anchorage', country: 'USA', slug: 'anchorage', importance: 'Alaska gateway' },
      { name: 'Greenland', country: 'Greenland', slug: 'nuuk', importance: 'Arctic explorer base' },
    ],
    activities: {
      diving: 'Extreme polar diving expeditions, underwater ice formations.',
      cruise: 'Arctic expedition cruises, Northern Lights viewing, polar exploration.',
    },
  },
  'southern-ocean': {
    name: 'Southern Ocean',
    slug: 'southern-ocean',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600',
    area: 21960000,
    avgDepth: 3839,
    maxDepth: 7235,
    marineConditions: {
      temperature: 5,
      waveHeight: 4.5,
      windSpeed: 45,
      swells: 'Rough to Very Rough (4-8m)',
      visibility: 'Moderate (10-15m)',
      lastUpdated: new Date().toISOString(),
    },
    conditionsRating: {
      shipping: { rating: 'Moderate', score: 50, status: 'Dangerous, severe weather conditions' },
      swimming: { rating: 'Poor', score: 10, status: 'Extreme cold, lethal conditions' },
      diving: { rating: 'Good', score: 75, status: 'Extreme diving, technical expertise required' },
      fishing: { rating: 'Very Good', score: 85, status: 'Rich Antarctic fisheries' },
      boating: { rating: 'Poor', score: 30, status: 'Severe weather, expert navigation only' },
    },
    history: 'The Southern Ocean surrounds Antarctica, one of Earth\'s last unexplored frontiers. It was a major whaling ground in the 19th and 20th centuries. Today it\'s heavily protected by international treaties.',
    geography: 'Circles Antarctica, containing the Drake Passage, one of the world\'s most notorious sea routes. The coldest, windiest, and roughest ocean. Characterized by the Antarctic Circumpolar Current.',
    marineLife: {
      mammals: ['Antarctic Whale', 'Leopard Seal', 'Weddell Seal', 'Fur Seal', 'Sea Lion'],
      fish: ['Antarctic Toothfish', 'Antarctic Cod', 'Antarctic Icefish'],
      endangeredSpecies: ['Antarctic Whale', 'Leopard Seal', 'Antarctic Penguin species'],
    },
    shipping: {
      importance: 'Limited shipping, primarily research vessels and Antarctic tourism. Drake Passage is notorious for rough seas.',
      majorPorts: [
        { name: 'Ushuaia', country: 'Argentina', throughput: 'Gateway to Antarctica' },
        { name: 'Lyttelton', country: 'New Zealand', throughput: 'Antarctic support' },
        { name: 'Punta Arenas', country: 'Chile', throughput: 'Antarctic operations' },
      ],
      majorRoutes: ['Drake Passage (South America to Antarctica)', 'Antarctic research expeditions'],
    },
    monsoonPatterns: {
      seasons: [
        {
          name: 'Antarctic Summer',
          months: 'November - March',
          description: 'Brief season with less ice, 24-hour daylight, most navigation possible.',
        },
        {
          name: 'Antarctic Winter',
          months: 'May - September',
          description: 'Extreme cold, maximum ice, polar night, virtually no shipping.',
        },
        {
          name: 'Shoulder Seasons',
          months: 'April, October',
          description: 'Transition periods, rapidly changing conditions.',
        },
      ],
      impact: 'Extreme seasonality limits activity almost entirely to southern summer.',
    },
    climateChange: {
      impact: 'Warming causing ice shelf collapse, ecosystem changes, shifting wildlife patterns.',
      seaLevelRise: 'Antarctic ice sheet melt is major contributor to global sea level rise.',
      temperatureRise: 'Antarctic warming affecting ice stability and ocean circulation.',
      effects: ['Ice shelf collapse', 'Sea level rise acceleration', 'Penguin population changes', 'Fish redistribution'],
    },
    borderingCities: [
      { name: 'Ushuaia', country: 'Argentina', slug: 'ushuaia', importance: 'Antarctica gateway' },
      { name: 'Punta Arenas', country: 'Chile', slug: 'punta-arenas', importance: 'Antarctic hub' },
      { name: 'Christchurch', country: 'New Zealand', slug: 'christchurch', importance: 'Ross Sea access' },
      { name: 'Hobart', country: 'Australia', slug: 'hobart', importance: 'Southern base' },
      { name: 'Port Stanley', country: 'Falkland Islands', slug: 'port-stanley', importance: 'South Atlantic' },
    ],
    activities: {
      diving: 'Antarctic expedition diving, underwater ice formations, seal and whale watching.',
      cruise: 'Antarctic expedition cruises, polar wildlife tours, Drake Passage voyages.',
    },
  },
};

export default function OceanPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [ocean, setOcean] = useState<Ocean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOcean(oceans[slug] || null);
      setLoading(false);
    }, 600);
  }, [slug]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!ocean) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Ocean not found</div>;
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Very Good':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Moderate':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[50vh] overflow-hidden"
      >
        <img
          src={ocean.image}
          alt={ocean.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-blue-900/70 to-gray-900/90" />

        <div className="absolute top-4 left-4">
          <div className="bg-blue-600/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <span className="font-semibold text-white">Ocean / Sea</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {ocean.name}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <div className="backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-100">Surface Area</div>
                <div className="font-semibold">{(ocean.area / 1000000).toFixed(2)}M km²</div>
              </div>
              <div className="backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-100">Average Depth</div>
                <div className="font-semibold">{ocean.avgDepth.toLocaleString()}m</div>
              </div>
              <div className="backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-100">Max Depth</div>
                <div className="font-semibold">{ocean.maxDepth.toLocaleString()}m</div>
              </div>
              <div className="backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-100">Conditions</div>
                <div className="font-semibold">{ocean.marineConditions.swells}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Live Sea Conditions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Waves className="w-7 h-7 text-blue-600" />
              Live Sea Conditions
            </h2>
            <div className="text-sm text-gray-500">
              Updated: {new Date(ocean.marineConditions.lastUpdated).toLocaleTimeString()}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-5">
              <Thermometer className="w-6 h-6 text-red-600 mb-2" />
              <div className="text-xs text-gray-600 mb-1">Temperature</div>
              <div className="text-2xl font-bold text-gray-900">{ocean.marineConditions.temperature}°C</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <Waves className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-xs text-gray-600 mb-1">Wave Height</div>
              <div className="text-2xl font-bold text-gray-900">{ocean.marineConditions.waveHeight}m</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-200 rounded-xl p-5">
              <Wind className="w-6 h-6 text-cyan-600 mb-2" />
              <div className="text-xs text-gray-600 mb-1">Wind Speed</div>
              <div className="text-2xl font-bold text-gray-900">{ocean.marineConditions.windSpeed} km/h</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-5">
              <Droplets className="w-6 h-6 text-purple-600 mb-2" />
              <div className="text-xs text-gray-600 mb-1">Visibility</div>
              <div className="text-2xl font-bold text-gray-900">{ocean.marineConditions.visibility}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
              <Activity className="w-6 h-6 text-green-600 mb-2" />
              <div className="text-xs text-gray-600 mb-1">Swells</div>
              <div className="text-xl font-bold text-gray-900">{ocean.marineConditions.swells}</div>
            </div>
          </div>
        </motion.section>

        {/* Conditions Rating */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Conditions Rating</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(ocean.conditionsRating).map(([key, value]) => (
              <div key={key} className={`bg-white rounded-xl p-5 border ${getRatingColor(value.rating)}`}>
                <div className="flex items-center gap-2 mb-3">
                  {key === 'shipping' && <Ship className="w-5 h-5" />}
                  {key === 'swimming' && <Droplets className="w-5 h-5" />}
                  {key === 'diving' && <Anchor className="w-5 h-5" />}
                  {key === 'fishing' && <Fish className="w-5 h-5" />}
                  {key === 'boating' && <AnchorIcon className="w-5 h-5" />}
                  <span className="font-semibold capitalize text-gray-900">{key}</span>
                </div>
                <div className="text-3xl font-bold mb-1">{value.score}%</div>
                <div className="text-sm font-medium mb-2">{value.rating}</div>
                <div className="text-xs text-gray-600">{value.status}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* History & Geography */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Globe className="w-7 h-7 text-indigo-600" />
                History
              </h2>
              <p className="text-gray-700 leading-relaxed">{ocean.history}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-red-600" />
                Geography
              </h2>
              <p className="text-gray-700 leading-relaxed">{ocean.geography}</p>
            </div>
          </div>
        </motion.section>

        {/* Marine Life */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Fish className="w-7 h-7 text-cyan-600" />
            Marine Life
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mammals */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Marine Mammals
              </h3>
              <ul className="space-y-1.5">
                {ocean.marineLife.mammals.map((mammal, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    {mammal}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fish */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Fish className="w-5 h-5 text-emerald-600" />
                Fish Species
              </h3>
              <ul className="space-y-1.5">
                {ocean.marineLife.fish.map((fish, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                    {fish}
                  </li>
                ))}
              </ul>
            </div>

            {/* Endangered Species */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Endangered Species
              </h3>
              <ul className="space-y-1.5">
                {ocean.marineLife.endangeredSpecies.map((species, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                    {species}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Shipping Importance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Ship className="w-7 h-7 text-gray-700" />
            Shipping Importance
          </h2>

          <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{ocean.shipping.importance}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Major Ports */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Major Ports</h3>
              <div className="space-y-3">
                {ocean.shipping.majorPorts.map((port, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="font-semibold text-gray-900">{port.name}</div>
                    <div className="text-sm text-gray-600">{port.country}</div>
                    <div className="text-sm text-gray-500 mt-1">{port.throughput}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Major Routes */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Major Shipping Routes</h3>
              <div className="space-y-2">
                {ocean.shipping.majorRoutes.map((route, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-gray-200 flex items-start gap-2">
                    <Anchor className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{route}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Monsoon Patterns */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-indigo-600" />
            Monsoon & Seasonal Patterns
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {ocean.monsoonPatterns.seasons.map((season, i) => (
              <div key={i} className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5">
                <div className="font-semibold text-gray-900 mb-1">{season.name}</div>
                <div className="text-sm text-indigo-600 mb-2">{season.months}</div>
                <div className="text-sm text-gray-700">{season.description}</div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">Historical Impact</h3>
            <p className="text-amber-800 text-sm">{ocean.monsoonPatterns.impact}</p>
          </div>
        </motion.section>

        {/* Climate Change Impact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6"
        >
          <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-red-600" />
            Climate Change Impact
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-gray-900">Temperature Rise</span>
              </div>
              <p className="text-gray-700 text-sm">{ocean.climateChange.temperatureRise}</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-gray-900">Sea Level Rise</span>
              </div>
              <p className="text-gray-700 text-sm">{ocean.climateChange.seaLevelRise}</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-gray-900">Overall Impact</span>
              </div>
              <p className="text-gray-700 text-sm">{ocean.climateChange.impact}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-red-200">
            <h3 className="font-semibold text-gray-900 mb-3">Effects</h3>
            <ul className="space-y-2">
              {ocean.climateChange.effects.map((effect, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                  <TrendingDown className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  {effect}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Bordering Cities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Building className="w-7 h-7 text-gray-700" />
            Bordering Cities
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ocean.borderingCities.map((city, i) => (
              <motion.a
                key={i}
                href={`/${city.country.toLowerCase().replace(/\s+/g, '-')}/${city.slug}`}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-600">{city.country}</div>
                    <div className="text-xs text-gray-500 mt-1">{city.importance}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Activities */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.a
            href={`https://www.viator.com/searchResults/all?text=${encodeURIComponent(ocean.name + ' diving')}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl p-6 text-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-semibold text-lg">Diving Tours</div>
                <div className="text-cyan-100 text-sm">Explore underwater world</div>
              </div>
              <ExternalLink className="w-5 h-5" />
            </div>
            <p className="text-sm text-cyan-100">{ocean.activities.diving}</p>
          </motion.a>

          <motion.a
            href={`https://www.viator.com/searchResults/all?text=${encodeURIComponent(ocean.name + ' cruise')}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-semibold text-lg">Cruise Packages</div>
                <div className="text-indigo-100 text-sm">Luxury sea voyages</div>
              </div>
              <ExternalLink className="w-5 h-5" />
            </div>
            <p className="text-sm text-indigo-100">{ocean.activities.cruise}</p>
          </motion.a>
        </motion.section>

      </div>

      {/* Back to Homepage */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Homepage
        </a>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-[50vh] bg-gray-300"></div>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 h-40"></div>
        ))}
      </div>

      {/* Back to Homepage */}
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Home className="w-5 h-5" />
          Back to Homepage
        </a>
      </div>
    </div>
  );
}
