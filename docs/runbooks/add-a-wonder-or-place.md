# Runbook — Add a Wonder / Place (the golden pattern)

How the golden template replicates: proven on the Taj Mahal
(Q9, PR #7) and the Arabian Sea (Q10, PR #10), specified in the
golden-wonder blueprint (`wch-golden-wonder-template-blueprint-2026-10-22.md`).
One verified data row per subject; the template does the rest.

## Step 1 — Verify the identity (before any content)

1. Find the subject on **Wikidata** and match on its **description
   and instance type**, never on the name alone and never the first
   search hit. The two standing warnings:
   - "Taj Mahal" the monument is **Q9141**; the first name hit is a
     1968 music album (Q3487323).
   - "Arabian Sea" the sea is **Q58705**; a same-name ship
     (Q105767867) sits in the results.
2. Record the QID, canonical coordinates, and the description you
   matched on — they go into the data row's sources.

## Step 2 — Assemble the fact set (every fact sourced)

- Facts grid: from Wikidata + the Wikipedia article + the official
  source (UNESCO listing for heritage sites — e.g. Taj Mahal =
  site **252**, inscribed 1983; the monument's own site for fees
  and visiting rules, e.g. tajmahal.gov.in).
- Chronology follows the most authoritative source (UNESCO beat
  the data pack's draft dates for the Taj Mahal: begun 1632, main
  structures 1648, complex completed 1653; 1631 = commission).
  Where sources **disagree**, record both and show the
  disagreement on the page (the Arabian Sea's max depth: Wikipedia
  5,395 m vs Wikidata 5,800 m — shown, not hidden).
- Visitor data (fees, hours, open rules) only from the official
  site, fetched the same week, and dated in the record.

## Step 3 — Harvest images (licence or it does not ship)

- From Wikimedia Commons: per file, record file title, direct URL,
  source page, creator, licence, licence URL, attribution string,
  role (hero/gallery/detail), alt text, dimensions.
- Only CC BY / CC BY-SA / CC0 / public domain with a recorded
  creator. Register every accepted and rejected candidate in
  `docs/media-registry/subjects/<slug>.json` (see card T1's format).
- No unattributed image, no "licence-free" stock, ever.

## Step 4 — Build the data row + page (branch + PR)

- Data layer follows `src/lib/wonders.ts` / `src/lib/oceans.ts`:
  a typed record (facts, story, architecture/nature, timeline in
  images, visitor guide, photo spots, nearby with **computed**
  distances, FAQs, media[], sources[] with `checkedAt`).
- If the subject needs database tables: migration SQL inside the
  PR, coordinator-numbered (wonders = 0001, oceans = 0002 pattern),
  owner applies it; the page serves the identical baked dataset
  until then (DB-first, baked fallback).
- Page order follows the blueprint's block order (14 blocks for
  wonders): sourced facts → Quick Answer (open-status **calculated**
  from the verified official rule, never typed) → live dashboard
  (weather/sun/golden hours at the subject's coordinates,
  Open-Meteo; marine layer for oceans) → story → structure →
  image timeline → visitor guide → See It Live map (OSM embed
  until the owner's Google Maps key lands; the component swaps
  without redesign) → photography → Myth vs Fact (curated,
  verified, sourced — NEVER API-guessed; only where famous myths
  genuinely exist) → Nearby → FAQs → Sources & Credits.

## Step 5 — QA gate

- `tools/qa-gate/qa_gate.py` on the detail URL + the hub.
- Raw-HTML check: title ≤60, description ≤155, exactly 1
  self-canonical, the live figures (temperature, sunrise) present
  in the prerendered HTML and matching the source sampled the
  same hour.
- Credits check: every image on the page carries its attribution;
  every Myth vs Fact card names its source.
- Index/hub treatment: until the detail page passes and merges,
  the subject appears on the hub as content **without a link**
  (L1/L6). Sitemap append only for the published detail route.

## Step 6 — Audit + merge

billi PASS → owner merge → post-merge production QA re-run.
Publish switch-ons that depend on the merge (homepage Wonders /
Oceans panel deep links) happen in a declared follow-up, not
silently inside this PR.
