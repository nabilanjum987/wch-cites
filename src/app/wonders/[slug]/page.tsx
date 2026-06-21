'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin, Clock, Sun, Cloud, Camera, Calendar, Info, ExternalLink, Shirt, DollarSign, AlertCircle, Car, Building, Sunset, Lightbulb, Star, BookOpen } from 'lucide-react';
import {
  generateVisitorGuideParagraph, generateVisitorGuideAfter,
  generateStoryParagraph, generateStoryAfter,
  generateArchitectureParagraph, generateArchitectureAfter,
  generateFactsParagraph, generateFactsAfter,
  generatePhotographyParagraph, generatePhotographyAfter,
  generateNearbyParagraph, generateNearbyAfter,
} from '@/lib/paragraphs/wonders';

interface Wonder {
  name: string;
  slug: string;
  category: string;
  image: string;
  location: {
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  unescoStatus: string;
  established: string;
  isOpen: boolean;
  openingHours: string;
  currentWeather: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    icon: string;
  };
  bestVisitingTime: {
    recommendation: string;
    goldenHour: { morning: string; evening: string };
    tip: string;
  };
  visitorGuide: {
    whatToWear: string[];
    fees: { type: string; price: string }[];
    rules: string[];
    gettingThere: { method: string; details: string }[];
  };
  history: {
    wikipedia: string;
    fullStory: string;
  };
  architecture: {
    uniqueFeatures: string[];
    dimensions: { aspect: string; value: string }[];
    materials: string[];
    geniusMoments: string[];
  };
  surprisingFacts: string[];
  photographyGuide: {
    bestSpots: { spot: string; description: string }[];
    bestTimeToday: string;
    tips: string[];
  };
  nearbyWonders: {
    name: string;
    slug: string;
    image: string;
    distance: string;
  }[];
  allWonders: {
    name: string;
    slug: string;
    image: string;
  }[];
}

const mockWonder: Wonder = {
  name: 'Taj Mahal',
  slug: 'taj-mahal',
  category: 'New Seven Wonder',
  image: 'https://images.unsplash.com/photo-1564507592333-fa34c3f8e56d?w=1600',
  location: {
    city: 'Agra',
    country: 'India',
    coordinates: { lat: 27.1751, lng: 78.0421 },
  },
  unescoStatus: 'UNESCO World Heritage Site (1983)',
  established: '1632-1653',
  isOpen: true,
  openingHours: '6:00 AM - 6:30 PM (Closed Fridays)',
  currentWeather: {
    temp: 32,
    condition: 'Partly Cloudy',
    humidity: 45,
    wind: 12,
    icon: '⛅',
  },
  bestVisitingTime: {
    recommendation: 'Visit early morning (6-8 AM) or late afternoon (4-6 PM) for best lighting and fewer crowds',
    goldenHour: { morning: '6:15 AM - 7:00 AM', evening: '5:30 PM - 6:15 PM' },
    tip: 'Full moon nights offer special viewing experiences (tickets required)',
  },
  visitorGuide: {
    whatToWear: [
      'Comfortable walking shoes',
      'Light, breathable clothing (respectful dress)',
      'Hat and sunglasses',
      'Sunscreen recommended',
    ],
    fees: [
      { type: 'Foreign Tourist', price: '₹1100 ($13)' },
      { type: 'Domestic Tourist', price: '₹50 ($0.60)' },
      { type: 'Moonlight Viewing', price: '₹2000 ($24)' },
    ],
    rules: [
      'No tripods or professional cameras without permit',
      'No food inside the mausoleum',
      'No touching of marble surfaces',
      'Maintain silence in inner chambers',
      'Drones strictly prohibited',
    ],
    gettingThere: [
      { method: 'Train', details: 'Agra Cantt Railway Station - 20 mins auto ride' },
      { method: 'Flight', details: 'Delhi Airport (DEL) - 3 hour drive or 2 hour train' },
      { method: 'Road', details: 'Yamuna Expressway from Delhi - 230 km, well-maintained' },
    ],
  },
  history: {
    wikipedia: 'https://en.wikipedia.org/wiki/Taj_Mahal',
    fullStory: 'The Taj Mahal was commissioned in 1632 by the Mughal Emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal, who died during childbirth. The tomb is the central focus of the entire complex, a large, white marble structure standing on a square plinth, consisting of a symmetrical building with an arch-shaped doorway topped by a large dome. Construction employed 20,000 artisans under the guidance of a board of architects led by Ustad Ahmad Lahauri. The Taj Mahal complex took 22 years to complete, with the mausoleum itself finished in 1648 and the surrounding buildings completed in 1653. A project that exemplified the Mughal Empire\'s cultural sophistication, the Taj Mahal influenced the design of numerous later buildings, both in India and abroad.',
  },
  architecture: {
    uniqueFeatures: [
      'Perfect symmetry in all directions',
      'Minarets tilt outward to protect the tomb from earthquake damage',
      'Pietra dura inlay work with 28 types of gemstones',
      'Calligraphy that appears to change size when viewed from below',
      'Self-cleaning marble that repels dirt',
    ],
    dimensions: [
      { aspect: 'Height', value: '73 meters (240 feet)' },
      { aspect: 'Dome Diameter', value: '17 meters (56 feet)' },
      { aspect: 'Minaret Height', value: '41 meters (135 feet)' },
      { aspect: 'Complex Area', value: '17 hectares (42 acres)' },
    ],
    materials: [
      'White Makrana marble from Rajasthan',
      'Jasper from Punjab',
      'Jade from China',
      'Turquoise from Tibet',
      'Lapis lazuli from Afghanistan',
      'Sapphires from Sri Lanka',
    ],
    geniusMoments: [
      'The dome changes color based on daylight - pink at dawn, white at noon, golden at dusk',
      'Optical illusions make the calligraphy appear proportional from ground level',
      'Self-supporting double dome structure - outer for beauty, inner for height',
      'Reflecting pool designed to create mirror image of the entire monument',
      'Acoustic design allows whispers to travel clearly in the inner dome',
    ],
  },
  surprisingFacts: [
    'The Taj Mahal cost approximately 32 million rupees in 1653, equivalent to about $1 billion today',
    'British soldiers defaced the Taj during the Indian Rebellion of 1857, chipping off precious stones',
    'A full-scale replica exists in Bangladesh, built in 8 years for $58 million',
    'During WWII and India-Pakistan wars, the dome was covered with bamboo scaffolding to disguise it',
    'The Taj is a solar aligned monument - the central arch frames the rising sun at summer solstice',
  ],
  photographyGuide: {
    bestSpots: [
      { spot: 'Diana Bench', description: 'Iconic view from the reflecting pool with perfect symmetry' },
      { spot: 'Mehtab Bagh', description: 'Across the Yamuna River for the classic back view at sunset' },
      { spot: 'Mosque Side', description: 'Morning light illuminates the red sandstone mosque beautifully' },
      { spot: 'Garden Level', description: 'Eye-level shots capturing geometric garden patterns' },
    ],
    bestTimeToday: 'Today\'s best photography window: 5:30 PM - 6:15 PM (evening golden hour with good light)',
    tips: [
      'Use the reflecting pool for mirror shots',
      'Include people in foreground for scale',
      'Walk around the monument for changing perspectives',
      'Capture details of the pietra dura inlay work',
      'Sunrise shots require arriving before 6 AM',
    ],
  },
  nearbyWonders: [
    { name: 'Agra Fort', slug: 'agra-fort', image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=400', distance: '2.5 km' },
    { name: 'Fatehpur Sikri', slug: 'fatehpur-sikri', image: 'https://images.unsplash.com/photo-1587474f7f31-6cb5-88e1-c7a076b0c39b?w=400', distance: '36 km' },
    { name: 'Tomb of Akbar', slug: 'tomb-of-akbar', image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=400', distance: '10 km' },
    { name: 'Mehtab Bagh', slug: 'mehtab-bagh', image: 'https://images.unsplash.com/photo-1564507592333-fa34c3f8e56d?w=400', distance: '500 m' },
  ],
  allWonders: [
    { name: 'Great Wall of China', slug: 'great-wall-of-china', image: 'https://images.unsplash.com/photo-1508804185872-e7a4e4c21e23?w=300' },
    { name: 'Petra', slug: 'petra', image: 'https://images.unsplash.com/photo-1579606042132-f7f4f4f4e4f1?w=300' },
    { name: 'Colosseum', slug: 'colosseum', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300' },
    { name: 'Chichen Itza', slug: 'chichen-itza', image: 'https://images.unsplash.com/photo-1603401058959-4d67c5a48e7c?w=300' },
    { name: 'Machu Picchu', slug: 'machu-picchu', image: 'https://images.unsplash.com/photo-1587595437289-3e4a5f8c0f1b?w=300' },
    { name: 'Christ the Redeemer', slug: 'christ-the-redeemer', image: 'https://images.unsplash.com/photo-1483729558449-99ef8e12f8f5?w=300' },
    { name: 'Taj Mahal', slug: 'taj-mahal', image: 'https://images.unsplash.com/photo-1564507592333-fa34c3f8e56d?w=300' },
  ],
};

export default function WonderPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [wonder, setWonder] = useState<Wonder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setWonder(mockWonder);
      setLoading(false);
    }, 600);
  }, [slug]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!wonder) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Wonder not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[70vh] overflow-hidden"
      >
        <img
          src={wonder.image}
          alt={wonder.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <span className="font-semibold text-gray-900">{wonder.category}</span>
          </div>
        </div>

        {wonder.unescoStatus && (
          <div className="absolute top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span className="font-semibold">{wonder.unescoStatus}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
              {wonder.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white">
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{wonder.location.city}, {wonder.location.country}</span>
              </div>
              <div className="flex items-center gap-2 backdrop-blur-sm bg-white/20 rounded-lg px-4 py-2">
                <Calendar className="w-5 h-5" />
                <span>Built {wonder.established}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Is Open Today + Current Weather */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Live Status */}
          <div className={`rounded-2xl p-6 border ${wonder.isOpen ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Is Open Today</h2>
              <div className={`px-4 py-2 rounded-full font-semibold ${wonder.isOpen ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {wonder.isOpen ? 'OPEN NOW' : 'CLOSED'}
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <span>{wonder.openingHours}</span>
            </div>
          </div>

          {/* Current Weather */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Weather at Wonder</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{wonder.currentWeather.icon}</span>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{wonder.currentWeather.temp}°C</div>
                  <div className="text-gray-600">{wonder.currentWeather.condition}</div>
                </div>
              </div>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4" />
                  <span>Humidity: {wonder.currentWeather.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <span>Wind: {wonder.currentWeather.wind} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Best Visiting Time */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sunset className="w-6 h-6 text-amber-600" />
            Best Visiting Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p className="text-gray-800 text-lg mb-4">{wonder.bestVisitingTime.recommendation}</p>
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="font-semibold text-gray-900 mb-2">Golden Hours Today</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-600" />
                    <span>Morning: {wonder.bestVisitingTime.goldenHour.morning}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sunset className="w-5 h-5 text-orange-600" />
                    <span>Evening: {wonder.bestVisitingTime.goldenHour.evening}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Pro Tip</div>
                  <p className="text-gray-700 text-sm">{wonder.bestVisitingTime.tip}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Visitor Guide Today */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Info className="w-7 h-7 text-blue-600" />
            Visitor Guide Today
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateVisitorGuideParagraph(wonder.name)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* What to Wear */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shirt className="w-5 h-5 text-purple-600" />
                What to Wear
              </h3>
              <ul className="space-y-2">
                {wonder.visitorGuide.whatToWear.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Fees */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Entrance Fees
              </h3>
              <div className="space-y-2">
                {wonder.visitorGuide.fees.map((fee, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">{fee.type}</div>
                    <div className="font-bold text-gray-900">{fee.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Important Rules
              </h3>
              <ul className="space-y-2">
                {wonder.visitorGuide.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2"></div>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Getting There */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Getting There
              </h3>
              <div className="space-y-2">
                {wonder.visitorGuide.gettingThere.map((route, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="font-semibold text-gray-900 text-sm">{route.method}</div>
                    <div className="text-xs text-gray-600 mt-1">{route.details}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateVisitorGuideAfter(wonder.name)}
          </p>
        </motion.section>

        {/* The Story */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            The Story
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-4">
            {generateStoryParagraph(wonder.name, wonder.location.city)}
          </p>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="leading-relaxed">{wonder.history.fullStory}</p>
          </div>
          <a
            href={wonder.history.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Read more on Wikipedia
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-gray-600 leading-relaxed text-sm mt-4">
            {generateStoryAfter(wonder.name)}
          </p>
        </motion.section>

        {/* Architecture */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Building className="w-7 h-7 text-gray-700" />
            Architecture
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateArchitectureParagraph(wonder.name)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Unique Features */}
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Unique Features</h3>
              <ul className="space-y-2">
                {wonder.architecture.uniqueFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dimensions */}
            <div className="bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Dimensions</h3>
              <div className="grid grid-cols-2 gap-3">
                {wonder.architecture.dimensions.map((dim, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600">{dim.aspect}</div>
                    <div className="font-bold text-gray-900">{dim.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-lg p-5 border border-gray-200 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Materials Used</h3>
            <div className="flex flex-wrap gap-2">
              {wonder.architecture.materials.map((material, i) => (
                <span key={i} className="px-3 py-2 bg-indigo-50 text-indigo-900 rounded-lg text-sm font-medium border border-indigo-200">
                  {material}
                </span>
              ))}
            </div>
          </div>

          {/* Genius Moments */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Genius Moments
            </h3>
            <ul className="space-y-3">
              {wonder.architecture.geniusMoments.map((moment, i) => (
                <li key={i} className="flex items-start gap-3 text-amber-900">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mt-2"></div>
                  {moment}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateArchitectureAfter(wonder.name)}
          </p>
        </motion.section>

        {/* 5 Surprising Facts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Lightbulb className="w-7 h-7 text-amber-500" />
            5 Surprising Facts
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateFactsParagraph(wonder.name)}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {wonder.surprisingFacts.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-3xl font-bold text-indigo-300 mb-3">{i + 1}</div>
                <p className="text-gray-800 text-sm leading-relaxed">{fact}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateFactsAfter(wonder.name)}
          </p>
        </motion.section>

        {/* Photography Guide Today */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Camera className="w-7 h-7 text-rose-600" />
            Photography Guide Today
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generatePhotographyParagraph(wonder.name)}
          </p>

          <div className="bg-white rounded-xl p-5 mb-6 border border-rose-200">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-gray-900">Best Time Today</span>
            </div>
            <p className="text-gray-700">{wonder.photographyGuide.bestTimeToday}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Best Spots */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Best Photo Spots</h3>
              <div className="space-y-3">
                {wonder.photographyGuide.bestSpots.map((spot, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-rose-200">
                    <div className="font-semibold text-gray-900">{spot.spot}</div>
                    <div className="text-sm text-gray-600 mt-1">{spot.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photography Tips */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Tips for Great Shots</h3>
              <ul className="space-y-2">
                {wonder.photographyGuide.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700 bg-white rounded-lg p-3 border border-rose-200">
                    <Camera className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-2">
            {generatePhotographyAfter(wonder.name)}
          </p>
        </motion.section>

        {/* Nearby Wonders */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Wonders</h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateNearbyParagraph(wonder.name, wonder.location.city)}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {wonder.nearbyWonders.map((nearby) => (
              <motion.a
                key={nearby.slug}
                href={`/wonders/${nearby.slug}`}
                whileHover={{ scale: 1.03 }}
                className="group"
              >
                <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="h-40 relative">
                    <img src={nearby.image} alt={nearby.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-semibold text-gray-700">
                      {nearby.distance}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-gray-900 text-sm">{nearby.name}</div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateNearbyAfter(wonder.name, wonder.location.city)}
          </p>
        </motion.section>

        {/* All 7 Wonders Navigation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white"
        >
          <h2 className="text-2xl font-bold mb-6">All 7 Wonders</h2>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
            {wonder.allWonders.map((w) => (
              <motion.a
                key={w.slug}
                href={`/wonders/${w.slug}`}
                whileHover={{ scale: 1.05 }}
                className={`${w.slug === wonder.slug ? 'ring-4 ring-amber-400' : ''} rounded-lg overflow-hidden`}
              >
                <div className="h-24 relative">
                  <img src={w.image} alt={w.name} className="w-full h-full object-cover" />
                  {w.slug === wonder.slug && (
                    <div className="absolute inset-0 bg-amber-400/30"></div>
                  )}
                </div>
                <div className="p-2 bg-white/10 backdrop-blur-sm">
                  <div className="text-xs font-semibold text-center truncate">{w.name}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Book Visit */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Visit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.a
              href={`https://www.viator.com/searchResults/all?text=${encodeURIComponent(wonder.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 text-white hover:shadow-lg transition-all"
            >
              <div className="font-semibold text-lg mb-1">Book Tour</div>
              <div className="text-orange-100 text-sm mb-4">Viator</div>
              <ExternalLink className="w-5 h-5" />
            </motion.a>

            <motion.a
              href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(wonder.location.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white hover:shadow-lg transition-all"
            >
              <div className="font-semibold text-lg mb-1">Book Hotel</div>
              <div className="text-blue-100 text-sm mb-4">Booking.com</div>
              <ExternalLink className="w-5 h-5" />
            </motion.a>

            <motion.a
              href={`https://www.skyscanner.com/transport/flights/to/${wonder.location.city.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl p-6 text-white hover:shadow-lg transition-all"
            >
              <div className="font-semibold text-lg mb-1">Search Flights</div>
              <div className="text-sky-100 text-sm mb-4">Skyscanner</div>
              <ExternalLink className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.section>

        {/* Link to Country Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center pb-12"
        >
          <a
            href={`/${wonder.location.country.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <MapPin className="w-5 h-5" />
            Explore {wonder.location.country}
          </a>
        </motion.div>

      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-[70vh] bg-gray-300"></div>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 h-40"></div>
        ))}
      </div>
    </div>
  );
}
