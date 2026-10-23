-- 0015_suggestions.sql
-- WorldCityHub — visitor suggestions table for the /improve form.
--
-- Why this exists: /improve posts to /api/suggest (src/app/api/suggest/
-- route.ts), which writes to public.suggestions via PostgREST using the
-- ANON key. Without this table the route's insert 404s and it answers
-- 503 { code: "not_active" } — the form is inactive until the owner runs
-- this migration in Supabase (after 0014, in filename order).
--
-- Expected shape, read from route.ts (the only writer):
--   POST /rest/v1/suggestions with body {
--     country:   string  (required, validated non-empty)
--     city:      string | null
--     page_type: string | null
--     category:  string  (required, one of the route's CATEGORIES)
--     message:   string  (required, >= 10 chars after cleaning)
--     name:      string | null
--     email:     string | null
--   }
--   The route never sends id / created_at / status, so all three need
--   server defaults: gen_random_uuid(), now(), and 'new'.
--   Status lifecycle (owner-managed in the dashboard):
--   'new' -> 'reviewed' -> 'done' / 'rejected'.
--
-- Security design (unchanged from the approved drop-box design):
-- the anon key can INSERT and do NOTHING else — no SELECT/UPDATE/DELETE
-- policy exists for anon or authenticated, so submissions can never be
-- read back through the website's keys. Nothing auto-publishes; the
-- owner reads submissions in the Supabase dashboard with owner access.
-- The route adds honeypot + time-trap + validation + rate limiting on
-- top; this migration is only the storage it expects.

CREATE TABLE IF NOT EXISTS public.suggestions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  country     TEXT NOT NULL,
  city        TEXT,
  page_type   TEXT,
  category    TEXT NOT NULL,
  message     TEXT NOT NULL,
  name        TEXT,
  email       TEXT,
  status      TEXT NOT NULL DEFAULT 'new'  -- new -> reviewed -> done / rejected
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Anon (the website) may ONLY insert.
DROP POLICY IF EXISTS "anon can insert suggestions" ON public.suggestions;
CREATE POLICY "anon can insert suggestions"
  ON public.suggestions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Deliberately NO select/update/delete policy for anon or authenticated:
-- submissions cannot be read back through the website's keys at all.
