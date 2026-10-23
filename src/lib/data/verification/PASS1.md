# R3 VERIFICATION PASS 1 — 2026-10-22 (fresh-eyes re-verification of R3's own packages)

Scope: country packages (S1 + S1b), international city packages (S2 + S2b),
places (S3 + S3b), conflicts detail data (S4), prayer tables (S5 + S5b).
Method: re-pull the figure from its live source and compare with the
packaged value. Outcome: **no data corrections required.** Records below.

## World Bank spot checks (live re-pull vs packaged snapshot) — 5/5 MATCH
- India GDP (NY.GDP.MKTP.CD): live 3,956,067,115,771.63 (2025) = packaged ✓
- Egypt GDP: live 365,254,630,179.74 (2025) = packaged (rounding only) ✓
- Canada population: live 41,651,653 (2025) = packaged ✓
- Kuwait GDP: live 157,209,026,926.42 (2025) = packaged ✓
- Türkiye inflation: live 34.88 (2025) = packaged 34.8811… ✓

## Prayer anomaly check — RESOLVED AS GENUINE
Rawalpindi's packaged 22-Oct row is minute-identical to Islamabad's.
Suspicion: wrong coordinates. Finding: the canonical dataset coords
differ (Rawalpindi 33.59733, 73.0479 · Islamabad 33.72148, 73.04329,
~14 km apart), and a LIVE Aladhan timings call with each city's own
coordinates returns Fajr 04:55 and Maghrib 17:26 for BOTH on
22-10-2026. The tables are correct; the identity is real at this
distance with the same calculation method.

## Structural checks
- Subdivision counts re-asserted from the packaged data: Türkiye 81,
  India 36 (28 + 8), USA 51 (50 + DC), Egypt 27, Malaysia 16 (13 + 3),
  Canada 13 (10 + 3), Australia 8 (6 + 2), Saudi Arabia 13, Oman 11,
  UAE 7, Bangladesh 8, Kuwait 6, Qatar 8, UK 4.
- Personality pools: S1 42/42 Wikipedia-verified; S1b 41/42 verified
  with the single unverified entry (Fahaid Al-Deehani) flagged inside
  its package with the reason.
- Panama law: every package's ISO codes come from the explicit
  slug→ISO map; no code in any package was derived from a slug.
- Known packaged gaps re-confirmed as intentional and documented
  in-place: diaspora figures omitted (no official table verified),
  Gaza UNHCR null (UNRWA mandate), Christ the Redeemer media empty
  (no freely-licensed file passed the check), nager.at non-coverage
  notes (QA/KW/OM/MY holidays).

## Defects found: NONE requiring correction.
