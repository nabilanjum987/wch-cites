# F4 — Gold & silver feeds: register + canonical proposal (PREP ONLY — nothing changed)

**Status:** prep document for an owner decision. No code was changed by this
card. Prepared 2026-10-23 from the Batch 4 Item 2 audit (Finding 3),
re-verified against the code on `main` (`bcca87a457`).

**One correction to the audit's shorthand:** the audit summarised the feeds
as "city goldapi.io / ticker PAXG / rates gold-api.com". Read against the
code, /rates' **gold** is CoinGecko PAX Gold and gold-api.com serves /rates'
**silver**. The register below is what the code actually does today.

## Register — every surface, verified in code

### Gold

| Surface | Code location | Feed today | What it returns | Key? | Cache |
|---|---|---|---|---|---|
| City pages — gold figure in the at-a-glance panel, FAQ answers and JSON-LD | `src/lib/apis/cityData.ts` → `fetchGoldRates()` | **Primary: goldapi.io** `GET /api/XAU/{currency}`. **Fallback: CoinGecko PAX Gold** `simple/price?ids=pax-gold` | goldapi: spot in the requested currency incl. `price_gram_24k`. Fallback: PAXG token price (USD + PKR), converted to per-gram (÷ 31.1035). | **goldapi needs `NEXT_PUBLIC_METAL_KEY`**; PAXG keyless | 3600s |
| Homepage Ticker 1 + Ticker 2 (gold /oz, gold Rs/tola, 24h mover) | `src/lib/tickers.ts` | **CoinGecko PAX Gold** (`simple/price`, USD + PKR, 24h change) | Token price; tola derived × 11.6638 / 31.1035 | Keyless | 300s |
| Homepage finance snapshot | `src/components/home/GlobalMarketSnapshot.tsx` | **CoinGecko PAX Gold** | USD + PKR + 24h change | Keyless | client fetch |
| Homepage search typeahead | `src/lib/home-search.ts` | **CoinGecko PAX Gold** (PKR) | Token price in PKR | Keyless | — |
| My City rail (gold/tola card) | `src/lib/home-mycity.ts`, refetched client-side in `src/components/home/MyCityPanel.tsx` | **CoinGecko PAX Gold** (PKR) | Token price in PKR | Keyless | 300s |
| /rates — gold section (karats, per-gram/tola, 30-day & YTD history, 24h change, high/low) | `src/lib/apis/rates.ts` → `fetchGoldRates()` | **CoinGecko PAX Gold** (`coins/markets` + `pax-gold/market_chart?days=365`) | USD token price, 24h change, 24h high/low, 365-day price series (karats derived from spot in `buildRates`) | Keyless | per-request |

Housekeeping note: `src/lib/api/cityData.ts` (singular `api/`) is a stale
duplicate of the live `src/lib/apis/cityData.ts` and contains the same
goldapi.io call. Nothing imports it on main — it should be deleted in the
follow-up card so a future grep never "finds" a second gold path again.

### Silver — already single-sourced

| Surface | Code location | Feed today | What it returns | Key? | Cache |
|---|---|---|---|---|---|
| /rates — silver section | `src/lib/apis/rates.ts` → `fetchSilverRates()` | **gold-api.com** `GET /price/XAG` | USD spot per troy oz + the source's own `updatedAt` timestamp. **No 24h change** — the section deliberately shows spot + derived weights only rather than inventing a daily move | Keyless | 300s |
| Homepage Ticker 1 (silver item) | `src/lib/tickers.ts` | **gold-api.com** XAG | same | Keyless | 300s |
| My City rail (silver) | `src/lib/home-mycity.ts` + `MyCityPanel.tsx` | **gold-api.com** XAG | same | Keyless | 300s |

Silver needs no consolidation decision: every surface already reads the
same feed, and the code comments say so explicitly ("so /rates#silver and
Ticker 1's silver item can never disagree").

## Why gold disagrees with itself today

- **Two different instruments.** goldapi.io returns bullion spot.
  CoinGecko's PAX Gold is a *tokenised-gold crypto token* whose price
  tracks spot closely but is not spot — it carries token-market noise and
  its own trading hours. The Batch 4 audit measured the practical effect:
  same magnitude on every surface, small live margins, no single truth.
- **A silent source switch.** On city pages the *displayed* source depends
  on whether `NEXT_PUBLIC_METAL_KEY` is set and goldapi.io answers. If the
  key lapses, every city page quietly switches to PAXG — the same failure
  shape as the PC1 incident (a placeholder replaced by an unplanned
  source). Nobody decides; the environment decides.
- **Three cache clocks.** 3600s (city), 300s (tickers/My City), per-request
  (/rates) — so even the surfaces that share PAXG rarely show the identical
  number at the same moment.

## Proposal — one canonical feed per metal

### Gold: canonical = **gold-api.com `GET /price/XAU`**, fallback = CoinGecko PAX Gold

- **Same provider as silver.** gold-api.com already serves every silver
  surface reliably; making it the spot source for both metals leaves the
  whole site with **one metals provider, one failure mode, one timestamp
  semantics** (it publishes `updatedAt`, so every surface can show the
  same "as of" time).
- **True spot, keyless.** XAU on gold-api.com is a bullion spot price with
  no API key — which fits the project's $0 / free-API doctrine and removes
  the site's only keyed metals dependency (goldapi.io) and its silent
  source-switch with it.
- **PKR fit.** gold-api returns USD/oz; conversion to PKR uses the site's
  existing ExchangeRate-API USD/PKR rate — the same conversion path the
  tickers and /rates already use for their USD figures — so per-gram and
  per-tola (× 11.6638 / 31.1035) become one calculation everywhere.
- **The fallback already exists.** The city fetch's PAXG fallback stays as
  the documented fallback for every surface (extend the same pattern),
  so a gold-api outage degrades to today's behaviour instead of a blank.
- **One honest exception:** gold-api publishes spot only — no 24h change,
  no history. /rates' 30-day/YTD chart and 24h-change figure would keep
  coming from CoinGecko's PAXG `market_chart` series, labelled as that
  series. The headline spot everywhere (the number users compare across
  pages) is gold-api's; the chart stays a clearly-labelled secondary
  display. If the owner prefers zero exceptions, the alternative is
  canonical = CoinGecko PAXG everywhere (city pages drop goldapi and use
  PAXG as primary) — simpler, but it makes a crypto token the site's
  definition of the gold price, which is the weaker foundation.

### Silver: canonical = **gold-api.com `GET /price/XAG`** (no change)

Already unanimous across /rates, the ticker and My City. The follow-up
card should simply record it as canonical so nobody "improves" one surface
away from the others.

### What the follow-up fix card would do (after the owner decides)

1. Point `fetchGoldRates()` (city data layer) at gold-api XAU; retire the
   goldapi.io call and the `NEXT_PUBLIC_METAL_KEY` dependency; keep the
   PAXG fallback.
2. Point the ticker / snapshot / search / My City gold reads at the same
   gold-api XAU value (one shared helper, one 300s cache), converting via
   the site FX rate.
3. /rates: headline gold spot from gold-api XAU; history + 24h change stay
   on CoinGecko PAXG, labelled as the PAXG series.
4. Delete the dead `src/lib/api/cityData.ts` duplicate.
5. Update `/sources` (it already lists gold-api.com for silver) and
   re-run the consistency audit: the same gold figure, same timestamp,
   on city / ticker / My City / rates at the same moment.

*No feeds were changed by this document.*
