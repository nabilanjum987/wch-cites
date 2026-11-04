import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import CompareTool from '@/components/compare/CompareTool';
import CompareView from '@/components/compare/CompareView';
import {
  getPairCompare, findCompareCity, getEntityCompare,
  findProvince, findCountry, findContinent, findOcean,
  findCanonicalPair, type CanonicalPair, type EntityCompareData,
} from '@/lib/compare';
import EntityCompareView from '@/components/compare/EntityCompareView';

// Replaces the original client page, which rendered a hard-coded
// `mockComparison` object: invented cost-of-living / safety / culture
// scores presented as real data. This version assembles the comparison
// from live sources only (see src/lib/compare.ts).
//
// Pair routing (B6): the canonical registry in lib/compare.ts is the
// only source of compare URLs. A reversed pair permanent-redirects to
// its registry form; a pair outside the registry 404s.

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function splitPair(slug: string): [string, string] | null {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return null;
  return [parts[0], parts[1]];
}

function resolvePair(slug: string): { pair: CanonicalPair; reversed: boolean } | null {
  const parts = splitPair(slug);
  if (!parts) return null;
  return findCanonicalPair(parts[0], parts[1]);
}

function entityNames(pair: CanonicalPair): [string, string] {
  switch (pair.kind) {
    case 'country': return [findCountry(pair.a)!.name, findCountry(pair.b)!.name];
    case 'continent': return [findContinent(pair.a)!.name, findContinent(pair.b)!.name];
    case 'ocean': return [findOcean(pair.a)!.name, findOcean(pair.b)!.name];
    default: return [findProvince(pair.a)!.name, findProvince(pair.b)!.name];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolvePair(slug);
  if (!resolved) return { title: 'Compare Cities | WorldCityHub' };
  const { pair } = resolved;
  const canonical = `https://worldcityhub.vercel.app/compare/${pair.slug}`;
  if (pair.kind === 'city') {
    const nameA = findCompareCity(pair.a)!.label;
    const nameB = findCompareCity(pair.b)!.label;
    return {
      title: `${nameA} vs ${nameB} | WorldCityHub`,
      description: `${nameA} vs ${nameB} compared with live data: current weather, air quality, today's prayer times, population and a measured scorecard.`,
      alternates: { canonical },
    };
  }
  const [nA, nB] = entityNames(pair);
  // Entity titles (S1): the short pattern below keeps every pair at or
  // under 60 characters (the longest, "Saudi Arabia vs United Arab
  // Emirates | WorldCityHub", is 52). Descriptions (S2) are kind-specific
  // and cite only the sources that kind actually uses. No cross-claims.
  const descriptions: Record<Exclude<CanonicalPair['kind'], 'city'>, string> = {
    province: `${nA} vs ${nB} compared on PBS Census 2023 figures: population, area, density and urban share for both provinces, plus live capital weather.`,
    country: `${nA} vs ${nB} on World Bank figures: population, GDP, GDP per capita, inflation, unemployment and life expectancy for both.`,
    continent: `${nA} vs ${nB} compared on World Bank country data grouped by continent: population, land area and density for both sides.`,
    ocean: `${nA} vs ${nB} compared on sourced facts from each ocean's own page: total area, maximum depth and average depth, sources shown.`,
  };
  return {
    title: `${nA} vs ${nB} | WorldCityHub`,
    description: descriptions[pair.kind as Exclude<CanonicalPair['kind'], 'city'>],
    alternates: { canonical },
  };
}

export default async function CompareSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolvePair(slug);
  if (!resolved) notFound();
  const { pair, reversed } = resolved;
  if (reversed) permanentRedirect(`/compare/${pair.slug}`);

  if (pair.kind !== 'city') {
    const data = await getEntityCompare(pair);
    if (!data) notFound();
    const intros: Record<EntityCompareData['kind'], string> = {
      province: 'Province against province on the 2023 census figure set: the same counts for both sides, plus live weather in each capital.',
      country: 'Country against country on one World Bank dataset: a row appears only where both countries report the same indicator.',
      continent: 'Continent against continent on World Bank country data, grouped with the same continent mapping this site publishes on its homepage: a row appears only where both sides carry the figure.',
      ocean: 'Ocean against ocean on the sourced facts each ocean page already prints: a row appears only where both records carry the fact, and every figure keeps its own page\u2019s source.',
    };
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <h1 className="text-3xl font-bold text-white">
          {data.a.name} vs {data.b.name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
          {intros[data.kind]}
        </p>
        <div className="mt-8">
          <EntityCompareView data={data} />
        </div>
      </main>
    );
  }

  const data = await getPairCompare(pair.a, pair.b);
  if (!data) notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="text-3xl font-bold text-white">
        {data.a.city.name} vs {data.b.city.name}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
        Side-by-side with live data only: weather, air quality, prayer times and population, measured at the
        same moment for both cities. This page updates hourly.
      </p>
      <div className="mt-6">
        <CompareTool initialA={pair.a} initialB={pair.b} />
      </div>
      <div className="mt-8">
        <CompareView a={data.a} b={data.b} />
      </div>
    </main>
  );
}
