// ─────────────────────────────────────────────────────────────────────────────
// F3 — Population single source: PBS Census-2023 admin-unit totals.
//
// ONE place holds the three live Pakistani cities' populations, and every
// rendered surface (city pages, compare pages, province/country live rows,
// homepage My City panel) reads from here — directly or through the
// census override in getCityData.ts — so the surfaces cannot drift apart
// again. Source: Pakistan Bureau of Statistics, 7th Population & Housing
// Census (2023), Detailed Results, Table 1 (admin-unit totals).
//
// Units (fixed with the figure, or the next edit drifts again):
//   Lahore    13,004,135 — Lahore District total (area 1,772 km²)
//   Karachi   20,382,881 — Karachi Division total, all 7 districts
//                          (area 3,527 km²; there is no single "Karachi
//                          district" anymore — the division is the
//                          smallest official unit covering the city)
//   Islamabad  2,363,863 — Islamabad Capital Territory total
//                          (area 906.5 km² per PBS; the city page renders
//                          the area as 906 — see note in the F3 report)
//
// Key spelling is the canonical page URL path
// (country/province/city). One legacy alias exists: supabase/schema.sql
// seeds the Islamabad row under province_slug 'islamabad', not the
// canonical URL spelling 'islamabad-capital-territory'. The alias maps
// that row spelling to the same figure — same city, same census value,
// never a second number. Do not "fix" the alias by editing the seed's
// province_slug here; that key change is a separate item.
// ─────────────────────────────────────────────────────────────────────────────

export const CENSUS_2023_POPULATION: Record<string, number> = {
  'pakistan/punjab/lahore': 13004135,
  'pakistan/sindh/karachi': 20382881,
  'pakistan/islamabad-capital-territory/islamabad': 2363863,
  // Legacy DB spelling of the same city (see header note).
  'pakistan/islamabad/islamabad': 2363863,
};

export const CENSUS_2023_SOURCE =
  'Pakistan Bureau of Statistics, 7th Population & Housing Census (2023), Detailed Results, Table 1';

/** Census figure for a canonical `country/province/city` key, or null. */
export function censusPopulationFor(key: string): number | null {
  return CENSUS_2023_POPULATION[key] ?? null;
}

/** True when this city key carries a PBS Census-2023 figure. */
export function hasCensusPopulation(key: string): boolean {
  return censusPopulationFor(key) != null;
}

/** Census figure, or the caller's value when this key has no census figure. */
export function censusPopulationOr(key: string, fallback: number): number {
  return CENSUS_2023_POPULATION[key] ?? fallback;
}

/** Census figure formatted with en-US grouping ("20,382,881"), or null. */
export function censusPopulationFormatted(key: string): string | null {
  const value = censusPopulationFor(key);
  return value == null ? null : value.toLocaleString('en-US');
}
