import type { Metadata } from 'next';
import Link from 'next/link';
import CompareTool from '@/components/compare/CompareTool';
import CompareView from '@/components/compare/CompareView';
import { getPairCompare, POPULAR_PAIRS, findCompareCity, PROVINCE_PAIRS, findProvince } from '@/lib/compare';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Compare Cities — Weather, Prayer Times, AQI | WorldCityHub',
  description: 'Compare two cities side by side with live data: weather, air quality, prayer times, population and more. Lahore vs Karachi and other popular comparisons.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/compare' },
};

export default async function ComparePage() {
  const pair = await getPairCompare('lahore', 'karachi');
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="text-3xl font-bold text-white">Compare Cities</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
        A decision tool built only on live, measurable data — current weather, air quality, today&apos;s prayer
        times and population for both cities, side by side. Pick any two cities to compare.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
        Every figure here is measured, not estimated: the same live weather, air-quality and prayer-time
        services feed both sides, so the verdict is decided by the data rather than by adjectives.
        Categories that have no honest, free data source — day-to-day living costs, for example — are left
        out entirely rather than filled with guesses.
      </p>

      <div className="mt-6">
        <CompareTool />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {POPULAR_PAIRS.map(([x, y]) => (
          <Link
            key={`${x}-${y}`}
            href={`/compare/${x}-vs-${y}`}
            className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-200 transition hover:bg-white/10"
          >
            {findCompareCity(x)?.label} vs {findCompareCity(y)?.label}
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-xl font-bold text-white">Popular: Lahore vs Karachi</h2>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-gray-400">
        The pairing readers ask for most: Pakistan&apos;s two largest cities on the same live figures, head
        to head. For the full picture behind the numbers, open{' '}
        <Link href="/pakistan/punjab/lahore" className="text-emerald-300 underline">Lahore’s complete guide</Link> and{' '}
        <Link href="/pakistan/sindh/karachi" className="text-emerald-300 underline">Karachi’s</Link> — weather,
        prayer times, rates, events and news for each city.
      </p>
      {pair ? (
        <CompareView a={pair.a} b={pair.b} />
      ) : (
        <p className="text-sm text-gray-400">Live comparison data is unavailable right now — please try again shortly.</p>
      )}
    
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white">Province vs province — 2023 census figures</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-400">
          The same census figure set for both sides (Pakistan Bureau of Statistics, 2023), plus live weather in each capital.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {PROVINCE_PAIRS.map(([x, y]) => (
            <Link
              key={`${x}-${y}`}
              href={`/compare/${x}-vs-${y}`}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              {findProvince(x)!.name} vs {findProvince(y)!.name}
            </Link>
          ))}
        </div>
        <h2 className="mt-8 text-lg font-semibold text-white">Country vs country — World Bank</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-400">
          One dataset, both sides: a figure appears only where Pakistan and India report the same World Bank indicator.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/compare/pakistan-vs-india"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Pakistan vs India
          </Link>
        </div>
      </section>

      <p className="mt-10 max-w-2xl text-sm leading-relaxed text-gray-400">
        Comparisons exist only for cities with full published guides, and the list grows as new cities pass
        the same verification standard. To suggest a pairing — or to report a figure that looks wrong — use
        the <Link href="/improve" className="text-emerald-300 underline">suggestion form</Link>.
      </p>
</main>
  );
}
