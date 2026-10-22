# Runbook — Add a City

The gated path from raw data to a live city. Every step exists
because skipping it has already caused a defect once. Written from
the code and the 2026-10-22 marathon day log.

## The rule above all rules

A city is **published only when it renders fully with real data and
passes the QA gate**. Until then it is a data package on a branch —
never in the sitemap, never linked from published pages (Link Laws
L1/L6), never described as live.

## Step 1 — Build the data package (branch only)

1. Branch from the current integration point. Marathon convention:
   one work package = one branch + one PR; packages for new cities
   are **build-only** until billi's audit.
2. City identity comes from the canonical registry pattern in
   `src/lib/getCityData.ts` (slug, display name, province/country
   slugs, canonical coordinates). Coordinates are the site's own
   canonical values — never a search snippet's.
3. **resolveIso2 law:** the ISO country code comes ONLY from the
   explicit slug→ISO2 map (`resolveIso2()`), never from slicing or
   truncating the slug. ("pakistan" truncated is "PA" = Panama —
   see the Panama runbook.)
4. Every figure needs a source: population from a census or the
   World Bank, economy through the one cached country dataset
   (`getCountryEconomy()`), weather/prayer/gold from the live API
   layer — never hand-typed "current" values.
5. Images: only licence-verified records from
   `docs/media-registry/` (or a fresh harvest to its standard:
   creator + licence + attribution recorded, else the image does
   not ship).

## Step 2 — Render through the template

The city template serves 8 page types (main, weather, prayer-times,
rates/economy, news, sports, events, places/personalities surfaces
per the current template set). Fill the template with the package's
data; sections with no honest data source are **omitted**, never
filled with plausible text. Display names everywhere in headings and
paragraphs — slugs are for URLs only (PC1 item 2).

## Step 3 — Run the QA gate

```bash
python3 tools/qa-gate/qa_gate.py <each of the city's URLs> --out /tmp/city-qa.md
```

Gate per page: HTTP 200 · real content in raw HTML (≥800 visible
chars, no client shell) · exactly 1 self-canonical · title ≤60 ·
description ≤155 · no placeholder strings · no dead internal links.
Plus the human checks the tool cannot do:

- Live figures sampled against their sources (weather vs the API,
  gold vs the ticker layer, economy vs the World Bank set).
- Titles audited for THIS city's name length (patterns are audited
  ≤60 even for a 15-character city name — PC1 item 4).
- No other city's facts leaking in: glance cards, FAQ JSON-LD, and
  nearby/pairs must reference THIS city (the de-Lahoring lesson,
  Q11).

## Step 4 — Database activation

If the city needs a `cities` row: the migration SQL ships **inside
the PR** (numbered by the coordinator — never invent a number) and
is applied by the owner, never by the builder. Code must degrade
honestly while the migration is unapplied (the /improve pattern:
real fallback data or an explicit "activating" state, never a crash,
never fake rows).

## Step 5 — Sitemap + links (only after the gate passes)

- Add the city's URLs to `src/app/sitemap.ts` (the sitemap is
  force-dynamic; it grows only with QA-passed pages).
- Switch on inbound links in the same release (L6): homepage §10
  cities panel, Ticker 2's published set, compare pairs, country
  inventory band ("What [Country] has on WorldCityHub").
- Verify the sitemap count grows by exactly the new URLs and every
  one returns 200 with content.

## Step 6 — Audit + merge

billi independently verifies (PASS/FAIL) → owner merges. After the
merge, re-run the QA gate against production for the new URLs and
file the result; indexation evidence (GSC) decides the NEXT batch —
activation order is gated on it, per the freeze plan.
