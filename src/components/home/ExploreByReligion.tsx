'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const religions = [
  {
    name: 'Christianity',
    symbol: '✝️',
    gradient: 'linear-gradient(160deg, rgba(30,58,95,0.85), rgba(30,64,175,0.85))',
    image: 'https://images.pexels.com/photos/208371/pexels-photo-208371.jpeg?auto=compress&cs=tinysrgb&w=800',
    followers: '2.4 Billion',
    description: 'From the Vatican to Jerusalem, explore churches, cathedrals, and Christian heritage cities across every continent.',
    action: 'Church Times & Bible Verse',
    href: '/explore/christianity',
    color: '#60a5fa',
  },
  {
    name: 'Islam',
    symbol: '☪️',
    gradient: 'linear-gradient(160deg, rgba(6,78,59,0.85), rgba(6,95,70,0.85))',
    image: 'https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=800',
    followers: '1.9 Billion',
    description: 'Find accurate prayer times, Qibla direction, and Islamic heritage from Mecca to Istanbul to Lahore.',
    action: 'Prayer Times & Qibla',
    href: '/explore/islam',
    color: '#34d399',
  },
  {
    name: 'Hinduism',
    symbol: '🕉️',
    gradient: 'linear-gradient(160deg, rgba(124,45,18,0.85), rgba(194,65,12,0.85))',
    image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=800',
    followers: '1.2 Billion',
    description: 'Discover Puja timings, the Hindu Panchang calendar, and sacred cities like Varanasi, Haridwar, and Mathura.',
    action: 'Puja Times & Panchang',
    href: '/explore/hinduism',
    color: '#fb923c',
  },
  {
    name: 'Secular & Cultural',
    symbol: '🌍',
    gradient: 'linear-gradient(160deg, rgba(30,41,59,0.85), rgba(51,65,85,0.85))',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    followers: '1.2 Billion',
    description: 'Explore cities celebrated for art, science, architecture, and human culture rather than any single faith tradition.',
    action: 'Explore Cities by Culture',
    href: '/explore/secular',
    color: '#94a3b8',
  },
  {
    name: 'Buddhism',
    symbol: '☸️',
    gradient: 'linear-gradient(160deg, rgba(74,4,78,0.85), rgba(126,34,206,0.85))',
    image: 'https://images.pexels.com/photos/1537086/pexels-photo-1537086.jpeg?auto=compress&cs=tinysrgb&w=800',
    followers: '500 Million',
    description: 'Walk the path from Lumbini to Bodh Gaya. Find meditation times, dharma events, and Buddhist pilgrimage sites worldwide.',
    action: 'Meditation & Dharma',
    href: '/explore/buddhism',
    color: '#c084fc',
  },
  {
    name: 'Sikhism',
    symbol: '🪯',
    gradient: 'linear-gradient(160deg, rgba(30,27,75,0.85), rgba(120,53,15,0.85))',
    image: 'https://images.pexels.com/photos/13032647/pexels-photo-13032647.jpeg?auto=compress&cs=tinysrgb&w=800',
    followers: '30 Million',
    description: 'From the Golden Temple in Amritsar to Gurdwaras across the world, explore Sikh heritage and daily Nitnem prayer times.',
    action: 'Nitnem & Gurdwara Times',
    href: '/explore/sikhism',
    color: '#fbbf24',
  },
  {
    name: 'Judaism',
    symbol: '✡️',
    gradient: 'linear-gradient(160deg, rgba(30,58,95,0.85), rgba(255,255,255,0.15))',
    image: 'https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg?auto=compress&cs=tinysrgb&w=800',
    followers: '15 Million',
    description: 'Track Shabbat times, explore the weekly Torah portion, and discover Jewish heritage cities from Jerusalem to New York.',
    action: 'Shabbat Times & Torah',
    href: '/explore/judaism',
    color: '#a78bfa',
  },
];

export default function ExploreByReligion() {
  return (
    <div className="mb-4">
      {/* Section SEO Paragraph */}
      <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
        WorldCityHub covers every major faith on earth. Whether you follow Islam, Christianity, Hinduism,
        Buddhism, Judaism, or Sikhism, or prefer a secular cultural lens, you will find cities,
        sacred times, and heritage that matter to you. Each faith section brings together prayer schedules,
        calendar events, pilgrimage sites, and the living cultures tied to belief systems followed by
        billions of people across 195 countries. Pick your faith below and start exploring the cities
        that shaped it.
      </p>

      {/* Desktop grid — 4 top, 3 centered bottom */}
      <div className="hidden md:grid md:grid-cols-4 gap-4 mb-4">
        {religions.slice(0, 4).map((r) => (
          <ReligionCard key={r.name} r={r} />
        ))}
      </div>
      <div className="hidden md:flex justify-center gap-4">
        {religions.slice(4).map((r) => (
          <div key={r.name} className="w-[calc(25%-0.75rem)]">
            <ReligionCard r={r} />
          </div>
        ))}
      </div>

      {/* Mobile horizontal scroll */}
      <div className="flex md:hidden gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {religions.map((r) => (
          <div key={r.name} className="min-w-[260px] flex-shrink-0">
            <ReligionCard r={r} />
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function ReligionCard({ r }: { r: typeof religions[0] }) {
  return (
    <Link href={r.href} className="block h-full">
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all h-[220px] cursor-pointer"
      >
        {/* Background image */}
        <img
          src={r.image}
          alt={r.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: r.gradient }}
        />

        {/* Content */}
        <div className="relative z-10 p-5 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-4xl leading-none">{r.symbol}</span>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm"
              style={{ color: r.color }}
            >
              {r.followers}
            </span>
          </div>

          <div>
            <h3 className="text-white text-xl font-bold mb-1">{r.name}</h3>
            <p className="text-gray-300 text-xs leading-snug mb-3 line-clamp-2">
              {r.description}
            </p>
            <div
              className="flex items-center text-xs font-semibold gap-1"
              style={{ color: r.color }}
            >
              {r.action}
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
