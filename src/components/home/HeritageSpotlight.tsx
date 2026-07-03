'use client';
import Link from 'next/link';

const HERITAGE = [
  {
    name: 'Lahori Khussa',
    origin: 'Lahore, Pakistan',
    flag: '🇵🇰',
    emoji: '👞',
    color: '#8B4513',
    desc: 'Hand-crafted leather slippers with intricate embroidery, made in Lahore\'s old city for over 300 years. Each pair takes 3–7 days of skilled craftsmanship using techniques passed through generations.',
    slug: 'lahori-khussa',
    category: 'Traditional Craft',
  },
  {
    name: 'Kashmiri Shawl',
    origin: 'Kashmir, India',
    flag: '🇮🇳',
    emoji: '🧣',
    color: '#8B0000',
    desc: 'Handwoven Pashmina wool shawls with intricate Kani weave patterns. A single shawl can take 6–18 months to complete and represents one of the finest textile traditions in the world.',
    slug: 'kashmiri-shawl',
    category: 'Textile Heritage',
  },
  {
    name: 'Murano Glass',
    origin: 'Venice, Italy',
    flag: '🇮🇹',
    emoji: '🏺',
    color: '#1e40af',
    desc: 'Hand-blown glass art from the island of Murano, Italy — a tradition dating to the 13th century. Venetian glassblowers were once forbidden from leaving the island to protect trade secrets.',
    slug: 'murano-glass',
    category: 'Glass Art',
  },
];

export default function HeritageSpotlight() {
  return (
    <div className="mb-4">
      <div className="flex justify-end mb-4">
        <Link href="/products/lahori-khussa" className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors no-underline">
          Explore Heritage Products →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {HERITAGE.map((h) => (
          <Link key={h.slug} href={`/products/${h.slug}`} className="no-underline group">
            <div className="rounded-2xl border p-5 h-full flex flex-col gap-3 transition-all group-hover:scale-[1.01]"
              style={{ background: `linear-gradient(135deg, ${h.color}15, #0a0f1e)`, borderColor: `${h.color}30` }}>
              <div className="flex items-center justify-between">
                <span className="text-4xl">{h.emoji}</span>
                <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: `${h.color}40`, color: `${h.color}`, backgroundColor: `${h.color}15` }}>
                  {h.category}
                </span>
              </div>
              <div>
                <div className="text-white font-bold">{h.name}</div>
                <div className="flex items-center gap-1 text-white/40 text-xs mt-0.5">
                  <span>{h.flag}</span>
                  <span>{h.origin}</span>
                </div>
              </div>
              <p className="text-white/50 text-xs leading-relaxed flex-1">{h.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
