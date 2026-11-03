import type { Metadata } from 'next';
import Link from 'next/link';
import CompareTool from '@/components/compare/CompareTool';
import {
  getPairCompare, POPULAR_PAIRS, findCompareCity, PROVINCE_PAIRS, findProvince,
  CANONICAL_PAIRS, aqiScore,
} from '@/lib/compare';
import { censusPopulationOr } from '@/lib/census2023';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Compare Cities: Weather, Prayer Times, AQI | WorldCityHub',
  description: 'Compare two cities side by side with live data: weather, air quality, prayer times, population and more. Lahore vs Karachi and other popular comparisons.',
  alternates: { canonical: 'https://worldcityhub.vercel.app/compare' },
};

function fmtPop(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${n}`;
}

export default async function ComparePage() {
  const pair = await getPairCompare('lahore', 'karachi');
  // Compact summary figures for the featured pair (S5): headline numbers
  // and the verdict line only. The full comparison lives on the pair page;
  // the hub no longer duplicates the whole CompareView.
  let summary: {
    verdict: string;
    figures: string;
  } | null = null;
  if (pair) {
    const { a, b } = pair;
    const popA = censusPopulationOr('pakistan/punjab/lahore', a.city.population);
    const popB = censusPopulationOr('pakistan/sindh/karachi', b.city.population);
    const comfortWinner = a.comfort != null && b.comfort != null && a.comfort !== b.comfort
      ? (a.comfort > b.comfort ? a : b) : null;
    const aqiWinnerSide = aqiScore(a.aqi) != null && aqiScore(b.aqi) != null && aqiScore(a.aqi) !== aqiScore(b.aqi)
      ? (aqiScore(a.aqi)! > aqiScore(b.aqi)! ? a : b) : null;
    const winsA = (comfortWinner === a ? 1 : 0) + (aqiWinnerSide === a ? 1 : 0);
    const winsB = (comfortWinner === b ? 1 : 0) + (aqiWinnerSide === b ? 1 : 0);
    const verdict = winsA > winsB
      ? `${a.city.name} leads ${winsA}–${winsB} on the live scorecard`
      : winsB > winsA
        ? `${b.city.name} leads ${winsB}–${winsA} on the live scorecard`
        : `the two are level at ${winsA}–${winsB} on the live scorecard`;
    summary = {
      verdict,
      figures: `${a.city.name} ${popA ? fmtPop(popA) : ''} people, ${a.temp != null ? `${a.temp}°C` : 'temperature unavailable'}, US AQI ${a.aqi ?? 'unavailable'} · ${b.city.name} ${popB ? fmtPop(popB) : ''} people, ${b.temp != null ? `${b.temp}°C` : 'temperature unavailable'}, US AQI ${b.aqi ?? 'unavailable'}`,
    };
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="text-3xl font-bold text-white">Compare Cities</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
        A decision tool built only on live, measurable data: current weather, air quality, today&apos;s prayer
        times and population for both cities, side by side. Pick any two cities to compare. Live figures on
        the pair pages are updated hourly.
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
        Every figure here is measured, not estimated: the same live weather, air-quality and prayer-time
        services feed both sides, so the verdict is decided by the data rather than by adjectives.
        Categories that have no honest, free data source, day-to-day living costs for example, are left
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
        <Link href="/pakistan/punjab/lahore" className="text-emerald-300 underline">Lahore&apos;s complete guide</Link> and{' '}
        <Link href="/pakistan/sindh/karachi" className="text-emerald-300 underline">Karachi&apos;s</Link>: weather,
        prayer times, rates, events and news for each city.
      </p>
      {summary ? (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-gray-300">{summary.figures}</p>
          <p className="mt-2 text-sm font-semibold text-white">Right now, {summary.verdict}.</p>
          <p className="mt-3 text-sm">
            <Link href="/compare/lahore-vs-karachi" className="text-emerald-300 underline">
              Open the full Lahore vs Karachi comparison
            </Link>
            <span className="text-gray-500"> · live conditions, prayer times, scorecard and method, updated hourly</span>
          </p>
        </section>
      ) : (
        <p className="text-sm text-gray-400">Live comparison data is unavailable right now. Please try again shortly.</p>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white">Province vs province: 2023 census figures</h2>
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
        <h2 className="mt-8 text-lg font-semibold text-white">Country vs country: World Bank</h2>
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
        The pairs above are the complete published set: {CANONICAL_PAIRS.length} comparisons in the canonical
        registry ({POPULAR_PAIRS.length} city pairs, {PROVINCE_PAIRS.length} province pairs and one country
        pair). A pair enters the registry only when both sides carry verified figures, and the sitemap lists
        exactly the registry pairs. To suggest a pairing, or to report a figure that looks wrong, use
        the <Link href="/improve" className="text-emerald-300 underline">suggestion form</Link>.
      </p>
</main>
  );
}
