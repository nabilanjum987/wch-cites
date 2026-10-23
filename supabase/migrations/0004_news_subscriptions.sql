-- ─────────────────────────────────────────────────────────────────────────────
-- 0004_news_subscriptions.sql — News subscription groundwork (WP8 / Q13)
-- Source of truth: wch-news-system-spec-2026-10-22.md
--
-- GROUNDWORK ONLY: this stores opt-ins. No email/push SENDING exists yet
-- (the owner's sender setup comes later); nothing in the codebase sends
-- anything to these addresses.
--
-- Security: anon may INSERT a new 'active' subscription and nothing
-- else (no read-back of other people's addresses, no update, no
-- delete). Review/management is authenticated-only.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS news_subscriptions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text NOT NULL,
  categories text[] NOT NULL DEFAULT '{}',
  status     text NOT NULL DEFAULT 'active'
             CHECK (status IN ('active','unsubscribed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);

ALTER TABLE news_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to news"
  ON news_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'active');

CREATE POLICY "Authenticated users can manage news subscriptions"
  ON news_subscriptions FOR SELECT
  TO authenticated
  USING (true);
