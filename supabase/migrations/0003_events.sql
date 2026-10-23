-- ─────────────────────────────────────────────────────────────────────────────
-- 0003_events.sql — WorldCityHub own events system (WP7 / marathon Q12)
-- Source of truth: wch-events-pakistan-strategy-2026-10-22.md
--
-- Design:
--   * `events`            — the public events dataset. ONLY rows with
--                           status='approved' AND verified=true are
--                           readable by the public (RLS). Nothing else
--                           can be inserted/updated/deleted by anon.
--   * `event_submissions` — the "List Your Event" drop-box. Anon may
--                           INSERT only (no read-back, no update, no
--                           delete). A human reviews each submission
--                           and, if real, promotes it into `events`
--                           with verified=true. Nothing auto-publishes.
--
-- Seed data: ONLY verifiable real data — Pakistan's fixed-date national
-- public holidays for 2026 and 2027 (dates fixed by law; cross-checked
-- against the date-holidays dataset, which attributes them to the
-- Government of Pakistan holiday list / Wikipedia "Public holidays in
-- Pakistan"). Islamic holidays (Eid al-Fitr, Eid al-Adha, Ashura,
-- Milad-un-Nabi) are deliberately NOT seeded: their Gregorian dates
-- depend on the official moon-sighting notification each year.
-- PSL/PCB fixtures are NOT seeded either: TheSportsDB (league 5067)
-- was reachable, but its 2026 season is complete and no 2027 fixtures
-- are published yet — see the Q12 evidence pack.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text NOT NULL UNIQUE,
  city_slug   text,                       -- NULL = national / country-wide
  venue       text NOT NULL DEFAULT '',
  starts_at   timestamptz NOT NULL,
  ends_at     timestamptz,
  category    text NOT NULL DEFAULT 'community'
              CHECK (category IN ('sports','culture','food','education','community','religious')),
  description text NOT NULL DEFAULT '',
  source_name text NOT NULL DEFAULT '',
  source_url  text NOT NULL DEFAULT '',
  verified    boolean NOT NULL DEFAULT false,
  status      text NOT NULL DEFAULT 'draft'
              CHECK (status IN ('draft','approved','rejected')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_city_starts_idx
  ON events (city_slug, starts_at);
CREATE INDEX IF NOT EXISTS events_public_idx
  ON events (starts_at) WHERE status = 'approved' AND verified = true;

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public (anon + authenticated) may read ONLY approved, verified events.
CREATE POLICY "Public can read approved verified events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' AND verified = true);

-- No anon INSERT/UPDATE/DELETE policies on events: writes happen only
-- through the service role / SQL editor by a human reviewer.

CREATE TABLE IF NOT EXISTS event_submissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  city_name       text NOT NULL DEFAULT '',
  city_slug       text NOT NULL DEFAULT '',
  venue           text NOT NULL DEFAULT '',
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz,
  category        text NOT NULL DEFAULT 'community'
                  CHECK (category IN ('sports','culture','food','education','community','religious')),
  description     text NOT NULL DEFAULT '',
  organizer_name  text NOT NULL DEFAULT '',
  organizer_email text NOT NULL DEFAULT '',
  source_url      text NOT NULL DEFAULT '',
  status          text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;

-- Write-only drop-box: anon may INSERT a pending submission, nothing else.
CREATE POLICY "Anyone can submit an event"
  ON event_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- Reviewers (authenticated) may read the queue.
CREATE POLICY "Authenticated users can review event submissions"
  ON event_submissions FOR SELECT
  TO authenticated
  USING (true);

-- ── Seed: Pakistan fixed-date national public holidays (real, verified) ────
INSERT INTO events (title, slug, city_slug, venue, starts_at, ends_at, category, description, source_name, source_url, verified, status) VALUES
  ('Kashmir Day',        'kashmir-day-2026',        NULL, 'Nationwide', '2026-02-05T00:00:00+05:00', '2026-02-05T23:59:59+05:00', 'community', 'Public holiday — Kashmir Solidarity Day, observed across Pakistan.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Pakistan Day',       'pakistan-day-2026',       NULL, 'Nationwide', '2026-03-23T00:00:00+05:00', '2026-03-23T23:59:59+05:00', 'community', 'Public holiday — Pakistan Day, commemorating the Lahore Resolution of 1940.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Labour Day',         'labour-day-2026',         NULL, 'Nationwide', '2026-05-01T00:00:00+05:00', '2026-05-01T23:59:59+05:00', 'community', 'Public holiday — International Workers'' Day.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Youm-e-Takbeer',     'youm-e-takbeer-2026',     NULL, 'Nationwide', '2026-05-28T00:00:00+05:00', '2026-05-28T23:59:59+05:00', 'community', 'Public holiday — Youm-e-Takbeer, observed on 28 May.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Independence Day',   'independence-day-2026',   NULL, 'Nationwide', '2026-08-14T00:00:00+05:00', '2026-08-14T23:59:59+05:00', 'community', 'Public holiday — Independence Day of Pakistan.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Iqbal Day',          'iqbal-day-2026',          NULL, 'Nationwide', '2026-11-09T00:00:00+05:00', '2026-11-09T23:59:59+05:00', 'community', 'Public holiday — birthday of Allama Muhammad Iqbal.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Quaid-e-Azam Day',   'quaid-e-azam-day-2026',   NULL, 'Nationwide', '2026-12-25T00:00:00+05:00', '2026-12-25T23:59:59+05:00', 'community', 'Public holiday — birthday of Muhammad Ali Jinnah, founder of Pakistan.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Kashmir Day',        'kashmir-day-2027',        NULL, 'Nationwide', '2027-02-05T00:00:00+05:00', '2027-02-05T23:59:59+05:00', 'community', 'Public holiday — Kashmir Solidarity Day, observed across Pakistan.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Pakistan Day',       'pakistan-day-2027',       NULL, 'Nationwide', '2027-03-23T00:00:00+05:00', '2027-03-23T23:59:59+05:00', 'community', 'Public holiday — Pakistan Day, commemorating the Lahore Resolution of 1940.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Labour Day',         'labour-day-2027',         NULL, 'Nationwide', '2027-05-01T00:00:00+05:00', '2027-05-01T23:59:59+05:00', 'community', 'Public holiday — International Workers'' Day.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Youm-e-Takbeer',     'youm-e-takbeer-2027',     NULL, 'Nationwide', '2027-05-28T00:00:00+05:00', '2027-05-28T23:59:59+05:00', 'community', 'Public holiday — Youm-e-Takbeer, observed on 28 May.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Independence Day',   'independence-day-2027',   NULL, 'Nationwide', '2027-08-14T00:00:00+05:00', '2027-08-14T23:59:59+05:00', 'community', 'Public holiday — Independence Day of Pakistan.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Iqbal Day',          'iqbal-day-2027',          NULL, 'Nationwide', '2027-11-09T00:00:00+05:00', '2027-11-09T23:59:59+05:00', 'community', 'Public holiday — birthday of Allama Muhammad Iqbal.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved'),
  ('Quaid-e-Azam Day',   'quaid-e-azam-day-2027',   NULL, 'Nationwide', '2027-12-25T00:00:00+05:00', '2027-12-25T23:59:59+05:00', 'community', 'Public holiday — birthday of Muhammad Ali Jinnah, founder of Pakistan.', 'Government of Pakistan public holidays', 'https://en.wikipedia.org/wiki/Public_holidays_in_Pakistan', true, 'approved')
ON CONFLICT (slug) DO NOTHING;
