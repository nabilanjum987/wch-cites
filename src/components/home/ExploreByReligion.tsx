'use client';
import Link from 'next/link';

const FAITHS = [
  { name: 'Islam',       emoji: '☪️',  followers: '1.9B', color: '#01411C', link: '/pakistan/punjab/lahore/prayer-times', desc: 'Prayer times, Quran, Hajj guidance' },
  { name: 'Christianity',emoji: '✝️',  followers: '2.4B', color: '#1e3a8a', link: '/horoscope',                           desc: 'Churches, masses, Christian calendar' },
  { name: 'Hinduism',    emoji: '🕉️',  followers: '1.2B', color: '#FF6B00', link: '/horoscope',                           desc: 'Temples, puja times, festivals' },
  { name: 'Buddhism',    emoji: '☸️',  followers: '535M', color: '#8B5CF6', link: '/horoscope',                           desc: 'Meditation, temples, Buddhist calendar' },
  { name: 'Judaism',     emoji: '✡️',  followers: '15M',  color: '#2563EB', link: '/horoscope',                           desc: 'Synagogues, Shabbat, Hebrew calendar' },
  { name: 'Sikhism',     emoji: '🪯',  followers: '25M',  color: '#F59E0B', link: '/horoscope',                           desc: 'Gurdwaras, Nitnem, Sikh calendar' },
  { name: 'Others',      emoji: '🌀',  followers: '1.2B', color: '#6B7280', link: '/horoscope',                           desc: 'Indigenous, folk & other traditions' },
];

export default function ExploreByReligion() {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {FAITHS.map((f) => (
          <Link key={f.name} href={f.link} className="no-underline group">
            <div className="rounded-2xl border p-4 h-28 flex flex-col justify-between transition-all group-hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${f.color}20, #0a0f1e)`, borderColor: `${f.color}30` }}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{f.emoji}</span>
                <span className="text-xs text-white/40">{f.followers}</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">{f.name}</div>
                <div className="text-white/40 text-xs mt-0.5 line-clamp-1">{f.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
