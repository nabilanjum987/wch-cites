import { getMarketTickerItems } from '@/lib/tickers';
import PopulationCounter from './PopulationCounter';

// Finance panel figures (§12) — SERVER component rendered inside the
// homepage's #finance section, under the market snapshot. Carries the
// spec's index trio: Fear & Greed, the World Population live counter
// (labelled honestly as a World Bank-anchored estimate), and world
// life expectancy (World Bank latest, with its year). Market figures
// themselves (gold/FX/crypto) live in the snapshot above and in the
// ticker, all from the same data layer (src/lib/tickers.ts).

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

export default async function FinanceFigures() {
  const [items, life] = await Promise.all([
    getMarketTickerItems().catch(() => []),
    jget('https://api.worldbank.org/v2/country/WLD/indicator/SP.DYN.LE00.IN?format=json&per_page=3'),
  ]);
  const fng = items.find((i) => i.label === 'Fear & Greed');
  const pop = items.find((i) => i.live?.type === 'population');
  const lifeRow = Array.isArray(life?.[1]) ? life[1].find((r: any) => typeof r?.value === 'number') : null;

  if (!fng && !pop && !lifeRow) return null;

  const card = 'rounded-2xl bg-white/5 border border-white/10 p-5';
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
        {fng && (
          <div className={card}>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Crypto Fear & Greed</div>
            <div className="text-white font-bold text-2xl">{fng.value}</div>
            <div className="sub-desc mt-1">Alternative.me index, updated daily</div>
          </div>
        )}
        {pop?.live?.type === 'population' && (
          <div className={card}>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">World Population — live estimate</div>
            <div className="text-white font-bold text-2xl">
              <PopulationCounter base={pop.live.base} perSecond={pop.live.perSecond} at={pop.live.at} />
            </div>
            <div className="sub-desc mt-1">
              An estimate: the World Bank's latest counted total, grown at the Bank's published growth rate.
            </div>
          </div>
        )}
        {lifeRow && (
          <div className={card}>
            <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Life expectancy at birth</div>
            <div className="text-white font-bold text-2xl">{Number(lifeRow.value).toFixed(1)} years</div>
            <div className="sub-desc mt-1">World average, World Bank ({lifeRow.date})</div>
          </div>
        )}
      </div>
    </div>
  );
}
