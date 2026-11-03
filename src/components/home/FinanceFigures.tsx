import { getMarketTickerItems } from '@/lib/tickers';

// Finance panel figures (§12) — SERVER component rendered inside the
// homepage's #finance section, under the market snapshot. Carries the
// Crypto Fear & Greed index card. Market figures themselves (gold,
// FX, crypto) live in the snapshot above and in the ticker, all from
// the same data layer (src/lib/tickers.ts).
//
// Stage 2 (owner ruling, 2026-11-03): the World Population counter
// and the Life Expectancy card MOVED OUT of this section into §5
// Today's World (FactCards) — they are world figures, not market
// rates, and the owner ordered them out of Live Market Rates. They
// are not duplicated here any more.

export default async function FinanceFigures() {
  const items = await getMarketTickerItems().catch(() => []);
  const fng = items.find((i) => i.label === 'Fear & Greed');
  if (!fng) return null;

  return (
    <div className="mt-6">
      <div className="rounded-2xl t-card border t-border p-5">
        <div className="text-[11px] uppercase tracking-wide t-g500 mb-1">Crypto Fear & Greed</div>
        <div className="t-text font-bold text-2xl">{fng.value}</div>
        <div className="sub-desc mt-1">Alternative.me index, updated daily</div>
      </div>
    </div>
  );
}
