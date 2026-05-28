'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import type { City } from '@/types/city';

interface HeritageProduct {
  name: string;
  emoji: string;
  traditionYears: number;
  description: string;
  amazonUrl?: string;
  etsyUrl?: string;
  ebayUrl?: string;
}

const PRODUCT_EMOJIS: Record<string, string> = {
  leather: '👜',
  jewelry: '💎',
  textile: '🧵',
  pottery: '🏺',
  carpet: '🪔',
  shawl: '🧣',
  embroidery: '🎨',
  wood: '🪵',
  metal: '⚙️',
  brass: '🥇',
  brassware: '🥇',
  khussa: '👟',
  shoes: '👟',
  food: '🍚',
  sweet: '🍬',
  fabric: '🧵',
  chappal: '👡',
  knife: '🔪',
  sports: '🏏',
  bangles: '💫',
  ajrak: '🧣',
  glass: '🥃',
  bone: '🦴',
  ivory: '🦣',
  cloth: '👔',
  silk: '🧵',
  cotton: '🌱',
  perfume: '🌸',
  spices: '🫚',
  copper: '🥉',
  silver: '🥈',
  gold: '🥇',
  furniture: '🛋️',
  instrument: '🪕',
  onyx: '🪨',
  marble: '🪨',
  camel: '🐪',
  horse: '🐴',
  blanket: '🛏️',
  rug: '🪔',
};

const DEFAULT_PRODUCTS: Record<string, Array<{ name: string; traditionYears: number }>> = {
  lahore: [
    { name: 'Leather Jackets', traditionYears: 150 },
    { name: 'Embroidered Shawls', traditionYears: 400 },
    { name: 'Brassware', traditionYears: 200 },
    { name: 'Khussa Shoes', traditionYears: 500 },
    { name: 'Sports Equipment', traditionYears: 80 },
    { name: 'Handicrafts', traditionYears: 350 },
    { name: 'Silver Jewelry', traditionYears: 600 },
    { name: 'Glass Bangles', traditionYears: 300 },
  ],
  karachi: [
    { name: 'Camel Leather Products', traditionYears: 200 },
    { name: 'Ajrak (Block-printed fabric)', traditionYears: 4500 },
    { name: 'Ajrak', traditionYears: 4500 },
    { name: 'Hala Pottery', traditionYears: 350 },
    { name: 'Bandhani (Tie-dye)', traditionYears: 400 },
    { name: 'Camel Skin Lamps', traditionYears: 150 },
    { name: 'Naswar (Traditional snuff)', traditionYears: 500 },
    { name: 'Rilli Quilts', traditionYears: 300 },
  ],
  multan: [
    { name: 'Blue Pottery', traditionYears: 900 },
    { name: 'Camel Skin Lamps', traditionYears: 200 },
    { name: 'Mangoes (Chaunsa)', traditionYears: 500 },
    { name: 'Sohan Halwa', traditionYears: 250 },
    { name: 'Embroidered Fabrics', traditionYears: 600 },
    { name: 'Cottoen Fabric', traditionYears: 500 },
    { name: 'Silver Jewelry', traditionYears: 700 },
    { name: 'Carpets', traditionYears: 400 },
  ],
  faisalabad: [
    { name: 'Cotton Textiles', traditionYears: 200 },
    { name: 'Phulkari Embroidery', traditionYears: 500 },
  ],
  sialkot: [
    { name: 'Sports Goods', traditionYears: 120 },
    { name: 'Surgical Instruments', traditionYears: 90 },
    { name: 'Leather Garments', traditionYears: 180 },
  ],
  peshawar: [
    { name: 'Chappal (Peshawari sandals)', traditionYears: 600 },
    { name: 'Chitrali Caps', traditionYears: 400 },
    { name: 'Dry Fruits', traditionYears: 1000 },
    { name: 'Khand (Local sweets)', traditionYears: 300 },
    { name: 'Handwoven Fabrics', traditionYears: 800 },
    { name: 'Copper Utensils', traditionYears: 500 },
  ],
  islamabad: [
    { name: 'Walnuts (Akhrot)', traditionYears: 500 },
    { name: 'Honey', traditionYears: 400 },
    { name: 'Gemstones', traditionYears: 300 },
  ],
};

async function fetchWikipediaDescription(name: string): Promise<string | null> {
  try {
    const encodedName = encodeURIComponent(name.toLowerCase().replace(/\s+/g, '_'));
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedName}`
    );

    if (!response.ok) return null;
    const data = await response.json();
    return data.extract?.slice(0, 150) || null;
  } catch {
    return null;
  }
}

function getProductEmoji(name: string): string {
  const lowerName = name.toLowerCase();
  for (const [key, emoji] of Object.entries(PRODUCT_EMOJIS)) {
    if (lowerName.includes(key)) return emoji;
  }
  return '🛍️';
}

function generateAffiliateLinks(name: string): {
  amazon: string;
  etsy: string;
  ebay: string;
} {
  const encoded = encodeURIComponent(name);
  return {
    amazon: `https://www.amazon.com/s?k=${encoded}`,
    etsy: `https://www.etsy.com/search?q=${encoded}`,
    ebay: `https://www.ebay.com/sch/i.html?_nkw=${encoded}`,
  };
}

function ProductCard({ product, index }: { product: HeritageProduct; index: number }) {
  const links = generateAffiliateLinks(product.name);

  return (
    <motion.div
      className="flex-shrink-0 w-64 bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{product.emoji}</span>
        <div>
          <p className="font-bold text-gray-900">{product.name}</p>
          <p className="text-xs text-emerald-600">{product.traditionYears} years old tradition</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 line-clamp-3 mb-4 min-h-[60px]">
        {product.description}
      </p>

      <div className="space-y-2">
        <a
          href={product.amazonUrl || links.amazon}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center justify-center gap-2 w-full py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
        >
          <span>📦</span> Amazon
        </a>
        <div className="flex gap-2">
          <a
            href={product.etsyUrl || links.etsy}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex-1 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors text-center"
          >
            Etsy
          </a>
          <a
            href={product.ebayUrl || links.ebay}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors text-center"
          >
            eBay
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 bg-gray-50 rounded-xl p-4 border border-gray-100 animate-pulse">
      <div className="flex gap-3 mb-3">
        <div className="w-12 h-12 bg-gray-200 rounded"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}

export function HeritageProducts({ city }: { city: City }) {
  const [products, setProducts] = useState<HeritageProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      let productList: Array<{ name: string; traditionYears: number }> = [];

      if (city.famous_products && typeof city.famous_products === 'string') {
        const items = city.famous_products.split(',').map((p) => p.trim()).filter(Boolean);
        productList = items.map((name) => ({
          name,
          traditionYears: Math.floor(Math.random() * 400) + 100,
        }));
      } else {
        productList = DEFAULT_PRODUCTS[city.city_slug] || DEFAULT_PRODUCTS[city.name.toLowerCase()] || [];
      }

      if (productList.length === 0) {
        productList = [
          { name: 'Handicrafts', traditionYears: 300 },
          { name: 'Traditional Textiles', traditionYears: 500 },
          { name: 'Local Artwork', traditionYears: 200 },
        ];
      }

      const enriched: HeritageProduct[] = await Promise.all(
        productList.map(async (p) => {
          const description = await fetchWikipediaDescription(p.name);
          return {
            name: p.name,
            emoji: getProductEmoji(p.name),
            traditionYears: p.traditionYears,
            description: description || `Traditional ${p.name} crafted using ancient techniques passed down through generations.`,
          };
        })
      );

      setProducts(enriched);
      setLoading(false);
    }

    load();
  }, [city.city_slug, city.name, city.famous_products]);

  const scrollTo = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 280;
    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(containerRef.current.scrollWidth - containerRef.current.clientWidth, scrollPosition + scrollAmount);

    animate(scrollPosition, newPosition, {
      duration: 0.4,
      onUpdate: (latest) => {
        if (containerRef.current) {
          containerRef.current.scrollLeft = latest;
        }
      },
    });
    setScrollPosition(newPosition);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef.current
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth - 10
    : true;

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🛍️</span>
          Heritage & Famous Products
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => scrollTo('left')}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              canScrollLeft
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }`}
          >
            ←
          </button>
          <button
            onClick={() => scrollTo('right')}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              canScrollRight
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
            }`}
          >
            →
          </button>
        </div>
      </div>

      {products.length === 0 && !loading ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
          <p className="text-4xl mb-3">🛍️</p>
          <p>No heritage products found for this city</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {loading ? (
            [...Array(5)].map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            products.map((product, idx) => (
              <ProductCard key={product.name + idx} product={product} index={idx} />
            ))
          )}
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
}
