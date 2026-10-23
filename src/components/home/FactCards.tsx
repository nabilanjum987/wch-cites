// ─────────────────────────────────────────────────────────────────────────
// FACT CARDS (owner addendum 2026-10-23, Polish Card 4) — a one-glance
// row inside §5 Today's World. Every card is built from a figure the
// homepage ALREADY computes through an existing data path, and every
// card names its source:
//   Lahore temperature — getMyCityData (Open-Meteo), the My City feed
//   Next prayer        — getMyCityData (Aladhan), with a live countdown
//   Gold per tola (PKR) — getMyCityData (CoinGecko PAX Gold × tola ratio)
//   World population   — getMarketTickerItems live payload (World Bank
//                        SP.POP.TOTL grown at SP.POP.GROW), ticked by
//                        the same PopulationCounter as §12 — this is
//                        also the addendum's animated counter: the one
//                        figure on the page with a real, continuous
//                        live model behind it.
// A card renders ONLY when its figure loaded — never an invented
// number. AQI is deliberately absent: the site's OpenAQ fallback is
// inoperative today (v2 returns HTTP 410, v3 needs a key the site does
// not hold), so there is no working live AQI source to card.
// ─────────────────────────────────────────────────────────────────────────

import { getMyCityData } from '@/lib/home-mycity';
import { getMarketTickerItems } from '@/lib/tickers';
import PopulationCounter from './PopulationCounter';
import PrayerCountdown from './PrayerCountdown';

function Card({ label, value, sub, source }: {
  label: string; value: React.ReactNode; sub?: React.ReactNode; source: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/50">{sub}</p>}
      <p className="mt-2 text-[11px] text-white/35">Source: {source}</p>
    </div>
  );
}

export default async function FactCards() {
  const [mc, items] = await Promise.all([
    getMyCityData('lahore').catch(() => null),
    getMarketTickerItems().catch(() => []),
  ]);
  const pop = items.find((i) => i.live?.type === 'population');

  const cards: React.ReactNode[] = [];
  if (mc?.weather) {
    cards.push(
      <Card key="temp" label="Lahore — right now"
        value={`${mc.weather.temp}°C`}
        sub={`${mc.weather.condition} · feels like ${mc.weather.feels}°C`}
        source="Open-Meteo (the My City weather feed)" />,
    );
  }
  if (mc?.nextPrayer) {
    cards.push(
      <Card key="prayer" label="Next prayer — Lahore"
        value={mc.nextPrayer.name}
        sub={<>{mc.nextPrayer.time} · <PrayerCountdown atMs={mc.nextPrayer.atMs} /></>}
        source="Aladhan (the My City prayer feed)" />,
    );
  }
  if (mc?.goldTola) {
    cards.push(
      <Card key="gold" label="Gold — per tola (PKR)"
        value={`Rs ${mc.goldTola.toLocaleString('en-PK')}`}
        sub="24k gold, one tola (11.6638 g)"
        source="CoinGecko PAX Gold (the My City gold feed)" />,
    );
  }
  if (pop?.live?.type === 'population') {
    cards.push(
      <Card key="pop" label="World population — live estimate"
        value={<PopulationCounter base={pop.live.base} perSecond={pop.live.perSecond} at={pop.live.at} />}
        sub="Counting up in real time from the Bank's latest counted total"
        source="World Bank SP.POP.TOTL, grown at SP.POP.GROW" />,
    );
  }

  if (cards.length === 0) return null;
  return (
    <div className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2">{cards}</div>
    </div>
  );
}
