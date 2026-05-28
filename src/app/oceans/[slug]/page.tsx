'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Thermometer, Waves, Wind, Anchor, Fish, Ship, AlertTriangle, Globe, TrendingUp, TrendingDown, ExternalLink, Calendar, Users, Building, Droplets, Activity, Anchor as AnchorIcon } from 'lucide-react';

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

const mockOcean: Ocean = {
  name: 'Arabian Sea',
  slug: 'arabian-sea',
  image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600',
  area: 3862000,
  avgDepth: 2734,
  maxDepth: 4652,
  marineConditions: {
    temperature: 28,
    waveHeight: 1.5,
    windSpeed: 18,
    swells: 'Moderate (2-3m)',
    visibility: 'Good (15-20m)',
    lastUpdated: new Date().toISOString(),
  },
  conditionsRating: {
    shipping: { rating: 'Excellent', score: 90, status: 'High traffic, busy ports' },
    swimming: { rating: 'Good', score: 75, status: 'Calm waters most areas' },
    diving: { rating: 'Very Good', score: 85, status: 'Good visibility, diverse marine life' },
    fishing: { rating: 'Moderate', score: 65, status: 'Seasonal restrictions apply' },
    boating: { rating: 'Good', score: 80, status: 'Favorable conditions' },
  },
  history: 'The Arabian Sea has been a crucial maritime route for over 5000 years, connecting ancient civilizations of the Indus Valley, Mesopotamia, Egypt, and the Mediterranean. Named after Arab merchants who dominated trade routes from the 8th to 15th centuries, this body of water facilitated the exchange of spices, textiles, precious metals, and ideas between East and West. The sea witnessed the rise of great trading ports like Calicut, Hormuz, and Aden, and played a pivotal role in the spread of Islam, Buddhism, and Hinduism throughout South Asia and beyond.',
  geography: 'Located in the northwestern part of the Indian Ocean, the Arabian Sea is bounded by India to the east, Pakistan and Iran to the north, the Arabian Peninsula to the west, and the open Indian Ocean to the south. It covers approximately 3.86 million square kilometers and includes the Gulf of Oman, Gulf of Aden, and Persian Gulf connections. Major rivers including the Indus, Narmada, and Tapti drain into it, creating nutrient-rich coastal zones.',
  marineLife: {
    mammals: [
      'Blue Whale',
      'Humpback Whale',
      'Sperm Whale',
      'Bryde\'s Whale',
      'Indo-Pacific Humpback Dolphin',
      'Spinner Dolphin',
      'Dugong',
      'Finless Porpoise',
    ],
    fish: [
      'Yellowfin Tuna',
      'Skipjack Tuna',
      'King Mackerel',
      'Mahi-Mahi (Dolphinfish)',
      'Barracuda',
      'Giant Trevally',
      'Reef Shark',
      'Hammerhead Shark',
      'Manta Ray',
      'Marlin',
      'Snapper',
      'Groupers',
    ],
    endangeredSpecies: [
      'Blue Whale (Endangered)',
      'Humpback Whale (Endangered)',
      'Dugong (Vulnerable)',
      'Green Sea Turtle (Endangered)',
      'Hawksbill Turtle (Critically Endangered)',
      'Whale Shark (Endangered)',
      'Giant Grouper (Vulnerable)',
    ],
  },
  shipping: {
    importance: 'One of the world\'s busiest sea lanes, handling approximately 17% of global oil trade and 50,000+ vessel transits annually. The Arabian Sea connects the oil-rich Persian Gulf with major markets in Europe, Asia, and the Americas. Strategic chokepoints include the Strait of Hormuz (21% of world petroleum consumption passes through) and the Gulf of Aden entry point.',
    majorPorts: [
      { name: 'Jawaharlal Nehru Port', country: 'India', throughput: '5.1M TEU/year' },
      { name: 'Jebel Ali Port', country: 'UAE', throughput: '15.1M TEU/year' },
      { name: 'Mundra Port', country: 'India', throughput: '4.4M TEU/year' },
      { name: 'Karachi Port', country: 'Pakistan', throughput: '1.4M TEU/year' },
      { name: 'Mumbai Port', country: 'India', throughput: '58M tonnes/year' },
      { name: 'Salalah Port', country: 'Oman', throughput: '4.1M TEU/year' },
    ],
    majorRoutes: [
      'Strait of Hormuz → Gulf of Oman → Arabian Sea → Indian Ocean',
      'Persian Gulf → Arabian Sea → Red Sea → Suez Canal → Mediterranean',
      'Gulf of Aden → Arabian Sea → Malacca Strait → East Asia',
      'Arabian Sea → Cape of Good Hope → Atlantic Ocean',
      'Mumbai → Dubai (major container corridor)',
    ],
  },
  monsoonPatterns: {
    seasons: [
      {
        name: 'Northeast Monsoon (Winter)',
        months: 'November - March',
        description: 'Dry season with offshore winds, calm seas, ideal for shipping and fishing. Air temperature: 25-30°C.',
      },
      {
        name: 'Southwest Monsoon (Summer)',
        months: 'June - September',
        description: 'Wet season with strong onshore winds, rough seas, heavy rainfall. Waves can reach 4-6 meters. Monsoon currents reverse direction.',
      },
      {
        name: 'Inter-Monsoon Periods',
        months: 'April-May, October',
        description: 'Transitional periods with variable winds, occasional cyclones, mixed conditions. Best for sailing.',
      },
    ],
    impact: 'The monsoon cycle dictates all maritime activities, fishing seasons, and port operations. Historically, traders timed journeys by monsoon winds - sailing from Arabia to India with the northeast monsoon (Nov-Mar) and returning with the southwest monsoon (Jun-Sep). This pattern shaped commerce and culture for millennia.',
  },
  climateChange: {
    impact: 'The Arabian Sea is experiencing significant climate-related changes including accelerated warming (0.5°C increase in sea surface temperature since 1990), rising sea levels (3.2mm/year), and shifting monsoon patterns leading to unpredictable weather events.',
    seaLevelRise: 'Global mean sea level rise: 3.2mm/year. Projected additional rise of 0.3-1.0m by 2100, threatening coastal cities including Mumbai, Karachi, and Dubai with increased flooding risk.',
    temperatureRise: 'Sea surface temperature has increased by 0.5°C since 1990. Warming is intensifying cyclones and triggering more frequent harmful algal blooms, affecting fisheries and marine ecosystems.',
    effects: [
      'Intensifying cyclones - increased frequency of Category 4-5 storms',
      'Coral bleaching events - 40% of coral reefs severely damaged',
      'Fishery collapse in some areas - shifting fish populations',
      'Mangrove loss - 15% decline in coastal mangrove coverage',
      'Increased coastal erosion threatening cities',
      'Ocean acidification affecting shellfish populations',
      'Changing monsoon patterns affecting agriculture',
      'Loss of marine biodiversity hotspots',
    ],
  },
  borderingCities: [
    { name: 'Mumbai', country: 'India', slug: 'mumbai', importance: 'Major port and financial center' },
    { name: 'Karachi', country: 'Pakistan', slug: 'karachi', importance: 'Largest port in Pakistan' },
    { name: 'Dubai', country: 'UAE', slug: 'dubai', importance: 'Global trade hub' },
    { name: 'Muscat', country: 'Oman', slug: 'muscat', importance: 'Strategic port location' },
    { name: 'Kochi', country: 'India', slug: 'kochi', importance: 'Major fishing port' },
    { name: 'Gwadar', country: 'Pakistan', slug: 'gwadar', importance: 'Deep water port (CPEC)' },
  ],
  activities: {
    diving: 'Explore vibrant coral reefs in Lakshadweep Islands, wreck diving in Goa, or encounter whale sharks off the Gujarat coast.',
    cruise: 'Luxury cruises from Dubai to Mumbai, island-hopping in the Maldives, or coastal voyages along the Konkan coast.',
  },
};

export default function OceanPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [ocean, setOcean] = useState<Ocean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setOcean(mockOcean);
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
            <div className="bg-cyan- from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
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
                href={`/india/${city.slug}`}
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
    </div>
  );
}
