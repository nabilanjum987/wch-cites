-- ─────────────────────────────────────────────────────────────────────────────
-- 0027: Wonders publish parity. flip the published wonders' DB rows
-- from status='draft' to status='published'.
--
-- Purpose: seven wonders are published on the live site and in the
-- sitemap (PUBLISHED_WONDERS in src/lib/wonders.ts): taj-mahal,
-- great-wall-of-china, petra, christ-the-redeemer, machu-picchu,
-- chichen-itza, colosseum. The pages are served from the baked records
-- in code, so they render correctly today; the database rows are a
-- stale twin. Migration 0008 seeded its batch-1 rows with
-- status='draft' ("the switch-on waits for billi's audit"), and four
-- of the seven published wonders sit in that batch still marked draft:
--   great-wall-of-china, christ-the-redeemer, machu-picchu, colosseum
-- This migration flips exactly those rows. taj-mahal was seeded by
-- migration 0001 already 'published'; its guarded UPDATE below is a
-- no-op safeguard so this file covers every published wonder that has
-- a row.
--
-- NOT flipped, deliberately: the other 0008 rows (eiffel-tower,
-- pyramids-of-giza, burj-khalifa) and every 0011 batch-2 row
-- (statue-of-liberty, grand-canyon, acropolis-athens and the rest)
-- are NOT in PUBLISHED_WONDERS; they stay draft, unlisted and
-- noindexed, exactly as the site treats them today.
--
-- NOT covered, stated plainly: petra and chichen-itza have NO rows in
-- the wonders table at all (no migration seeds them; their records
-- were authored in code only for the 4 Nov 2026 publish). There is
-- nothing to flip for them. Seeding their full content rows is a
-- separate content-parity job, not a status flip, and is not attempted
-- here.
--
-- Owner runs this in the Supabase SQL editor. It is not applied by any
-- code deploy: paste the whole file into the SQL editor and run it
-- once. Every UPDATE is guarded on the row's slug AND its current
-- status still being 'draft', so the file is idempotent: running it a
-- second time changes nothing. Applying it changes no rendered page
-- (the baked records serve); it brings the DB twin in line with the
-- published state.
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE public.wonders
SET status = 'published'
WHERE slug = 'great-wall-of-china'
  AND status = 'draft';

UPDATE public.wonders
SET status = 'published'
WHERE slug = 'christ-the-redeemer'
  AND status = 'draft';

UPDATE public.wonders
SET status = 'published'
WHERE slug = 'machu-picchu'
  AND status = 'draft';

UPDATE public.wonders
SET status = 'published'
WHERE slug = 'colosseum'
  AND status = 'draft';

UPDATE public.wonders
SET status = 'published'
WHERE slug = 'taj-mahal'
  AND status = 'draft';

-- Verification (optional, read-only): the five slugs above should all
-- read 'published' afterwards, and no other wonders row should have
-- changed status:
--   SELECT slug, status FROM public.wonders ORDER BY slug;
