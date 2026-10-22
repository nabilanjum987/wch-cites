'use client';

// Heritage Products panel (§18) — CONTENT ONLY. Product detail pages
// are shells, so every link is on HOLD (link map §18 / L1) and the
// panel's commercial redesign is PLAN LATER per the freeze. The
// product cards themselves (real catalogue data from the site's
// product registry) render without links until the pages are real.

import { getAllProducts } from '@/lib/data/products';

const STYLE: Record<string, { emoji: string; color: string; category: string }> = {
  'lahori-khussa': { emoji: '👞', color: '#8B4513', category: 'Traditional Craft' },
  'multan-blue-pottery': { emoji: '🏺', color: '#0369a1', category: 'Ceramic Art' },
};

const DEFAULT_STYLE = { emoji: '🎨', color: '#8B5CF6', category: 'Heritage Product' };

const COUNTRY_FLAGS: Record<string, string> = {
  Pakistan: '🇵🇰',
  India: '🇮🇳',
  Italy: '🇮🇹',
  Turkey: '🇹🇷',
};

export default function HeritageSpotlight() {
  const products = getAllProducts();

  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map((p) => {
          const style = STYLE[p.slug] ?? DEFAULT_STYLE;
          const flag = COUNTRY_FLAGS[p.origin.country] ?? '🌍';
          return (
            <div key={p.slug}>
              <div
                className="rounded-2xl border p-5 h-full flex flex-col gap-3"
                style={{ background: `linear-gradient(135deg, ${style.color}15, #0a0f1e)`, borderColor: `${style.color}30` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{style.emoji}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ borderColor: `${style.color}40`, color: style.color, backgroundColor: `${style.color}15` }}
                  >
                    {style.category}
                  </span>
                </div>
                <div>
                  <div className="text-white font-bold">{p.name}</div>
                  <div className="flex items-center gap-1 text-white/40 text-xs mt-0.5">
                    <span>{flag}</span>
                    <span>{p.origin.city}, {p.origin.country}</span>
                  </div>
                </div>
                <p className="text-white/50 text-xs leading-relaxed flex-1 line-clamp-3">{p.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-white/40 text-sm mt-4">
        Full product stories — the makers, the method, where to buy fairly — open as each product page passes review →
      </p>
    </div>
  );
}
