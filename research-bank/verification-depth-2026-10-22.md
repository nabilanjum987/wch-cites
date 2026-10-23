# Verification-Depth Register — Future Bank (B1–B10), 2026-10-22

**Pass:** TONIGHT card 4 (bank verification depth), run 2026-10-22 after the bank landed
(PRs #56–#66). Every banked file group was re-checked against its own stated sources —
live fetches where the source is a URL/API (World Bank, Alternative.me, Frankfurter,
TheSportsDB, nager.at, GNews, OpenAQ, Terralocate, TrackPostcode, PSA/CSO/BMKG/DWD),
and cross-checks against the repo's verified packages where the source is a package.
**Outcomes:** VERIFIED (matches source) · CORRECTED (fixed in place on the
`bank-verify2-*` branches — old → new recorded below) · FLAGGED (cannot be re-verified —
annotated inline in the banked file with a ⚠ VERIFY note; never silently kept, never
replaced with an unsourced figure).

**Totals: 3 corrections (3 files), 1 flag (1 file). All other groups verified clean.**

---

## B6 — Finance evergreens (5 files) — 2 CORRECTED

Checked ~34 figures/mechanism claims; 32 verified, 2 corrected, 0 flagged.

- **CORRECTED — `fear-and-greed-index-explained.md`, Alternative.me band boundaries.**
  Old: "0–24 extreme fear, 25–44 fear, 45–55 neutral, 56–75 greed, 76–100 extreme greed"
  (these were CNN's cut points, attributed to Alternative.me).
  New: **0–25 extreme fear, 26–46 fear, 47–54 neutral, 55–75 greed, 76–100 extreme greed.**
  Source: the publisher's own API (`api.alternative.me/fng/?limit=0`, full history,
  fetched 2026-10-22) — the min/max envelope of every classified reading is
  Extreme Fear ≤25 · Fear 26–46 · Neutral 47–54 · Greed 55–75 · Extreme Greed ≥76.
  The file's CNN bands (0–24/25–44/45–55/56–74/75–100) were independently verified
  against CNN-methodology sources and stand. Component weights (25/25/15/15-paused/
  10/10) match the publisher's methodology page verbatim.
- **CORRECTED — `how-pakistan-gold-pricing-works.md`, the association's name.**
  Old: "All Pakistan Sarafa Gems and Jewellers Association (APGJSA)" — a mismatched
  pairing. New: **"All-Pakistan Gems and Jewellers Sarafa Association (APGJSA)"**,
  the expansion the financial press uses (Business Recorder reporting, 2026-10-20/22);
  the variant word order "All Pakistan Sarafa Gems and Jewellers Association" pairs
  with the acronym APSGJA (sarafagold.com / apsgja.org) and is now noted in the
  file's Sources. The mechanism claims themselves verified: the association's sheet
  states interbank conversion + 24K/999 benchmark (press publication of the
  21 Oct 2026 sheet); formula (LBMA × USD/PKR × 11.6638 ÷ 31.1035 + premium) and
  karat factors (×0.9167 / ×0.875 / ×0.75) match sarafagold.com's published explainer.
- **VERIFIED — Zakat nisab (the priority check):** 87.48 g gold / 612.36 g silver
  (7.5 / 52.5 tola) confirmed as the Banuri Town standard, reproduced by multiple
  calculators citing Jamia Uloom-ul-Islamia Banuri Town fatwas; the 85 g / 595 g
  Arab convention confirmed alongside. 20 mithqal / 200 dirhams, the 2.5% rate, and
  the worked example's arithmetic (10 tola 22K @ Rs 440,000 = Rs 4,400,000; total
  Rs 4,500,000; silver nisab Rs 262,500; zakat Rs 112,500) all check out.
- **VERIFIED — dated FX sample:** interbank 277.00 / open market 279.77 for
  22 Oct 2026 confirmed live on sarafagold.com the same day (both figures shown in
  its formula panel); the remittance guide's worked figure (US$500 × 277.00 =
  Rs 138,500) is arithmetically exact; PRI (2009, SBP/Finance/Overseas Pakistanis)
  and Roshan Digital Account attributions are correct.

## B9 — Source reliability register (33 rows) — 1 CORRECTED

The register's load-bearing claims were re-run live; 11 of 12 spot checks confirmed
exactly as written, 1 status resolved by correction.

- **CORRECTED — OpenAQ row.** Old status: "ACTIVE in code on the v2 endpoint;
  v2→v3 migration status UNVERIFIED." Probed 2026-10-22: **v2 returns HTTP 410
  Gone; v3 returns HTTP 401 without a key** (no key is held). The row now records
  the fallback path as inoperative until migrated + keyed; delta note 5 updated.
- **VERIFIED — Frankfurter:** `api.frankfurter.dev/v1/currencies` lists 30
  currencies; PKR, AED and SAR are absent — the DEGRADED status and the
  "ECB currencies only" explanation are exact. Legacy host still called at
  `rates.ts:303,344` in this tree (re-grepped).
- **VERIFIED — GNews free tier:** gnews.io/pricing (fetched 2026-10-22) states
  non-commercial use only, 100 requests/day, up to 10 articles/request, 12-hour
  delay — the register's figures to the digit.
- **VERIFIED — TheSportsDB:** key `3` → HTTP 403 "permanently disabled";
  key `123` → HTTP 200 with data; the tree's `/json/2` base → HTTP 400
  "Invalid Premium API key" — the branch-dependent flag is accurate as written.
- **VERIFIED — nager.at coverage:** 2026 holidays — PK, QA, KW, OM, MY all
  HTTP 204 (no data); US HTTP 200. The register's coverage-gap list is exact.
- **VERIFIED — code flags:** `fetchYouTubeVideos()` re-grepped: hard-coded
  videoId `dQw4w9WgXcQ` and `Math.random()` view counts/durations present at
  `src/lib/apis/news.ts:201-211`, still imported by `VideoNews.tsx`. NewsData
  remains at zero *functional* references (one historical header comment in
  `news.ts`; one unrelated local variable in `SportsClient.tsx`).
- Rows the register itself marks UNVERIFIED (CoinGecko/gold-api limits,
  Ticketmaster limits, sunrise-sunset terms, hadithapi/bible-api terms…) were
  left as marked — honest UNVERIFIEDs are not defects.

## B7 — Demand register (70 rows + 146 probes) — 1 FLAGGED

Checked ~85 items; all verified except one internal count.

- **FLAGGED — "841 prayer-cluster phrases"** (`demand-register.md` §1, attributed
  to R5's audit). ⚠ VERIFY annotation added inline. Recounts of
  `phrase_bank.csv` (2026-10-22): 716 phrases filed under prayer seeds; 717–721
  by text match under the widest reasonable term set. No definition tried
  reproduces 841. The figure stays in place, flagged — R5's counting definition
  would be needed to clear it. Nothing else in the register depends on it (the
  fiqh-variant examples it introduces were verified present in the bank).
- **VERIFIED — Trends values:** 41 values quoted in the register were matched
  against `trends_summary.csv` (75 rows) — every one exact, including namaz time
  lahore 57.6, rawalpindi's S4 companions quetta 4.9 / sargodha 2.6 / mardan 1.2 /
  sukkur 0.5 (CSV-consistent), usd to pkr 72.8, gold rate today AE 68.9 / SA 64.4 /
  IN 54.6 / US 54.3 / GB 34.5 / WORLD 32.8, sehri 0.2 / iftar 0.0.
- **VERIFIED — phrase-bank counts:** 1,949 phrases (1,950 lines incl. header);
  all 26 city-mention counts in §2 reproduce exactly (Lahore 102 … Toronto 0).
- **VERIFIED — probes:** 12 of the 146 banked probes (6 seeds × Google/YouTube)
  re-run live 2026-10-22: 10 byte-identical; 2 (horoscope today, namaz time
  rawalpindi — Google) returned the identical 10-suggestion set in different
  order (normal intraday autocomplete drift). `demand-register.csv` ↔
  `demand-register.md` are fully consistent across all 70 rows.

## B2 — Country content (15 files) — VERIFIED, 0 corrections

Every numeric token in every file was swept against its country package
(`country-packages/` + `country-packages-batch2/`); the only non-package numbers
were emergency numbers and structural facts, each confirmed (Egypt 122/123/180;
India 28 states + 8 UTs = 36 packaged subdivisions; Türkiye 81 provinces; US
51 entries = 50 states + DC; Kuwait 112; Canada/US 911; Gulf 999-family).
End-to-end live check: **population and GDP for all 15 countries re-pulled from
the World Bank API (SP.POP.TOTL, NY.GDP.MKTP.CD, mrv=1) — 30/30 match the
banked figures** (e.g. Pakistan 255,219,554 / US$407.3B; Qatar 2,972,215 /
US$215.6B; UAE GDP US$552.3B is the 2024 value, as the file's snapshot states).
All 10 sampled GDP-per-capita figures (AE 50,274 · GB 57,602 · US 90,027 ·
SA 34,537 · QA 72,525 · MY 13,125 · CA 55,698 · AU 65,130 · EG 3,086 ·
PK 1,596) match the World Bank to rounding; Egypt inflation 14.07% and
remittances US$41.5B match FP.CPI.TOTL.ZG / BX.TRF.PWKR.CD.DT 2025 exactly.

## B1 — City content (33 files) — VERIFIED, 0 corrections

All 33 files swept numerically against the city packages
(`city-packages/`, `intl-city-packages/`, `intl-city-packages-batch2/`);
18 files (8 PK + 10 international) additionally hand-reviewed. Every figure
traces to its city package, its country package, or the World Bank (the PK
files' recurring country figures — GDP US$407.3B, GDP per capita US$1,596 —
are the WB 2025 values verified under B2). No figure in any city file failed
to trace. Elevation trap noted in Round 2 (Bahawalpur) remains correctly
handled — the banked file uses the corrected value from the package.

## B3 — Wonder + place content (26 files) — VERIFIED, 0 corrections

All 26 files swept against the place packages (`places/`, `places-batch2/`),
`wonders.ts` and migrations 0008/0011. Four numbers outside the pool were
hand-verified in context, all correct and two of them corrections of common
myths, properly framed: Golden Gate towers 746 ft ≈ 227 m (Myth-vs-Fact card);
Grand Canyon South Rim ≈2,100 m; St Peter's dome climb 551 steps (320 after
the lift); Sheikh Zayed Grand Mosque file's UAE emergency set 999/998/997.
The Eiffel file's 324 m vs 330 m handling matches its sources (324 m place-row
survey; 330 m with the 2022 antenna used in the Story) — the current official
height is 330 m.

## B5 — Compare narratives (5 files) — VERIFIED, 0 corrections

All figures trace to `src/lib/compare.ts`, the packages, or the files' cited
PBS 2023 census finals — which are exact: Punjab 127,688,922 · Sindh
55,696,147 · KP 40,856,097 · Balochistan 14,894,402. Official provincial areas
(Punjab 205,344 km² · Sindh 140,914 km² · Balochistan 347,190 km²) are the
census-frame areas the files cite; densities are labelled derivations and the
arithmetic re-checks (Punjab 622/km², Sindh 395/km², KP 402/km²).
Pakistan-vs-India uses the WB set verified under B2.

## B8 — Competitor watch — VERIFIED, 0 corrections (2 refinements noted)

The citable claims were re-fetched live 2026-10-22:
- **Terralocate PK shard** (`sitemap-places/pk/1`): lastmods cluster in June
  2026 exactly as recorded (bulk 2026-06-04, second wave 2026-06-28).
  Refinements for the next watch: the full shard holds **852 URLs** (B8 quoted
  the then-visible truncated portion, "≥200" — accurate as stated), and 6 URLs
  carry a 2026-06-11 lastmod between the two waves.
- **Terralocate Lahore defects — both still live:** headline population
  11,126,285 vs "over 14 million" in the same page's overview; "Nearby places
  in Punjab" still lists Baía da Traição, Aldeia Acajutibiro and Aldeia Forte
  (Brazil) at "7591.9 mi away" (B8's "7,591.9" is the same figure, comma-formatted).
- **TrackPostcode:** homepage still states data updated 22 October 2026 and
  539 scored areas (449/53/37 split in structured data) — verified.

## B10 — Next-tier scouting (12 countries, 17 rows) — VERIFIED (sample), 0 corrections

Four of the 17 verified rows were re-fetched 2026-10-22, including all three
"strongest stack" claims: PSA OpenSTAT live, carrying the open-licence text
("data can be freely used, re-used and redistributed by anyone without any
restrictions other than proper source attribution" + CC BY 4.0) exactly as
scouted; CSO PxStat (data.cso.ie) live; BMKG open-data portal live; DWD
open-data server live. Rows B10 itself marked UNVERIFIED (BPS Web API model,
Destatis GENESIS, INSEE API, 5 named-but-unfetched weather services) were
left as marked — they were recorded as gaps, not claims.

## B4 — Horoscope evergreen (13 files) — VERIFIED clean

All 13 files scanned for dated or factual claims: no years, no percentages,
no statistics, no transit/event claims anywhere in the sign profiles (transit
references exist only in the monthly framework, which is a production-method
document, and in Sources notes pointing at the site's own computed system).
Sign rulerships match the conventions the files cite (Mars/Aries, Moon/Cancer,
Saturn/Capricorn, Mercury/Gemini, Uranus/Aquarius…). The entertainment
framing line is present in 13/13 files. Editorial content verified as
editorial — nothing to correct or flag.

---

## Correction/flag index (for the two verify2 PRs)

| # | File | Outcome | Change |
|---|---|---|---|
| 1 | content-bank/finance/fear-and-greed-index-explained.md | CORRECTED | Alternative.me bands 0–24/25–44/45–55/56–75/76–100 → **0–25/26–46/47–54/55–75/76–100** (publisher API history) |
| 2 | content-bank/finance/how-pakistan-gold-pricing-works.md | CORRECTED | Association name "All Pakistan Sarafa Gems and Jewellers Association (APGJSA)" → **"All-Pakistan Gems and Jewellers Sarafa Association (APGJSA)"** (press expansion; APSGJA variant noted in Sources) |
| 3 | research-bank/source-register.md | CORRECTED | OpenAQ row: v2→v3 status UNVERIFIED → **v2 HTTP 410 Gone; v3 key-gated (401)** — fallback path inoperative until migrated + keyed |
| 4 | research-bank/demand-register.md | FLAGGED | "841 prayer-cluster phrases" annotated ⚠ VERIFY — unreproducible from phrase_bank.csv (recounts 716–721); R5's definition outstanding |

*Method note: a figure was only ever corrected against the same class of source
the file itself cites (publisher's own API/page, the repo's verified packages,
the World Bank). Where a source could not settle a figure, the figure was
flagged, not replaced. Files only — nothing in this pass is wired to a route.*
