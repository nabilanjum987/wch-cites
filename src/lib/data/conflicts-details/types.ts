// Conflicts DETAIL data (Round 3 / S4) — data behind the live hub's
// detail slugs. DATA ONLY: the detail route still redirects to the hub;
// nothing here renders. Editorial law (from src/lib/conflicts.ts):
// whitelist sources only, no party casualty figures, no editorialising,
// Peace Efforts compulsory, charity 0% commission, no weapons links.
export interface ConflictUnhcr {
  year: number;
  refugees: number | string | null; asylumSeekers: number | string | null;
  idps: number | string | null; stateless: number | string | null;
  returnedRefugees: number | string | null; source: string;
}
export interface ConflictHeadline { title: string; source: string; url: string; date: string }
export interface ConflictDetail {
  slug: string; name: string;
  unhcr: ConflictUnhcr | null; unhcrNote: string | null;
  headlinesSnapshot: { note: string; fetchedAt: string; items: ConflictHeadline[] };
  peaceEfforts: { items: ConflictHeadline[]; standingSources: { name: string; url: string; note: string }[]; note: string };
  charity: { commissionStatement: string; organisations: { name: string; url: string; donateUrl: string }[]; note: string };
  editorialRules: string[];
}
