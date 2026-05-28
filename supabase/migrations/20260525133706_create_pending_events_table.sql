/*
  # Create pending_events table

  1. New Tables
    - `pending_events`
      - `id` (uuid, primary key)
      - `name` (text, event name)
      - `date` (text, event date string)
      - `venue` (text, venue name)
      - `category` (text, event category)
      - `website` (text, event website URL)
      - `city` (text, city name)
      - `country_code` (text, ISO country code)
      - `submitted_at` (timestamptz, submission time)
      - `status` (text, review status: pending/approved/rejected)
      - `submitter_ip` (text, optional submitter identifier)

  2. Security
    - Enable RLS on `pending_events` table
    - Add policy for anyone (anon) to INSERT new pending events
    - Add policy for authenticated users to SELECT (review) pending events
    - No UPDATE or DELETE from public - admin only
*/

CREATE TABLE IF NOT EXISTS pending_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date text NOT NULL,
  venue text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'culture',
  website text DEFAULT '',
  city text NOT NULL,
  country_code text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  submitter_ip text DEFAULT ''
);

ALTER TABLE pending_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit pending events"
  ON pending_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can review pending events"
  ON pending_events FOR SELECT
  TO authenticated
  USING (true);
