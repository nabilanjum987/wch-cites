// Place row types (Round 3 / S3) — golden-blueprint shape, DATA ONLY.
// Mirrors the Wonder record structure of WP4 (src/lib/wonders.ts) so a
// place row can be ingested by the same template family unchanged.
export interface PlaceMedia {
  fileTitle: string; fileUrl: string; pageUrl: string;
  width: number; height: number;
  licence: string; licenceUrl: string; author: string; attribution: string;
  role: 'hero' | 'gallery' | 'timeline' | 'detail'; alt: string; sortOrder: number;
}
export interface PlaceFact { label: string; value: string; source: string }
export interface PlaceSource { claim: string; sourceName: string; sourceUrl: string; checkedAt: string }
export interface PlaceRow {
  slug: string; name: string; category: string;
  wikidataQid: string; wikidataDescription: string;
  unescoId: number | null;
  cityName: string; regionName: string; countryName: string;
  lat: number | null; lng: number | null; timezone: string;
  facts: PlaceFact[];
  media: PlaceMedia[];
  liveLayer: { provider: string; endpoints: string[]; fields: string[]; note: string };
  sources: PlaceSource[];
}
