-- final30 B10 — Real `cities` rows for Multan and Peshawar.
--
-- Why: every city subpage (weather / prayer-times / rates / news /
-- events / sports / economy) keys off `getCityData()` → the `cities`
-- row. With no row, the subpages fall back to generated stubs
-- (coords 0,0) or, for prayer-times, to Lahore's coordinates. These
-- two rows give the subpages real coordinates, names and populations
-- so they render real content. Sitemap listing is NOT done here: the
-- C2 sitemap PR merges only after this PR and verifies live renders.
--
-- Sources (all figures carry their source; nothing invented):
--   Populations: Pakistan Bureau of Statistics, 7th Population &
--     Housing Census (2023), Detailed Results, Table 1, DISTRICT
--     totals — the same unit rule F3 uses for Lahore/Karachi/
--     Islamabad (district total paired with district area):
--       Multan district   5,362,305 (area 3,720 km²)
--       Peshawar district 4,758,762 (area 1,518 km²)
--   Coordinates: the site's canonical CITY_DB coordinates
--     (city main page), identical to the prayer-tables coordinates
--     for Peshawar (34.008, 71.57849); Multan CITY_DB (30.1978,
--     71.4711) differs from its prayer-table row (30.19679, 71.47824)
--     by <1 km — immaterial to prayer times, and one canonical
--     coordinate per city wins over two.
--   Areas/elevations/languages: the city main page GLANCE records
--     (Multan: 3,720 km², 122 m, Urdu/Saraiki/Punjabi; Peshawar:
--     1,518 km², 340 m, Urdu/Pashto/Hindko).
--   Tagline: Multan 'City of Saints' from the site's own Multan city
--     package (famous_for). Peshawar has no repo-sourced city
--     tagline, so its tagline stays NULL rather than invented.
--   name_local is deliberately left NULL: the site is English-only
--     in public UI/content, so no Urdu-script name is added here.
--
-- Idempotent: INSERT ... ON CONFLICT (slug, province_slug,
-- country_slug) DO UPDATE — replaces zeroed stub rows if they exist
-- and refreshes stale values if the rows already exist. Safe to
-- re-run. Migration number 0020: 0018 is claimed by open PR #124
-- (B4) and 0019 by open PR #134 (B2); this file takes the next free
-- number at push time.

INSERT INTO cities (
  slug, province_slug, country_slug,
  name,
  population, area, elevation,
  lat, lng, timezone, utc_offset,
  major_faith,
  languages, currency_code,
  tagline, primary_color
) VALUES (
  'multan', 'punjab', 'pakistan',
  'Multan',
  5362305, 3720, 122,
  30.1978, 71.4711, 'Asia/Karachi', '+05:00',
  'Islam',
  ARRAY['Urdu', 'Saraiki', 'Punjabi'], 'PKR',
  'City of Saints', '#0C7A3D'
), (
  'peshawar', 'khyber-pakhtunkhwa', 'pakistan',
  'Peshawar',
  4758762, 1518, 340,
  34.008, 71.57849, 'Asia/Karachi', '+05:00',
  'Islam',
  ARRAY['Urdu', 'Pashto', 'Hindko'], 'PKR',
  NULL, '#0C7A3D'
)
ON CONFLICT (slug, province_slug, country_slug) DO UPDATE SET
  name = EXCLUDED.name,
  population = EXCLUDED.population,
  area = EXCLUDED.area,
  elevation = EXCLUDED.elevation,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  timezone = EXCLUDED.timezone,
  utc_offset = EXCLUDED.utc_offset,
  major_faith = EXCLUDED.major_faith,
  languages = EXCLUDED.languages,
  currency_code = EXCLUDED.currency_code,
  tagline = EXCLUDED.tagline,
  primary_color = EXCLUDED.primary_color,
  updated_at = NOW();
