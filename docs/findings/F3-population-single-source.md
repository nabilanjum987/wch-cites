# F3 — Population single-source: comparison table (PREP ONLY — nothing changed)

**Status:** prep document for an owner decision. No data or code was changed by
this card. Prepared 2026-10-23 from the Batch 4 Item 2 fact-consistency audit
(Finding 1 + Finding 2).

## The problem

The site currently shows **three different population stores** for the same
cities, and two of its surfaces contradict each other in public:

1. **City pages** read the hard-coded `GLANCE` map in
   `src/app/[country]/[province]/[city]/page.tsx` (values described in the
   code comment as "the site's own collected dataset values
   (pakistan_cities.csv, GeoNames-shaped)").
2. **Compare pages** read the Supabase `cities` table via `getCityData()`
   (`src/lib/getCityData.ts`) and render the value rounded to one decimal
   (`fmtPop` in `src/components/compare/CompareView.tsx`).
3. A **dev-only mock fallback** inside `getCityData.ts` carries a third set
   (Lahore 13,095,038 · Karachi 14,910,352) that matches neither of the
   above — it only renders when Supabase does not answer, so it is not what
   production shows, but it proves how easily a fourth figure can slip in.

## The table — one row per live city, every cell sourced

| City | City page (GLANCE, in code) | Compare page (Supabase, as displayed in production) | 2023 census — Pakistan Bureau of Statistics |
|---|---|---|---|
| **Lahore** | **13,004,135** — `GLANCE['pakistan/punjab/lahore']`, `src/app/[country]/[province]/[city]/page.tsx` | **"14M"** — observed live on `/compare/lahore-vs-karachi` (2026-10-23); the raw Supabase value is not in the repo and the display rounds to 1 decimal, so the stored value is ≈13.95–14.04M | **13,004,135** — **Lahore District total** (the whole district, 1,772 km²; PBS, *7th Population & Housing Census — Detailed Results, Table 1*). The district is 100% urban per PBS, so district total = urban total. |
| **Karachi** | **11,624,219** — `GLANCE['pakistan/sindh/karachi']` (same code location) | **"16M"** — observed live on `/compare/lahore-vs-karachi` (2026-10-23); stored value ≈15.95–16.04M | **20,382,881** — **Karachi Division total**: all 7 districts (3,527 km²), PBS Census-2023 (division table). Of that, the **urban** component is **18,868,021** (92.57%) and rural 1,514,860. There is no single "Karachi district" anymore — the old district was split into today's 7 districts, so the division is the smallest official unit that covers the whole city. |
| **Islamabad** | **601,600** — `GLANCE['pakistan/islamabad-capital-territory/islamabad']` (same code location) | **"2M"** — observed live on `/compare/lahore-vs-islamabad` (2026-10-23); stored value ≈1.95–2.05M | **2,363,863** — **Islamabad Capital Territory total** (the whole territory, 906.5 km²), PBS Census-2023. Of that, the **urban** component is **1,108,872** (46.91%) and rural 1,254,991. (The "~1.01M" sometimes quoted is the **2017** urban figure — do not use it against 2023 numbers.) |

Census figures as published in the PBS Census-2023 detailed results
(pbscensus.gov.pk, Table 1 and the provincial tables), retrieved via the
district/division/territory records that reproduce those tables verbatim:
Lahore District — https://en.wikipedia.org/wiki/Lahore_District ·
Karachi Division — https://en.wikipedia.org/wiki/Karachi_Division ·
Islamabad Capital Territory — https://en.wikipedia.org/wiki/Islamabad_Capital_Territory

## What the table shows

- **Lahore's city page is already right — by the census definition.** The
  GLANCE figure 13,004,135 is *exactly* the PBS 2023 Lahore District total
  (and GLANCE's area, 1,772, matches the district's 1,772 km²). The outlier
  for Lahore is the **compare** figure (≈14M, +7.7% over census).
- **Karachi is the worst divergence, in both directions.** GLANCE
  (11,624,219) understates the census division total by ~43% and matches no
  official 2023 unit; the compare figure (≈16M) sits between the GLANCE
  value and the census and also matches no 2023 unit (it is closest to the
  **2017** division count, 16,051,521 — a stale vintage). Note GLANCE's
  Karachi *area* (3,527) is the **division** area — the dataset pairs a
  division-sized area with a much smaller, older population.
- **Islamabad's GLANCE figure (601,600) matches nothing current** — it is a
  pre-2017-vintage city estimate. The compare figure (≈2M) is at least the
  right order of magnitude but is neither the ICT total (2,363,863) nor the
  ICT urban count (1,108,872).
- **Half the disagreement is definitions, not arithmetic.** "Karachi" can
  mean a 7-district division of 20.38M or its urban core of 18.87M;
  "Islamabad" can mean a 2.36M territory or a 1.11M urban area. Any single
  source decision must fix the definition as well as the vendor, or the two
  surfaces will drift apart again the next time someone edits one store.

## The decision the owner must make

**Pick one source + one definition, applied to every surface (city pages,
compare, schema, FAQs) at the same time:**

- **Recommended: PBS Census-2023, administrative-unit totals** —
  Lahore District 13,004,135 · Karachi Division 20,382,881 · Islamabad
  Capital Territory 2,363,863, labelled on-page as "2023 census".
  Reasons: (1) it is the only figure set with an official, citable
  provenance — every other store on the site is unsourced or stale;
  (2) each city page's existing *area* already describes exactly these
  units (1,772 / 3,527 / 906 km²), so population and area become
  consistent by construction; (3) Lahore — the most-visited city page —
  does not change at all; (4) one definition everywhere kills the
  compare-vs-city contradiction permanently instead of patching numbers.
- **Alternative: PBS Census-2023, urban-only counts** —
  Lahore 13,004,135 (unchanged; the district is 100% urban) ·
  Karachi 18,868,021 · Islamabad 1,108,872. Choose this if the site
  prefers "people in the built-up city" over "people in the
  administrative unit" — but then areas should be re-stated too, and ICT
  drops by more than half, which reads oddly next to a 906 km² territory
  map.
- **Not recommended:** keeping GLANCE (unsourced, mixed vintages,
  Karachi −43%) or the Supabase values (unsourced, ≈2017 vintage for
  Karachi) as the canonical store.

Whichever option is picked, the follow-up fix card should: write the chosen
figures into ONE place both surfaces read, delete or regenerate the other
stores (including the `getCityData` mock fallback), and re-run the Batch 4
link/consistency audit to confirm the contradiction is gone.

*No figures were changed by this document.*
