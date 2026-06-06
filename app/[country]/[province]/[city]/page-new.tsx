'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { getCityData } from '@/lib/getCityData';
import type { City } from '@/types/city';

interface CityState {
  city: City | null;
  localTime: string;
  hijriDate: string;
  loading: boolean;
  error: string | null;
}

// Famous personalities in Lahore
const LAHORE_PERSONALITIES = [
  { name: 'Allama Iqbal', profession: 'Poet & Philosopher', legend: 'National poet of Pakistan' },
  { name: 'Wasim Akram', profession: 'Cricketer', legend: 'King of swing bowling' },
  { name: 'Nusrat Fateh Ali Khan', profession: 'Sufi Singer', legend: 'Master of Qawwali' },
  { name: 'Faiz Ahmed Faiz', profession: 'Poet', legend: 'Voice of the common man' },
  { name: 'Jahangir Khan', profession: 'Squash Player', legend: 'Unbeatable champion' },
  { name: 'Arfa Karim', profession: 'Tech Prodigy', legend: 'Youngest Microsoft MVP' },
];

// Famous places in Lahore
const LAHORE_PLACES = [
  { name: 'Badshahi Mosque', description: 'Iconic Mughal monument and architectural marvel', year: '1673' },
  { name: 'Lahore Fort', description: 'Ancient fort with rich history spanning centuries', year: 'Medieval' },
  { name: 'Data Darbar', description: 'Spiritual shrine and major religious site', year: '11th Century' },
  { name: 'Shalimar Gardens', description: 'UNESCO world heritage Mughal garden', year: '1641' },
  { name: 'Wagah Border', description: 'International border with ceremonial gate', year: '1947' },
];

// Heritage products
const HERITAGE_PRODUCTS = [
  { name: 'Phulkari', emoji: '🪡', description: 'Traditional embroidered textiles' },
  { name: 'Khussa', emoji: '👞', description: 'Ornate traditional footwear' },
  { name: 'Blue Pottery', emoji: '🏺', description: 'Hand-painted ceramic art' },
  { name: 'Truck Art', emoji: '🚚', description: 'Colorful truck decorations' },
  { name: 'Chikankari', emoji: '🧵', description: 'Fine embroidery work' },
];

// Street food
const STREET_FOOD = [
  'Lahori Chargha',
  'Nihari',
  'Paye',
  'Halwa Puri',
  'Lassi',
];

export default function CityPageNew() {
  const params = useParams();
  const [state, setState] = useState<CityState>({
    city: null,
    localTime: '00:00',
    hijriDate: '',
    loading: true,
    error: null,
  });

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      if (!state.city) return;
      const now = new Date();
      setState((prev) => ({
        ...prev,
        localTime: now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      }));
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [state.city]);

  // Load city data
  useEffect(() => {
    const loadData = async () => {
      try {
        const country = Array.isArray(params.country) ? params.country[0] : params.country;
        const province = Array.isArray(params.province) ? params.province[0] : params.province;
        const citySlug = Array.isArray(params.city) ? params.city[0] : params.city;

        const cityData = await getCityData(country, province, citySlug);
        if (!cityData) {
          setState((prev) => ({ ...prev, error: 'City not found', loading: false }));
          return;
        }

        setState((prev) => ({
          ...prev,
          city: cityData,
          loading: false,
        }));
      } catch (err) {
        console.error(err);
        setState((prev) => ({
          ...prev,
          error: 'Error loading city data',
          loading: false,
        }));
      }
    };

    loadData();
  }, [params]);

  const { city, loading, error, localTime } = state;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">Loading city data...</div>;
  }

  if (error || !city) {
    return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-red-400">{error || 'City not found'}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01411C] via-[#030712] to-[#030712]">
      {/* HERO SECTION */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full py-12 px-4 md:py-20 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">🇵🇰</span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              {city.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 text-gray-300 mb-4">
            <span>📍 {city.province}</span>
            <span>•</span>
            <span>🌍 {city.country}</span>
          </div>
          <p className="text-gray-400">Breadcrumb: World > {city.country} > {city.province} > {city.name}</p>
        </div>
      </motion.header>

      <div className="w-full px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* SECTION 1: TICKER BAR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-lg bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 border border-white/10"
          >
            <motion.div
              animate={{ x: ['0%', '-100%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="flex whitespace-nowrap py-4 px-4"
            >
              {[...Array(2)].map((_, i) => (
                <span key={i} className="text-white font-semibold px-8">
                  🕌 Next Prayer: Maghrib in 2h 15m | 🌡️ 34°C Sunny | 💰 Gold PKR 21,500 | ₿ BTC $67,420
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 2: TIME & SKY DOME */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <GlassCard variant="premium" glowColor="cyan" className="p-8 md:p-12 text-center">
                <p className="text-cyan-300 text-sm font-bold mb-4">LOCAL TIME</p>
                <p className="text-7xl md:text-8xl font-mono font-bold text-white mb-6">
                  {localTime}
                </p>
                <p className="text-gray-400">
                  Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* SECTION 3: WEATHER SNAPSHOT */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">🌤️ Weather</h3>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Temperature', value: '34°C', icon: '🌡️' },
                { label: 'Condition', value: 'Sunny', icon: '☀️' },
                { label: 'Humidity', value: '52%', icon: '💧' },
              ].map((item) => (
                <motion.div key={item.label} variants={itemVariants}>
                  <GlassCard variant="default" className="p-6 text-center">
                    <p className="text-3xl mb-2">{item.icon}</p>
                    <p className="text-gray-400 text-sm">{item.label}</p>
                    <p className="text-2xl font-bold text-white mt-2">{item.value}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 4: PRAYER TIMES COMPACT */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">🕌 Prayer Times</h3>
            <GlassCard variant="default" className="p-6">
              <div className="space-y-6">
                {/* Next prayer large display */}
                <div className="text-center bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-6">
                  <p className="text-emerald-300 text-sm font-bold">NEXT PRAYER</p>
                  <p className="text-4xl font-bold text-white mt-2">Maghrib</p>
                  <p className="text-emerald-400 font-mono mt-2">in 2h 15m</p>
                </div>

                {/* All 5 prayers */}
                <div className="grid grid-cols-5 gap-2 text-center">
                  {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                    <div key={prayer} className="bg-white/5 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">{prayer}</p>
                      <p className="text-lg font-mono font-bold text-white">04:45</p>
                    </div>
                  ))}
                </div>

                {/* Religion bar */}
                <div className="border-t border-white/10 pt-6">
                  <p className="text-gray-400 text-sm mb-2">Primary Religion</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${city.religion_percent}%` }} />
                    </div>
                    <span className="text-white font-bold">{city.major_religion} {city.religion_percent}%</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* SECTION 5: NEWS TODAY */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">📰 News Today</h3>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Local Market Updates', source: 'Live', category: 'Markets' },
                { title: 'Weather Alert Issued', source: 'Weather Bureau', category: 'Alert' },
                { title: 'Transport Update', source: 'City Info', category: 'Transport' },
              ].map((news, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <GlassCard variant="default" className="p-4 hover:bg-red-500/10 transition-colors">
                    <p className="text-red-400 text-xs font-bold">{news.category}</p>
                    <p className="text-white font-semibold mt-2">{news.title}</p>
                    <p className="text-gray-400 text-xs mt-2">{news.source}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 6: EVENTS */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">📅 Upcoming Events</h3>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { date: 'Today', event: 'Iqbal Day Celebrations', venue: 'Iqbal Park' },
                { date: 'Tomorrow', event: 'Sufi Music Festival', venue: 'Alhamra Hall' },
                { date: 'This Week', event: 'Food Street Festival', venue: 'Walled City' },
              ].map((evt, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <GlassCard variant="default" className="p-4 hover:bg-green-500/10 transition-colors">
                    <p className="text-green-400 text-xs font-bold">{evt.date}</p>
                    <p className="text-white font-semibold mt-2">{evt.event}</p>
                    <p className="text-gray-400 text-xs mt-2">📍 {evt.venue}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 7: GOLD RATES */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">💰 Today's Gold Rates</h3>
            <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { karat: '24K', price: 21500, change: '+0.4%' },
                { karat: '22K', price: 19708, change: '+0.4%' },
                { karat: '21K', price: 18812, change: '+0.4%' },
                { karat: '18K', price: 16094, change: '+0.4%' },
              ].map((g) => (
                <motion.div key={g.karat} variants={itemVariants}>
                  <GlassCard variant="default" className="p-4 text-center hover:bg-amber-500/10 transition-colors border border-amber-600/30">
                    <p className="text-amber-400 font-bold">{g.karat}</p>
                    <p className="text-white text-lg font-mono font-bold mt-2">PKR {g.price}</p>
                    <p className="text-green-400 text-xs mt-1">▲ {g.change}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 8: FAMOUS PERSONALITIES */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">🌟 Famous Personalities</h3>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LAHORE_PERSONALITIES.slice(0, 6).map((person, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <GlassCard variant="default" className="p-6 text-center hover:bg-orange-500/10 transition-colors">
                    <p className="text-3xl mb-3">🌟</p>
                    <p className="text-white font-bold">{person.name}</p>
                    <p className="text-gray-400 text-sm mt-1">{person.profession}</p>
                    <p className="text-orange-400 text-xs mt-3 font-semibold">"{person.legend}"</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 9: FAMOUS PLACES */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">🏛️ Famous Places</h3>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LAHORE_PLACES.map((place, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <GlassCard variant="default" className="p-6 hover:bg-teal-500/10 transition-colors border border-teal-600/30">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-white">{place.name}</h4>
                      <span className="text-teal-400 text-xs bg-teal-500/20 px-2 py-1 rounded">{place.year}</span>
                    </div>
                    <p className="text-gray-400">{place.description}</p>
                    <button className="mt-4 px-4 py-2 bg-teal-500 text-white text-sm rounded font-semibold hover:bg-teal-600 transition-colors">
                      Visit
                    </button>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 10: HERITAGE PRODUCTS */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">🎨 Heritage Products</h3>
            <motion.div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {HERITAGE_PRODUCTS.map((product, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <GlassCard variant="default" className="p-4 text-center hover:bg-purple-500/10 transition-colors">
                    <p className="text-3xl mb-2">{product.emoji}</p>
                    <p className="text-white font-semibold text-sm">{product.name}</p>
                    <p className="text-gray-400 text-xs mt-2">{product.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 11: ECONOMY SNAPSHOT */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">📊 Economy Snapshot</h3>
            <GlassCard variant="default" className="p-8 border border-pink-600/30">
              <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'GDP', value: '$350B' },
                  { label: 'Lahore Share', value: '13%' },
                  { label: 'Inflation', value: '23.4%' },
                  { label: 'Growth Rate', value: '2.4%' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-gray-400 text-sm mb-2">{item.label}</p>
                    <p className="text-3xl font-bold text-pink-400">{item.value}</p>
                  </div>
                ))}
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* SECTION 12: STREET FOOD */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">🍲 Street Food</h3>
            <GlassCard variant="default" className="p-8 text-center">
              <p className="text-2xl font-bold text-white mb-4 italic">
                "Lahore does not eat. Lahore feasts."
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {STREET_FOOD.map((food) => (
                  <span key={food} className="px-4 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm font-semibold">
                    🍽️ {food}
                  </span>
                ))}
              </div>
              <p className="text-gray-400">Best areas: Gawalmandi, Anarkali, MM Alam Road</p>
            </GlassCard>
          </motion.div>

          {/* SECTION 13: SPORTS */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">🏏 Sports</h3>
            <GlassCard variant="default" className="p-6 border border-blue-600/30">
              <div className="space-y-4">
                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/50">
                  <p className="text-blue-300 font-semibold">Lahore Qalandars</p>
                  <p className="text-white text-lg font-bold mt-2">PSL Standings</p>
                  <p className="text-gray-400 text-sm mt-1">Position: Competitive league</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded text-center">
                    <p className="text-gray-400 text-xs">Pakistan Ranking</p>
                    <p className="text-white font-bold mt-1">#3 T20</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded text-center">
                    <p className="text-gray-400 text-xs">Next Match</p>
                    <p className="text-white font-bold mt-1">TBD</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* SECTION 14: EMERGENCY CONTACTS */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">🚨 Emergency Contacts</h3>
            <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { icon: '🚔', service: 'Police', number: '15' },
                { icon: '🚑', service: 'Ambulance', number: '1122' },
                { icon: '🚒', service: 'Fire', number: '16' },
                { icon: '👩‍⚖️', service: 'Women', number: '1043' },
                { icon: '👶', service: 'Child', number: '1121' },
              ].map((service) => (
                <motion.div key={service.service} variants={itemVariants}>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-3 rounded-lg transition-colors text-center">
                    <p className="text-2xl mb-2">{service.icon}</p>
                    <p className="text-xs">{service.service}</p>
                    <p className="text-lg font-mono mt-1">{service.number}</p>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 15: NATURAL RESOURCES */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">🌍 Natural Resources</h3>
            <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { name: 'Alluvial Soil', icon: '🌱' },
                { name: 'Underground Water', icon: '💧' },
                { name: 'Natural Gas', icon: '⚡' },
                { name: 'Salt Mines', icon: '🪨' },
              ].map((resource) => (
                <motion.div key={resource.name} variants={itemVariants}>
                  <GlassCard variant="default" className="p-6 text-center">
                    <p className="text-3xl mb-3">{resource.icon}</p>
                    <p className="text-white font-semibold">{resource.name}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 16: CITY AT A GLANCE */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">👀 City at a Glance</h3>
            <GlassCard variant="default" className="p-8">
              <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Population', value: city.population.toLocaleString() },
                  { label: 'Province', value: city.province },
                  { label: 'Area', value: '1,772 km²' },
                  { label: 'Elevation', value: '217m' },
                  { label: 'Languages', value: 'Urdu, Punjabi' },
                  { label: 'Religion', value: city.major_religion },
                  { label: 'Founded', value: '1st Century AD' },
                  { label: 'Timezone', value: city.timezone },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-gray-400 text-sm">{item.label}</p>
                    <p className="text-white font-bold text-lg mt-2">{item.value}</p>
                  </div>
                ))}
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* SECTION 17: NEARBY CITIES */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">🛣️ Nearby Cities</h3>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { city: 'Gujranwala', distance: '80 km' },
                { city: 'Faisalabad', distance: '128 km' },
                { city: 'Islamabad', distance: '375 km' },
              ].map((n) => (
                <motion.div key={n.city} variants={itemVariants}>
                  <GlassCard variant="default" className="p-4 text-center hover:bg-cyan-500/10 transition-colors cursor-pointer">
                    <p className="text-white font-bold">{n.city}</p>
                    <p className="text-gray-400 text-sm mt-2">→ {n.distance}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* SECTION 18: COMPARE */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <h3 className="text-2xl font-bold text-white mb-6">⚖️ Compare {city.name}</h3>
            <motion.div variants={itemVariants}>
              <GlassCard variant="default" className="p-8 text-center">
                <p className="text-gray-400 mb-4">How does {city.name} compare?</p>
                <button className="px-6 py-3 bg-white text-[#030712] font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Compare vs Other Cities
                </button>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
