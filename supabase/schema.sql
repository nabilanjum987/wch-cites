-- WorldCityHub — Complete Supabase Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── COUNTRIES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS countries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  code            TEXT NOT NULL,
  flag            TEXT,
  region          TEXT,
  continent       TEXT,
  population      BIGINT,
  area            INTEGER,
  capital         TEXT,
  currency_name   TEXT,
  currency_code   TEXT,
  languages       TEXT[],
  government      TEXT,
  timezone        TEXT,
  utc_offset      TEXT,
  independence    TEXT,
  climate         TEXT,
  major_faith     TEXT,
  major_faith_pct NUMERIC,
  gdp             TEXT,
  gdp_raw         BIGINT,
  growth_rate     TEXT,
  inflation       TEXT,
  unemployment    TEXT,
  exports         TEXT[],
  hero_image      TEXT,
  tagline         TEXT,
  primary_color   TEXT,
  secondary_color TEXT,
  lat             NUMERIC,
  lng             NUMERIC,
  literacy_rate   NUMERIC,
  hdi             NUMERIC,
  internet_pct    NUMERIC,
  mobile_pct      NUMERIC,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PROVINCES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS provinces (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 TEXT NOT NULL,
  country_slug         TEXT NOT NULL REFERENCES countries(slug) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  capital              TEXT,
  population           BIGINT,
  area                 INTEGER,
  tagline              TEXT,
  known_for            TEXT,
  gdp_contribution_pct NUMERIC,
  literacy_rate        NUMERIC,
  climate              TEXT,
  major_faith          TEXT,
  major_faith_pct      NUMERIC,
  hero_image           TEXT,
  primary_color        TEXT,
  lat                  NUMERIC,
  lng                  NUMERIC,
  divisions            JSONB,
  industries           TEXT[],
  natural_resources    TEXT[],
  universities         INTEGER,
  established          TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, country_slug)
);

-- ─── CITIES ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT NOT NULL,
  province_slug     TEXT NOT NULL,
  country_slug      TEXT NOT NULL REFERENCES countries(slug) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  name_local        TEXT,
  city_type         TEXT,
  population        BIGINT,
  area              INTEGER,
  elevation         INTEGER,
  lat               NUMERIC NOT NULL,
  lng               NUMERIC NOT NULL,
  timezone          TEXT,
  utc_offset        TEXT,
  founded_year      INTEGER,
  climate_type      TEXT,
  major_faith       TEXT,
  major_faith_pct   NUMERIC,
  languages         TEXT[],
  currency_code     TEXT,
  mayor             TEXT,
  sister_cities     TEXT[],
  famous_bazaar     TEXT,
  mosque_count      INTEGER,
  unesco_sites      INTEGER,
  annual_tourists   INTEGER,
  hero_image        TEXT,
  tagline           TEXT,
  primary_color     TEXT,
  nearby_water      TEXT,
  gdp_contribution  TEXT,
  main_industries   TEXT[],
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug, province_slug, country_slug)
);

-- ─── PERSONALITIES ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS personalities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  profession    TEXT,
  category      TEXT,
  country_slug  TEXT REFERENCES countries(slug),
  province_slug TEXT,
  city_slug     TEXT,
  birth_year    INTEGER,
  death_year    INTEGER,
  birth_city    TEXT,
  nationality   TEXT,
  achievements  TEXT,
  photo_url     TEXT,
  wikipedia_url TEXT,
  featured_month INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── LANDMARKS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS landmarks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  type            TEXT,
  city_slug       TEXT,
  province_slug   TEXT,
  country_slug    TEXT REFERENCES countries(slug),
  lat             NUMERIC,
  lng             NUMERIC,
  era             TEXT,
  built_by        TEXT,
  built_for       TEXT,
  material        TEXT,
  capacity        INTEGER,
  annual_visitors INTEGER,
  unesco          BOOLEAN DEFAULT false,
  wonder_type     TEXT,
  open_time       TEXT,
  close_time      TEXT,
  entry_fee       TEXT,
  closed_days     TEXT[],
  hero_image      TEXT,
  wikipedia_url   TEXT,
  visitor_rating  NUMERIC,
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── HERITAGE PRODUCTS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS heritage_products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  city_slug     TEXT,
  province_slug TEXT,
  country_slug  TEXT REFERENCES countries(slug),
  craft_age     TEXT,
  artisans      INTEGER,
  export_value  TEXT,
  exports_to    TEXT[],
  unique_quality TEXT,
  materials     TEXT,
  process       TEXT,
  unesco_status TEXT,
  hero_image    TEXT,
  emoji         TEXT,
  category      TEXT,
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WONDERS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wonders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  wonder_type     TEXT NOT NULL,
  city_slug       TEXT,
  country_slug    TEXT REFERENCES countries(slug),
  lat             NUMERIC,
  lng             NUMERIC,
  built_year      TEXT,
  built_by        TEXT,
  built_for       TEXT,
  material        TEXT,
  height_m        NUMERIC,
  area_km2        NUMERIC,
  annual_visitors INTEGER,
  entry_fee       TEXT,
  open_time       TEXT,
  close_time      TEXT,
  closed_days     TEXT[],
  best_visit_time TEXT,
  photography_tip TEXT,
  hero_image      TEXT,
  wikipedia_url   TEXT,
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── OCEANS & SEAS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS oceans_seas (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  type                TEXT,
  parent_ocean        TEXT,
  area_km2            BIGINT,
  max_depth_m         INTEGER,
  avg_temp_c          NUMERIC,
  bordering_countries TEXT[],
  major_ports         TEXT[],
  shipping_routes     TEXT[],
  marine_species      INTEGER,
  economic_value      TEXT,
  lat_center          NUMERIC,
  lng_center          NUMERIC,
  hero_image          TEXT,
  description         TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CONFLICTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conflicts (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 TEXT UNIQUE NOT NULL,
  name                 TEXT NOT NULL,
  status               TEXT,
  started_year         INTEGER,
  ended_year           INTEGER,
  countries_involved   TEXT[],
  cities_affected      TEXT[],
  displaced_people     INTEGER,
  casualties_estimate  TEXT,
  peace_efforts        TEXT,
  source_url           TEXT,
  hero_image           TEXT,
  summary              TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ─── HOROSCOPE SIGNS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS horoscope_signs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  tradition     TEXT,
  symbol        TEXT,
  emoji         TEXT,
  date_range    TEXT,
  element       TEXT,
  ruling_planet TEXT,
  lucky_color   TEXT,
  lucky_number  INTEGER,
  traits        TEXT[],
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NATIONAL TEAMS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS national_teams (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  country_slug     TEXT REFERENCES countries(slug),
  sport            TEXT NOT NULL,
  team_name        TEXT NOT NULL,
  current_ranking  TEXT,
  coach            TEXT,
  captain          TEXT,
  achievements     TEXT[],
  next_match       JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── HOLIDAYS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS holidays (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_slug  TEXT REFERENCES countries(slug),
  province_slug TEXT,
  name          TEXT NOT NULL,
  date_fixed    TEXT,
  date_type     TEXT,
  holiday_type  TEXT,
  significance  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── EMERGENCY CONTACTS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_slug  TEXT REFERENCES countries(slug),
  province_slug TEXT,
  city_slug     TEXT,
  service       TEXT NOT NULL,
  number        TEXT NOT NULL,
  color         TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FAMOUS FOODS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS famous_foods (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  country_slug  TEXT REFERENCES countries(slug),
  province_slug TEXT,
  city_slug     TEXT,
  emoji         TEXT,
  origin        TEXT,
  description   TEXT,
  meal_type     TEXT,
  ingredients   TEXT[],
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NATURAL RESOURCES ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS natural_resources (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_slug  TEXT REFERENCES countries(slug),
  province_slug TEXT,
  city_slug     TEXT,
  name          TEXT NOT NULL,
  emoji         TEXT,
  rank          TEXT,
  description   TEXT,
  quantity      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── COMPARE PAIRS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS compare_pairs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city1_slug        TEXT NOT NULL,
  city2_slug        TEXT NOT NULL,
  searches_monthly  INTEGER,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city1_slug, city2_slug)
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_provinces_country ON provinces(country_slug);
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country_slug);
CREATE INDEX IF NOT EXISTS idx_cities_province ON cities(province_slug);
CREATE INDEX IF NOT EXISTS idx_personalities_country ON personalities(country_slug);
CREATE INDEX IF NOT EXISTS idx_landmarks_country ON landmarks(country_slug);
CREATE INDEX IF NOT EXISTS idx_landmarks_city ON landmarks(city_slug);
CREATE INDEX IF NOT EXISTS idx_heritage_country ON heritage_products(country_slug);
CREATE INDEX IF NOT EXISTS idx_heritage_city ON heritage_products(city_slug);
CREATE INDEX IF NOT EXISTS idx_holidays_country ON holidays(country_slug);
CREATE INDEX IF NOT EXISTS idx_emergency_country ON emergency_contacts(country_slug);
CREATE INDEX IF NOT EXISTS idx_foods_country ON famous_foods(country_slug);
CREATE INDEX IF NOT EXISTS idx_resources_country ON natural_resources(country_slug);

-- ─── ROW LEVEL SECURITY (Public read) ─────────────────────────────────────────
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE heritage_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE wonders ENABLE ROW LEVEL SECURITY;
ALTER TABLE oceans_seas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE horoscope_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE national_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE famous_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE natural_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE compare_pairs ENABLE ROW LEVEL SECURITY;

-- Public read policies (no auth required to read)
CREATE POLICY "Public read countries" ON countries FOR SELECT USING (true);
CREATE POLICY "Public read provinces" ON provinces FOR SELECT USING (true);
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public read personalities" ON personalities FOR SELECT USING (true);
CREATE POLICY "Public read landmarks" ON landmarks FOR SELECT USING (true);
CREATE POLICY "Public read heritage" ON heritage_products FOR SELECT USING (true);
CREATE POLICY "Public read wonders" ON wonders FOR SELECT USING (true);
CREATE POLICY "Public read oceans" ON oceans_seas FOR SELECT USING (true);
CREATE POLICY "Public read conflicts" ON conflicts FOR SELECT USING (true);
CREATE POLICY "Public read horoscope" ON horoscope_signs FOR SELECT USING (true);
CREATE POLICY "Public read teams" ON national_teams FOR SELECT USING (true);
CREATE POLICY "Public read holidays" ON holidays FOR SELECT USING (true);
CREATE POLICY "Public read emergency" ON emergency_contacts FOR SELECT USING (true);
CREATE POLICY "Public read foods" ON famous_foods FOR SELECT USING (true);
CREATE POLICY "Public read resources" ON natural_resources FOR SELECT USING (true);
CREATE POLICY "Public read compare" ON compare_pairs FOR SELECT USING (true);

-- ─── SEED DATA — PAKISTAN ──────────────────────────────────────────────────────
INSERT INTO countries (
  slug, name, code, flag, region, continent, population, area, capital,
  currency_name, currency_code, languages, government, timezone, utc_offset,
  independence, climate, major_faith, major_faith_pct, gdp, gdp_raw,
  growth_rate, inflation, unemployment, exports, hero_image, tagline,
  primary_color, secondary_color, lat, lng, literacy_rate, hdi, internet_pct, mobile_pct
) VALUES (
  'pakistan', 'Pakistan', 'PK', '🇵🇰', 'South Asia', 'Asia',
  231402117, 881913, 'Islamabad', 'Pakistani Rupee', 'PKR',
  ARRAY['Urdu','English','Punjabi','Pashto','Sindhi','Balochi'],
  'Federal Parliamentary Republic', 'PKT (UTC+5)', '+05:00',
  'August 14, 1947', 'Varies — Desert to Alpine', 'Islam', 96.0,
  '$376B', 376000000000, '5.7%', '28.2%', '6.2%',
  ARRAY['Textiles → USA/Europe/UAE','Rice → Middle East/Africa','Sports goods → Global','Surgical instruments → Germany/USA','Leather → Italy/UK'],
  'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'Land of ancient civilisations, towering peaks, and vibrant culture.',
  '#0C7A3D', '#FFFFFF', 30.3753, 69.3451, 62.3, 0.544, 36.0, 79.0
) ON CONFLICT (slug) DO NOTHING;

-- Punjab Province
INSERT INTO provinces (
  slug, country_slug, name, capital, population, area, tagline, known_for,
  gdp_contribution_pct, literacy_rate, climate, major_faith, major_faith_pct,
  lat, lng, industries, natural_resources, universities, established
) VALUES (
  'punjab', 'pakistan', 'Punjab', 'Lahore', 110012442, 205344,
  'Most populous province', 'Agriculture, Industry, Culture, Education',
  54.0, 64.0, 'Semi-arid', 'Islam', 97.0, 31.1471, 75.3412,
  ARRAY['Textiles','Agriculture','Manufacturing','Sports Goods','IT Services'],
  ARRAY['Fertile Agricultural Land','Indus River System','Rock Salt (Khewra)','Coal (Salt Range)','Natural Gas'],
  200, '1970 (modern province)'
) ON CONFLICT (slug, country_slug) DO NOTHING;

-- Lahore City
INSERT INTO cities (
  slug, province_slug, country_slug, name, name_local, city_type,
  population, area, elevation, lat, lng, timezone, utc_offset,
  founded_year, climate_type, major_faith, major_faith_pct, languages,
  currency_code, sister_cities, famous_bazaar, mosque_count, unesco_sites,
  annual_tourists, tagline, primary_color, nearby_water, gdp_contribution, main_industries
) VALUES (
  'lahore', 'punjab', 'pakistan', 'Lahore', 'لاہور', 'Provincial Capital',
  14000000, 1772, 217, 31.5497, 74.3436, 'Asia/Karachi', '+05:00',
  1000, 'Semi-arid', 'Islam', 94.0, ARRAY['Punjabi','Urdu'], 'PKR',
  ARRAY['Casablanca, Morocco','Chicago, USA','Houston, USA'],
  'Anarkali Bazaar', 2000, 3, 2000000,
  'Heart of Pakistan', '#0C7A3D', 'Ravi River',
  '13% of Pakistan GDP', ARRAY['Textiles','Leather','IT Services','Education','Food Processing']
) ON CONFLICT (slug, province_slug, country_slug) DO NOTHING;

-- Pakistan Emergency Contacts
INSERT INTO emergency_contacts (country_slug, province_slug, service, number, color) VALUES
('pakistan', NULL, 'Police', '15', '#1d4ed8'),
('pakistan', NULL, 'Ambulance', '1122', '#dc2626'),
('pakistan', NULL, 'Fire', '16', '#ea580c'),
('pakistan', NULL, 'Rescue', '1122', '#16a34a'),
('pakistan', NULL, 'Emergency', '115', '#7c3aed'),
('pakistan', NULL, 'Women Helpline', '1043', '#db2777'),
('pakistan', NULL, 'Child Helpline', '1121', '#0891b2'),
('pakistan', NULL, 'Disaster', '1700', '#b45309'),
('pakistan', NULL, 'Edhi Foundation', '115', '#059669');

-- Pakistan Holidays
INSERT INTO holidays (country_slug, name, date_fixed, date_type, holiday_type, significance) VALUES
('pakistan', 'Pakistan Day', 'March 23', 'Fixed', 'National', 'Commemoration of the Lahore Resolution 1940'),
('pakistan', 'Independence Day', 'August 14', 'Fixed', 'National', 'Independence from British India 1947'),
('pakistan', 'Defence Day', 'September 6', 'Fixed', 'National', 'Commemoration of 1965 war with India'),
('pakistan', 'Iqbal Day', 'November 9', 'Fixed', 'National', 'Birth anniversary of national poet Allama Iqbal'),
('pakistan', 'Quaid-e-Azam Day', 'December 25', 'Fixed', 'National', 'Birth anniversary of founder Muhammad Ali Jinnah'),
('pakistan', 'Eid ul Fitr', NULL, 'Islamic', 'Religious', 'End of Ramadan fasting month'),
('pakistan', 'Eid ul Adha', NULL, 'Islamic', 'Religious', 'Festival of sacrifice commemorating Ibrahim'),
('pakistan', 'Ashura', NULL, 'Islamic', 'Religious', '10th of Muharram observance');

-- Pakistan Famous Foods
INSERT INTO famous_foods (slug, name, country_slug, province_slug, city_slug, emoji, origin, description, meal_type) VALUES
('biryani-pakistan', 'Biryani', 'pakistan', NULL, NULL, '🍛', 'Mughal era', 'The national obsession — fragrant basmati, tender meat, and spices layered to perfection.', 'Lunch/Dinner'),
('nihari-lahore', 'Nihari', 'pakistan', 'punjab', 'lahore', '🥘', 'Old Delhi, adopted by Lahore', 'Slow-cooked beef shank simmered overnight. A Lahori Sunday morning ritual.', 'Breakfast'),
('chapli-kebab', 'Chapli Kebab', 'pakistan', 'khyber-pakhtunkhwa', NULL, '🥩', 'Peshawar, KPK', 'Peshawar''s gift to the world — flat spiced minced meat patty grilled over open flame.', 'Lunch/Dinner'),
('halwa-puri', 'Halwa Puri', 'pakistan', 'punjab', NULL, '🫓', 'Punjab', 'Fried bread with sweet semolina halwa and spiced chana — the classic Pakistani breakfast.', 'Breakfast'),
('karahi-pakistan', 'Karahi', 'pakistan', NULL, NULL, '🍲', 'Nationwide', 'Pakistan''s most loved dish — chicken or mutton cooked fast in a wok with tomatoes and ginger.', 'Lunch/Dinner'),
('lassi-punjab', 'Lassi', 'pakistan', 'punjab', NULL, '🥛', 'Punjab', 'Punjab in a glass. Thick churned yoghurt, sweet or salted, served chilled.', 'Drink');

-- Pakistan Natural Resources
INSERT INTO natural_resources (country_slug, name, emoji, rank, description) VALUES
('pakistan', 'Natural Gas', '🔥', 'World top 20', 'Top 20 global reserves. Provides significant domestic energy supply.'),
('pakistan', 'Coal', '⚫', '2nd largest in Asia', 'Thar Coal Field — one of the largest lignite reserves in the world.'),
('pakistan', 'Copper & Gold', '🟡', 'World top 5 deposit', 'Reko Diq in Balochistan — one of the largest undeveloped copper-gold deposits on earth.'),
('pakistan', 'Gemstones', '💎', 'Globally renowned', 'Emeralds, rubies, topaz, and tourmaline from the mountains of KPK and Gilgit-Baltistan.'),
('pakistan', 'Salt', '🪨', 'World 2nd largest mine', 'Khewra Salt Mine — world''s second largest and oldest salt mine, mined since the 1200s.'),
('pakistan', 'Water', '🌊', 'Top 10 river systems', 'Indus River system — one of the great river systems of the world, feeding Pakistan''s agriculture.');

-- Pakistan National Teams
INSERT INTO national_teams (slug, country_slug, sport, team_name, current_ranking, achievements) VALUES
('pakistan-cricket', 'pakistan', 'Cricket', 'Pakistan Cricket Team', 'World #4', ARRAY['T20 World Cup 2009','Champions Trophy 2017','Asia Cup 2022','World Cup 1992']),
('pakistan-hockey', 'pakistan', 'Hockey', 'Pakistan Hockey Team', 'World #16', ARRAY['4x World Cup Winner','3x Olympic Gold','4x Asian Games Gold']),
('pakistan-squash', 'pakistan', 'Squash', 'Pakistan Squash', 'Historically #1', ARRAY['Jahangir Khan 555 consecutive wins','Jansher Khan 8x World Champion']);

-- Pakistan Personalities
INSERT INTO personalities (slug, name, profession, category, country_slug, province_slug, city_slug, birth_year, death_year, birth_city, achievements) VALUES
('quaid-e-azam-jinnah', 'Quaid-e-Azam Muhammad Ali Jinnah', 'Father of the Nation', 'Leaders', 'pakistan', 'sindh', 'karachi', 1876, 1948, 'Karachi', 'Founded Pakistan on August 14, 1947'),
('allama-iqbal', 'Allama Iqbal', 'Poet of the East', 'Leaders', 'pakistan', 'punjab', 'sialkot', 1877, 1938, 'Sialkot', 'Philosophical father of Pakistan, national poet, wrote Tarana-e-Hind'),
('imran-khan', 'Imran Khan', 'Cricketer & Politician', 'Sports', 'pakistan', 'punjab', 'lahore', 1952, NULL, 'Lahore', 'World Cup captain 1992, 22nd Prime Minister of Pakistan'),
('wasim-akram', 'Wasim Akram', 'Cricketer', 'Sports', 'pakistan', 'punjab', 'lahore', 1966, NULL, 'Lahore', 'Greatest fast bowler, 916 international wickets, Sultan of Swing'),
('nusrat-fateh-ali-khan', 'Nusrat Fateh Ali Khan', 'Musician', 'Arts', 'pakistan', 'punjab', 'faisalabad', 1948, 1997, 'Faisalabad', 'King of Qawwali, global cultural ambassador, recorded 125+ albums'),
('dr-abdus-salam', 'Dr Abdus Salam', 'Physicist', 'Science', 'pakistan', 'punjab', 'jhang', 1926, 1996, 'Jhang', 'Nobel Prize in Physics 1979, first Pakistani Nobel laureate'),
('malala-yousafzai', 'Malala Yousafzai', 'Education Activist', 'Leaders', 'pakistan', 'khyber-pakhtunkhwa', NULL, 1997, NULL, 'Swat', 'Nobel Peace Prize 2014, youngest Nobel laureate ever'),
('abdul-sattar-edhi', 'Abdul Sattar Edhi', 'Philanthropist', 'Leaders', 'pakistan', 'sindh', 'karachi', 1928, 2016, 'Bantva (India)', 'Founded world''s largest volunteer ambulance network, 1,500+ ambulances');

-- Pakistan Landmarks (Lahore)
INSERT INTO landmarks (slug, name, type, city_slug, province_slug, country_slug, lat, lng, era, built_by, capacity, annual_visitors, unesco, hero_image, description) VALUES
('badshahi-mosque-lahore', 'Badshahi Mosque', 'Mosque', 'lahore', 'punjab', 'pakistan', 31.5881, 74.3101, 'Mughal 1673', 'Emperor Aurangzeb', 100000, 2000000, false, 'https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg', 'One of the world''s largest mosques, an iconic symbol of Lahore and Mughal architecture'),
('lahore-fort', 'Lahore Fort (Shahi Qila)', 'Fort', 'lahore', 'punjab', 'pakistan', 31.5880, 74.3137, 'Mughal 1566', 'Emperor Akbar', 50000, 1500000, true, '', 'UNESCO World Heritage Site, royal residence of Mughal emperors'),
('shalimar-gardens-lahore', 'Shalimar Gardens', 'Gardens', 'lahore', 'punjab', 'pakistan', 31.5879, 74.3764, 'Mughal 1641', 'Emperor Shah Jahan', 20000, 500000, true, '', 'UNESCO World Heritage Site, iconic Mughal-era terraced gardens'),
('mohenjo-daro', 'Mohenjo-daro', 'Archaeological', NULL, 'sindh', 'pakistan', 27.3244, 68.1375, '3000 BCE', 'Indus Valley Civilisation', 5000, 200000, true, '', 'UNESCO World Heritage Site, one of the earliest urban settlements in the world'),
('k2-mountain', 'K2', 'Mountain', NULL, 'gilgit-baltistan', 'pakistan', 35.8825, 76.5133, 'Natural Wonder', 'Natural', NULL, 15000, false, '', 'World''s second highest peak at 8,611m, one of the most dangerous mountains to climb'),
('faisal-mosque-islamabad', 'Faisal Mosque', 'Mosque', 'islamabad', 'islamabad', 'pakistan', 33.7295, 73.0387, 'Modern 1986', 'King Faisal of Saudi Arabia', 300000, 1000000, false, '', 'One of the world''s largest mosques, iconic landmark of Islamabad');

-- Pakistan Heritage Products
INSERT INTO heritage_products (slug, name, country_slug, province_slug, city_slug, craft_age, artisans, export_value, exports_to, unique_quality, emoji, category, description) VALUES
('khussa-shoes-lahore', 'Khussa Shoes', 'pakistan', 'punjab', 'lahore', '400+ years', 50000, 'PKR 500M/year', ARRAY['UAE','UK','USA','Canada'], 'Hand-stitched leather with intricate thread embroidery, each pair takes 2-3 days', '👞', 'Leather', 'Traditional hand-stitched leather shoes with intricate embroidery, made in the walled city of Lahore for over 400 years'),
('multan-blue-pottery', 'Multan Blue Pottery', 'pakistan', 'punjab', 'multan', '400+ years', 15000, 'PKR 2B/year', ARRAY['50+ countries'], 'Distinctive cobalt blue on white base using mineral pigments, no two pieces identical', '🏺', 'Pottery', '400-year craft tradition transforming locally sourced clay into beautiful cobalt blue ceramic art'),
('sialkot-sports-goods', 'Sialkot Sports Goods', 'pakistan', 'punjab', 'sialkot', '150+ years', 60000, '$500M/year', ARRAY['USA','UK','Europe','Australia'], '70% of world football supply comes from Sialkot', '⚽', 'Manufacturing', 'Sialkot produces 70% of the world''s hand-stitched footballs and significant share of surgical instruments'),
('truck-art-pakistan', 'Truck Art', 'pakistan', NULL, NULL, '70+ years', 30000, 'PKR 1B/year', ARRAY['Worldwide as art'], 'Unique fusion of Islamic calligraphy, floral patterns, and bold colours found nowhere else', '🎨', 'Art', 'Pakistan''s famous decorated trucks represent one of the most colourful and distinctive folk art traditions in the world'),
('phulkari-embroidery', 'Phulkari Embroidery', 'pakistan', 'punjab', NULL, '300+ years', 25000, 'PKR 300M/year', ARRAY['India','UK','USA'], 'Dense silk thread embroidery covering the entire fabric surface in geometric floral patterns', '🪡', 'Textile', 'Traditional Punjab embroidery art using silk thread on cotton fabric, historically gifted at weddings and festivals'),
('peshawari-chappal', 'Peshawari Chappal', 'pakistan', 'khyber-pakhtunkhwa', 'peshawar', '500+ years', 20000, 'PKR 400M/year', ARRAY['Afghanistan','UAE','UK'], 'Handmade from single piece of leather, worn by kings and commoners for centuries', '👡', 'Leather', 'The iconic leather sandal of the Frontier, hand-crafted from a single piece of cowhide using techniques unchanged for 500 years');

-- Western Horoscope Signs
INSERT INTO horoscope_signs (slug, name, tradition, symbol, emoji, date_range, element, ruling_planet, lucky_color, lucky_number, traits, description) VALUES
('aries', 'Aries', 'western', '♈', '🐏', 'March 21 - April 19', 'Fire', 'Mars', 'Red', 9, ARRAY['Bold','Ambitious','Competitive','Energetic'], 'The first sign of the zodiac, Aries is known for its fiery and pioneering spirit'),
('taurus', 'Taurus', 'western', '♉', '🐂', 'April 20 - May 20', 'Earth', 'Venus', 'Green', 6, ARRAY['Patient','Reliable','Devoted','Stubborn'], 'The bull sign known for determination, love of beauty, and groundedness'),
('gemini', 'Gemini', 'western', '♊', '👯', 'May 21 - June 20', 'Air', 'Mercury', 'Yellow', 5, ARRAY['Adaptable','Communicative','Witty','Indecisive'], 'The twins sign known for duality, curiosity, and excellent communication'),
('cancer', 'Cancer', 'western', '♋', '🦀', 'June 21 - July 22', 'Water', 'Moon', 'Silver', 2, ARRAY['Nurturing','Intuitive','Loyal','Moody'], 'The crab sign known for deep emotional intelligence and strong family bonds'),
('leo', 'Leo', 'western', '♌', '🦁', 'July 23 - August 22', 'Fire', 'Sun', 'Gold', 1, ARRAY['Generous','Creative','Theatrical','Proud'], 'The lion sign known for natural leadership, creativity, and generous spirit'),
('virgo', 'Virgo', 'western', '♍', '♍', 'August 23 - September 22', 'Earth', 'Mercury', 'Brown', 4, ARRAY['Analytical','Meticulous','Helpful','Perfectionist'], 'The maiden sign known for precision, practical intelligence, and helpfulness'),
('libra', 'Libra', 'western', '♎', '⚖️', 'September 23 - October 22', 'Air', 'Venus', 'Pink', 7, ARRAY['Diplomatic','Gracious','Fair-minded','Indecisive'], 'The scales sign known for justice, beauty, and desire for harmony'),
('scorpio', 'Scorpio', 'western', '♏', '🦂', 'October 23 - November 21', 'Water', 'Pluto', 'Dark Red', 8, ARRAY['Resourceful','Passionate','Loyal','Secretive'], 'The scorpion sign known for intensity, resourcefulness, and transformation'),
('sagittarius', 'Sagittarius', 'western', '♐', '🏹', 'November 22 - December 21', 'Fire', 'Jupiter', 'Purple', 3, ARRAY['Optimistic','Adventurous','Philosophical','Tactless'], 'The archer sign known for adventure, philosophy, and love of freedom'),
('capricorn', 'Capricorn', 'western', '♑', '🐐', 'December 22 - January 19', 'Earth', 'Saturn', 'Brown', 8, ARRAY['Disciplined','Responsible','Ambitious','Pessimistic'], 'The sea-goat sign known for discipline, ambition, and practical wisdom'),
('aquarius', 'Aquarius', 'western', '♒', '🏺', 'January 20 - February 18', 'Air', 'Uranus', 'Blue', 11, ARRAY['Progressive','Original','Humanitarian','Detached'], 'The water-bearer sign known for innovation, humanitarianism, and independence'),
('pisces', 'Pisces', 'western', '♓', '🐟', 'February 19 - March 20', 'Water', 'Neptune', 'Sea Green', 7, ARRAY['Compassionate','Artistic','Intuitive','Escapist'], 'The fish sign known for empathy, artistic talent, and spiritual depth');

-- Key Oceans & Seas
INSERT INTO oceans_seas (slug, name, type, area_km2, max_depth_m, avg_temp_c, bordering_countries, major_ports, marine_species, lat_center, lng_center, description) VALUES
('pacific-ocean', 'Pacific Ocean', 'Ocean', 165250000, 10924, 14, ARRAY['USA','China','Japan','Australia','Philippines','Indonesia'], ARRAY['Shanghai','Singapore','Los Angeles','Tokyo'], 150000, 0, -160, 'The world''s largest and deepest ocean, covering more than 30% of the Earth''s surface'),
('atlantic-ocean', 'Atlantic Ocean', 'Ocean', 106460000, 8376, 10, ARRAY['USA','Brazil','UK','France','Nigeria','Argentina'], ARRAY['Rotterdam','New York','Santos','Lagos'], 80000, 0, -30, 'The second-largest ocean, historically the route for European exploration and trade'),
('indian-ocean', 'Indian Ocean', 'Ocean', 70560000, 7906, 24, ARRAY['India','Australia','Indonesia','Somalia','South Africa'], ARRAY['Mumbai','Singapore','Colombo','Durban'], 70000, -20, 80, 'The third-largest ocean, warmest of all oceans, critically important for global trade'),
('arabian-sea', 'Arabian Sea', 'Sea', 3862000, 4652, 27, ARRAY['India','Pakistan','Oman','Yemen','Somalia'], ARRAY['Karachi','Mumbai','Muscat','Aden'], 5000, 16, 65, 'Part of the Indian Ocean, one of the world''s busiest shipping lanes for oil from the Gulf'),
('mediterranean-sea', 'Mediterranean Sea', 'Sea', 2500000, 5267, 18, ARRAY['Spain','France','Italy','Greece','Turkey','Egypt'], ARRAY['Barcelona','Marseille','Piraeus','Alexandria'], 10000, 36, 15, 'The sea of ancient civilisations, connecting Europe, Africa, and Asia for millennia'),
('red-sea', 'Red Sea', 'Sea', 438000, 3040, 28, ARRAY['Egypt','Saudi Arabia','Yemen','Eritrea','Sudan'], ARRAY['Suez','Jeddah','Aqaba'], 1000, 20, 38, 'Strategic waterway connecting the Mediterranean via Suez Canal to the Indian Ocean');

