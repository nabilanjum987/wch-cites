# Progress Atlas — Design

## ⚠️ DESIGN ONLY — NOT BUILT

Paper design for the owner's later decision (Round 4 design-only
authorization). No code, no routes, no data collection is started
by this document. Source idea: `wch-complete-handover-package-2026-10-22.md`
§6C (post-freeze vision): "Built ONLY on published, citable indexes
… never a homemade ranking presented as authority."

## Purpose

A hub that tracks how countries and cities are advancing, line by
line — AI readiness first (the owner's chosen lead line), then the
progress lines people actually follow: digital payments, startups,
renewable energy, education. Every line is a published, citable
index owned by a named institution; the Atlas republishes their
findings with methodology and sources shown, and adds only one
thing of its own: honest presentation — movement over time,
explained in plain English.

## Audience

- Readers comparing countries/cities on credible progress lines.
- Students and researchers who need the index behind a claim, one
  click away.
- The same institutions the project may later serve with reports
  (the institutional path belongs to City Voice's plan; the Atlas
  is the credibility surface that supports it).

## Design language

Inside the frozen visual system: English only; panel grammar
(heading → real written content → one live figure → hook line);
figures also as HTML text; sources shown on the page, not in a
footnote graveyard. The Atlas sits in the country/economy family
and inherits its discipline wholesale — above all the Panama
runbook: one cached dataset per index per country, the year on
every figure, and no derived score the page cannot explain.

## Page anatomy (section by section)

1. **Hub (/progress-atlas, proposed)** — the progress lines as
   cards; each card shows the line's owner-institution, its latest
   edition year, and one headline figure for the visitor's region
   where the index supports it. A card without a current edition
   shows the last edition labelled by year — never silently
   "current".
2. **Line page (one per progress line)** — what the index
   measures, in plain English; who publishes it and how often;
   the methodology summary with a link to the publisher's own
   methodology document; the full country table for the latest
   edition (rank + score as published — verbatim, never
   re-weighted); a "what changed" section diffing the last two
   editions (risers/fallers as the publisher's numbers state
   them).
3. **Country view (inside the existing country template family)**
   — the country's lines gathered: its AI readiness rank/score,
   its digital-payments standing, etc., each with edition year +
   source, feeding from the same cached per-index datasets the
   line pages use (one dataset, many surfaces — the economy law).
4. **Method & sources page** — every index used, its publisher,
   edition cadence, licence/terms for republication, and the
   date WorldCityHub last pulled it. If an index's terms forbid
   republication of scores, that line is linked-and-summarized
   only, or dropped (open question).

## Candidate indexes (to be confirmed against terms at build time)

- **AI readiness:** Stanford AI Index (annual) · Oxford Insights
  Government AI Readiness Index.
- **Digital economy/payments:** World Bank Global Findex ·
  ITU ICT statistics.
- **Renewables:** IRENA capacity statistics.
- **Education:** UNESCO Institute for Statistics series via the
  World Bank.
- **Startups:** only if a published, citable, terms-clear index
  exists at build time; otherwise the line waits. (Inventing a
  startup ranking is exactly what this page exists NOT to do.)

## Data model (sketch)

- `atlas_indexes` — slug, title, publisher, publisher_url,
  methodology_url, cadence, terms_note, last_pulled_at.
- `atlas_editions` — index_slug, edition_year, published_at,
  source_url.
- `atlas_entries` — edition_id, country_iso2 (via the resolveIso2
  map — never slug-derived), rank_as_published,
  score_as_published, score_label (the publisher's own wording).
- Pulls are batch jobs writing new editions; pages read the
  latest edition per index. No figure is ever hand-edited in
  place — a correction is a new pull with a note.

## Integrity rules

- **No homemade rankings.** The Atlas never averages, re-weights,
  or combines indexes into a WorldCityHub score presented as
  authority. Cross-index reading is allowed only as clearly
  labelled editorial summary, in words, not as a composite number.
- Every figure carries: publisher, edition year, and a link.
  A figure that loses its source in an edit loses its place on
  the page.
- Movement is reported as the publisher's numbers state it;
  methodology changes between editions are flagged where the
  publisher flags them ("not comparable across the methodology
  change" is a sentence this page must be willing to print).
- Country identity and codes follow the resolveIso2 law; the
  Panama failure mode is named in the build ticket for this
  feature so it cannot be reintroduced by a shortcut.
- Conflicts/charity content rules do not apply here; if a future
  line touches aid or relief data, the frozen conflicts rules
  govern it (whitelist sources, no commission links).

## Open questions for the owner

1. Which line leads at launch — AI readiness alone, or AI +
   digital payments together?
2. Republication terms: which candidate indexes permit score
   republication with attribution, and which are link-only?
3. City-level lines: most indexes are national. Are city lines
   in scope only where a publisher provides them, or does the
   Atlas stay national until city sources exist?
4. Update ownership: who runs the annual edition pulls, and what
   staleness threshold takes a line's card off the hub?
5. Does the Atlas get its own homepage door at launch (a §-panel
   slot needs a freeze amendment), or does it grow from the
   economy/country surfaces first?

**DESIGN ONLY — NOT BUILT.**
