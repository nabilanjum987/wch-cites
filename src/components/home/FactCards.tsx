// ─────────────────────────────────────────────────────────────────────────
// FACT CARDS (owner addendum 2026-10-23, Polish Card 4; restructured
// in Stage 2, 2026-11-03) — the one-glance row inside §5 Today's World.
//
// Stage 2 owner rules applied here:
//   1) NO CITY DATA BEFORE "MY LOCATION": the default-city cards
//      (temperature, next prayer, gold per tola) moved into the
//      client-gated FactCardsCity row, which renders only after the
//      visitor opts in. Before that, this section is world data only.
//   2) WORLD POPULATION + LIFE EXPECTANCY MOVE HERE from §12 Live
//      Market Rates (they were never market figures), joined by a
//      continent population pie (WorldContinentPie) and by births /
//      deaths-today ESTIMATE counters. The estimates are derived on
//      the spot from the published population figure and the World
//      Bank's published crude birth / death rates, and are labelled
//      estimates with their sources, per the owner's condition.
// Every card names its source and renders ONLY when its figure
// loaded — never an invented number. AQI stays absent: the site's
// OpenAQ fallback is inoperative (see git history), so there is no
// working live AQI source to card.
// ─────────────────────────────────────────────────────────────────────────

import { getMyCityData } from '@/lib/home-mycity';
import { getMarketTickerItems } from '@/lib/tickers';
import PopulationCounter from './PopulationCounter';
import FactCardsCity from './FactCardsCity';
import WorldContinentPie from './WorldContinentPie';

async function jget(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const wbLatest = (json: any): { value: number; year: string } | null => {
  const row = Array.isArray(json?.[1]) ? json[1].find((r: any) => typeof r?.value === 'number') : null;
  return row ? { value: row.value, year: String(row.date) } : null;
};

function Card({ label, value, sub, source }: {
  label: string; value: React.ReactNode; sub?: React.ReactNode; source: string;
}) {
  return (
    <div className="rounded-3xl border t-border t-card p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] t-text-50">{label}</p>
      <p className="mt-2 text-2xl font-extrabold t-text">{value}</p>
      {sub && <p className="mt-1 text-xs t-text-50">{sub}</p>}
      <p className="mt-2 text-[11px] t-text-35">Source: {source}</p>
    </div>
  );
}

export default async function FactCards() {
  const [mc, items, lifeJson, birthJson, deathJson] = await Promise.all([
    getMyCityData('lahore').catch(() => null),
    getMarketTickerItems().catch(() => []),
    jget('https://api.worldbank.org/v2/country/WLD/indicator/SP.DYN.LE00.IN?format=json&per_page=3'),
    jget('https://api.worldbank.org/v2/country/WLD/indicator/SP.DYN.CBRT.IN?format=json&per_page=3'),
    jget('https://api.worldbank.org/v2/country/WLD/indicator/SP.DYN.CDRT.IN?format=json&per_page=3'),
  ]);
  const pop = items.find((i) => i.live?.type === 'population');
  const life = wbLatest(lifeJson);
  const birthRate = wbLatest(birthJson);
  const deathRate = wbLatest(deathJson);

  const world: React.ReactNode[] = [];
  if (pop?.live?.type === 'population') {
    world.push(
      <Card key="pop" label="World population: live estimate"
        value={<PopulationCounter base={pop.live.base} perSecond={pop.live.perSecond} at={pop.live.at} />}
        sub="Counting up in real time from the Bank's latest counted total"
        source="World Bank SP.POP.TOTL, grown at SP.POP.GROW" />,
    );
  }
  if (life) {
    world.push(
      <Card key="life" label="Life expectancy at birth"
        value={`${life.value.toFixed(1)} years`}
        sub="World average"
        source={`World Bank SP.DYN.LE00.IN (${life.year})`} />,
    );
  }
  // Births / deaths today: estimates derived from the published
  // population figure and the Bank's crude rates (per 1,000 people
  // per year), counted from the start of today, UTC. Labelled as
  // estimates on the card, per the owner's condition.
  if (pop?.live?.type === 'population' && birthRate && deathRate) {
    const now = Date.now();
    const secsToday = (now - Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())) / 1000;
    const perSec = (ratePer1000: number) => (pop.live!.base * (ratePer1000 / 1000)) / 31557600;
    const bPerSec = perSec(birthRate.value);
    const dPerSec = perSec(deathRate.value);
    world.push(
      <Card key="births" label="Births today: estimate"
        value={<PopulationCounter base={Math.round(bPerSec * secsToday)} perSecond={bPerSec} at={now} />}
        sub="Babies born worldwide since midnight UTC, estimated"
        source={`Estimate: World Bank population × crude birth rate SP.DYN.CBRT.IN (${birthRate.year})`} />,
      <Card key="deaths" label="Deaths today: estimate"
        value={<PopulationCounter base={Math.round(dPerSec * secsToday)} perSecond={dPerSec} at={now} />}
        sub="Deaths worldwide since midnight UTC, estimated"
        source={`Estimate: World Bank population × crude death rate SP.DYN.CDRT.IN (${deathRate.year})`} />,
    );
  }

  const hasCity = !!(mc?.weather || mc?.nextPrayer || mc?.goldTola);
  if (world.length === 0 && !hasCity) return null;

  return (
    <div className="mt-6 space-y-4">
      {world.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">{world}</div>
      )}
      {hasCity && (
        <FactCardsCity
          data={{
            cityName: mc!.name,
            temp: mc!.weather ? { temp: mc!.weather.temp, feels: mc!.weather.feels, condition: mc!.weather.condition } : null,
            prayer: mc!.nextPrayer ? { name: mc!.nextPrayer.name, time: mc!.nextPrayer.time, atMs: mc!.nextPrayer.atMs } : null,
            goldTola: mc!.goldTola ?? null,
          }}
        />
      )}
      <WorldContinentPie />
    </div>
  );
}
