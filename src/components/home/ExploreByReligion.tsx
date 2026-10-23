'use client';

// Faiths hub panel (§11) — faith cards (content only; the old version
// linked most cards to /horoscope, which is not a faith page) plus the
// panel's working doors: today's prayer-times pages for the three
// published cities (link map §11 — READY). Follower counts are the
// widely published global estimates, shown as reference, not live data.

import Link from 'next/link';

const FAITHS = [
  { name: 'Islam',       emoji: '☪️',  followers: '≈1.9B followers', color: '#01411C', desc: 'Prayer times & Hajj' },
  { name: 'Christianity',emoji: '✝️',  followers: '≈2.4B followers', color: '#1e3a8a', desc: 'Mass & calendar' },
  { name: 'Hinduism',    emoji: '🕉️',  followers: '≈1.2B followers', color: '#FF6B00', desc: 'Puja & festivals' },
  { name: 'Buddhism',    emoji: '☸️',  followers: '≈535M followers', color: '#8B5CF6', desc: 'Meditation times' },
  { name: 'Judaism',     emoji: '✡️',  followers: '≈15M followers',  color: '#2563EB', desc: 'Shabbat & calendar' },
  { name: 'Sikhism',     emoji: '🪯',  followers: '≈25M followers',  color: '#F59E0B', desc: 'Nitnem & calendar' },
  { name: 'Others',      emoji: '🌀',  followers: '≈1.2B followers', color: '#6B7280', desc: 'Folk traditions' },
];

const PRAYER_LINKS = [
  { label: 'Lahore prayer times', href: '/pakistan/punjab/lahore/prayer-times' },
  { label: 'Karachi prayer times', href: '/pakistan/sindh/karachi/prayer-times' },
  { label: 'Islamabad prayer times', href: '/pakistan/islamabad-capital-territory/islamabad/prayer-times' },
];

export default function ExploreByReligion() {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
        {FAITHS.map((f) => (
          <div key={f.name}>
            <div className="rounded-2xl border p-4 h-28 flex flex-col justify-between"
              style={{ background: `linear-gradient(135deg, ${f.color}20, var(--bg))`, borderColor: `${f.color}30` }}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{f.emoji}</span>
                <span className="text-xs t-text-40">{f.followers}</span>
              </div>
              <div>
                <div className="t-text font-bold text-sm">{f.name}</div>
                <div className="sub-desc mt-0.5">{f.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {PRAYER_LINKS.map((l) => (
          <Link key={l.href} href={l.href}
            className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/25 t-emerald text-sm font-medium hover:bg-emerald-500/20 transition-colors no-underline">
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
