-- ─────────────────────────────────────────────────────────────────────────────
-- 0016 — P2 (28 Oct final sitting): publish the two future verified city
-- rows seeded by migration 0007.
--
-- PREREQUISITE: migrations 0003 (events table + national holidays) and
-- 0007 (Lahore / Karachi / Islamabad seed calendars) must already be applied
-- in the target database; if they are not, this UPDATE matches zero rows
-- and is a harmless no-op (it creates nothing on its own).
--
-- SWITCH-ON: migration 0007 deliberately left every seed row draft, gated
-- on the owner's switch-on after audit. Merging the PR that carries this
-- file IS that switch-on for the two rows below — billi's PASS + Sayyed's
-- go are required before merge, exactly like every other sitting item.
-- If the owner declines, drop this file from the PR: the events pages
-- still pass as honestly parked (national dates + parked notice), and
-- Karachi / Islamabad simply stay parked at city level too.
--
-- SCOPE: only the two rows that are still in the future at apply time.
-- The three past evidence-base rows (Faiz Festival Lahore Feb 2026,
-- Karachi Literature Festival Feb 2026, Lok Mela Islamabad Nov 2025) stay
-- draft: they are history, not upcoming listings, and the pages filter
-- starts_at >= now() anyway.
--   * sindhi-cultural-day-karachi-2026 — 6 Dec 2026 (first Sunday of
--     December), Karachi Press Club and gatherings across the city.
--   * pakistan-day-parade-islamabad-2027 — 23 Mar 2027, Shakarparian
--     Parade Ground, Islamabad (fixed-date national ceremony).
-- Both rows were verified 2026-10-22 in migration 0007 with in-row sources.
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE events
SET status = 'approved'
WHERE slug IN (
  'sindhi-cultural-day-karachi-2026',
  'pakistan-day-parade-islamabad-2027'
)
  AND status = 'draft'
  AND verified = true
  AND starts_at > now();
