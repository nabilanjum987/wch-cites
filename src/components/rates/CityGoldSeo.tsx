// A4: city gold answer (server-rendered, city rates pages).
// The figures are the page's OWN server-fetched gold rates
// (fetchGoldRates = F4 gold-api XAU spot, CoinGecko PAXG for history
// only), passed in as props so this section can never disagree with
// the hero strip above it. The rate is the national spot-derived
// figure; the section says so, and never claims a separate city
// market quote. A null figure renders an honest unavailable note.
//
// 3 Nov 2026 (subpages fix A):
//   R1: the H1 "Gold Price in {City} Today" now sits at the top of
//       the page (RatesPageClient); this section's heading is the
//       former H1 text, "Pakistan Gold Rates", kept as a section
//       heading.
//   R2: the honesty sentence names all five cities the rate serves.
//   R3: a one-line note explains why this page's figure can differ
//       from the site ticker (the page figure is live spot-derived;
//       the ticker refreshes on its own cycle; aligning the two
//       feeds was non-trivial because the ticker converts through
//       its own live FX snapshot while the page converts at the
//       country currency rate, so the note was chosen).
//   S2: the visible AEO Q&A below and the FAQPage JSON-LD are built
//       from the SAME array (lib/data/gold-faqs.ts).
import JsonLd from '@/components/seo/JsonLd';
import { faqPageSchema } from '@/components/aeo/AnswerLayer';
import { buildCityGoldFaqs, goldHonestySentence, GOLD_TICKER_NOTE } from '@/lib/data/gold-faqs';

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
  const faqs = buildCityGoldFaqs(cityName, perGram, perTola, feedLabel);

  return (
    <section className="bg-[#0a0e1a] px-4 py-12 text-white sm:px-6 lg:px-8">
      {faqs.length > 0 && <JsonLd data={faqPageSchema(faqs)} />}
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold">Pakistan Gold Rates</h2>
        {perGram !== null && perTola !== null ? (
          <>
            <p className="mt-3 text-lg font-semibold text-gray-100">
              Gold in {cityName}: PKR {fmt(perGram)} per gram (24K) · PKR {fmt(perTola)} per tola
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Source: {feedLabel}
              {asOf ? `, as of ${asOf}` : ''} · converted to PKR at the page&apos;s dollar rate.
            </p>
            <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
              {goldHonestySentence(cityName, perGram, perTola, feedLabel)}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
              {GOLD_TICKER_NOTE}
            </p>
            <div className="mt-8">
              <h3 className="text-lg font-bold text-white">Gold price in {cityName}, answered</h3>
              <div className="mt-3 space-y-4">
                {faqs.map((f) => (
                  <div key={f.q}>
                    <h4 className="font-semibold text-white">{f.q}</h4>
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-gray-300">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
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
