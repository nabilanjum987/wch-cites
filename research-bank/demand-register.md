# DEMAND REGISTER — WorldCityHub Research Bank (B7)

**Written:** 2026-10-22 · **Status:** research file only — nothing here is wired into the site.
**Purpose:** the evidence base for the post-merge activation order. Every subject the
site has built or packaged is graded by the demand signals that can actually be
cited — measured where measurement exists, "indicative" where only autocomplete
behaviour exists, and "absent" where no source shows anything. Nothing is upgraded
beyond what its source supports.

## Sources and method

| # | Source | What it is | Date |
|---|---|---|---|
| S1 | WCH keyword phrase bank | `~/workspace/worldcityhub/data/keyword/phrase_bank.csv` — 1,949 phrases captured from Google + YouTube autocomplete across 7 markets (PK full seed list; WORLD/IN/AE/SA/US/GB core list) | pulled 2026-10-21 |
| S2 | WCH trends summary | `trends_summary.csv` — Google Trends relative index (0–100 within pull, 90-day means) via trendspy, 75 keyword rows | pulled 2026-10-21 |
| S3 | B7 autocomplete probes | 146 fresh probes run for this register (73 seeds × Google + YouTube) against `suggestqueries.google.com/complete/search` — the same public endpoint the daily engine uses. Full suggestion lists are in `demand-register.csv`'s companion probe log (see Appendix) | run 2026-10-22 |
| S4 | B7 supplementary Trends pull | trendspy, same method/timeframe as the daily engine ("today 3-m"), 5 pulls / 25 keywords covering the clusters the daily engine never seeded (compare, horoscope, wonders, places, batch-2 PK prayer) | run 2026-10-22 |

**Signal grades used in every table below**

- **STRONG (measured)** — a Google Trends mean index exists for the subject or its
  head term (S2/S4). Trends values are *relative within their pull*, so grades
  compare subjects inside a cluster, never across clusters.
- **INDICATIVE** — autocomplete returns a deep, on-topic suggestion tail (S1/S3):
  real search behaviour, but no volume number exists. A full 10/10 Google tail is
  the norm for any famous subject, so discrimination uses tail *content* (does it
  contain the site's own dimensions — population, area, GDP, fiqh variants,
  ticket/intent words?) and YouTube tail depth (YouTube caps lower and varies:
  0–10).
- **WEAK / ABSENT** — thin tails, near-zero measured index, or no presence in any
  source. Absence is reported as absence, never smoothed over.

**Two honesty caveats that govern the whole register**

1. The daily keyword engine was only ever seeded for **prayer, gold/FX, weather
   and time** (see `fetch_suggest.py` / `fetch_trends.py`). Compare, wonders,
   places and horoscope subjects therefore have *zero rows in S1/S2 by seeding
   design*, not because demand was measured and found missing. Those clusters
   are graded from S3 + S4, which were run for this register.
2. Keyword Planner volumes do **not** exist yet — the owner creates the Google
   Ads account (pending-list item), after which exact volumes can replace the
   relative indices here. Until then, no row in this register claims an absolute
   search volume, because none has been sourced.

---

## 1. Prayer cluster — the strongest measured demand the site owns

PK market, Google Trends 90-day means (S2, geo = PK):

| Subject | Head term | Mean index | Grade | Source |
|---|---|---|---|---|
| Lahore | namaz time lahore | 57.6 | STRONG | S2 |
| Karachi | namaz time karachi | 56.1 | STRONG | S2 |
| Rawalpindi | namaz time rawalpindi | 58.1 | STRONG | S4 |
| Islamabad | namaz time islamabad | 21.9 | STRONG (mid) | S2 |
| Faisalabad | namaz time faisalabad | 5.2 | measured, thin | S2 |
| Multan | namaz time multan | 5.0 | measured, thin | S2 |
| Quetta | namaz time quetta | 4.9 | measured, thin | S4 |
| Sargodha | namaz time sargodha | 2.6 | measured, very thin | S4 |
| Mardan | namaz time mardan | 1.2 | measured, very thin | S4 |
| Sukkur | namaz time sukkur | 0.5 | measured, near-absent | S4 |

Generic PK prayer terms are the largest measured block in the entire bank:
`fajr time` 56.6 · `namaz time` 53.9 · `prayer times` 20.6 (S2). The phrase bank
holds 841 prayer-cluster phrases (the FAQ bank count from R5's audit ⚠ VERIFY — verification-depth pass, 2026-10-22: this count could not be reproduced from `phrase_bank.csv`; recounts give 716 phrases filed under prayer seeds and 717–721 by text match under any reasonable term set. The 841 figure is R5's audit count under an unstated definition — treat as UNVERIFIED until R5's definition is produced), including
the fiqh dimension people actually type — e.g. "namaz time karachi hanafi",
"namaz time karachi shia today", "namaz time faisalabad shia" (S1) — which is
direct evidence for the method-toggle feature. Ramadan terms (`sehri time`,
`iftar time`) measure near-zero in October and spike seasonally (S2: sehri 0.2,
iftar 0.0 in PK) — a calendar fact, not a demand absence.

International prayer (S2, WORLD geo):

| Subject | Term | Mean index | Grade |
|---|---|---|---|
| London | prayer times london | 64.9 | STRONG |
| Dubai | prayer times dubai | 50.0 | STRONG |
| Sydney | prayer times sydney | 41.2 | STRONG |
| Toronto | prayer times toronto | 36.6 | STRONG |
| New York | prayer times new york | 9.7 | measured, thin (max 86 — spiky) |

S3 probes (2026-10-22) returned full 10/10 on-topic Google tails for prayer
times in Dubai, Riyadh, Jeddah, Doha, Istanbul, Abu Dhabi, Sharjah, Kuwait,
Muscat, Kuala Lumpur and Cairo — every packaged Gulf/regional city carries the
tail; YouTube tails were thin (0–6), as expected for a utility query.

**Register verdict — prayer:** activate in measured order. The published three
(Lahore, Karachi, Islamabad) sit on the strongest terms; **Rawalpindi is the
single most under-served measured subject in this register** (58.1 — top-tier
index, packaged in Round 1's registry work, not yet published). Gulf-city
prayer (Dubai first) is the strongest international line.

## 2. Cities / weather cluster

PK city weather, Trends 90-day means (S2, geo = PK): Peshawar 35.3 ·
Faisalabad 32.0 · Sialkot 31.0 · Lahore 27.5 · Multan 25.4 · Karachi 18.0 ·
Islamabad 18.5 · Quetta 6.1. Phrase-bank city mentions (S1, all markets):
Lahore 102 · Karachi 90 · Faisalabad 45 · Multan 40 · Peshawar 38 · Islamabad
35 · Dubai 34 · Sialkot 22 · Rawalpindi 14 · Hyderabad 12 · Riyadh 12 · Jeddah
12 · London 14 · Abu Dhabi 9 · New York 9 · Sharjah 9 · Istanbul 2 ·
Gujranwala 2 · **Quetta 0 · Sargodha 0 · Bahawalpur 0 · Abbottabad 0 ·
Sukkur 0 · Mardan 0 · Doha 0 · Toronto 0** (zero = never seeded in the engine,
not measured-zero; my S3 probes found full Google weather tails for Quetta,
Rawalpindi, Hyderabad, Gujranwala, Sargodha, Bahawalpur and Toronto, and
YouTube weather tails of 10/10 for Quetta, Hyderabad and Gujranwala).

**Register verdict — cities:** the packaged-but-unpublished PK tier orders
itself by measured signal as Peshawar ≈ Faisalabad ≈ Sialkot > Multan >
Rawalpindi (prayer-led) > Hyderabad > Quetta; the batch-2 five (Sargodha,
Bahawalpur, Abbottabad, Sukkur, Mardan) have indicative-only signals and
should activate last in the PK queue, behind everything measured.

## 3. Gold / FX cluster (the rates hub's demand)

| Term | Market | Mean index | Source |
|---|---|---|---|
| usd to pkr | PK | **72.8 — the strongest single PK term measured** | S2 |
| gold rate today | AE | 68.9 | S2 |
| gold rate today | SA | 64.4 | S2 |
| gold price | WORLD | 62.4 | S2 |
| gold rate today | IN | 54.6 | S2 |
| gold rate today | US | 54.3 | S2 |
| gold rate today | WORLD | 32.8 | S2 |
| gold rate in pakistan | PK | 41.9 | S2 |
| usd to pkr | US (diaspora) | 41.6 | S2 |
| sar to pkr | SA | 36.4 | S2 |
| gold rate today | GB | 34.5 | S2 |
| aed to pkr | AE | 13.0 | S2 |
| usd to inr | WORLD | 11.4 | S2 |

S3 probes for the batch-2 currency set returned full Google tails for gold
rate in Kuwait, Qatar, Oman and Malaysia, and for usd→kwd / usd→omr /
usd→myr / usd→egp / cad→pkr / aud→pkr — the diaspora-pair pattern extends
cleanly. YouTube tails for converter queries are ~0 (utility queries live on
Google) — recorded, not a negative signal for web pages.

**Register verdict — FX:** the demand is already served by the live /rates
hub; the register's actionable line is that **SAR→PKR and AED→PKR are
diaspora-market terms** (measured in SA/AE geos, near-zero in PK itself),
which is the evidence for keeping remittance-pair content aimed at the Gulf
markets (see B6 in the content bank).

## 4. Compare cluster — indicative-strong, measured-weak (both facts kept)

No compare term was ever seeded in S1/S2 (seeding artifact, caveat 1). The
S4 measured pull for literal "X vs Y" strings is **near-zero** (lahore vs
karachi 0.0, lahore vs islamabad 0.0, punjab vs sindh 0.0, lahore vs delhi
0.0, pakistan vs india 1.5 — WORLD, 3-month means). But the S3 autocomplete
tails are the richest in this register, and they ask for exactly the site's
figure set:

- "lahore vs karachi" → …food · population · area · area comparison · psl ·
  city · gdp · reddit
- "punjab vs sindh" → …population · gdp · which is better · area · budget
- "lahore vs delhi" → …which is better · area · gdp · comparison · population
  · pollution · **aqi · aqi today** · reddit
- "pakistan vs india", "karachi vs lahore", "dubai vs abu dhabi" → full
  10/10 tails on Google *and* YouTube (10/10 YouTube relevance for all five
  main pairs — the only cluster besides wonders where YouTube is saturated).

**Register verdict — compare:** people demonstrably *compose* these queries
(the tail proves the dimensions) but the literal head strings carry little
standalone Trends weight; the pairs should activate behind the city pages
they compare, and "lahore vs delhi" (with its AQI tail) is the standout
cross-border candidate. Grade: **INDICATIVE (strong tail), not measured.**

## 5. Wonders cluster — measured-strong

S4 (WORLD, 3-month means): taj mahal 46.9 · eiffel tower 38.4 · statue of
liberty 28.6 · burj khalifa 24.3 · great wall of china 11.8. S3: every
probed wonder (Taj Mahal, Eiffel Tower, Burj Khalifa, Great Wall, Pyramids
of Giza, Colosseum, Machu Picchu, Christ the Redeemer, Statue of Liberty,
Sydney Opera House, Hagia Sophia) returned 10/10 relevant tails on Google
**and** 10/10 on YouTube.

**Register verdict — wonders:** the golden replication order used in Round 2
(Taj first, then the batch-1 seven) matches the measured order well; demand
is not the constraint on this cluster — audit/merge order is.

## 6. Places cluster — measured-strong at the famous end, regional at home

S4 (WORLD): cn tower 49.5 · sydney opera house 37.0 · hagia sophia 33.1 ·
badshahi mosque 1.8 · faisal mosque 1.9. The two Pakistani places measure
low on a *worldwide* geo because their demand is regional (PK + diaspora);
that is a geo artifact to record, not a demand absence — S3 tails for both
are full 10/10 on Google and YouTube.

**Register verdict — places:** international places carry world-scale
measured demand; the home places ride on the Lahore/Islamabad city demand
(§1–2) rather than their own head terms.

## 7. Horoscope cluster — measured-strong head, thin per-sign terms

S4 (WORLD): horoscope today **60.4** · zodiac signs **49.9** · aries
compatibility 7.7 · leo horoscope today 5.0 · aries horoscope today 3.1.
S3 tails: "horoscope today" expands into a full per-sign tail (all 12 signs
suggested), and "aries compatibility" expands into a full matrix tail
("aries compatibility with scorpio / virgo / taurus / cancer / aquarius /
capricorn…") — which maps one-to-one onto the frozen Find Your Match design
(144 sign pairs).

**Register verdict — horoscope:** the demand concentrates in the *daily
head term* and the *compatibility matrix*, not in per-sign head terms —
exactly the shape of the built product (daily sign pages + Find Your Match).
Grade: STRONG (measured) for the hub terms; INDICATIVE for individual signs.

## 8. Time cluster (capitals / hero clocks) — measured

S2 (WORLD): time in london 36.8 · time in new york 29.0 · time in dubai
14.6 · time in sydney 13.6 · time in toronto 10.6. Supports the §9A capitals
panel and hero-clock ordering (London, New York lead).

---

## Activation-order implications (the register's bottom line)

1. **Rawalpindi** is the highest-value unpublished subject in the bank
   (prayer index 58.1, top-tier) — first in the PK activation queue.
2. PK measured tier: Peshawar, Faisalabad, Sialkot, Multan (weather +
   prayer), then Hyderabad, Quetta; batch-2 five last (indicative only).
3. International prayer pages (Dubai, London, Sydney, Toronto) carry
   measured demand comparable to mid-tier PK cities — they belong early
   in the international queue, not after it.
4. Compare pairs activate *behind* their cities; "lahore vs delhi" is
   the priority cross-border pair (AQI tail).
5. Wonders/places order is demand-safe as built; horoscope investment
   should favour the daily hub + compatibility matrix over per-sign
   head-term chasing.
6. FX content should be aimed at diaspora geos (SA/AE/US) for the
   remittance pairs — that is where the terms measure.

## Appendix — probe log (S3, 2026-10-22)

Method: `GET https://suggestqueries.google.com/complete/search?client=
firefox&q=<seed>&hl=en[&gl=PK][&ds=yt]` — 73 seeds × 2 sources = 146
probes, zero errors. Google returned 10 suggestions for every seed (the
endpoint's cap), so Google discrimination is by tail *content*; YouTube
returned 0–10 and is the discriminating count. Full per-probe suggestion
lists are banked alongside this file as `demand-probes-2026-10-22.csv`,
and the graded results are tabulated in `demand-register.csv`. One measurement artifact is
recorded for honesty: an automated relevance scorer initially scored
"horoscope today" 0/10 because it filtered the words "horoscope"/"today"
as stopwords — the actual tail is 10 per-sign suggestions, i.e. fully
relevant, and the register grades it so.

*End of register. Companion data: `demand-register.csv` (one row per
subject-signal).*
