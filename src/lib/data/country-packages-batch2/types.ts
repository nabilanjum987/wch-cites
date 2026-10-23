// Country package types (Round 3 / S1) — BUILD ONLY data packages.
// Nothing here is wired to a page; activation is billi's gated process.
//
// PANAMA LAW: iso2/iso3 in every package come from an EXPLICIT
// slug->ISO map written by hand in the package — never derived by
// slicing a slug (Round 1 PC1 root cause: "pakistan" -> "PA" = Panama).
export interface CountryEconomySnapshot {
  source: string;
  /** World Bank indicator code set identical to fetchWorldBankLatest (src/lib/apis/worldbank.ts). */
  indicators: Record<string, { value: number; year: number; indicator: string }>;
}
export interface CountryPersonalitySeed {
  slug: string; name: string; note: string; years: string;
  wikiUrl: string; wikiVerified: boolean;
}
export interface CountryPackage {
  slug: string; name: string;
  iso2: string; iso3: string; isoNote: string;
  capital: { name: string; lat: number | null; lng: number | null };
  areaKm2: number | null;
  currency: { code: string; name: string | null };
  languages: string[];
  callingCode: string | null;
  population: { value: number; year: number; indicator: string } | null;
  economySnapshot: CountryEconomySnapshot;
  subdivisionType: string;
  subdivisions: { name: string; capital: string }[];
  subdivisionsSource: string;
  personalitiesPool: CountryPersonalitySeed[];
  sources: string[];
}
