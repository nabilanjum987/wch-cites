'use client';

// Homepage search — FIGURES PREVIEW (WP2 Slice 2 / Q2, frozen spec §2).
// Typing a published city or country name lists matches; choosing one
// opens a preview card with that place's main REAL figures right now
// (weather, next prayer, gold per tola for cities; capital + World Bank
// population for the country), fetched live from the same keyless APIs
// the site uses. Only published entities exist in the registry
// (src/lib/home-search.ts) — unpublished places never appear (L2/L6).
// The old version searched the Supabase cities table directly and
// navigated instantly with no preview; that contract is replaced here.

import { useEffect, useRef, useState } from 'react';
import { Search, X, ArrowRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  matchEntities,
  fetchPreviewFigures,
  type SearchEntity,
  type PreviewFigures,
} from '@/lib/home-search';

interface SearchBarProps {
  onCitySelect?: (city: { country_slug: string; province_slug: string; city_slug: string }) => void;
}

const SLUGS: Record<string, { country_slug: string; province_slug: string; city_slug: string }> = {
  Lahore: { country_slug: 'pakistan', province_slug: 'punjab', city_slug: 'lahore' },
  Karachi: { country_slug: 'pakistan', province_slug: 'sindh', city_slug: 'karachi' },
  Islamabad: { country_slug: 'pakistan', province_slug: 'islamabad-capital-territory', city_slug: 'islamabad' },
};

export default function SearchBar({ onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<SearchEntity[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SearchEntity | null>(null);
  const [figures, setFigures] = useState<PreviewFigures | null>(null);
  const [figLoading, setFigLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const onType = (v: string) => {
    setQuery(v);
    setSelected(null);
    setFigures(null);
    const m = matchEntities(v);
    setMatches(m);
    setOpen(m.length > 0);
  };

  const choose = async (e: SearchEntity) => {
    setSelected(e);
    setOpen(false);
    setFigures(null);
    setFigLoading(true);
    const f = await fetchPreviewFigures(e).catch(() => ({} as PreviewFigures));
    setFigures(f);
    setFigLoading(false);
  };

  const go = () => {
    if (!selected) return;
    const slugs = SLUGS[selected.name];
    if (selected.kind === 'city' && slugs && onCitySelect) {
      onCitySelect(slugs);
    } else {
      window.location.href = selected.href;
    }
  };

  const clear = () => {
    setQuery('');
    setMatches([]);
    setSelected(null);
    setFigures(null);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={wrapRef}>
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onType(e.target.value)}
          onFocus={() => matches.length > 0 && !selected && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && matches.length > 0) choose(matches[0]);
            if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Search a city or country — try Lahore or Pakistan"
          aria-label="Search cities and countries"
          className="w-full pl-14 pr-12 py-4 text-lg rounded-full backdrop-blur-xl bg-white/15 border border-white/30 text-white placeholder-gray-300 focus:bg-white/25 focus:border-cyan-400/50 focus:outline-none transition-all shadow-lg"
        />
        {query && (
          <button onClick={clear} aria-label="Clear search"
            className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 mt-3 backdrop-blur-xl bg-[#030712]/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 text-left"
          >
            {matches.map((m) => (
              <button key={m.name} onClick={() => choose(m)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/10 transition-colors">
                <span className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-white">{m.name}</span>
                  <span className="text-gray-400 text-sm">{m.sub}</span>
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">{m.kind}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 rounded-2xl border border-cyan-400/30 bg-[#030712]/90 backdrop-blur-xl p-5 text-left"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-white font-bold text-lg leading-tight">{selected.name}</div>
                <div className="text-gray-400 text-sm">{selected.sub}</div>
              </div>
              <button onClick={clear} aria-label="Close preview" className="p-1 hover:bg-white/10 rounded-full">
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            {figLoading ? (
              <p className="text-gray-400 text-sm">Loading live figures…</p>
            ) : figures && Object.keys(figures).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {figures.weather && (
                  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Weather now</div>
                    <div className="text-white font-semibold text-sm">{figures.weather}</div>
                  </div>
                )}
                {figures.nextPrayer && (
                  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Next prayer</div>
                    <div className="text-white font-semibold text-sm">{figures.nextPrayer}</div>
                  </div>
                )}
                {figures.goldTola && (
                  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Gold</div>
                    <div className="text-white font-semibold text-sm">{figures.goldTola}</div>
                  </div>
                )}
                {figures.capital && (
                  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Capital</div>
                    <div className="text-white font-semibold text-sm">{figures.capital}</div>
                  </div>
                )}
                {figures.population && (
                  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500">Population</div>
                    <div className="text-white font-semibold text-sm">{figures.population}</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm mb-4">Live figures are unavailable right now — the full page has everything.</p>
            )}
            <button onClick={go}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500/90 hover:bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition-colors">
              Open the full {selected.name} page <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
