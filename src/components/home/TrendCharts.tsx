'use client';

// ─────────────────────────────────────────────────────────────────────────
// 30-DAY TREND CHARTS (owner addendum 2026-10-23, Polish Card 4) —
// placed in the §12 finance zone under the market snapshot. Every
// series comes from a feed the site ALREADY uses — no new API:
//   Gold  — CoinGecko PAX Gold market_chart, the exact feed behind
//           fetchGoldRates() in src/lib/apis/rates.ts (the rates page's
//           30-day chart), reduced to daily closes the same way.
//   BTC   — CoinGecko Bitcoin market_chart, same endpoint family.
//   USD→PKR — the dated-snapshot currency files behind
//           fetchCurrencyHistory() in the same rates.ts (one published
//           file per day; missing days are skipped, never interpolated).
// Charts are hand-drawn SVG (no chart library) so the whole panel adds
// only a few KB of JS. A series that fails renders a pointer to the
// Rates page — never an invented line.
// ─────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Pt { date: string; price: number }
type Series = { pts: Pt[] } | 'loading' | 'failed';

const DATED_FX_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api';

async function jget(url: string): Promise<any | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Same daily-close reduction as fetchGoldRates() in rates.ts.
function dailyCloses(chart: any): Pt[] {
  const byDay = new Map<string, number>();
  for (const [ts, price] of (chart?.prices ?? []) as [number, number][]) {
    byDay.set(new Date(ts).toISOString().split('T')[0], price);
  }
  return [...byDay.entries()].map(([date, price]) => ({ date, price }));
}

async function goldSeries(): Promise<Pt[]> {
  const chart = await jget('https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=usd&days=30&interval=daily');
  return dailyCloses(chart);
}

async function btcSeries(): Promise<Pt[]> {
  const chart = await jget('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily');
  return dailyCloses(chart);
}

// Dated snapshots every 3 days across the last 30 days (11 files max);
// a day whose file is missing is skipped — never interpolated.
async function pkrSeries(): Promise<Pt[]> {
  const dates: string[] = [];
  for (let back = 30; back >= 0; back -= 3) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - back);
    dates.push(d.toISOString().split('T')[0]);
  }
  const results = await Promise.all(dates.map(async (date) => {
    const file = await jget(`${DATED_FX_BASE}@${date}/v1/currencies/usd.json`);
    const rate = file?.usd?.pkr;
    return typeof rate === 'number' ? { date: file?.date ?? date, price: rate } : null;
  }));
  return results.filter((r): r is Pt => r !== null).sort((a, b) => a.date.localeCompare(b.date));
}

function Spark({ pts }: { pts: Pt[] }) {
  const W = 300, H = 84, PAD = 6;
  const prices = pts.map((p) => p.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  const span = max - min || 1;
  const stepX = (W - PAD * 2) / Math.max(1, pts.length - 1);
  const xy = pts.map((p, i) => [PAD + i * stepX, H - PAD - ((p.price - min) / span) * (H - PAD * 2)] as const);
  const line = xy.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const up = pts[pts.length - 1].price >= pts[0].price;
  const stroke = up ? '#34d399' : '#fb7185';
  const [lx, ly] = xy[xy.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full" preserveAspectRatio="none" role="img"
      aria-label={`Trend line from ${pts[0].date} to ${pts[pts.length - 1].date}`}>
      <polygon points={`${PAD},${H - 2} ${line} ${lx.toFixed(1)},${H - 2}`} fill={stroke} opacity="0.12" />
      <polyline points={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lx} cy={ly} r="3" fill={stroke} />
    </svg>
  );
}

function ChartCard({ title, series, format, source }: {
  title: string; series: Series; format: (n: number) => string; source: string;
}) {
  return (
    <div className="rounded-3xl border t-border t-card p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] t-text-50">{title}</p>
      {series === 'loading' && (
        <div className="mt-3 flex h-20 items-center text-sm t-text-40">Loading live series…</div>
      )}
      {series === 'failed' && (
        <div className="mt-3 flex h-20 items-center text-sm t-text-50">
          Live series unavailable right now — <Link href="/rates" className="ml-1 t-amber hover:underline">see the Rates page</Link>
        </div>
      )}
      {typeof series === 'object' && (
        <>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3">
            <span className="text-2xl font-extrabold tabular-nums t-text">{format(series.pts[series.pts.length - 1].price)}</span>
            {(() => {
              const chg = ((series.pts[series.pts.length - 1].price - series.pts[0].price) / series.pts[0].price) * 100;
              return (
                <span className={`text-sm font-medium tabular-nums ${chg >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {chg >= 0 ? '▲' : '▼'} {Math.abs(chg).toFixed(2)}% · 30 days
                </span>
              );
            })()}
          </div>
          <div className="mt-2"><Spark pts={series.pts} /></div>
          <p className="mt-1 text-[11px] tabular-nums t-text-35">
            {series.pts[0].date} → {series.pts[series.pts.length - 1].date} · {series.pts.length} daily points
          </p>
        </>
      )}
      <p className="mt-2 text-[11px] leading-relaxed t-text-35">{source}</p>
    </div>
  );
}

export default function TrendCharts() {
  const [gold, setGold] = useState<Series>('loading');
  const [btc, setBtc] = useState<Series>('loading');
  const [pkr, setPkr] = useState<Series>('loading');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [g, b, p] = await Promise.allSettled([goldSeries(), btcSeries(), pkrSeries()]);
      if (cancelled) return;
      setGold(g.status === 'fulfilled' && g.value.length >= 2 ? { pts: g.value } : 'failed');
      setBtc(b.status === 'fulfilled' && b.value.length >= 2 ? { pts: b.value } : 'failed');
      setPkr(p.status === 'fulfilled' && p.value.length >= 2 ? { pts: p.value } : 'failed');
    })();
    return () => { cancelled = true; };
  }, []);

  const usd0 = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold t-text">30-Day Trends</h3>
      <p className="sub-desc mt-1">Live series drawn from the same feeds as the Rates page — fetched when you open this page, never cached or invented.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <ChartCard title="Gold — per troy ounce (USD)" series={gold} format={usd0}
          source="Source: CoinGecko PAX Gold market chart — the feed behind the Rates page gold history." />
        <ChartCard title="Bitcoin (USD)" series={btc} format={usd0}
          source="Source: CoinGecko Bitcoin market chart, daily closes." />
        <ChartCard title="US Dollar → Pakistani Rupee" series={pkr} format={(n) => `Rs ${n.toFixed(2)}`}
          source="Source: dated daily snapshots of the published currency dataset (@fawazahmed0/currency-api) — the feed behind the Rates page currency history." />
      </div>
    </div>
  );
}
