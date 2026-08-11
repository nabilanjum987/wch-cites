'use client';
import Link from 'next/link';
import { getAllProducts } from '@/lib/data/products';

// Optional presentation styling per product slug. Falls back to a generic
// style for any product that doesn't have a custom entry, so new products
// from new cities automatically show up here with zero extra work.
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
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/40 text-xs">Products from cities across WorldCityHub</p>
        <Link href="/products/lahori-khussa" className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors no-underline">
          Explore Heritage Products →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map((p) => {
          const style = STYLE[p.slug] ?? DEFAULT_STYLE;
          const flag = COUNTRY_FLAGS[p.origin.country] ?? '🌍';
          return (
            <Link key={p.slug} href={`/products/${p.slug}`} className="no-underline group">
              <div
                className="rounded-2xl border p-5 h-full flex flex-col gap-3 transition-all group-hover:scale-[1.01]"
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
