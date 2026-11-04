-- ─────────────────────────────────────────────────────────────────────────────
-- 0025 — G1 dash cleanup, DB twins: personality titles (F4 + F2) and the
-- national-holiday event descriptions (F3).
--
-- Purpose: the site rulebook (G1) bans the em dash (—) from all rendered
-- copy. The code side was swept on 2026-11-04 (deploy-18 fix batch): the
-- personality seed data in src/lib/data/personalities-seed.ts and
-- personalities-extension.ts already carries the clean colon forms, the
-- meta-title composer now joins name and title with ": ", and two stored
-- titles were shortened so they end whole inside the 60-character title
-- budget. The database still serves the old values for these rows, so the
-- hub cards and profile pages keep rendering the dashes until this twin
-- is applied. The same applies to the national-holiday event
-- descriptions seeded by migration 0003, which compose as
-- "Public holiday — …" in the rendered events views.
--
-- Owner runs this in the Supabase SQL editor. It is not applied by any
-- code deploy: paste the whole file into the SQL editor and run it once.
-- Every UPDATE is guarded on the row's slug AND its exact current value,
-- so the file is idempotent: running it a second time changes nothing.
--
-- Section A — personality jobTitles, em dash to colon (8 rows). The old
-- values are the exact strings written by the last migration to set each
-- title (0006, 0013); the new values are the exact strings now held in
-- the seed files the profiles fall back to:
--   fatima-jinnah, mehdi-hasan, mir-muhammad-masum, mohammad-hafeez,
--   muhammad-ali-jinnah, mushaf-ali-mir, noor-jehan, sardar-mehtab-abbasi
--
-- Section B — the two F2 title shortenings (same treatment as the seed):
--   allama-iqbal:  'Poet-Philosopher & Spiritual Father of Pakistan'
--                  (written by 0014) rendered cut as "…& Spiritual";
--                  new title 'Poet of the East', his defining epithet.
--   younis-khan:   'Pakistan’s Highest Test Run-Scorer' (written by
--                  0013) rendered cut as "Pakistan's Highest Test";
--                  new title 'Pakistan’s Top Test Run-Scorer'.
--
-- Section C — events: the 7 distinct national-holiday descriptions from
-- migration 0003 (14 rows: each holiday is seeded for 2026 and 2027),
-- "Public holiday — X" becomes "Public holiday: X". Guarded on the exact
-- old description, so both year rows are updated by one statement each.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Section A: personality jobTitles ────────────────────────────────────────

UPDATE personalities
SET title = 'Madar-e-Millat: Mother of the Nation'
WHERE slug = 'fatima-jinnah'
  AND title = 'Madar-e-Millat — Mother of the Nation';

UPDATE personalities
SET title = 'Shahenshah-e-Ghazal: King of Ghazal'
WHERE slug = 'mehdi-hasan'
  AND title = 'Shahenshah-e-Ghazal — King of Ghazal';

UPDATE personalities
SET title = 'Historian of Sindh: author of Tarikh-i-Masumi'
WHERE slug = 'mir-muhammad-masum'
  AND title = 'Historian of Sindh — author of Tarikh-i-Masumi';

UPDATE personalities
SET title = 'The Professor: Pakistan All-Rounder'
WHERE slug = 'mohammad-hafeez'
  AND title = 'The Professor — Pakistan All-Rounder';

UPDATE personalities
SET title = 'Quaid-e-Azam: Founder of Pakistan'
WHERE slug = 'muhammad-ali-jinnah'
  AND title = 'Quaid-e-Azam — Founder of Pakistan';

UPDATE personalities
SET title = 'Air Chief Marshal: Chief of Air Staff (2000–2003)'
WHERE slug = 'mushaf-ali-mir'
  AND title = 'Air Chief Marshal — Chief of Air Staff (2000–2003)';

UPDATE personalities
SET title = 'Malika-e-Tarannum: Queen of Melody'
WHERE slug = 'noor-jehan'
  AND title = 'Malika-e-Tarannum — Queen of Melody';

UPDATE personalities
SET title = 'Sardar of Abbottabad: former Chief Minister & Governor of KP'
WHERE slug = 'sardar-mehtab-abbasi'
  AND title = 'Sardar of Abbottabad — former Chief Minister & Governor of KP';

-- ── Section B: F2 title shortenings ─────────────────────────────────────────

UPDATE personalities
SET title = 'Poet of the East'
WHERE slug = 'allama-iqbal'
  AND title = 'Poet-Philosopher & Spiritual Father of Pakistan';

UPDATE personalities
SET title = 'Pakistan’s Top Test Run-Scorer'
WHERE slug = 'younis-khan'
  AND title = 'Pakistan’s Highest Test Run-Scorer';

-- ── Section C: national-holiday event descriptions (migration 0003) ────────

UPDATE events
SET description = 'Public holiday: Independence Day of Pakistan.'
WHERE description = 'Public holiday — Independence Day of Pakistan.';

UPDATE events
SET description = 'Public holiday: International Workers'' Day.'
WHERE description = 'Public holiday — International Workers'' Day.';

UPDATE events
SET description = 'Public holiday: Kashmir Solidarity Day, observed across Pakistan.'
WHERE description = 'Public holiday — Kashmir Solidarity Day, observed across Pakistan.';

UPDATE events
SET description = 'Public holiday: Pakistan Day, commemorating the Lahore Resolution of 1940.'
WHERE description = 'Public holiday — Pakistan Day, commemorating the Lahore Resolution of 1940.';

UPDATE events
SET description = 'Public holiday: Youm-e-Takbeer, observed on 28 May.'
WHERE description = 'Public holiday — Youm-e-Takbeer, observed on 28 May.';

UPDATE events
SET description = 'Public holiday: birthday of Allama Muhammad Iqbal.'
WHERE description = 'Public holiday — birthday of Allama Muhammad Iqbal.';

UPDATE events
SET description = 'Public holiday: birthday of Muhammad Ali Jinnah, founder of Pakistan.'
WHERE description = 'Public holiday — birthday of Muhammad Ali Jinnah, founder of Pakistan.';
