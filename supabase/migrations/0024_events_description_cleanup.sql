-- ─────────────────────────────────────────────────────────────────────────────
-- 0024 — Events description cleanup: remove internal jargon from seeded
-- event descriptions that are visible to the public on event pages.
--
-- Purpose: several seeded event descriptions (migrations 0007 and 0013)
-- contain internal bookkeeping language — references to migrations, to
-- seeding, and to database rows — that was written for reviewers, not for
-- readers. This migration removes or rewrites exactly those phrases and
-- leaves the rest of each description intact.
--
-- Owner runs this in the Supabase SQL editor. It is not applied by any
-- code deploy: paste the whole file into the SQL editor and run it once.
-- Every UPDATE below uses replace() on the description and is matched by
-- the row's unique slug, so the file is idempotent: running it a second
-- time changes nothing (each replace() simply finds no match).
--
-- Rows targeted (identified by slug, the unique key used by the seeding
-- migrations 0007 and 0013, and by migration 0016 which published two of
-- these rows by slug):
--   1. pakistan-day-parade-islamabad-2027 (title 'Pakistan Day Parade',
--      city_slug 'islamabad', seeded in migration 0007)
--   2. cholistan-desert-jeep-rally-2026 (seeded in migration 0013)
--   3. faiz-festival-lahore-2026 (seeded in migration 0007)
--   4. karachi-literature-festival-2026 (seeded in migration 0007)
--   5. lok-mela-islamabad-2025 (seeded in migration 0007)
--
-- Scan note: the other seeded event descriptions were checked for the
-- same jargon (the words "migration", "seeded" and "row" inside a
-- description). The national-holiday descriptions seeded in migration
-- 0003 and the Sindhi Cultural Day description in migration 0007 contain
-- none of it in their description text, so they are not touched here.
--
-- Verify after running:
--   * Run the SELECT in the verification block at the bottom of this file.
--     It must return 0 rows.
--   * Open the Islamabad events page and confirm the Pakistan Day Parade
--     description now ends at "...held at this venue in its modern
--     editions." with no parenthetical sentence after it.
--   * Spot-check one festival listing and confirm its description no
--     longer mentions a database row.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Pakistan Day Parade, Islamabad: remove the internal parenthetical
--    sentence "(The Pakistan Day public holiday itself is seeded
--    nationally in migration 0003; this row is the capital's ceremony as
--    a city event.)" including the space before it, leaving the rest of
--    the description intact. Three replace() passes cover the apostrophe
--    variants the seeded text may hold in the database (curly ’, the
--    literal \u2019 sequence written in migration 0007, and a straight ').
UPDATE events
SET description = replace(
      replace(
        replace(
          description,
          ' (The Pakistan Day public holiday itself is seeded nationally in migration 0003; this row is the capital’s ceremony as a city event.)',
          ''
        ),
        ' (The Pakistan Day public holiday itself is seeded nationally in migration 0003; this row is the capital\u2019s ceremony as a city event.)',
        ''
      ),
      ' (The Pakistan Day public holiday itself is seeded nationally in migration 0003; this row is the capital''s ceremony as a city event.)',
      ''
    )
WHERE slug = 'pakistan-day-parade-islamabad-2027';

-- 2. Cholistan Desert Jeep Rally 2026, Bahawalpur: the seeded description
--    says "...records the held dates as 11–15 February 2026, which this
--    row uses. Seeded retrospectively as a dated edition record (R7
--    pattern); the next edition’s dates are the organiser’s to announce."
--    Remove the "this row" clause and the "Seeded retrospectively ...
--    (R7 pattern)" internal note, keeping the held dates and the
--    next-edition sentence.
UPDATE events
SET description = replace(
      description,
      ', which this row uses. Seeded retrospectively as a dated edition record (R7 pattern); the next edition’s dates are the organiser’s to announce.',
      '. The next edition’s dates are the organiser’s to announce.'
    )
WHERE slug = 'cholistan-desert-jeep-rally-2026';

-- 3. Faiz Festival, Lahore: "...dates are announced by the organisers
--    (Faiz Foundation / Alhamra) and will replace this row when
--    published." The phrase "replace this row" is internal bookkeeping;
--    the public meaning is that the new dates will be listed here.
UPDATE events
SET description = replace(
      description,
      'will replace this row when published',
      'will be listed here when published'
    )
WHERE slug = 'faiz-festival-lahore-2026';

-- 4. Karachi Literature Festival: "...dates are announced by OUP and will
--    replace this row when published." Same cleanup as row 3 above.
UPDATE events
SET description = replace(
      description,
      'will replace this row when published',
      'will be listed here when published'
    )
WHERE slug = 'karachi-literature-festival-2026';

-- 5. Lok Mela, Islamabad: "...dates had not been announced by Lok Virsa;
--    they will replace this row when published." Same cleanup, with the
--    sentence's own wording ("they will replace this row...").
UPDATE events
SET description = replace(
      description,
      'they will replace this row when published',
      'they will be listed here when published'
    )
WHERE slug = 'lok-mela-islamabad-2025';

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification (read-only, safe to run any number of times): this must
-- return 0 rows after the UPDATEs above have run.
--
-- SELECT slug, description
-- FROM events
-- WHERE slug IN (
--   'pakistan-day-parade-islamabad-2027',
--   'cholistan-desert-jeep-rally-2026',
--   'faiz-festival-lahore-2026',
--   'karachi-literature-festival-2026',
--   'lok-mela-islamabad-2025'
-- )
-- AND (
--   description ILIKE '%migration%'
--   OR description ILIKE '%seeded%'
--   OR description ILIKE '%this row%'
-- );
-- ─────────────────────────────────────────────────────────────────────────────
