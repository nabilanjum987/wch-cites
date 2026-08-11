'use client';

import { useState } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

const regions = ['All', 'Asia', 'Middle East', 'Europe', 'Americas', 'Africa', 'Oceania'];

const newsItems = [
  { region: 'Middle East', headline: 'Oil prices hold steady as OPEC+ maintains current production targets heading into Q3', source: 'Reuters', time: '2h ago' },
  { region: 'Asia', headline: 'Pakistan rupee strengthens against dollar for the third consecutive week amid IMF review', source: 'Dawn', time: '3h ago' },
  { region: 'Europe', headline: 'European Central Bank signals cautious approach to further interest rate adjustments', source: 'BBC', time: '4h ago' },
  { region: 'Americas', headline: 'US Federal Reserve holds rates steady, monitors inflation data before next decision', source: 'CNN', time: '5h ago' },
  { region: 'Asia', headline: 'India records fastest GDP growth among G20 nations in latest World Bank quarterly report', source: 'The Hindu', time: '6h ago' },
  { region: 'Africa', headline: 'Egypt accelerates infrastructure development in new administrative capital project', source: 'Al Jazeera', time: '7h ago' },
  { region: 'Middle East', headline: 'Saudi Arabia opens new heritage tourism routes connecting ancient Nabataean sites', source: 'Arab News', time: '8h ago' },
  { region: 'Europe', headline: 'London marks record tourism numbers as summer travel season hits peak demand', source: 'Guardian', time: '9h ago' },
  { region: 'Asia', headline: 'Dubai property market sees renewed foreign investment interest in first-half data', source: 'Khaleej Times', time: '10h ago' },
  { region: 'Americas', headline: 'Brazil and Argentina deepen trade ties with new cross-border infrastructure pact', source: 'Reuters', time: '11h ago' },
  { region: 'Africa', headline: 'Nigeria expands renewable energy grid with new solar capacity coming online', source: 'AllAfrica', time: '12h ago' },
  { region: 'Oceania', headline: 'Australia and New Zealand coordinate on Pacific climate resilience funding', source: 'ABC News', time: '13h ago' },
];

const regionColors: Record<string, string> = {
  'Middle East': 'text-amber-400 bg-amber-400/10',
  'Asia': 'text-cyan-400 bg-cyan-400/10',
  'Europe': 'text-blue-400 bg-blue-400/10',
  'Americas': 'text-red-400 bg-red-400/10',
  'Africa': 'text-emerald-400 bg-emerald-400/10',
  'Oceania': 'text-teal-400 bg-teal-400/10',
};

export default function NewsPage() {
  const [activeRegion, setActiveRegion] = useState('All');

  const filtered = activeRegion === 'All'
    ? newsItems
    : newsItems.filter((n) => n.region === activeRegion);

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <Newspaper className="w-8 h-8 text-indigo-400" />
          <h1 className="text-4xl md:text-5xl font-bold">World News</h1>
        </div>
        <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-3xl">
          Stay on top of what is happening across the world right now. WorldCityHub pulls together
          news from Asia, the Middle East, Europe, the Americas, Africa, and Oceania, covering
          politics, economy, culture, and society.
        </p>

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

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all group"
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
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-white/40 text-center py-12">No headlines in this region right now.</p>
        )}
      </div>
    </main>
  );
}
