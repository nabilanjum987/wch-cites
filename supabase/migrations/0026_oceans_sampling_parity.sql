-- ─────────────────────────────────────────────────────────────────────────────
-- 0026: Oceans sampling-point parity. store the code overlay's sampling
-- coordinates in the oceans table.
--
-- Purpose: the live marine panel samples waves at a record's sampling
-- point (sampleLat/sampleLng) when one exists, because two oceans'
-- representative points sit in ice and return no wave data. In code,
-- src/lib/oceans.ts carries those points on the baked records and
-- getOcean() overlays them onto any DB-served record that lacks them
-- (the "DB-twin fix" comment at the overlay, 3 Nov 2026). The oceans
-- table itself has no sampling columns, so the values exist only in
-- code. This migration adds the columns and backfills the only two
-- values the code overlay carries, copied verbatim from the baked
-- records in src/lib/oceans.ts:
--   arctic-ocean:   sampleLat 72.5,  sampleLng 20
--                   (nearest open water: Barents Sea; the ocean's own
--                   point at 79.1386, -3.239 is ice-covered)
--   southern-ocean: sampleLat -55,   sampleLng 90
--                   (nearest open water; the ocean's own point at
--                   -65, 90 sits in the seasonal ice zone)
-- No other ocean record carries a sampling point in code, so no other
-- row is backfilled: every other row keeps NULL, which the code reads
-- as "sample at the record's own lat/lng", exactly as today.
--
-- Owner runs this in the Supabase SQL editor. It is not applied by any
-- code deploy: paste the whole file into the SQL editor and run it
-- once. The DDL uses IF NOT EXISTS and every UPDATE is guarded on the
-- row's slug AND its sampling columns still being NULL, so the file is
-- idempotent: running it a second time changes nothing.
--
-- Honest scope note: getOceanFromDb does not read these columns yet;
-- getOcean()'s code overlay remains the serving path, so applying this
-- file changes no rendered page. It completes the data twin in the
-- database so the sampling points survive in the DB alongside the
-- rows they belong to.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.oceans
  ADD COLUMN IF NOT EXISTS sample_lat double precision;

ALTER TABLE public.oceans
  ADD COLUMN IF NOT EXISTS sample_lng double precision;

UPDATE public.oceans
SET sample_lat = 72.5, sample_lng = 20
WHERE slug = 'arctic-ocean'
  AND sample_lat IS NULL
  AND sample_lng IS NULL;

UPDATE public.oceans
SET sample_lat = -55, sample_lng = 90
WHERE slug = 'southern-ocean'
  AND sample_lat IS NULL
  AND sample_lng IS NULL;

-- Verification (optional, read-only): after running, this should list
-- exactly the two rows above with their sampling points, and no other
-- ocean should carry a sampling point yet:
--   SELECT slug, sample_lat, sample_lng FROM public.oceans
--   WHERE sample_lat IS NOT NULL ORDER BY slug;
