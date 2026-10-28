'use client';

// Faiths hub panel (§11) — faith cards (content only; the old version
// linked most cards to /horoscope, which is not a faith page) plus the
// panel's working doors: today's prayer-times pages for the three
// published cities (link map §11 — READY). Follower counts are the
// widely published global estimates, shown as reference, not live data.

import Link from 'next/link';

// Homepage-imagery pass (2026-10-28): each faith tile now carries a
// real photo of one of its actual sites — never a symbol or a generic
// stock shot (vendored under public/images/home28/; licence +
// creator records in
// docs/media-registry/subjects/homepage-imagery-2026-10-28.json).
// 'Others' (folk traditions) is pictured by a Shinto shrine's torii
// path, captioned as exactly that.
const FAITHS = [
  { name: 'Islam',       emoji: '☪️',  followers: '≈1.9B followers', color: '#01411C', desc: 'Prayer times & Hajj',
    img: '/images/home28/faith-islam.webp', imgAlt: 'The Sheikh Zayed Grand Mosque in Abu Dhabi', credit: 'Francesco Bini · CC BY-SA 4.0' },
  { name: 'Christianity',emoji: '✝️',  followers: '≈2.4B followers', color: '#1e3a8a', desc: 'Mass & calendar',
    img: '/images/home28/faith-christianity.webp', imgAlt: "St. Peter's Basilica in Vatican City", credit: 'Alvesgaspar · CC BY-SA 4.0' },
  { name: 'Hinduism',    emoji: '🕉️',  followers: '≈1.2B followers', color: '#FF6B00', desc: 'Puja & festivals',
    img: '/images/home28/faith-hinduism.webp', imgAlt: 'The Brihadisvara Temple during Maha Shivaratri', credit: 'Rainer Halama · CC BY-SA 4.0' },
  { name: 'Buddhism',    emoji: '☸️',  followers: '≈535M followers', color: '#8B5CF6', desc: 'Meditation times',
    img: '/images/home28/faith-buddhism.webp', imgAlt: 'Wat Arun temple in Bangkok', credit: 'Diego Delso · CC BY-SA 3.0' },
  { name: 'Judaism',     emoji: '✡️',  followers: '≈15M followers',  color: '#2563EB', desc: 'Shabbat & calendar',
    img: '/images/home28/faith-judaism.webp', imgAlt: 'The Western Wall in Jerusalem', credit: 'Golasso · CC BY-SA 4.0' },
  { name: 'Sikhism',     emoji: '🪯',  followers: '≈25M followers',  color: '#F59E0B', desc: 'Nitnem & calendar',
    img: '/images/home28/faith-sikhism.webp', imgAlt: 'The Golden Temple in Amritsar', credit: 'Shagil Kannur · CC BY-SA 4.0' },
  { name: 'Others',      emoji: '🌀',  followers: '≈1.2B followers', color: '#6B7280', desc: 'Folk traditions',
    img: '/images/home28/faith-others.webp', imgAlt: 'Torii path with lanterns at Fushimi Inari shrine, Kyoto', credit: 'Basile Morin · CC BY-SA 4.0' },
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
            <div className="rounded-2xl border overflow-hidden flex flex-col"
              style={{ background: `linear-gradient(135deg, ${f.color}20, var(--bg))`, borderColor: `${f.color}30` }}>
              <div className="relative h-24 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.img} alt={f.imgAlt} width={600} height={200} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-black/60 text-white/70 text-[9px] px-1.5 py-0.5 rounded-tl-md">{f.credit}</span>
              </div>
              <div className="p-4 flex flex-col justify-between gap-2 grow">
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
