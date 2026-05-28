/*
  # Create cities table for WorldCityHub

  1. New Tables
    - `cities`
      - `id` (uuid, primary key)
      - `name` (text, city name)
      - `city_slug` (text, URL-safe slug)
      - `country` (text, country name)
      - `country_code` (text, ISO country code)
      - `country_slug` (text, URL-safe country slug)
      - `province` (text, province/state name)
      - `province_slug` (text, URL-safe province slug)
      - `lat` (numeric, latitude)
      - `lng` (numeric, longitude)
      - `population` (bigint, population count)
      - `timezone` (text, IANA timezone string)
      - `major_religion` (text, predominant religion)
      - `religion_percent` (numeric, religion percentage)
      - `primary_color` (text, hex color for page header)
      - `secondary_color` (text, hex color accent)
      - `famous_for` (text, what city is known for)
      - `famous_products` (text, notable products)
      - `emergency_police` (text, police emergency number)
      - `emergency_ambulance` (text, ambulance emergency number)
      - `emergency_fire` (text, fire emergency number)
      - `region` (text, geographic region)
      - `is_active` (boolean, whether city page is live)
      - `created_at` (timestamptz, creation timestamp)

  2. Security
    - Enable RLS on `cities` table
    - Add policy for public read access (this is a public SEO site)
    - Only authenticated users can insert/update/delete

  3. Indexes
    - Unique index on city_slug + province_slug + country_slug for URL lookups
    - Index on country_slug for country page queries
    - Index on is_active for filtering active cities
*/

CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city_slug text NOT NULL,
  country text NOT NULL,
  country_code text NOT NULL DEFAULT '',
  country_slug text NOT NULL,
  province text NOT NULL,
  province_slug text NOT NULL,
  lat numeric NOT NULL DEFAULT 0,
  lng numeric NOT NULL DEFAULT 0,
  population bigint NOT NULL DEFAULT 0,
  timezone text NOT NULL DEFAULT 'UTC',
  major_religion text NOT NULL DEFAULT '',
  religion_percent numeric NOT NULL DEFAULT 0,
  primary_color text NOT NULL DEFAULT '#01411C',
  secondary_color text NOT NULL DEFAULT '#FFFFFF',
  famous_for text NOT NULL DEFAULT '',
  famous_products text NOT NULL DEFAULT '',
  emergency_police text NOT NULL DEFAULT '',
  emergency_ambulance text NOT NULL DEFAULT '',
  emergency_fire text NOT NULL DEFAULT '',
  region text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Unique constraint for URL path uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_cities_slug_path ON cities (country_slug, province_slug, city_slug);

-- Index for country-level queries
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities (country_slug) WHERE is_active = true;

-- Index for province-level queries
CREATE INDEX IF NOT EXISTS idx_cities_province ON cities (country_slug, province_slug) WHERE is_active = true;

-- Enable RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Public read access (this is a public SEO site, anyone can read city data)
CREATE POLICY "Public can read active cities"
  ON cities FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert cities"
  ON cities FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update cities"
  ON cities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete cities"
  ON cities FOR DELETE
  TO authenticated
  USING (true);
