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
// Stage 3 pass (2026-11-03, owner review): the Islam card now shows
// the Kaaba in Mecca, Islam's most important place, reusing the
// existing licensed asset ctry-saudi.webp (Moataz Egbaria,
// CC BY-SA 3.0, the same credit recorded in FeaturedCountries).
// The Hinduism card now shows Varanasi and the Ganges, Hinduism's
// holiest city and river (new asset faith-varanasi.webp: Babasteve,
// CC BY 2.0, via Wikimedia Commons, licence verified on the file
// page File:Varanasiganga.jpg). Buddhism keeps Wat Arun for now: a
// Mahabodhi Temple (Bodh Gaya) swap was researched, but the Commons
// file pages could not be loaded for licence verification in this
// pass, so no unverified image was shipped. The faith signs are
// Unicode TEXT glyphs: the U+FE0E variation selector forces text
// presentation, so no sign renders as a coloured emoji in a box.
// Sikhism uses U+262C (Adi Shakti), a text glyph, in place of the
// emoji-only khanda. Photo credits sit below the photo as captions,
// never on the image.
const FAITHS = [
  { name: 'Islam',       sign: '☪︎',  followers: '≈1.9B followers', color: '#01411C', desc: 'Prayer times & Hajj',
    img: '/images/home28/ctry-saudi.webp', imgAlt: 'The Kaaba in Mecca', credit: 'Moataz Egbaria · CC BY-SA 3.0' },
  { name: 'Christianity',sign: '✝︎',  followers: '≈2.4B followers', color: '#1e3a8a', desc: 'Mass & calendar',
    img: '/images/home28/faith-christianity.webp', imgAlt: "St. Peter's Basilica in Vatican City", credit: 'Alvesgaspar · CC BY-SA 4.0' },
  { name: 'Hinduism',    sign: 'ॐ',  followers: '≈1.2B followers', color: '#FF6B00', desc: 'Puja & festivals',
    img: '/images/home28/faith-varanasi.webp', imgAlt: 'The ghats of Varanasi on the Ganges', credit: 'Babasteve · CC BY 2.0' },
  { name: 'Buddhism',    sign: '☸︎',  followers: '≈535M followers', color: '#8B5CF6', desc: 'Meditation times',
    img: '/images/home28/faith-buddhism.webp', imgAlt: 'Wat Arun temple in Bangkok', credit: 'Diego Delso · CC BY-SA 3.0' },
  { name: 'Judaism',     sign: '✡︎',  followers: '≈15M followers',  color: '#2563EB', desc: 'Shabbat & calendar',
    img: '/images/home28/faith-judaism.webp', imgAlt: 'The Western Wall in Jerusalem', credit: 'Golasso · CC BY-SA 4.0' },
  { name: 'Sikhism',     sign: '☬',  followers: '≈25M followers',  color: '#F59E0B', desc: 'Nitnem & calendar',
    img: '/images/home28/faith-sikhism.webp', imgAlt: 'The Golden Temple in Amritsar', credit: 'Shagil Kannur · CC BY-SA 4.0' },
  { name: 'Others',      sign: '✦',  followers: '≈1.2B followers', color: '#6B7280', desc: 'Folk traditions',
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
              <div className="relative h-36 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.img} alt={f.imgAlt} width={600} height={320} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <p className="px-4 pt-2 text-[10px] t-text-40">Photo: {f.credit}</p>
              <div className="px-4 pb-4 pt-1 flex flex-col justify-between gap-2 grow">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{f.sign}</span>
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
