import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { COMPARE_CITIES } from '@/lib/compare';

// "What this country has on WorldCityHub" — a coverage inventory built
// ONLY from real site data (Supabase rows + the live city registry).
// If a country has no live coverage yet, this renders nothing rather
// than dressing up an empty shelf.
export default async function CountryInventory({ countrySlug }: { countrySlug: string }) {
  let countryName = '';
  let provinces: { slug: string; name: string }[] = [];
  const cityMap = new Map<string, { slug: string; name: string; province_slug: string }>();
  try {
    const sb = getSupabase();
    const { data: ctry } = await sb.from('countries').select('name').eq('slug', countrySlug).maybeSingle();
    if (ctry?.name) countryName = ctry.name as string;
    const { data: provs } = await sb.from('provinces').select('slug,name').eq('country_slug', countrySlug);
    if (provs) provinces = provs as { slug: string; name: string }[];
    const { data: cities } = await sb
      .from('cities')
      .select('slug,name,province_slug')
      .eq('country_slug', countrySlug);
    for (const c of cities ?? []) {
      cityMap.set(c.slug as string, {
        slug: c.slug as string,
        name: c.name as string,
        province_slug: c.province_slug as string,
      });
    }
  } catch {
    /* fall through to registry data */
  }
  for (const c of COMPARE_CITIES) {
    if (c.countrySlug === countrySlug && !cityMap.has(c.citySlug)) {
      cityMap.set(c.citySlug, { slug: c.citySlug, name: c.label, province_slug: c.provinceSlug });
    }
    if (c.countrySlug === countrySlug && !countryName) {
      countryName = countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1);
    }
  }
  const cities = [...cityMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  if (!countryName || cities.length === 0) return null;

  const provinceCount = provinces.length > 0 ? provinces.length : new Set(cities.map((c) => c.province_slug)).size;
  const pageTypes = ['City guide', 'Weather', 'Prayer times', 'Rates', 'News', 'Economy', 'Events', 'Sports'];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-2 pt-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white">What {countryName} has on WorldCityHub</h2>
        <p className="mt-1 text-sm text-gray-400">
          Our verified coverage for {countryName} right now — this list only shows what is actually live.
          Coverage grows in quality-checked batches; a city appears here only when its pages pass the gate.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-200">
            {provinceCount} province{provinceCount === 1 ? '' : 's'} covered
          </span>
          <span className="rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-200">
            {cities.length} city guide{cities.length === 1 ? '' : 's'} live
          </span>
          <span className="rounded-full bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-200">
            {pageTypes.length} page types per city
          </span>
        </div>
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">City guides live now</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/${countrySlug}/${c.province_slug}/${c.slug}`}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-100 transition hover:bg-white/10"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-gray-400">
          Every city guide bundles {pageTypes.join(', ').toLowerCase()} — live data from OpenWeatherMap,
          Aladhan, CoinGecko, the World Bank and GNews, never placeholder numbers.
        </p>
      </div>
    </section>
  );
}
