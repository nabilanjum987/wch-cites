'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Coins, DollarSign, BarChart3 } from 'lucide-react';

// Live market snapshot — every number is fetched at runtime from free
// keyless APIs (CoinGecko for gold/BTC/USD-PKR, Open Exchange Rates API
// for the currency table, Alternative.me for Fear & Greed).
// Truth rule: nothing here is hardcoded. A value that fails to load is
// replaced by a pointer to the Rates page, never by an invented number.
// The old Oil card was removed: there is no free, keyless, reliable oil
// feed, and the plan forbids presenting made-up prices as live.

interface MarketState {
  goldPerGram: number | null;
  goldChange: number | null;
  btc: number | null;
  btcChange: number | null;
  usdPkr: number | null;
  usdPkrChange: number | null;
  fx: { pair: string; rate: number }[] | null;
  fng: { value: number; label: string } | null;
  loaded: boolean;
}

const EMPTY: MarketState = {
  goldPerGram: null, goldChange: null,
  btc: null, btcChange: null,
  usdPkr: null, usdPkrChange: null,
  fx: null, fng: null, loaded: false,
};

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function Change({ value }: { value: number | null }) {
  if (value == null) return null;
  return (
    <span className={`text-sm font-medium ${value >= 0 ? 't-green' : 't-red'}`}>
      {value >= 0 ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
    </span>
  );
}

export default function GlobalMarketSnapshot() {
  const [m, setM] = useState<MarketState>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: MarketState = { ...EMPTY, loaded: true };
      const [cg, fxRes, fngRes] = await Promise.allSettled([
        fetchJson('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold,tether&vs_currencies=usd,pkr&include_24hr_change=true'),
        fetchJson('https://open.er-api.com/v6/latest/USD'),
        fetchJson('https://api.alternative.me/fng/?limit=1'),
      ]);
      if (cg.status === 'fulfilled') {
        const gold = cg.value?.['pax-gold'];
        const btc = cg.value?.bitcoin;
        const usdt = cg.value?.tether;
        if (gold?.usd) {
          next.goldPerGram = gold.usd / 31.1035;
          next.goldChange = gold.usd_24h_change ?? null;
        }
        if (btc?.usd) {
          next.btc = btc.usd;
          next.btcChange = btc.usd_24h_change ?? null;
        }
        if (usdt?.pkr) {
          next.usdPkr = usdt.pkr;
          next.usdPkrChange = usdt.pkr_24h_change ?? null;
        }
      }
      if (fxRes.status === 'fulfilled') {
        const r = fxRes.value?.rates;
        if (r) {
          const pairs: { pair: string; rate: number }[] = [];
          if (r.EUR) pairs.push({ pair: 'EUR/USD', rate: 1 / r.EUR });
          if (r.GBP) pairs.push({ pair: 'GBP/USD', rate: 1 / r.GBP });
          if (r.JPY) pairs.push({ pair: 'USD/JPY', rate: r.JPY });
          if (r.CHF) pairs.push({ pair: 'USD/CHF', rate: r.CHF });
          if (r.INR) pairs.push({ pair: 'USD/INR', rate: r.INR });
          if (r.PKR) pairs.push({ pair: 'USD/PKR', rate: r.PKR });
          if (r.SAR) pairs.push({ pair: 'USD/SAR', rate: r.SAR });
          if (r.AED) pairs.push({ pair: 'USD/AED', rate: r.AED });
          if (pairs.length) next.fx = pairs;
        }
      }
      if (fngRes.status === 'fulfilled') {
        const f = fngRes.value?.data?.[0];
        if (f?.value) next.fng = { value: Number(f.value), label: f.value_classification ?? '' };
      }
      if (!cancelled) setM(next);
    })();
    return () => { cancelled = true; };
  }, []);


  return (
    <div className="mb-4">
      {/* Explore link — no duplicate title */}
      <div className="flex justify-end mb-4">
        <Link href="/rates" className="flex items-center gap-1 t-yellow text-sm font-medium transition-colors no-underline">
          Full rates page <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3 commodity cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-xl p-5 border border-yellow-400/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Coins className="w-5 h-5 t-gold" /><span className="font-semibold t-text">Gold</span></div>
            <Change value={m.goldChange} />
          </div>
          <div className="text-2xl font-bold t-text">
            {m.goldPerGram != null ? <>${m.goldPerGram.toFixed(2)}<span className="t-g400 text-sm ml-1">/gram</span></> : <span className="text-base t-g400">{'Live on the Rates page'}</span>}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-5 border border-orange-400/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-orange-400" /><span className="font-semibold t-text">Bitcoin</span></div>
            <Change value={m.btcChange} />
          </div>
          <div className="text-2xl font-bold t-text">
            {m.btc != null ? `$${Math.round(m.btc).toLocaleString()}` : <span className="text-base t-g400">{'Live on the Rates page'}</span>}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-5 border border-emerald-400/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /><span className="font-semibold t-text">USD / PKR</span></div>
            <Change value={m.usdPkrChange} />
          </div>
          <div className="text-2xl font-bold t-text">
            {m.usdPkr != null ? `Rs ${m.usdPkr.toFixed(2)}` : <span className="text-base t-g400">{'Live on the Rates page'}</span>}
          </div>
        </div>
      </div>

      {/* Currency table — real rates; daily change is not available from
          the free feed, so it is not shown rather than invented. */}
      {m.fx && (
        <div className="rounded-xl border t-border-8 overflow-hidden mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {m.fx.map((c) => (
              <div key={c.pair} className="p-3 border-b border-r t-border-6 last:border-r-0">
                <div className="t-g400 text-xs mb-1">{c.pair}</div>
                <div className="flex items-center justify-between">
                  <span className="t-text font-semibold">{c.rate.toFixed(c.rate > 10 ? 2 : 4)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fear & Greed */}
      {m.fng && (
        <div className="flex items-center gap-4 p-4 rounded-xl border t-border-8">
          <div className="t-g400 text-sm">Fear &amp; Greed Index</div>
          <div className={`text-2xl font-bold ${m.fng.value > 50 ? 't-green' : 't-red'}`}>{m.fng.value}</div>
          <div className="t-g400 text-sm">{m.fng.label}</div>
          <div className="flex-1 h-2 t-card rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style={{ width: `${m.fng.value}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
