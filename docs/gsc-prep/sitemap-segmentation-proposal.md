# GSC Prep — Sitemap Segmentation Proposal

**Proposal only — for the owner/billi to approve. Nothing in the
live sitemap changes by this document.** Prepared 2026-10-22.

## Where we are

One sitemap, force-dynamic, **53 URLs** (2026-10-22): the Pakistan
cluster (27), 13 horoscope URLs, compare hub + 5 pairs, conflicts,
news, rates, countries, my-location, improve, homepage. Post-Round-1
merges it grows to ~63. One file serves this comfortably today.

## Why segment at all (and when)

A single sitemap file caps at **50,000 URLs** (and 50 MB
uncompressed) per the sitemap protocol. The project's stated
ambition is orders of magnitude beyond that (500 Pakistani cities
× 8 page types alone = 4,000 URLs; global capitals-first growth
runs to tens of thousands; the long-term vision speaks of ~1M
pages). Segmentation is therefore not a today-fix; it is the
structure that must exist **before** growth makes one file a
liability, and it buys three things earlier than the cap forces it:

1. **Per-cluster indexation evidence.** GSC reports per-sitemap
   discovered/indexed counts. The freeze plan gates expansion on
   indexation ratio per batch — segmented sitemaps make that ratio
   measurable per cluster instead of one blended number.
2. **Failure isolation.** A malformed cluster file cannot poison
   the whole sitemap.
3. **Crawl budgeting.** Fresh clusters (new cities) can be
   resubmitted without touching stable ones.

## Proposed structure

A sitemap **index** at `/sitemap.xml` referencing cluster files:

| File | Contents | Activation trigger |
|---|---|---|
| `sitemap-core.xml` | Homepage, hubs (countries, rates, news, compare, conflicts, horoscope, my-location), utility (about, contact, privacy, sources, improve, events/submit) | At segmentation |
| `sitemap-pakistan.xml` | Country + provinces + every published PK city cluster (city × its page types) | At segmentation; grows per activation batch |
| `sitemap-golden.xml` | Wonders + oceans hubs and detail pages | At segmentation (starts with Taj Mahal + Arabian Sea) |
| `sitemap-countries/<iso2>.xml` | One file per activated country beyond Pakistan (its country/province/city clusters) | First non-PK country activation |
| `sitemap-horoscope.xml` | Hub + 12 signs (+ compatibility surfaces if they publish) | Only if the cluster outgrows core |
| `sitemap-compare.xml` | Hub + published pairs | Only when pair count makes core unwieldy (pairs grow combinatorially — this is the likeliest early split after countries) |

## Rules that do not change

- **A URL enters a sitemap only when its page renders fully with
  real data and passes the QA gate** — segmentation changes
  filing, not standards.
- Every cluster file stays far below the 50k cap by construction
  (per-country files make the cap nearly unreachable; if a single
  country's city count ever threatens it, split that country by
  province — the pattern extends naturally).
- The robots/sitemap wiring updates in the same PR that introduces
  the index; old single-file URL keeps working as the index
  location (`/sitemap.xml` never moves).
- Migration is one PR: generate cluster files from the same
  registry the current force-dynamic sitemap reads, verify the
  union of cluster files equals the pre-change sitemap exactly
  (same URL set, no dupes, no losses), then swap.

## Recommendation

Approve the structure now; implement when the post-merge set
crosses ~100 URLs or the first non-Pakistan country activates —
whichever comes first. Until then the single file is correct, and
this proposal is the agreed shape of its successor.
