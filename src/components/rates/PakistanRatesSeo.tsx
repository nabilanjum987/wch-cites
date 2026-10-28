// A4 — Pakistan rates answers (server-rendered, /pakistan/rates only).
// Every figure here comes from a live feed at render time, with its
// source named beside it: silver from the gold-api XAG spot
// (fetchSilverRates, the canonical silver path), the dollar rate from
// the ExchangeRate-API open endpoint (fetchCurrencyPairs). Gold
// figures are NOT repeated here — one keyword, one page: each city
// gold figure lives on its own city rates page, linked below.
// Petrol and diesel carry NO pump figure: no verified OGRA feed is
// connected (fetchFuelPrices returns [] by design), so both answers
// say so honestly and point to OGRA's own notifications instead of
// printing an estimate. A failed feed renders an honest "unavailable
// right now" note, never a stale or invented number.
import Link from 'next/link';
import { fetchCurrencyPairs, fetchSilverRates } from '@/lib/apis/rates';

const fmt = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 2 });

export default async function PakistanRatesSeo() {
  const pairs = await fetchCurrencyPairs().catch(() => []);
  const pkr = pairs.find((p) => p.code === 'PKR');
  const fx = pkr?.rate ?? null;
  const silver = fx ? await fetchSilverRates(fx, 'PKR', '₨').catch(() => null) : null;
  const silverDate = silver
    ? new Date(silver.last_updated).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <section className="bg-[#0a0e1a] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <p className="max-w-3xl text-base leading-relaxed text-gray-300">
          Pakistan rates, answered directly — every figure below is read live at render time and shows its
          source. Where no verified feed exists, the page says so rather than printing an estimate.
        </p>

        <div>
          <h2 className="text-2xl font-bold">Silver Price in Pakistan Today</h2>
          {silver ? (
            <>
              <p className="mt-3 text-lg font-semibold text-gray-100">
                Silver: PKR {fmt(silver.per_tola)} per tola · PKR {fmt(silver.per_gram)} per gram
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Source: gold-api XAG spot, as of {silverDate} · converted at PKR {fmt(fx as number)} per US
                dollar (ExchangeRate-API open endpoint).
              </p>
              <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
                Silver in Pakistan today costs PKR {fmt(silver.per_tola)} per tola, or PKR{' '}
                {fmt(silver.per_gram)} per gram, converted from the gold-api XAG silver spot at the
                day&apos;s dollar rate of PKR {fmt(fx as number)} per US dollar. The figure is the
                national spot-derived rate, updated when the feed refreshes, and jewellers may charge a
                different retail price for finished silver. The source and as-of time are shown above
                the answer.
              </p>
            </>
          ) : (
            <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
              The live silver figure is unavailable right now because the gold-api XAG feed could not be
              read at render time. This page shows no estimate in its place; please refresh shortly. When
              the feed responds, the figure here is the national spot-derived rate per tola and per gram,
              converted at the day&apos;s dollar rate.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold">Diesel Price in Pakistan Today</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
            Diesel prices in Pakistan are notified by the Oil and Gas Regulatory Authority (OGRA) alongside
            petrol, and today&apos;s retail price is the one in OGRA&apos;s latest notification. This page
            shows no live diesel figure, because no verified OGRA feed is connected yet. Check{' '}
            <a
              href="https://www.ogra.org.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 underline"
            >
              OGRA&apos;s own notifications
            </a>{' '}
            for the current price; the live dollar rate below matters too, since diesel imports move with
            the exchange rate.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Dollar Rate in Pakistan Today</h2>
          {fx ? (
            <>
              <p className="mt-3 text-lg font-semibold text-gray-100">
                1 US dollar = PKR {fmt(fx)}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Source: ExchangeRate-API open endpoint (daily reference rate).
              </p>
              <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
                One US dollar buys PKR {fmt(fx)} in Pakistan today, at the ExchangeRate-API open rate used
                across this page. That is a daily reference rate; open-market bureaus and banks may quote
                slightly different buying and selling rates, and the rate moves through the day. The
                converter above applies this same rate to any amount you enter.
              </p>
              <h3 className="mt-6 text-xl font-bold">USD to PKR Today</h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
                Converting US dollars to Pakistani rupees today uses the rate of PKR {fmt(fx)} per dollar,
                so 100 dollars converts to about PKR {Math.round(100 * fx).toLocaleString('en-US')}. The
                figure comes from the ExchangeRate-API open endpoint and is refreshed through the day.
                Banks and exchange bureaus may apply their own margins, so the amount you actually receive
                can differ slightly from this reference conversion.
              </p>
              <h3 className="mt-6 text-xl font-bold">PKR to USD Today</h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
                Converting Pakistani rupees to US dollars today uses the same rate in reverse: PKR{' '}
                {fmt(fx)} buys one dollar, so 10,000 rupees converts to about $
                {(10000 / fx).toFixed(2)} dollars. The rate comes from the ExchangeRate-API open endpoint
                and is refreshed through the day. Banks and bureaus may apply margins, so the amount you
                actually receive can differ slightly from this reference conversion.
              </p>
            </>
          ) : (
            <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
              The live dollar rate is unavailable right now because the ExchangeRate-API open endpoint
              could not be read at render time. This page shows no estimate in its place; please refresh
              shortly. When the feed responds, the figure here is the daily reference rate of rupees per
              US dollar, with both conversion directions below it.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold">Gold Prices in Pakistan&apos;s Cities Today</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
            Gold is quoted from one national spot-derived rate, so each city page below carries that
            city&apos;s gold figure from the same gold-api XAU feed — the per-gram and per-tola prices in
            rupees, with the source and as-of time shown on the page.
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/pakistan/punjab/lahore/rates" className="text-cyan-300 underline">
                Gold price in Lahore today
              </Link>
            </li>
            <li>
              <Link href="/pakistan/sindh/karachi/rates" className="text-cyan-300 underline">
                Gold price in Karachi today
              </Link>
            </li>
            <li>
              <Link
                href="/pakistan/islamabad-capital-territory/islamabad/rates"
                className="text-cyan-300 underline"
              >
                Gold price in Islamabad today
              </Link>
            </li>
          </ul>
        </div>

        <p className="text-xs text-gray-500">
          Sources: silver — gold-api.com XAG spot; dollar — ExchangeRate-API open endpoint; fuel prices
          — Oil and Gas Regulatory Authority (OGRA) notifications at ogra.org.pk (no live feed connected,
          so no pump figure is shown); gold — gold-api.com XAU spot via the F4 helpers, on the city pages
          linked above.
        </p>
      </div>
    </section>
  );
}
