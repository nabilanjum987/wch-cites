// International city package types (Round 3 / S2) — BUILD ONLY.
// Shape mirrors the country-template city dataset: identity, glance
// facts (every figure sourced), landmarks, foods, emergency numbers,
// parent-country reference and the local-source map (API map doctrine:
// free LOCAL official sources first at activation).
export interface IntlCityPackage {
  qid: string;
  slug: string; name: string;
  countrySlug: string; countryIsoNote: string;
  province: string; timezone: string;
  lat: number | null; lng: number | null;
  glance: {
    population: { value: number; year: number | null; source: string } | null;
    areaKm2: number | null; elevationM: number | null; glanceSource: string;
  };
  landmarks: { name: string; wikiUrl: string | null; wikiVerified: boolean; resolvedFrom?: string; note?: string }[];
  foods: { name: string; description: string }[];
  emergency: Record<string, string>;
  localSources: string[];
  diaspora: { figures: string; note: string } | null;
  sources: string[];
}
