'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { flagEmoji, type CapitalRow } from '@/lib/capitals-table';

export interface CapitalRowWithTemp extends CapitalRow {
  tempC: number | null;
}

// World Capitals table (Q8 / link map §9A): country -> capital -> local
// time -> current temperature -> country page. Temperatures arrive
// server-rendered (one cached Open-Meteo multi-location request made
// by the /countries page); local times are computed here from each
// capital's IANA timezone and refreshed every 30 seconds.
export default function CapitalsTable({ rows }: { rows: CapitalRowWithTemp[] }) {
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.country.toLowerCase().includes(q) || r.capital.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const timeFor = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', timeZone: tz,
      }).format(now);
    } catch {
      return '—';
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search country or capital…"
          aria-label="Search country or capital"
          className="w-full max-w-sm rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-cyan-400/60 focus:outline-none"
        />
        <span className="text-xs text-white/40">
          {filtered.length} of {rows.length} capitals · times are each capital&apos;s local time now
        </span>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wide text-white/50">
              <th className="px-4 py-3 font-semibold">Country</th>
              <th className="px-4 py-3 font-semibold">Capital</th>
              <th className="px-4 py-3 font-semibold">Local time</th>
              <th className="px-4 py-3 font-semibold">Weather now</th>
              <th className="px-4 py-3 font-semibold">Country page</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.code + r.countrySlug} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-2.5 font-medium text-white">
                  <span className="mr-2" aria-hidden>{flagEmoji(r.code)}</span>
                  {r.country}
                </td>
                <td className="px-4 py-2.5 text-white/80">{r.capital}</td>
                <td className="px-4 py-2.5 font-mono text-cyan-300">{timeFor(r.timezone)}</td>
                <td className="px-4 py-2.5 text-white/80">
                  {r.tempC != null ? `${Math.round(r.tempC)}°C` : '—'}
                </td>
                <td className="px-4 py-2.5">
                  <Link href={`/${r.countrySlug}`} className="text-cyan-300 hover:text-cyan-200 hover:underline">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-white/50">
                  No country or capital matches “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
