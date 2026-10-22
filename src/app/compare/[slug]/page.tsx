import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CompareTool from '@/components/compare/CompareTool';
import CompareView from '@/components/compare/CompareView';
import { getPairCompare, findCompareCity } from '@/lib/compare';

// Replaces the original client page, which rendered a hard-coded
// `mockComparison` object — invented cost-of-living / safety / culture
// scores presented as real data. This version assembles the comparison
// from live sources only (see src/lib/compare.ts).

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

function parsePair(slug: string): [string, string] | null {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return null;
  const [a, b] = parts;
  if (!findCompareCity(a) || !findCompareCity(b) || a === b) return null;
  return [a, b];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parsePair(slug);
  if (!parsed) return { title: 'Compare Cities | WorldCityHub' };
  const [a, b] = parsed;
  const nameA = findCompareCity(a)!.label;
  const nameB = findCompareCity(b)!.label;
  return {
    title: `${nameA} vs ${nameB} — Compared Live | WorldCityHub`,
    description: `${nameA} vs ${nameB} compared with live data: current weather, air quality, today's prayer times, population and a measured scorecard.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/compare/${slug}` },
  };
}

export default async function CompareSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parsePair(slug);
  if (!parsed) notFound();
  const [aSlug, bSlug] = parsed;
  const data = await getPairCompare(aSlug, bSlug);
  if (!data) notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="text-3xl font-bold text-white">
        {data.a.city.name} vs {data.b.city.name}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
        Side-by-side with live data only — weather, air quality, prayer times and population, measured at the
        same moment for both cities.
      </p>
      <div className="mt-6">
        <CompareTool initialA={aSlug} initialB={bSlug} />
      </div>
      <div className="mt-8">
        <CompareView a={data.a} b={data.b} />
      </div>
    </main>
  );
}
