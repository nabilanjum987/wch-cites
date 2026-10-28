// A4 — city gold answer (server-rendered, city rates pages).
// The figures are the page's OWN server-fetched gold rates
// (fetchGoldRates = F4 gold-api XAU spot, CoinGecko PAXG for history
// only), passed in as props so this section can never disagree with
// the hero strip above it. The rate is the national spot-derived
// figure — the section says so, and never claims a separate city
// market quote. A null figure renders an honest unavailable note.
interface CityGoldSeoProps {
  cityName: string;
  perGram: number | null;
  perTola: number | null;
  spotSource: 'gold-api-xau' | 'coingecko-pax-gold' | null;
  lastUpdated: string | null;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 2 });

export default function CityGoldSeo({
  cityName,
  perGram,
  perTola,
  spotSource,
  lastUpdated,
}: CityGoldSeoProps) {
  const feedLabel =
    spotSource === 'coingecko-pax-gold'
      ? 'CoinGecko PAX Gold (gold-api XAU unavailable at render time)'
      : 'gold-api XAU spot';
  const asOf = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <section className="bg-[#0a0e1a] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold">Gold Price in {cityName} Today</h2>
        {perGram !== null && perTola !== null ? (
          <>
            <p className="mt-3 text-lg font-semibold text-gray-100">
              Gold: PKR {fmt(perGram)} per gram (24K) · PKR {fmt(perTola)} per tola
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Source: {feedLabel}
              {asOf ? `, as of ${asOf}` : ''} · converted to PKR at the page&apos;s dollar rate.
            </p>
            <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
              Gold in {cityName} today costs PKR {fmt(perGram)} per gram for 24K, or PKR{' '}
              {fmt(perTola)} per tola, from the {feedLabel} converted to rupees. The rate is the
              national spot-derived figure, so it is the same in Lahore, Karachi and Islamabad, while
              jewellers&apos; retail prices for finished pieces may differ. The source and as-of time are
              shown above.
            </p>
          </>
        ) : (
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
            Gold prices for {cityName} are drawn from the national gold-api XAU spot converted to
            rupees, so the city figure is the national spot-derived rate rather than a separate city
            market quote. The live figure is unavailable right now because the feed could not be read;
            the page shows no estimate in its place. Please refresh shortly, or check the Pakistan rates
            page for the latest national figure.
          </p>
        )}
      </div>
    </section>
  );
}
