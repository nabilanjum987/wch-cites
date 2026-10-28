# Source Reliability Register — WorldCityHub (Research Bank B9)

**Status:** LIVING REGISTER, banked 2026-10-22. Review date for every row: **2026-10-22**.
**Compiled from:** (1) codebase grep of this repo tree (endpoints + `process.env` reads),
(2) `DAY_LOG_2026-10-22.md`, (3) `wch-local-data-api-map-2026-10-22.md`.
**Conventions:** Key owner = whose account/Vercel env holds the key. A limit or term that could
not be verified in this pass is marked **UNVERIFIED** rather than asserted. "In tree" means
present in the codebase as grepped 2026-10-22 (pre-merge main state; several fixes exist only
on unmerged PR branches and are noted as such).

## ⚠ Flags first (read before the table)

1. **NEW — fabrication function still mounted (not in the day log).**
   `src/lib/apis/news.ts` → `fetchYouTubeVideos()` **invents** video listings: titles
   synthesised from the country slug ("Latest news from X #1…#6"), a hard-coded videoId
   (`dQw4w9WgXcQ`), `Math.random()` view counts and durations, and `picsum.photos` placeholder
   thumbnails. It is still imported by `src/components/city/VideoNews.tsx` and mounted in
   `src/components/city/NewsPage.tsx:992`. Whether a live route still renders NewsPage was
   **not** verified in this pass (the migration-0004 DB news system may have superseded it) —
   recorded as a code-level risk of the same family as the `schemaMarkup.ts` dead-code flag:
   **verify reachability and remove before any wiring.** Neighbouring `generate*` functions in
   the same file (`generateGlobalImpacts`, `generateTrendingTopics`, `generateWeekInReview`)
   were not audited line-by-line in this pass and are flagged for the same check.
2. **TheSportsDB state differs by branch.** Day log: free key `3` permanently dead, test key
   `123` adopted. This tree: base URL is `/api/v1/json/2` (`src/lib/apis/sports.ts`,
   `SportsClient.tsx`) with two further calls on `/json/3/`. Neither matches the day-log state —
   reconcile at merge time.
3. **Name-collision trap:** `gold-api.com` (keyless, in tickers/rates) and `goldapi.io`
   (keyed, `NEXT_PUBLIC_METAL_KEY`, in cityData) are **different services**; both are in code.
4. **Frankfurter migration is branch-only.** This tree still calls the legacy host
   `api.frankfurter.app` in `src/lib/apis/rates.ts` (lines 303, 344). The move to the
   ExchangeRate-API open endpoint exists on PR #13 (unmerged).

---

## A. Finance & economy

| Source | Owner | Powers | Licence / terms | Free-tier limits | Key | Fallback | Status 2026-10-22 |
|---|---|---|---|---|---|---|---|
| CoinGecko | CoinGecko | Ticker gold (PAXG), BTC, market movers | API terms; attribution expected | UNVERIFIED (public tier rate limits apply) | none | gold-api.com | ACTIVE (tickers.ts) |
| gold-api.com | gold-api.com | Silver spot XAG (ticker + rates); XAU path | Free API, terms UNVERIFIED | UNVERIFIED | none | CoinGecko PAXG | ACTIVE |
| goldapi.io | GoldAPI.io | Gold price in cityData path | Commercial API, keyed | UNVERIFIED | owner (`NEXT_PUBLIC_METAL_KEY`) | gold-api.com / CoinGecko | ACTIVE in code; key in Vercel |
| open.er-api.com | ExchangeRate-API (open endpoint) | Ticker FX (USD/PKR, SAR, AED, GBP…) | Free open endpoint, attribution | Updates daily; pair limits UNVERIFIED | none | ExchangeRate-API v6 keyed | ACTIVE |
| ExchangeRate-API v6 | ExchangeRate-API | FX in cityData path | Keyed API terms | UNVERIFIED | owner (`NEXT_PUBLIC_EXCHANGE_KEY`) | open.er-api.com | ACTIVE in code |
| Frankfurter | Frankfurter (ECB data) | Legacy FX history in rates.ts | Free, keyless | n/a | none | ExchangeRate-API (PR #13, unmerged) | **DEGRADED** — new host dropped PKR/AED/SAR (ECB currencies only); legacy host still called in this tree |
| FRED | Federal Reserve Bank of St. Louis | Brent crude (DCOILBRENTEU) via fredgraph.csv | Free; cite FRED | Daily series (not intraday) | none | none wired | ACTIVE (tickers) |
| Alternative.me | Alternative.me | Fear & Greed index (ticker) | Free API | UNVERIFIED | none | omit item (ticker emits only on response) | ACTIVE |
| World Bank API | World Bank | Economy indicators; world population anchor + growth (ticker); country datasets | Open data, CC BY 4.0 (WB terms) | Keyless; generous | none | cached country dataset (PC1 pattern) | ACTIVE |

## B. Weather, environment, time, place

| Source | Owner | Powers | Licence / terms | Free-tier limits | Key | Fallback | Status 2026-10-22 |
|---|---|---|---|---|---|---|---|
| Open-Meteo (forecast + archive) | Open-Meteo | Weather on city/home pages; climate archive | Free for non-commercial use (their terms); commercial = subscription | UNVERIFIED (fair-use rate limits) | none | OpenWeatherMap | ACTIVE (6 forecast call sites) |
| Open-Meteo Marine | Open-Meteo | Ocean wave data (oceans pages) | As above | UNVERIFIED | none | omit section | ACTIVE (oceans.ts); null-wave bug found+fixed in R2 |
| Open-Meteo Air Quality (CAMS) | Open-Meteo / Copernicus | AQI + pollutants (weather pages) | As above | UNVERIFIED | none | OpenAQ stations | ACTIVE (weather.ts) |
| OpenWeatherMap | OpenWeather | Weather + forecast (co-source) | API terms; free tier | UNVERIFIED | owner (`NEXT_PUBLIC_OPENWEATHER_KEY`, `OPENWEATHER_API_KEY`) | Open-Meteo | ACTIVE |
| Aladhan | Aladhan / Islamic Network | Prayer timings (5 call sites), method variants | Free API | UNVERIFIED | none | none wired for prayer | ACTIVE |
| sunrise-sunset.org | sunrise-sunset.org | Sunrise/sunset/day length (cityData) | Free with attribution (re-verify before commercial reliance — UNVERIFIED this pass) | UNVERIFIED | none | Open-Meteo sun times | ACTIVE in code; credited on /sources |
| date.nager.at | Nager.Date | Public holidays (ticker, city, events) | Free, keyless | n/a | none | curated holiday tables (migration 0003) | ACTIVE with **coverage gaps: PK absent; QA/KW/OM/MY absent (204)** |
| ipwho.is | ipwho.is | Visitor approximate city (My City panel) | Free tier | UNVERIFIED | none | default city | ACTIVE |
| ipapi.co | ipapi.co | (former visitor-geo first choice) | — | — | none | ipwho.is | **SUPERSEDED** — rate-limited from this network; only a code comment remains (useVisitorCity.ts) |
| Local flag artwork | Vendored PNGs in public/images/flags/ | Capital/country flags (WorldCapitals) | Public-domain flag artwork, vendored locally | n/a | none | omit flag | VENDORED (F20, 2026-10-28) |
| OpenStreetMap (Nominatim + Overpass) | OSM contributors | Reverse geocode; POI/amenity queries | ODbL; Nominatim usage policy (rate limits) | policy-capped | none | none wired | ACTIVE in code |
| emergencynumberapi.com | emergencynumberapi | Emergency numbers (city local info) | Free API, terms UNVERIFIED | UNVERIFIED | none | omit section | ACTIVE in code |

## C. News, events, sports

| Source | Owner | Powers | Licence / terms | Free-tier limits | Key | Fallback | Status 2026-10-22 |
|---|---|---|---|---|---|---|---|
| GNews | GNews | /news + homepage news (search endpoint; PK has no country edition) | **Free tier is NON-COMMERCIAL** (owner-flagged) | ~100 req/day, ~10 articles/req, ~12 h delay (per day log/API map) | owner (`NEXT_PUBLIC_GNEWS_KEY`, `GNEWS_API_KEY`) | RSS layer | ACTIVE — terms are the known commercial risk; owner decision pending |
| NewsData.io | NewsData | — (nothing) | — | — | owner (key sits in Vercel) | n/a | **INERT** — zero *functional* references in this tree (no endpoint, no env read; grep-verified 2026-10-22, wording corrected in the verification pass — the only service mention is a header comment in `news.ts` recording that this module originally used NewsData.io and was consolidated onto GNews in Batch 2i, 2026-10-21) |
| RSS layer (news-rss.ts) | each publisher | News fallback/co-source: BBC, Al Jazeera, UN News, Dawn, ScienceDaily, NASA, CoinDesk, WHO (8 feeds in tree) | Publishers' RSS terms; headlines+links only | n/a | none | GNews | ACTIVE |
| The Guardian Open Platform | Guardian News & Media | News fetcher (Q13, env-gated) | API terms; key required | UNVERIFIED | **absent** (owner-key item; code reads `GUARDIAN_API_KEY` ×3) | GNews/RSS | NOT WIRED — key absent |
| Ticketmaster Discovery | Ticketmaster | Events listings | API terms | UNVERIFIED | owner (`NEXT_PUBLIC_TICKETMASTER_KEY`) | curated events DB (migration 0003) | ACTIVE; **PK coverage ≈ zero** (coverage fact, not a key fault) |
| TheSportsDB | TheSportsDB | Sports fixtures/results | Free/test keys | UNVERIFIED | test keys in URL path | events DB | **BRANCH-DEPENDENT** — see Flag 2: tree uses `/json/2` base + `/json/3` calls; day log records key `3` dead, `123` adopted elsewhere |
| YouTube (as wired) | — | — | — | — | — | — | **NOT A SOURCE — see Flag 1.** `fetchYouTubeVideos()` fabricates listings; the real YouTube Data API key was never submitted (owner pending list) |

## D. Knowledge, population, reference

| Source | Owner | Powers | Licence / terms | Free-tier limits | Key | Fallback | Status 2026-10-22 |
|---|---|---|---|---|---|---|---|
| Wikidata | Wikimedia Foundation | Entities/facts backbone: capitals, wonders, oceans, personalities, QID-verified datasets | CC0 | Keyless; fair-use rates | none | Wikipedia | ACTIVE (data-side, via banked packages) |
| Wikipedia / Wikimedia APIs + Commons | Wikimedia Foundation | Overviews, summaries (REST + action API), licensed images | CC BY-SA text; per-file image licences (image bank verifies per asset) | Keyless | none | omit | ACTIVE |
| UNHCR Population API | UNHCR | Conflicts displacement figures | Open API | n/a | none | ReliefWeb (outbound links in tree) | ACTIVE with **TRAP: a wrong/absent parameter silently returns GLOBAL totals** — caught in testing, never shipped; parameter discipline mandatory |
| OpenAQ | OpenAQ | AQI station fallback (weather.ts) | Open data | UNVERIFIED | none | Open-Meteo CAMS | ACTIVE in code on the **v2 endpoint** — but v2 is **DEAD: HTTP 410 Gone** (probed 2026-10-22, verification-depth pass); v3 requires an API key (HTTP 401 unauthenticated, probed same day), and no key is held — the code path cannot return data until migrated + keyed |
| WAQI (aqicn) | World Air Quality Index | — (would power station AQI) | Token required | — | **absent** (owner-key item) | Open-Meteo + OpenAQ | NOT WIRED — zero references in tree |
| hadithapi.com | hadithapi | Faith content (islamic.ts) — observed in code | UNVERIFIED | UNVERIFIED | UNVERIFIED | curated faith content | ACTIVE in code (observed; not in day log) |
| bible-api.com | bible-api.com | Faith content (faiths.ts) — observed in code | Free API, terms UNVERIFIED | UNVERIFIED | none observed | curated faith content | ACTIVE in code (observed; not in day log) |
| Google Trends via trendspy | Google (unofficial access) | Keyword/demand research ONLY (not the site) | Unofficial library over public Trends | Self-throttled (16 pulls/day in the daily cron) | none | autocomplete probes | ACTIVE (tools venv; pytrends broken, trendspy works) |
| Supabase | Supabase | DB for cities/events/news/personalities/suggestions; RLS | Platform terms | Free-tier project limits UNVERIFIED here | owner project (`NEXT_PUBLIC_SUPABASE_URL`/`_ANON_KEY` — public by design under RLS) | static datasets in repo | ACTIVE; suggestions table SQL still on owner's pending list |
| picsum.photos | picsum | Placeholder images | — | — | none | — | **Not a data source** — appears only inside the Flag-1 fabrication function |

## E. Dead, unreachable, forbidden, or mapped-but-unused

| Source | State 2026-10-22 | Note |
|---|---|---|
| REST Countries | **DEAD** | Service down; zero references in this tree; Wikidata substituted during R2/R3 |
| Stooq | **UNREACHABLE** from this network | Tested during Q1 ticker build; never wired |
| goldprice.org | **FORBIDDEN** | Terms prohibit the intended use; never wired |
| GDELT | Mapped, unused | Named in the API-map backbone; no reference in this tree |
| USGS Earthquake API | Mapped, unused | Named in the API-map backbone; no reference in this tree (Terralocate uses it; WCH does not yet) |
| NASA API | Mapped, unused | Only a NASA *RSS feed* is wired (news layer); no api.nasa.gov key |
| Frankfurter (new host frankfurter.dev) | Degraded | See §A — dropped PKR/AED/SAR |

## Status changes vs the day log (the delta this register adds)

1. **NEW FLAG:** `fetchYouTubeVideos()` fabrication (Flag 1) — not recorded in the day log;
   still mounted via NewsPage/VideoNews in this tree; reachability from live routes unverified.
2. **TheSportsDB:** day-log state (`123` in use) does not match this tree (`/2` base, `/3`
   calls) — branch-dependent; reconcile at merge.
3. **Frankfurter:** day-log suspicion confirmed in code — legacy host still called in
   `rates.ts`; the fix is PR #13 only.
4. **NewsData inert:** confirmed by grep (zero functional references — one historical comment
   in `news.ts` records its Batch-2i replacement by GNews; two other grep hits are an unrelated
   local variable), not just by report.
5. **OpenAQ v2 endpoint** in production code path — migration status resolved by the 2026-10-22 verification-depth pass: **v2 returns HTTP 410 Gone; v3 is key-gated (401 without a key)**. The fallback as wired is therefore inoperative, not merely unverified.
6. **hadithapi.com / bible-api.com** observed in code but absent from the day log's source
   narrative — now registered with UNVERIFIED terms/key status.

*Register rule going forward: a source enters this table only with a dated observation (code
grep, fetch, or day-log entry). Anything else is UNVERIFIED or UNSOURCED — never upgraded.*
