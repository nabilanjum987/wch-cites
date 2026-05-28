/*
  # Create cities table for WorldCityHub

  1. New Tables
    - `cities`
      - `id` (uuid, primary key)
      - `name` (text, city name)
      - `city_slug` (text, URL-friendly slug)
      - `country` (text, country name)
      - `country_code` (text, ISO 3166-1 alpha-2 code)
      - `country_slug` (text, URL-friendly country slug)
      - `province` (text, province/state name)
      - `province_slug` (text, URL-friendly province slug)
      - `lat` (numeric, latitude)
      - `lng` (numeric, longitude)
      - `population` (integer)
      - `timezone` (text, IANA timezone)
      - `major_religion` (text, primary religion)
      - `religion_percent` (numeric, percentage)
      - `primary_color` (text, hex color for header)
      - `secondary_color` (text, hex color for accents)
      - `famous_for` (text, what the city is known for)
      - `famous_products` (text, notable products)
      - `emergency_police` (text, police number)
      - `emergency_ambulance` (text, ambulance number)
      - `emergency_fire` (text, fire department number)
      - `region` (text, geographic region)
      - `is_active` (boolean, whether city is published)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `cities` table
    - Public read access (no authentication required)
    - Only service role can insert/update

  3. Indexes
    - Index on `city_slug` for fast lookups
    - Index on `country_slug` for filtering
    - Index on `name` for autocomplete search
*/

CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city_slug text NOT NULL UNIQUE,
  country text NOT NULL,
  country_code text NOT NULL,
  country_slug text NOT NULL,
  province text NOT NULL,
  province_slug text NOT NULL,
  lat numeric(10, 7) NOT NULL,
  lng numeric(10, 7) NOT NULL,
  population integer DEFAULT 0,
  timezone text DEFAULT 'UTC',
  major_religion text DEFAULT 'Islam',
  religion_percent numeric(5, 2) DEFAULT 0,
  primary_color text DEFAULT '#0F172A',
  secondary_color text DEFAULT '#1E3A5F',
  famous_for text DEFAULT '',
  famous_products text DEFAULT '',
  emergency_police text DEFAULT '',
  emergency_ambulance text DEFAULT '',
  emergency_fire text DEFAULT '',
  region text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active cities"
  ON cities FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Service role can insert cities"
  ON cities FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update cities"
  ON cities FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_cities_city_slug ON cities(city_slug);
CREATE INDEX idx_cities_country_slug ON cities(country_slug);
CREATE INDEX idx_cities_name ON cities(name);

-- Insert sample cities for autocomplete testing
INSERT INTO cities (name, city_slug, country, country_code, country_slug, province, province_slug, lat, lng, population, timezone, major_religion, religion_percent, primary_color, famous_for, region) VALUES
('Dubai', 'dubai', 'United Arab Emirates', 'AE', 'united-arab-emirates', 'Dubai', 'dubai', 25.2048, 55.2708, 3331420, 'Asia/Dubai', 'Islam', 76.0, '#00732F', 'Burj Khalifa, luxury shopping, tourism', 'Middle East'),
('London', 'london', 'United Kingdom', 'GB', 'united-kingdom', 'England', 'england', 51.5074, -0.1278, 8982000, 'Europe/London', 'Christianity', 59.0, '#012169', 'Big Ben, Tower Bridge, finance', 'Europe'),
('Lahore', 'lahore', 'Pakistan', 'PK', 'pakistan', 'Punjab', 'punjab', 31.5204, 74.3587, 11130000, 'Asia/Karachi', 'Islam', 96.0, '#01411C', 'Badshahi Mosque, food, culture', 'South Asia'),
('Istanbul', 'istanbul', 'Turkey', 'TR', 'turkey', 'Istanbul', 'istanbul', 41.0082, 28.9784, 15460000, 'Europe/Istanbul', 'Islam', 99.0, '#E30A17', 'Hagia Sophia, Bosphorus, history', 'Middle East'),
('Mumbai', 'mumbai', 'India', 'IN', 'india', 'Maharashtra', 'maharashtra', 19.0760, 72.8777, 20411000, 'Asia/Kolkata', 'Hinduism', 66.0, '#FF9933', 'Bollywood, Gateway of India, finance', 'South Asia'),
('New York', 'new-york', 'United States', 'US', 'united-states', 'New York', 'new-york', 40.7128, -74.0060, 8336817, 'America/New_York', 'Christianity', 68.0, '#B22234', 'Statue of Liberty, Times Square, finance', 'North America'),
('Tokyo', 'tokyo', 'Japan', 'JP', 'japan', 'Tokyo', 'tokyo', 35.6762, 139.6503, 13960000, 'Asia/Tokyo', 'Buddhism', 67.0, '#BC002D', 'Shibuya, technology, anime', 'East Asia')
ON CONFLICT (city_slug) DO NOTHING;