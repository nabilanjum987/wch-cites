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

// Polish Card 5: homepage cards carry ONE short line per product.
// The full catalogue descriptions (lib/data/products) stay untouched
// for the product pages; these are the card summaries.
const CARD_LINES: Record<string, string> = {
  'lahori-khussa': 'Hand-stitched leather shoe of Lahore',
  'multan-blue-pottery': 'Cobalt-blue Kashigari pottery of Multan',
};

// Stage 3 (2026-11-03, owner review): the card standard is a real
// photo OF THE PRODUCT ITSELF. The Multan card's earlier photo
// (Fred Bremner, c. 1902, public domain) shows the potters, not the
// pottery, so it is removed from this panel; the file and its licence
// record stay in the media registry
// (docs/media-registry/subjects/multan-blue-pottery.json). Repeated
// Wikimedia Commons searches in this pass found NO verified
// open-licence product photo for either homepage product: no Multan
// blue pottery ware shot, and the only verified Commons khussa image
// remains the Sindhi khussa stall (Kandhkot), wrong city, rejected
// rather than mislabelled. Both cards therefore render without a
// photo until a verified product photo is sourced; the PHOTOS
// mechanism below is kept for that day. The registry's unrecorded
// Unsplash URLs are NOT used.
const PHOTOS: Record<string, { img: string; alt: string; caption: string; credit: string }> = {};

// Vendored flag files beside the origin line (emoji flags render as
// bare country-code letters on Windows). Countries without a vendored
// flag render no flag at all.
const COUNTRY_FLAGS: Record<string, string> = {
  Pakistan: '/images/flags/pk.png',
  India: '/images/flags/in.png',
  Turkey: '/images/flags/tr.svg',
};

export default function HeritageSpotlight() {
  const products = getAllProducts();

  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {products.map((p) => {
          const style = STYLE[p.slug] ?? DEFAULT_STYLE;
          const flagImg = COUNTRY_FLAGS[p.origin.country];
          return (
            <div key={p.slug}>
              <div
                className="rounded-2xl border p-5 flex flex-col gap-3 h-full"
                style={{ background: `linear-gradient(135deg, ${style.color}15, var(--bg))`, borderColor: `${style.color}30` }}
              >
                {PHOTOS[p.slug] && (
                  <figure>
                    <div className="relative h-36 overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={PHOTOS[p.slug].img} alt={PHOTOS[p.slug].alt} width={768} height={420} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <figcaption className="text-[11px] t-text-40 mt-1.5">
                      {PHOTOS[p.slug].caption} · Photo: {PHOTOS[p.slug].credit}
                    </figcaption>
                  </figure>
                )}
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
                  <div className="t-text font-bold">{p.name}</div>
                  <div className="flex items-center gap-1.5 sub-desc mt-0.5">
                    {flagImg && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={flagImg} alt={`Flag of ${p.origin.country}`} width={24} height={16} loading="lazy" decoding="async" className="rounded-sm shadow shrink-0" />
                    )}
                    <span>{p.origin.city}, {p.origin.country}</span>
                  </div>
                </div>
                <p className="sub-desc flex-1">{CARD_LINES[p.slug] ?? p.caption}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="sub-desc mt-4">
        Full product stories, the makers, the method, where to buy fairly, open as each product page passes review →
      </p>
    </div>
  );
}
