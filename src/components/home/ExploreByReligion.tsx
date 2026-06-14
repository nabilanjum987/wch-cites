import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const religions = [
  {
    name: 'Islam',
    icon: '☪️',
    emoji: '☪️',
    gradient: 'linear-gradient(135deg, #064e3b, #065f46)',
    description: 'Discover prayer times for Mecca, Medina, and cities with Islamic heritage',
    cities: ['Mecca', 'Medina', 'Istanbul', 'Cairo', 'Lahore']
  },
  {
    name: 'Christianity',
    icon: '✝️',
    emoji: '✝️',
    gradient: 'linear-gradient(135deg, #1e3a5f, #1e40af)',
    description: 'Explore Vatican City, Jerusalem, and cities with Christian history',
    cities: ['Vatican City', 'Jerusalem', 'Rome', 'Bethlehem']
  },
  {
    name: 'Hinduism',
    icon: '🕉️',
    emoji: '🕉️',
    gradient: 'linear-gradient(135deg, #7c2d12, #c2410c)',
    description: 'Visit Varanasi, Haridwar, and sacred Hindu pilgrimage sites',
    cities: ['Varanasi', 'Haridwar', 'Rishikesh', 'Ayodhya']
  },
  {
    name: 'Judaism',
    icon: '✡️',
    emoji: '✡️',
    gradient: 'linear-gradient(135deg, #713f12, #a16207)',
    description: 'Explore Jerusalem, Tel Aviv, and cities with Jewish heritage',
    cities: ['Jerusalem', 'Tel Aviv', 'Hebron', 'Safed']
  },
  {
    name: 'Buddhism',
    icon: '☸️',
    emoji: '☸️',
    gradient: 'linear-gradient(135deg, #4a044e, #7e22ce)',
    description: 'Discover Lumbini, Bodh Gaya, and Buddhist pilgrimage sites',
    cities: ['Lumbini', 'Bodh Gaya', 'Kushinagar', 'Sarnath']
  },
  {
    name: 'Sikhism',
    icon: '🙏',
    emoji: '🙏',
    gradient: 'linear-gradient(135deg, #7c2d12, #b45309)',
    description: 'Visit Amritsar, Anandpur Sahib, and Sikh holy places',
    cities: ['Amritsar', 'Anandpur Sahib', 'Nanded', 'Patna Sahib']
  },
  {
    name: 'No Religion',
    icon: '🧘',
    emoji: '🧘',
    gradient: 'linear-gradient(135deg, #1e293b, #334155)',
    description: 'Explore secular cities and places of spiritual diversity',
    cities: ['Tokyo', 'Berlin', 'Amsterdam', 'Stockholm']
  }
];

export default function ExploreByReligion() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Explore by Religion</h2>
        <span className="text-gray-400">Find cities by faith</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {religions.map((religion) => (
          <Link
            key={religion.name}
            href="/prayer-times"
            className="rounded-2xl p-6 text-left hover:scale-105 transition-all group border border-white/10 min-h-[200px] relative overflow-hidden"
            style={{ background: religion.gradient }}
          >
            {/* Pulse Dot Top-Left */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
            </div>

            {/* Emoji Watermark Top-Right */}
            <div 
              className="absolute top-2 right-4 text-6xl opacity-10 pointer-events-none"
              style={{ fontSize: '4rem', opacity: 0.1 }}
            >
              {religion.emoji}
            </div>

            <div className="flex items-start justify-between mb-4 relative z-10">
              <span className="text-5xl">{religion.icon}</span>
              <div
                className="w-4 h-4 rounded-full border-2 border-white/30"
              />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{religion.name}</h3>

            <p className="text-gray-200 text-sm mb-4 line-clamp-2">
              {religion.description}
            </p>

            <div className="flex items-center text-white/80 text-sm font-medium group-hover:text-white transition-colors">
              Explore prayer times
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
