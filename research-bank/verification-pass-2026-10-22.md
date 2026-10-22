# Verification Pass — Research Bank Registers (2026-10-22)

**Scope per the Future Bank order:** after B10, verification depth ONLY — a sample of the
bank's own claims re-checked against their sources; corrections on a `bank-verify-*` branch.
No new scope was opened. All re-checks performed 2026-10-22.

## Sample re-checks (11)

| # | Claim (where) | Re-check method | Result |
|---|---|---|---|
| 1 | Phrase bank = 1,949 phrases (B7) | `wc -l phrase_bank.csv` | ✔ 1,950 lines = 1,949 rows + header |
| 2 | Trends summary = 75 rows (B7) | `wc -l trends_summary.csv` | ✔ 76 lines = 75 rows + header |
| 3 | Rawalpindi "namaz time" PK mean 58.1 (B7, S4) | grep `/tmp/b7_trends.csv` | ✔ exact row: `namaz time rawalpindi,PK,58.1,100,64.6` |
| 4 | Demand register = 70 rows; probes = 146 (B7) | row counts on the pushed CSVs | ✔ 70 and 146 exactly |
| 5 | demand-register.md line count (B7 evidence pack said 249) | `wc -l` | ⚠ 248 by `wc -l` — counting difference only (final-line newline); content unaffected; noted, not corrected in the file |
| 6 | Frankfurter called at rates.ts:303,344 (B9) | grep | ✔ exact lines, legacy host `api.frankfurter.app` |
| 7 | VideoNews mounted at NewsPage.tsx:992 (B9 Flag 1) | grep | ✔ exact (import at line 20, mount at 992) |
| 8 | TheSportsDB base = `/json/2` in sports.ts + SportsClient (B9 Flag 2) | grep | ✔ exact, both files |
| 9 | NewsData "zero references" (B9) | grep -rni | ✘ **imprecise — CORRECTED on this branch.** 3 raw hits: a header comment in `src/lib/apis/news.ts` ("this module originally used NewsData.io… consolidated onto GNews in Batch 2i (2026-10-21)") + an unrelated local variable `newsData` in SportsClient.tsx. Substance holds (no endpoint, no env read — the service is inert), and the register now says "zero *functional* references" in both places it made the claim |
| 10 | Terralocate PK shard lastmod 2026-06-28; place build June 2026 (B8) | re-fetch of terralocate.com/sitemap.xml | ✔ `sitemap-places/pk/1` = 2026-06-28T15:04:47Z; static/hubs sitemaps stamped 2026-10-22T17:18:35Z (dynamic); all place shards May–Jun 2026 |
| 11 | B10 headline claims (PSA OpenSTAT open licence; CSO keyless API docs; BMKG open portal; DWD keyless server) | verified at fetch time this session from the sources' own pages (verbatim in the B10 evidence trail) | ✔ no re-fetch needed; no discrepancy found |

## Corrections applied on this branch

- `research-bank/source-register.md` — NewsData row (§C) and delta item 4 reworded from
  "zero references" to "zero functional references", with the `news.ts` header-comment
  provenance added. No other register text changed.

## Not re-checked (stated plainly)

- B8's per-page observations (Terralocate Lahore defects, TrackPostcode figures) rest on this
  session's fetches; only the sitemap claim was re-fetched. A future watch diffs against the
  B8 snapshot as its baseline.
- B9's live-route reachability question for NewsPage/VideoNews (Flag 1) remains open by
  design — it needs a production render check, which is a build-side action, not bank work.
- B10's five named-but-unfetched weather services remain unknown, as recorded.

*Outcome: 9 of 11 sampled claims exact, 1 trivial counting difference, 1 imprecision found
and corrected. The registers stand as corrected.*
