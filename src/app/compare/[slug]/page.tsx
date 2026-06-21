'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowLeftRight, GitCompare, Sun, Thermometer, Wind, Droplets, Clock, TrendingUp, Award, Shield, DollarSign, Building, UtensilsCrossed, GraduationCap, Heart, Bus, Theater, Landmark, Trophy, MessageSquare, Quote, ExternalLink, Home, MapPin } from 'lucide-react';
import {
  generateLiveConditionsParagraph, generateLiveConditionsAfter,
  generateComprehensiveParagraph, generateComprehensiveAfter,
  generateVerdictParagraph, generateVerdictAfter,
  generateReviewsParagraph, generateReviewsAfter,
  generateGuidesParagraph, generateGuidesAfter,
} from '@/lib/paragraphs/compare';

interface CityComparison {
  city1: {
    name: string;
    slug: string;
    country: string;
    current: {
      time: string;
      timezone: string;
      temperature: number;
      feelsLike: number;
      humidity: number;
      windSpeed: number;
      aqi: number;
      aqiLevel: string;
      prayerTimes: { name: string; time: string }[];
      goldRate: number;
      currency: string;
      currencyRate: number;
    };
    metrics: {
      costOfLiving: number;
      safetyIndex: number;
      economyJobs: number;
      cultureScore: number;
      foodScene: number;
      climate: number;
      education: number;
      healthcare: number;
      infrastructure: number;
      entertainment: number;
      heritage: number;
      overallScore: number;
    };
  };
  city2: {
    name: string;
    slug: string;
    country: string;
    current: {
      time: string;
      timezone: string;
      temperature: number;
      feelsLike: number;
      humidity: number;
      windSpeed: number;
      aqi: number;
      aqiLevel: string;
      prayerTimes: { name: string; time: string }[];
      goldRate: number;
      currency: string;
      currencyRate: number;
    };
    metrics: {
      costOfLiving: number;
      safetyIndex: number;
      economyJobs: number;
      cultureScore: number;
      foodScene: number;
      climate: number;
      education: number;
      healthcare: number;
      infrastructure: number;
      entertainment: number;
      heritage: number;
      overallScore: number;
    };
  };
  winner: {
    overall: string;
    categories: { [key: string]: string };
  };
  verdict: {
    chooseCity1: string[];
    chooseCity2: string[];
    recommendation: string;
  };
  reviews: {
    city1: string[];
    city2: string[];
  };
}

const cities = [
  { name: 'Lahore', slug: 'lahore', country: 'Pakistan' },
  { name: 'Karachi', slug: 'karachi', country: 'Pakistan' },
  { name: 'Islamabad', slug: 'islamabad', country: 'Pakistan' },
  { name: 'Faisalabad', slug: 'faisalabad', country: 'Pakistan' },
  { name: 'Rawalpindi', slug: 'rawalpindi', country: 'Pakistan' },
  { name: 'Multan', slug: 'multan', country: 'Pakistan' },
  { name: 'Peshawar', slug: 'peshawar', country: 'Pakistan' },
  { name: 'Quetta', slug: 'quetta', country: 'Pakistan' },
];

const popularPairs = [
  { city1: 'lahore', city2: 'karachi', label: 'Lahore vs Karachi' },
  { city1: 'islamabad', city2: 'karachi', label: 'Islamabad vs Karachi' },
  { city1: 'lahore', city2: 'islamabad', label: 'Lahore vs Islamabad' },
  { city1: 'faisalabad', city2: 'multan', label: 'Faisalabad vs Multan' },
];

const globalPopularComparisons = [
  { city1: 'Lahore', city2: 'Karachi', slug: 'lahore-vs-karachi' },
  { city1: 'Dubai', city2: 'Abu Dhabi', slug: 'dubai-vs-abu-dhabi' },
  { city1: 'New York', city2: 'London', slug: 'new-york-vs-london' },
  { city1: 'Toronto', city2: 'Vancouver', slug: 'toronto-vs-vancouver' },
  { city1: 'Sydney', city2: 'Melbourne', slug: 'sydney-vs-melbourne' },
  { city1: 'Berlin', city2: 'Munich', slug: 'berlin-vs-munich' },
  { city1: 'Mumbai', city2: 'Delhi', slug: 'mumbai-vs-delhi' },
  { city1: 'Jeddah', city2: 'Riyadh', slug: 'jeddah-vs-riyadh' },
  { city1: 'Bangkok', city2: 'Phuket', slug: 'bangkok-vs-phuket' },
  { city1: 'Paris', city2: 'Rome', slug: 'paris-vs-rome' },
];

const mockComparison: CityComparison = {
  city1: {
    name: 'Lahore',
    slug: 'lahore',
    country: 'Pakistan',
    current: {
      time: '3:45 PM',
      timezone: 'PKT',
      temperature: 38,
      feelsLike: 42,
      humidity: 45,
      windSpeed: 12,
      aqi: 156,
      aqiLevel: 'Unhealthy',
      prayerTimes: [
        { name: 'Fajr', time: '4:15 AM' },
        { name: 'Sunrise', time: '5:42 AM' },
        { name: 'Dhuhr', time: '12:30 PM' },
        { name: 'Asr', time: '5:15 PM' },
        { name: 'Maghrib', time: '7:02 PM' },
        { name: 'Isha', time: '8:30 PM' },
      ],
      goldRate: 243500,
      currency: 'PKR',
      currencyRate: 278.5,
    },
    metrics: {
      costOfLiving: 72,
      safetyIndex: 68,
      economyJobs: 71,
      cultureScore: 89,
      foodScene: 94,
      climate: 58,
      education: 76,
      healthcare: 70,
      infrastructure: 72,
      entertainment: 82,
      heritage: 92,
      overallScore: 75,
    },
  },
  city2: {
    name: 'Karachi',
    slug: 'karachi',
    country: 'Pakistan',
    current: {
      time: '3:45 PM',
      timezone: 'PKT',
      temperature: 35,
      feelsLike: 40,
      humidity: 78,
      windSpeed: 18,
      aqi: 142,
      aqiLevel: 'Unhealthy for Sensitive Groups',
      prayerTimes: [
        { name: 'Fajr', time: '4:20 AM' },
        { name: 'Sunrise', time: '5:48 AM' },
        { name: 'Dhuhr', time: '12:35 PM' },
        { name: 'Asr', time: '5:20 PM' },
        { name: 'Maghrib', time: '7:08 PM' },
        { name: 'Isha', time: '8:35 PM' },
      ],
      goldRate: 243800,
      currency: 'PKR',
      currencyRate: 278.5,
    },
    metrics: {
      costOfLiving: 68,
      safetyIndex: 58,
      economyJobs: 82,
      cultureScore: 74,
      foodScene: 85,
      climate: 65,
      education: 78,
      healthcare: 75,
      infrastructure: 68,
      entertainment: 78,
      heritage: 70,
      overallScore: 72,
    },
  },
  winner: {
    overall: 'Lahore',
    categories: {
      costOfLiving: 'Karachi',
      safetyIndex: 'Lahore',
      economyJobs: 'Karachi',
      cultureScore: 'Lahore',
      foodScene: 'Lahore',
      climate: 'Karachi',
      education: 'Karachi',
      healthcare: 'Karachi',
      infrastructure: 'Lahore',
      entertainment: 'Lahore',
      heritage: 'Lahore',
    },
  },
  verdict: {
    chooseCity1: [
      'Rich cultural heritage and historical sites',
      'World-famous food scene with authentic Punjabi cuisine',
      'Better safety and security environment',
      'Vibrant arts and entertainment options',
      'Family-friendly neighborhoods',
      'Modern infrastructure and roads',
    ],
    chooseCity2: [
      'Major economic hub with more job opportunities',
      'Better education institutions and universities',
      'More affordable cost of living',
      'Beach lifestyle and coastal activities',
      'Cosmopolitan atmosphere and diversity',
      'Healthcare facilities and medical tourism',
    ],
    recommendation: 'If you value culture, food, and a family-oriented lifestyle, Lahore is your best choice. However, if career growth, job opportunities, and affordable living are your priorities, Karachi offers distinct advantages. Both cities have unique strengths - the right choice depends on what matters most to you.',
  },
  reviews: {
    city1: [
      '"Moving to Lahore was the best decision - the food culture here is unmatched and the people are incredibly warm and welcoming." - Ali R.',
      '"The heritage sites like Badshahi Mosque and Lahore Fort make every weekend special. There\'s so much history everywhere." - Sara K.',
      '"Safe neighborhoods and great schools for kids. The infrastructure has improved dramatically over the past decade." - Hassan M.',
    ],
    city2: [
      '"Karachi gave my career a massive boost - the job market here is thriving and opportunities are endless." - Fatima Z.',
      '"I love the variety in Karachi - you find people from all backgrounds, amazing restaurants, and the beach life is a bonus." - Omar S.',
      '"Cost of living is more reasonable here. Started my own business with lower startup costs compared to other major cities." - Ayesha T.',
    ],
  },
};

export default function ComparePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [comparison, setComparison] = useState<CityComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity1, setSelectedCity1] = useState('lahore');
  const [selectedCity2, setSelectedCity2] = useState('karachi');

  useEffect(() => {
    if (slug) {
      const [city1, city2] = slug.split('-vs-');
      if (city1 && city2) {
        setSelectedCity1(city1);
        setSelectedCity2(city2);
      }
    }

    setTimeout(() => {
      setComparison(mockComparison);
      setLoading(false);
    }, 600);
  }, [slug]);

  const handleCompare = () => {
    if (selectedCity1 && selectedCity2 && selectedCity1 !== selectedCity2) {
      router.push(`/compare/${selectedCity1}-vs-${selectedCity2}`);
    }
  };

  const handleSwap = () => {
    const temp = selectedCity1;
    setSelectedCity1(selectedCity2);
    setSelectedCity2(temp);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-emerald-50 border-emerald-200';
    if (score >= 40) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 150) return 'text-orange-600';
    if (aqi <= 200) return 'text-red-600';
    return 'text-purple-600';
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!comparison) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">No comparison data available</div>;
  }

  const categories = [
    { key: 'costOfLiving', label: 'Cost of Living', icon: DollarSign, lower: true },
    { key: 'safetyIndex', label: 'Safety Index', icon: Shield },
    { key: 'economyJobs', label: 'Economy & Jobs', icon: TrendingUp },
    { key: 'cultureScore', label: 'Culture Score', icon: Building },
    { key: 'foodScene', label: 'Food Scene', icon: UtensilsCrossed },
    { key: 'climate', label: 'Climate', icon: Sun },
    { key: 'education', label: 'Education', icon: GraduationCap },
    { key: 'healthcare', label: 'Healthcare', icon: Heart },
    { key: 'infrastructure', label: 'Infrastructure', icon: Bus },
    { key: 'entertainment', label: 'Entertainment', icon: Theater },
    { key: 'heritage', label: 'Heritage', icon: Landmark },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            City Comparison
          </h1>
          <p className="text-gray-600">Compare cities side-by-side to find the perfect place for you</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Compare Tool */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Select Cities to Compare</h2>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">City 1</label>
              <select
                value={selectedCity1}
                onChange={(e) => setSelectedCity1(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                {cities.map((city) => (
                  <option key={city.slug} value={city.slug} disabled={city.slug === selectedCity2}>
                    {city.name}, {city.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mt-6 md:mt-8">
              <span className="text-2xl font-bold text-gray-400">VS</span>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">City 2</label>
              <select
                value={selectedCity2}
                onChange={(e) => setSelectedCity2(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                {cities.map((city) => (
                  <option key={city.slug} value={city.slug} disabled={city.slug === selectedCity1}>
                    {city.name}, {city.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mt-6 md:mt-8">
              <motion.button
                onClick={handleSwap}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftRight className="w-5 h-5" />
                <span className="hidden md:inline">Swap</span>
              </motion.button>

              <motion.button
                onClick={handleCompare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <GitCompare className="w-5 h-5" />
                Compare
              </motion.button>
            </div>
          </div>

          {/* Popular Pairs */}
          <div className="mt-6">
            <div className="text-sm text-gray-600 mb-3">Quick links - Popular comparisons:</div>
            <div className="flex flex-wrap gap-2">
              {popularPairs.map((pair) => (
                <button
                  key={`${pair.city1}-${pair.city2}`}
                  onClick={() => router.push(`/compare/${pair.city1}-vs-${pair.city2}`)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  {pair.label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Winner Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-lg p-6 md:p-8 text-center text-white"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8" />
            <span className="text-sm uppercase tracking-wide font-medium">Overall Winner</span>
          </div>
          <div className="text-4xl md:text-5xl font-bold mb-2">
            {comparison.winner.overall}
          </div>
          <div className="text-lg opacity-90">
            Score: {comparison.city1.name === comparison.winner.overall ? comparison.city1.metrics.overallScore : comparison.city2.metrics.overallScore}/100
          </div>
        </motion.section>

        {/* Live Conditions Side by Side */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">Live Conditions</h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateLiveConditionsParagraph(comparison.city1.name, comparison.city2.name)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City 1 */}
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">{comparison.city1.name}</h3>
                <div className="text-sm text-gray-600">{comparison.city1.country}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  icon={Clock}
                  label="Time"
                  value={`${comparison.city1.current.time} ${comparison.city1.current.timezone}`}
                  winner={false}
                />
                <MetricCard
                  icon={Thermometer}
                  label="Temperature"
                  value={`${comparison.city1.current.temperature}°C`}
                  subValue={`Feels ${comparison.city1.current.feelsLike}°C`}
                  winner={comparison.city1.current.temperature < comparison.city2.current.temperature}
                />
                <MetricCard
                  icon={Wind}
                  label="Wind"
                  value={`${comparison.city1.current.windSpeed} km/h`}
                  winner={false}
                />
                <MetricCard
                  icon={Droplets}
                  label="Humidity"
                  value={`${comparison.city1.current.humidity}%`}
                  winner={comparison.city1.current.humidity < comparison.city2.current.humidity}
                />
                <MetricCard
                  icon={Sun}
                  label="AQI"
                  value={comparison.city1.current.aqi.toString()}
                  subValue={comparison.city1.current.aqiLevel}
                  winner={comparison.city1.current.aqi < comparison.city2.current.aqi}
                  colorClass={getAQIColor(comparison.city1.current.aqi)}
                />
                <MetricCard
                  icon={DollarSign}
                  label="Gold Rate"
                  value={`PKR ${comparison.city1.current.goldRate.toLocaleString()}`}
                  winner={comparison.city1.current.goldRate > comparison.city2.current.goldRate}
                />
              </div>

              {/* Prayer Times */}
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Prayer Times</div>
                <div className="space-y-1">
                  {comparison.city1.current.prayerTimes.map((prayer) => (
                    <div key={prayer.name} className="flex justify-between text-sm">
                      <span className="text-gray-600">{prayer.name}</span>
                      <span className="font-medium text-gray-900">{prayer.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* City 2 */}
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">{comparison.city2.name}</h3>
                <div className="text-sm text-gray-600">{comparison.city2.country}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  icon={Clock}
                  label="Time"
                  value={`${comparison.city2.current.time} ${comparison.city2.current.timezone}`}
                  winner={false}
                />
                <MetricCard
                  icon={Thermometer}
                  label="Temperature"
                  value={`${comparison.city2.current.temperature}°C`}
                  subValue={`Feels ${comparison.city2.current.feelsLike}°C`}
                  winner={comparison.city2.current.temperature < comparison.city1.current.temperature}
                />
                <MetricCard
                  icon={Wind}
                  label="Wind"
                  value={`${comparison.city2.current.windSpeed} km/h`}
                  winner={false}
                />
                <MetricCard
                  icon={Droplets}
                  label="Humidity"
                  value={`${comparison.city2.current.humidity}%`}
                  winner={comparison.city2.current.humidity < comparison.city1.current.humidity}
                />
                <MetricCard
                  icon={Sun}
                  label="AQI"
                  value={comparison.city2.current.aqi.toString()}
                  subValue={comparison.city2.current.aqiLevel}
                  winner={comparison.city2.current.aqi < comparison.city1.current.aqi}
                  colorClass={getAQIColor(comparison.city2.current.aqi)}
                />
                <MetricCard
                  icon={DollarSign}
                  label="Gold Rate"
                  value={`PKR ${comparison.city2.current.goldRate.toLocaleString()}`}
                  winner={comparison.city2.current.goldRate > comparison.city1.current.goldRate}
                />
              </div>

              {/* Prayer Times */}
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Prayer Times</div>
                <div className="space-y-1">
                  {comparison.city2.current.prayerTimes.map((prayer) => (
                    <div key={prayer.name} className="flex justify-between text-sm">
                      <span className="text-gray-600">{prayer.name}</span>
                      <span className="font-medium text-gray-900">{prayer.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateLiveConditionsAfter(comparison.city1.name, comparison.city2.name)}
          </p>
        </motion.section>

        {/* Comprehensive Comparison Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            Comprehensive Comparison
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateComprehensiveParagraph(comparison.city1.name, comparison.city2.name)}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">{comparison.city1.name}</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">{comparison.city2.name}</th>
                  <th className="text-center py-4 px-4 font-semibold text-amber-600">Winner</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => {
                  const city1Score = comparison.city1.metrics[category.key as keyof typeof comparison.city1.metrics];
                  const city2Score = comparison.city2.metrics[category.key as keyof typeof comparison.city2.metrics];
                  const winner = category.lower
                    ? (city1Score < city2Score ? comparison.city1.name : comparison.city2.name)
                    : (city1Score > city2Score ? comparison.city1.name : comparison.city2.name);

                  return (
                    <motion.tr
                      key={category.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.03 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <category.icon className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-900">{category.label}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-8 rounded-lg border ${getScoreBg(city1Score)} ${getScoreColor(city1Score)} font-bold`}>
                          {city1Score}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-8 rounded-lg border ${getScoreBg(city2Score)} ${getScoreColor(city2Score)} font-bold`}>
                          {city2Score}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {winner === comparison.city1.name ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                            <Trophy className="w-4 h-4" />
                            {winner}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                            <Trophy className="w-4 h-4" />
                            {winner}
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Overall Scores */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`rounded-xl p-6 border-2 ${comparison.city1.name === comparison.winner.overall ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-sm text-gray-600 mb-1">{comparison.city1.name}</div>
              <div className={`text-4xl font-bold ${getScoreColor(comparison.city1.metrics.overallScore)}`}>
                {comparison.city1.metrics.overallScore}
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${comparison.city1.metrics.overallScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">VS</div>
                <div className="text-lg font-bold text-gray-400">Score</div>
              </div>
            </div>

            <div className={`rounded-xl p-6 border-2 ${comparison.city2.name === comparison.winner.overall ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-sm text-gray-600 mb-1">{comparison.city2.name}</div>
              <div className={`text-4xl font-bold ${getScoreColor(comparison.city2.metrics.overallScore)}`}>
                {comparison.city2.metrics.overallScore}
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${comparison.city2.metrics.overallScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6"
        >
          <h3 className="font-semibold text-blue-900 mb-3 text-lg">Summary</h3>
          <p className="text-blue-800 leading-relaxed">
            {comparison.winner.overall === comparison.city1.name ? (
              <>
                <strong>{comparison.city1.name}</strong> wins the overall comparison with a score of <strong>{comparison.city1.metrics.overallScore}/100</strong>.
                It excels in {Object.entries(comparison.winner.categories).filter(([, v]) => v === comparison.city1.name).slice(0, 3).map(([k]) => categories.find(c => c.key === k)?.label.toLowerCase()).join(', ')}, while {comparison.city2.name} leads in {Object.entries(comparison.winner.categories).filter(([, v]) => v === comparison.city2.name).slice(0, 3).map(([k]) => categories.find(c => c.key === k)?.label.toLowerCase()).join(', ')}.
              </>
            ) : (
              <>
                <strong>{comparison.city2.name}</strong> wins the overall comparison with a score of <strong>{comparison.city2.metrics.overallScore}/100</strong>.
                It excels in {Object.entries(comparison.winner.categories).filter(([, v]) => v === comparison.city2.name).slice(0, 3).map(([k]) => categories.find(c => c.key === k)?.label.toLowerCase()).join(', ')}, while {comparison.city1.name} leads in {Object.entries(comparison.winner.categories).filter(([, v]) => v === comparison.city1.name).slice(0, 3).map(([k]) => categories.find(c => c.key === k)?.label.toLowerCase()).join(', ')}.
              </>
            )}
          </p>
          <p className="text-gray-600 leading-relaxed text-sm mt-4">
            {generateComprehensiveAfter(comparison.city1.name, comparison.city2.name)}
          </p>
        </motion.section>

        {/* Narrative Verdict */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            Which City Should You Choose?
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateVerdictParagraph(comparison.city1.name, comparison.city2.name)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* City 1 */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 text-lg">
                Choose {comparison.city1.name} if you want:
              </h3>
              <ul className="space-y-2">
                {comparison.verdict.chooseCity1.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-start gap-2 text-blue-800"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* City 2 */}
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3 text-lg">
                Choose {comparison.city2.name} if you want:
              </h3>
              <ul className="space-y-2">
                {comparison.verdict.chooseCity2.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-start gap-2 text-green-800"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Trophy className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Bottom Line</h3>
                <p className="text-amber-800 leading-relaxed">{comparison.verdict.recommendation}</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-4">
            {generateVerdictAfter(comparison.city1.name, comparison.city2.name)}
          </p>
        </motion.section>

        {/* What People Say */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-gray-600" />
            What People Say
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateReviewsParagraph(comparison.city1.name, comparison.city2.name)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* City 1 Reviews */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">
                Those who chose {comparison.city1.name} say:
              </h3>
              <div className="space-y-3">
                {comparison.reviews.city1.map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <Quote className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 text-sm leading-relaxed italic">{review}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* City 2 Reviews */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">
                Those who chose {comparison.city2.name} say:
              </h3>
              <div className="space-y-3">
                {comparison.reviews.city2.map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <Quote className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 text-sm leading-relaxed italic">{review}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateReviewsAfter(comparison.city1.name, comparison.city2.name)}
          </p>
        </motion.section>

        {/* City Guides Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-red-600" />
            Explore Full City Guides
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm mb-6">
            {generateGuidesParagraph(comparison.city1.name, comparison.city2.name)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* City 1 Grid */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200"
            >
              <h3 className="font-semibold text-blue-900 mb-4 text-lg">{comparison.city1.name} Guide</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Weather', 'Prayer Times', 'News', 'Events', 'Economy', 'Sports', 'Rates', 'Famous Places'].map((section) => (
                  <a
                    key={section}
                    href={`/pakistan/punjab/${comparison.city1.slug}/${section.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-blue-200 text-sm font-medium text-gray-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    {section}
                  </a>
                ))}
              </div>
              <a
                href={`/pakistan/punjab/${comparison.city1.slug}`}
                className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View Full {comparison.city1.name} Guide
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>

            {/* City 2 Grid */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200"
            >
              <h3 className="font-semibold text-green-900 mb-4 text-lg">{comparison.city2.name} Guide</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Weather', 'Prayer Times', 'News', 'Events', 'Economy', 'Sports', 'Rates', 'Famous Places'].map((section) => (
                  <a
                    key={section}
                    href={`/pakistan/sindh/${comparison.city2.slug}/${section.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-green-200 text-sm font-medium text-gray-700 hover:bg-green-100 hover:border-green-300 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    {section}
                  </a>
                ))}
              </div>
              <a
                href={`/pakistan/sindh/${comparison.city2.slug}`}
                className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                View Full {comparison.city2.name} Guide
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mt-6">
            {generateGuidesAfter(comparison.city1.name, comparison.city2.name)}
          </p>
        </motion.section>

        {/* Popular Comparisons Sidebar & Affiliates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Comparisons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="font-bold text-gray-900 mb-4">Popular Comparisons</h3>
            <div className="space-y-2">
              {globalPopularComparisons.map((pair) => (
                <button
                  key={pair.slug}
                  onClick={() => router.push(`/compare/${pair.slug}`)}
                  className="w-full text-left px-3 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  {pair.city1} vs {pair.city2}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Digital Affiliates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="lg:col-span-2 space-y-4"
          >
            <h3 className="font-bold text-gray-900">Plan Your Move</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City 1 Apartments */}
              <motion.a
                href="https://www.zameen.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-5 text-white border border-blue-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Find Apartments</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" />
                </div>
                <div className="text-blue-100 text-sm mb-2">in {comparison.city1.name}</div>
                <div className="bg-blue-700/50 rounded-lg px-3 py-1.5 inline-block text-xs font-semibold">
                  Zameen.com
                </div>
              </motion.a>

              {/* City 2 Apartments */}
              <motion.a
                href="https://www.zameen.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-5 text-white border border-green-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Find Apartments</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-green-200 group-hover:text-white transition-colors" />
                </div>
                <div className="text-green-100 text-sm mb-2">in {comparison.city2.name}</div>
                <div className="bg-green-700/50 rounded-lg px-3 py-1.5 inline-block text-xs font-semibold">
                  Zameen.com
                </div>
              </motion.a>

              {/* Hotels */}
              <motion.a
                href="https://www.booking.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="md:col-span-2 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl p-5 text-white border border-orange-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">Book Hotels to Visit</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-orange-200 group-hover:text-white transition-colors" />
                </div>
                <div className="text-orange-100 text-sm mb-2">Compare prices on Booking.com</div>
                <div className="bg-orange-700/50 rounded-lg px-3 py-1.5 inline-block text-xs font-semibold">
                  Best Price Guarantee
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Back to Homepage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center pb-12"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Homepage
          </a>
        </motion.div>

      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, subValue, winner, colorClass }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subValue?: string;
  winner: boolean;
  colorClass?: string;
}) {
  return (
    <div className={`rounded-lg p-3 border ${winner ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${colorClass || 'text-gray-400'}`} />
        <span className="text-xs text-gray-600">{label}</span>
        {winner && <span className="ml-auto text-xs text-green-600 font-semibold">Winner</span>}
      </div>
      <div className={`font-bold ${colorClass || 'text-gray-900'}`}>
        {value}
      </div>
      {subValue && <div className="text-xs text-gray-500 mt-0.5">{subValue}</div>}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="bg-gray-100 rounded-lg p-5 h-20"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
