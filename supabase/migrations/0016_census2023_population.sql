-- 0016 — F3: Population single source = PBS Census-2023 admin-unit totals.
--
-- OWNER-RUN ONLY. This migration is NOT applied by the PR itself: nothing
-- in production changes until the owner runs it in the Supabase SQL
-- Editor. Until then, the client-side canonical overrides (see
-- src/lib/census2023.ts and its call sites) keep every rendered surface
-- on the census figures regardless of the stored row values.
--
-- Source: Pakistan Bureau of Statistics, 7th Population & Housing
-- Census (2023), Detailed Results, Table 1.
--   Lahore    13,004,135 — Lahore District total
--   Karachi   20,382,881 — Karachi Division total, all 7 districts
--   Islamabad  2,363,863 — Islamabad Capital Territory total
--
-- Idempotent: re-running sets the same values. Rows are matched on
-- slug + country_slug only (NOT province_slug): the seed stores the
-- Islamabad row under province_slug 'islamabad' while the canonical
-- page URL uses 'islamabad-capital-territory', and both spellings must
-- end up corrected.

UPDATE cities SET population = 13004135
WHERE country_slug = 'pakistan' AND slug = 'lahore';

UPDATE cities SET population = 20382881
WHERE country_slug = 'pakistan' AND slug = 'karachi';

UPDATE cities SET population = 2363863
WHERE country_slug = 'pakistan' AND slug = 'islamabad';
