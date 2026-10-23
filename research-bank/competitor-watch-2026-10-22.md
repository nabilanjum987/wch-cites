# Competitor Watch — 2026-10-22 (Research Bank B8)

**Status:** BANKED EVIDENCE — not wired into any route; nothing here publishes.
**Date of all observations:** 2026-10-22 (text fetches of live pages/sitemaps; no accounts, no outreach).
**Baseline note (important):** the competitor files named in the handover package —
`wch-competitor-map-2026-10-22.md`, `wch-competitor-research-full-2026-10-22.md`,
`wch-alike-trace-2026-10-22.md` — were **not among the delivered files** (checked
`~/workspace/user/files/`, 2026-10-22). There is therefore no earlier dated baseline to diff
against: **this watch is the baseline.** The competitor set below is taken only from names that
appear in delivered files: the handover package (Terralocate named first; the alike-trace line
"no true twin exists; City-Data / Terralocate / timeanddate are slices"), the final plan
(competitor doctrine + Wikipedia-list competition), the personalities rules (famouspeople.io,
thefamouspeople.com), and the local API map (TrackPostcode as the UK area-report model).

Method: homepage + sitemap fetches via text extraction, 2026-10-22. Traffic/scale numbers quoted
from a site's own pages are marked *(self-reported)* — not independently verified.

---

## 1. Terralocate (terralocate.com) — the named head-on competitor

**What it is (homepage, fetched 2026-10-22):** "Open encyclopedia of every place." Layers:
featured editorial lists ("10 of the World's Best Food Cities", "8 Highest-Altitude Cities",
"8 Oldest Continuously Inhabited Cities" — rankings with a stated methodology line),
long-form place stories (Rjukan's mirrors, Whittier Alaska, Monowi pop. 1, Coober Pedy),
a **compare-any-two-cities tool** ("Population, weather, schools, cost-of-living — every number
on one page"; featured pairs Chicago vs Dallas, Denver vs San Diego, Miami vs Seattle),
featured cities, and place data in five categories: Demographics, Geography, Climate & Weather,
History, Landmarks.

**Scale (homepage "Popular countries", self-reported place counts):** Brazil 83,980+ · France
59,146+ · Poland 48,302+ · Germany 44,255+ · UK 36,895+ · US 32,330+ · Italy 15,901+ ·
Australia 8,156+. Pakistan does not appear in the popular-countries list.

**What has shipped, from sitemap evidence (fetched 2026-10-22):** the sitemap index lists a
static sitemap, a hubs sitemap, and per-country place shards (`sitemap-places/<cc>/N`) for
~180 countries. Place-shard `lastmod` values cluster in **June 2026** — i.e. the place index was
bulk-built in June 2026 and no later build wave is visible. Pakistan has exactly **one shard**
(`sitemap-places/pk/1`, lastmod 2026-06-28): the visible (truncated) portion alone lists
**≥200 `/place/pk-*` URLs**, generated in two waves — 2026-06-04 (most Punjab/Sindh/KP towns)
and 2026-06-28 (Islamabad, Quetta and Balochistan/AJK towns: Gwadar, Turbat, Khuzdar, Chaman,
Sibi, Zhob, Muzaffarabad, Mirpur, Kotli, Rawalakot…). Every WCH batch-1/2 PK city already has a
Terralocate `/place/` page. Shards also exist for WCH's other markets (in, bd, ae, sa, kw, qa,
eg, my, tr, …).

**Depth check — /place/pk-lahore (fetched 2026-10-22):** one page per place carrying: PBS
population headline (11,126,285), Wikipedia overview text, geography/coords, **climate as
10-year ERA5 averages** (not live weather), GBIF species observations, USGS earthquake history,
Wikidata "notable people born within ~10 km", NASA POWER solar climatology, Wikimedia Commons
gallery, Wikipedia pageview stats, Open Library books, and a full per-page sources list.
Section tabs: Census · Wikipedia · Weather · Places · People · Environment · Health & Schools ·
Related · Geography & Culture · Live Monitoring · Events & Gallery. **No prayer-times, gold/FX,
news, horoscope or events-listing layer was observed** on the homepage category list or on this
page.

**Quality defects found on that page (citable, dated 2026-10-22):**
1. **Broken nearby-places join:** the "Nearby places in Punjab" section lists Brazilian villages
   — Baía da Traição, Aldeia Acajutibiro, Aldeia Forte… — "7,591.9 mi away". A name-collision bug
   (Punjab vs Paraíba) shipped to production.
2. **Self-contradicting population:** the title/headline figure is 11,126,285 while the overview
   text on the same page says "over 14 million". The page footnotes the discrepancy itself
   ("Demographic figures from Pakistan Bureau of Statistics. Overview below cites Wikipedia and
   may reference a different year.") — an admission, not a fix.

**Patterns worth ANSWERING (not copying):**
- Compare-any-two as a *tool* (arbitrary pairs), not only pre-built pair pages.
- Ranked listicles with the methodology stated on the page.
- A visible per-page sources list (WCH already does source lines; keep them as prominent).

**Gaps they leave open:** no live data anywhere observed (climate = decade averages; no live
weather, prayer, FX, gold, AQI or news layer); PK depth = 1 generic page per place vs WCH's
8 page types per published city; no diaspora/remittance framing; demonstrable join bugs and
unreconciled figures on flagship pages.

---

## 2. City-Data (city-data.com) — the US slice

**What it is (homepage, fetched 2026-10-22):** US-only city profiles "from government and
private sources" — demographics, crime, housing, schools, plus a **Compare two cities** tool,
advanced city search, Top 100/101 lists, city guides, an active blog, and a large forum.
Scale claims on the homepage: 14M users/month, 34M property assessments, 700,000 restaurant
inspections, 74,000 city photos, forum 1.5M members / 15,000 posts per day — all
*(self-reported)*. Their interactive-map copy states the data is "Based on 2000-2023 data".

**Patterns worth answering:** the forum/community moat and the compare tool are the stickiness;
the seasonal blog (dated posts through late 2025 in the fetch) feeds the head terms.

**Gaps they leave open:** zero non-US coverage; a visibly ageing data vintage on their own copy;
no live/fresh data layer (no weather/prayer/FX/news). WCH's US package cannot out-depth
City-Data on US relocation data — the answer is the international frame (diaspora, prayer, FX,
compare-with-home-country) that City-Data structurally does not offer.

---

## 3. timeanddate.com — the time/sun slice

**What it is (homepage, fetched 2026-10-22, itself dated "Oct 22, 2026"):** World Clock,
personal world clock, time-zone map/converter, meeting planner, event time announcer, printable
calendars, date calculators, countdowns/timers, sunrise/sunset, moon phases, eclipses, and
weather (current + 14-day). Fresh seasonal editorial is part of the model: "Europe Ends DST
2026" (published Sep 25, 2026), "The World Abandons Leap Seconds" (Oct 12, 2026),
"End of DST: Fall 2026" (Aug 20, 2026). No prayer-times cluster was visible in the homepage
extraction.

**Patterns worth answering:** dated explainer editorial around clock changes (DST start/end per
market) — directly transferable to WCH's time cluster and city pages, using WCH's own computed
data.

**Gaps they leave open:** tools are standalone utilities with no city-profile integration — no
demographics, economy, prayer, FX or news attached to the place; the answer is the integrated
city page, not a better standalone clock.

---

## 4. Personalities incumbents — famouspeople.io & thefamouspeople.com

Named in the handover personalities rules as the Wikipedia/Wikidata-first competition.

**famouspeople.io (fetched 2026-10-22):** a single ranked "Most Famous People in the World"
list (Pantheon-style fame ranking; portraits hotlinked from Wikimedia Commons; name, nationality,
role, birth/death years). Global-list framing only was observed on the homepage — no
country/city browsing layer in the extraction.

**thefamouspeople.com (fetched 2026-10-22):** "Lists of Trending Celebrities in 2026, Ratings &
Bios" — category listicles (Film & Theater Personalities, Sportspersons, Singers…) with
editorial bios in a gossip-adjacent tone (ages of spouses, "four failed marriages" jokes in the
fetched samples).

**Gaps they leave open:** neither offers sourced, etiquette-filtered profiles tied to a place.
WCH §16's rules — verified facts only, no controversy/gossip framing, profiles linked from the
city/country they belong to — are the direct answer to both models.

---

## 5. TrackPostcode (trackpostcode.uk) — the API-map's UK model, verified live

Named in the local API map as the example of the official-source stack done right.
Homepage fetched 2026-10-22; the page itself states **"Data last updated 22 October 2026"**.

**What it is:** free UK area reports — any postcode/town/city/council scored 0–100 across
**twelve weighted categories** (weights published: cost of living 15%, affordability 15%,
safety 10%, weather 10%, employment 10%, housing 10%, transport/broadband/environment/healthcare/
education/lifestyle 5% each), each category with its primary official source named on the page:
ONS, HM Land Registry, police.uk, Met Office (HadUK-Grid 1 km), Ofcom, DfT NaPTAN, Defra UK-AIR,
DfE, OpenStreetMap. Index state (self-reported): **539 areas scored** (449 England, 53 Scotland,
37 Wales — Northern Ireland not covered), median overall 67/100, range 39–77. Extras: an
affordability calculator (salary/savings based), a relocation quiz, and the same categories
re-weighted for five life profiles (families, students, retirees…).

**Its three public honesty positions (verbatim in substance from the homepage):**
1. *No blended rankings across incomparable datasets* — safest-places tables are published one
   nation at a time because police.uk (England & Wales) and Scottish Government statistics are
   not the same measurement.
2. *Show a gap rather than an estimate* — a missing category is left blank, dropped from the
   score, and the remaining weights rebalanced; the report states its own completeness.
3. *Publish the resolution of every figure* — each section states whether its data is point-level
   (1 km grid, ~1-mile crime radius) or council-level.

**Why this matters to WCH:** it is live proof the API-map doctrine ("per-country FREE LOCAL
official APIs first; every figure linked to its source") produces a credible, differentiated
product — and its honesty positions are the same laws WCH already runs on (never fake data;
omit and log). **Patterns worth answering:** stated geography-level per figure; completeness
stated on the page; persona-weighted re-ranking. **Gap:** Great Britain only — no Northern
Ireland, nothing outside the UK.

---

## 6. Wikipedia lists (competitor class named in the plan)

Not fetched page-by-page in this watch (class-level note from the plan file, which frames the
"most populated / largest / richest" list traffic as Wikipedia's to lose). Wikipedia structurally
cannot carry live data — prayer countdowns, live FX/gold, today's weather/AQI — which is the
standing WCH answer for every list-type page. Recorded UNSOURCED at page level; no specific
list page was fetched for this entry.

---

## 7. Summary — who covers what (observed 2026-10-22)

| Competitor | Places/cities | Compare | Live weather | Prayer | Gold/FX | News | Personalities | Local-official data |
|---|---|---|---|---|---|---|---|---|
| Terralocate | ✔ global bulk (Jun 2026 build) | ✔ any-two tool | ✘ (ERA5 averages) | ✘ not observed | ✘ | ✘ | partial (Wikidata born-nearby) | partial (PBS headline) |
| City-Data | ✔ US only | ✔ | ✘ | ✘ | ✘ | blog only | ✘ | ✔ US gov/private |
| timeanddate | tools, not profiles | ✘ | ✔ forecast | ✘ not observed | ✘ | editorial explainers | ✘ | n/a |
| famouspeople.io | ✘ | ✘ | ✘ | ✘ | ✘ | ✘ | ✔ global fame list | Wikidata/Wikipedia |
| thefamouspeople.com | ✘ | ✘ | ✘ | ✘ | ✘ | ✘ | ✔ celebrity listicles | ✘ editorial |
| TrackPostcode | ✔ UK areas (539) | via quiz/rankings | climate grid | ✘ | ✘ | ✘ | ✘ | ✔✔ per-category official |
| **WCH (for contrast)** | ✔ curated, 8 page types/city | ✔ pre-built pairs | ✔ live | ✔ | ✔ | ✔ aggregate | ✔ §16-filtered | ✔ where wired |

**The open ground, in one line:** no observed competitor combines *live* prayer + gold/FX +
weather + news on curated per-city pages for the PK/Gulf/diaspora markets — Terralocate has the
place breadth without the live layers; everyone else has one slice. That combination is WCH's
frozen positioning, and this snapshot (2026-10-22) is the baseline future watches diff against.

---

*Honesty box: every observation above comes from text fetches made 2026-10-22 (URLs: terralocate.com, terralocate.com/sitemap.xml, terralocate.com/sitemap-places/pk/1, terralocate.com/place/pk-lahore, city-data.com, timeanddate.com, famouspeople.io, thefamouspeople.com, trackpostcode.uk). Scale/traffic figures are the sites' own claims, marked self-reported. The three competitor files named in the handover package were never delivered; nothing was substituted for them silently — §6 is labelled a class-level note for that reason.*
