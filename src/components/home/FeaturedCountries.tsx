'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const COUNTRIES = [
  { name: 'Pakistan',      flag: '🇵🇰', code: 'PK', cities: 142, color: '#01411C', slug: 'pakistan'       },
  { name: 'India',         flag: '🇮🇳', code: 'IN', cities: 312, color: '#FF9933', slug: 'india'          },
  { name: 'Saudi Arabia',  flag: '🇸🇦', code: 'SA', cities: 87,  color: '#006C35', slug: 'saudi-arabia'   },
  { name: 'UAE',           flag: '🇦🇪', code: 'AE', cities: 38,  color: '#00732F', slug: 'united-arab-emirates' },
  { name: 'United States', flag: '🇺🇸', code: 'US', cities: 287, color: '#B22234', slug: 'united-states'  },
  { name: 'United Kingdom',flag: '🇬🇧', code: 'GB', cities: 198, color: '#012169', slug: 'united-kingdom' },
  { name: 'Turkey',        flag: '🇹🇷', code: 'TR', cities: 94,  color: '#E30A17', slug: 'turkey'         },
  { name: 'Indonesia',     flag: '🇮🇩', code: 'ID', cities: 112, color: '#CE1126', slug: 'indonesia'      },
  { name: 'Egypt',         flag: '🇪🇬', code: 'EG', cities: 67,  color: '#CE1126', slug: 'egypt'          },
  { name: 'Nigeria',       flag: '🇳🇬', code: 'NG', cities: 78,  color: '#008751', slug: 'nigeria'        },
  { name: 'Brazil',        flag: '🇧🇷', code: 'BR', cities: 203, color: '#009C3B', slug: 'brazil'         },
  { name: 'Japan',         flag: '🇯🇵', code: 'JP', cities: 167, color: '#BC002D', slug: 'japan'          },
];

const PAGE_SIZE = 4;

export default function FeaturedCountries() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(COUNTRIES.length / PAGE_SIZE);
  const visible = COUNTRIES.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    const timer = setInterval(() => {
      setPage(p => (p + 1) % totalPages);
    }, 3000);
    return () => clearInterval(timer);
  }, [totalPages]);

  return (
    <div className="mb-4">
      <div className="flex justify-end mb-4">
        <Link href="/countries" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors no-underline">
          View All 195 Countries →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {visible.map((c) => (
          <Link key={c.code} href={`/${c.slug}`} className="no-underline group">
            <div className="relative rounded-2xl overflow-hidden border p-4 h-28 flex flex-col justify-between transition-all group-hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${c.color}25, #0a0f1e)`, borderColor: `${c.color}40` }}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{c.flag}</span>
                <span className="text-xs text-white/40 font-mono">{c.code}</span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">{c.name}</div>
                <div className="text-white/40 text-xs">{c.cities} cities</div>
              </div>
              {/* Dim flag in background */}
              <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none select-none">
                <span style={{ fontSize: '56px', opacity: 0.08 }}>{c.flag}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Dot navigation */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} onClick={() => setPage(i)}
            className="w-2 h-2 rounded-full transition-all"
            style={{ backgroundColor: i === page ? '#06b6d4' : 'rgba(255,255,255,0.2)' }}
          />
        ))}
      </div>
    </div>
  );
}
