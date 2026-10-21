'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Newspaper, ExternalLink } from 'lucide-react';

export interface WorldNewsItem {
  region: string;
  headline: string;
  source: string;
  time: string;
  url: string;
}

const regions = ['All', 'Asia', 'Middle East', 'Europe', 'Americas', 'Africa', 'Oceania'];

const regionColors: Record<string, string> = {
  'Middle East': 'text-amber-400 bg-amber-400/10',
  'Asia': 'text-cyan-400 bg-cyan-400/10',
  'Europe': 'text-blue-400 bg-blue-400/10',
  'Americas': 'text-red-400 bg-red-400/10',
  'Africa': 'text-emerald-400 bg-emerald-400/10',
  'Oceania': 'text-teal-400 bg-teal-400/10',
};

export default function NewsClient({ items }: { items: WorldNewsItem[] }) {
  const [activeRegion, setActiveRegion] = useState('All');

  const filtered = activeRegion === 'All'
    ? items
    : items.filter((n) => n.region === activeRegion);

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <Newspaper className="w-8 h-8 text-indigo-400" />
          <h1 className="text-4xl md:text-5xl font-bold">World News</h1>
        </div>
        <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-3xl">
          Stay on top of what is happening across the world right now. WorldCityHub aggregates
          headlines from trusted publishers across Asia, the Middle East, Europe, the Americas,
          Africa, and Oceania — refreshed every 15 minutes.
        </p>

        {items.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/70 mb-2">Live world headlines are unavailable right now.</p>
            <p className="text-white/40 text-sm mb-6">
              We never fill this page with placeholder stories. Meanwhile, city news pages carry
              the latest local coverage:
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/pakistan/punjab/lahore/news" className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium no-underline">Lahore News</Link>
              <Link href="/pakistan/sindh/karachi/news" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium no-underline">Karachi News</Link>
            </div>
          </div>
        ) : (
          <>
            {/* Region tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRegion(r)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeRegion === r
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* News grid — every card links to the original publisher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all group no-underline"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${regionColors[item.region] || 'text-gray-400 bg-gray-400/10'}`}>
                        {item.region}
                      </span>
                      <span className="text-gray-500 text-xs">{item.time}</span>
                    </div>
                    <p className="text-white text-sm font-medium leading-snug group-hover:text-indigo-300 transition-colors">
                      {item.headline}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">{item.source}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1 group-hover:text-indigo-400 transition-colors" />
                </a>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-white/40 text-center py-12">No headlines in this region right now.</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
