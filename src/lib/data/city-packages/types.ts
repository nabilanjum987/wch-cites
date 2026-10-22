// ─────────────────────────────────────────────────────────────────────────────
// City data package — BUILD ONLY (Round 2, R4).
//
// A complete, activation-ready dataset for one city, in the exact shape the
// city template consumes. NOT wired into the live registry, the sitemap or
// any published list: activation stays gated on billi's PASS + the owner.
// Identity figures were verified against Wikidata on 2026-10-22 (QID in the
// sources); cultural datasets are compiled from the standard references
// named per group and are flagged for a spot-check at activation.
// ─────────────────────────────────────────────────────────────────────────────
import type { City } from '@/types/city';

export interface CityPackageSource { group: string; source: string; detail: string }
export interface CityPackage {
  /** Exact template record (src/types/city.ts). is_active stays false. */
  identity: Omit<City, 'religion_percent'> & { religion_percent: number | null };
  /** Economy sections resolve through the one cached country dataset. */
  economyCountryIso2: 'PK';
  glanceFacts: { label: string; value: string }[];
  foods: { name: string; note: string }[];
  landmarks: { name: string; note: string }[];
  emergency: { police: string; ambulance: string; fire: string; rescueNote: string; hospitals: { name: string; note: string }[] };
  personalitySeeds: { name: string; field: string; note: string; source: string }[];
  sources: CityPackageSource[];
  verifiedAt: string;
}
