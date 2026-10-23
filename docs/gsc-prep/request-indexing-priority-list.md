# GSC Prep — Prioritized Request-Indexing List

**For the owner to execute in Google Search Console. The agent
touches no Google property.** This list is written for the moment
**after the Round 1 merges land** — requesting indexing for URLs
that are not yet live in their merged form wastes the request.
Baseline: production sitemap = 53 URLs (2026-10-22). Post-merge
additions (wonders/oceans hubs + golden details, footer pages,
events submission) bring the set to ~63.

Work the tiers in order, a few URLs per session — GSC's manual
request quota is small, and the homepage's internal links do most
of the discovery work for everything below Tier 1.

## Tier 1 — the doors (request first)

| # | URL | Why first |
|---|---|---|
| 1 | `/` | The homepage carries a link to every cluster; its re-crawl pulls the new internal links (golden panels, footer) into the index queue. |
| 2 | `/countries` | Hub + the 198-capital table — the site's largest single new content surface. |
| 3 | `/wonders/taj-mahal` | The golden wonder: highest-value new page, homepage-linked, image-rich. |
| 4 | `/oceans/arabian-sea` | The golden ocean; same reasoning, second in the golden pair. |

## Tier 2 — the hubs

| # | URL | Why |
|---|---|---|
| 5 | `/rates` | Rebuilt FX path (post-Q8) + anchors; money queries are the site's proven demand (keyword brief: "usd to pkr" strongest). |
| 6 | `/news` | Category hub completion (Q8) + deeper system behind it (Q13). |
| 7 | `/compare` | Real-data hub; pairs below it inherit its crawl path. |
| 8 | `/conflicts` | Real-data hub (whitelist sources); detail pages remain held — hub only. |
| 9 | `/horoscope` | Priority cluster (daily-habit product, handover §15). |
| 10 | `/wonders` | Hub (now server-rendered) — after its detail page (Tier 1 #3). |
| 11 | `/oceans` | Hub — after its detail page (Tier 1 #4). |
| 12 | `/my-location` | Utility hub, already in sitemap. |

## Tier 3 — the published city clusters (24 URLs)

For each of Lahore, Karachi, Islamabad — in that order (Lahore is
the foundation template city):

- `/pakistan/punjab/lahore` + its 7 subpages (weather, prayer-times,
  rates, news, sports, events, places surfaces per the live set)
- `/pakistan/sindh/karachi` + its 7 subpages
- `/pakistan/islamabad-capital-territory/islamabad` + its 7 subpages

Why this order: Lahore's cluster is the template proof; Islamabad's
cluster carries the PC1 fix (Panama) and must be re-crawled so the
corrected economy page replaces the poisoned one in the index —
**Islamabad's economy URL is the single most important re-crawl in
this tier** despite coming third.

## Tier 4 — country + provinces

- `/pakistan` (inventory band + corrected economy frame)
- `/pakistan/punjab` · `/pakistan/sindh` ·
  `/pakistan/islamabad-capital-territory` (ICT page now renders ICT,
  not Punjab — Q11; re-crawl matters here too)

## Tier 5 — the long tail (request only if quota remains)

- The 5 published compare pairs (`/compare/lahore-vs-karachi`,
  `/compare/karachi-vs-islamabad`, + the remaining published pairs)
- The 13 horoscope sign pages
- `/about` · `/sources` (trust pages; low traffic, high credibility)
- `/contact` · `/privacy` · `/improve` · `/events/submit` —
  utility pages; request only for completeness, expect “Crawled –
  not indexed” on some and accept it.

## Rules while executing

- Request a URL only after verifying it live (200, real content) in
  the same session.
- Never request a URL for a page whose PR has not merged.
- Log each request (URL, date, GSC verdict) in the review file —
  the 1 Nov evidence checklist consumes that log.
