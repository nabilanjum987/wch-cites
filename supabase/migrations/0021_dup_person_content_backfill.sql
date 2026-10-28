-- ─────────────────────────────────────────────────────────────────────────────
-- 0021_dup_person_content_backfill.sql — duplicate-person consolidation
-- (owner decision, 28 Oct 2026, final)
--
-- PROBLEM: the survivor pages must render the FULL profile — bio,
-- quotes, timeline, facts — at the same depth as the loser pages do
-- today, or the consolidation ships a thinner page than the one it
-- replaces.
--
-- WHAT IS PROVEN ABOUT THE SURVIVOR ROWS (repo evidence only):
--   * Both survivor rows exist in production (migration 0019 updates
--     them, and the final28 sitemap pass listed them as DB-only slugs).
--   * Migration 0019 proves their title + summary were EMPTY before it
--     backfilled them ('Nobel Laureate Physicist' + 140-char summary
--     for dr-abdus-salam; 'Founder' + 152-char summary for
--     quaid-e-azam-jinnah). 0019 is already applied by the owner.
--   * NO migration in the repo ever populated the survivors' rich
--     fields (achievements, timeline, works, quotes, sources, or the
--     scalar identity fields). The legacy schema.sql rows for these
--     two people belong to an older table shape (profession/category/
--     birth_year columns), not the detail-page `personalities` table,
--     so they prove nothing about the detail-page rows.
--   * The loser rows DO carry the full verified content: migration
--     0006 inserted it, and the seed (src/lib/data/personalities-
--     seed.ts) carries byte-identical content — the loser pages render
--     from exactly this data today.
--
-- FIX: copy the losers' verified content into the survivor rows, but
-- ONLY where the survivor field is empty (NULL, '' for text, [] for
-- jsonb). Every UPDATE below is guarded on its own column, so this
-- migration is idempotent and NEVER overwrites existing survivor
-- data — if a survivor field already holds a human value, that value
-- wins and the loser's value is skipped. Re-running is a no-op.
--
-- DELIBERATELY NOT TOUCHED:
--   * slug, name — the survivor's own identity.
--   * title, summary — already backfilled by 0019; overwriting them
--     with the loser's wording would undo the owner's 0019 fix (the
--     survivor display names differ: 'Dr Abdus Salam' vs 'Abdus
--     Salam'; 'Quaid-e-Azam Muhammad Ali Jinnah' vs 'Muhammad Ali
--     Jinnah').
--   * quotes for dr-abdus-salam, description_sections for both — the
--     loser records carry [] for these, so there is nothing to copy
--     and the survivor is at exactly the loser's depth (zero) there.
--   * image_url / image_credit / image_licence — the loser rows carry
--     NULL; the survivor hero renders photo-less exactly as the loser
--     page does today (P9 made the photo optional).
--   * verified — the human publication gate; untouched.
--   * The loser rows themselves — they stay (history); their URLs are
--     retired by the proxy 301, not by deleting data.
--
-- SOURCES: every value below is copied VERBATIM from migration 0006's
-- rows for abdus-salam / muhammad-ali-jinnah (the same content the
-- loser pages render today). No new facts are introduced; this is a
-- move of verified content from a retired slug to its survivor.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Dr Abdus Salam ← Abdus Salam ──────────────────────────────────────────

UPDATE personalities
SET achievements = $wch$[{"icon": "🏆", "title": "Nobel Prize (1979)", "description": "First Pakistani Nobel laureate; shared the Physics prize."}, {"icon": "🔬", "title": "Electroweak Unification", "description": "Unified two fundamental forces on paper before experiment confirmed it."}, {"icon": "🌍", "title": "ICTP Founder", "description": "Built a home for developing-world physicists in Trieste."}]$wch$::jsonb
WHERE slug = 'dr-abdus-salam'
  AND (achievements IS NULL OR achievements = '[]'::jsonb);

UPDATE personalities
SET timeline = $wch$[{"year": "1926", "title": "Born in Jhang", "description": "Born in Punjab; a prodigy at Government College Lahore and Cambridge."}, {"year": "1951", "title": "Professor at Lahore", "description": "Returns to head mathematics at Government College Lahore."}, {"year": "1964", "title": "Founds the ICTP", "description": "Establishes the International Centre for Theoretical Physics in Trieste."}, {"year": "1979", "title": "Nobel Prize in Physics", "description": "Shares the Nobel for the electroweak theory."}, {"year": "1996", "title": "Dies in Oxford", "description": "Passes away in Oxford; buried in Rabwah, Pakistan."}]$wch$::jsonb
WHERE slug = 'dr-abdus-salam'
  AND (timeline IS NULL OR timeline = '[]'::jsonb);

UPDATE personalities
SET works = $wch$[{"title": "Gauge Unification of Fundamental Forces", "year": "1979", "description": "His Nobel lecture and summation of the electroweak work.", "type": "Physics"}, {"title": "Ideals and Realities", "description": "Essays on science, faith and the developing world.", "type": "Essays"}]$wch$::jsonb
WHERE slug = 'dr-abdus-salam'
  AND (works IS NULL OR works = '[]'::jsonb);

UPDATE personalities
SET sources = $wch$[{"name": "Wikipedia", "url": "https://en.wikipedia.org/wiki/Abdus_Salam"}, {"name": "Wikidata", "url": "https://www.wikidata.org/wiki/Q28189"}]$wch$::jsonb
WHERE slug = 'dr-abdus-salam'
  AND (sources IS NULL OR sources = '[]'::jsonb);

UPDATE personalities SET occupation = 'Physicist'
WHERE slug = 'dr-abdus-salam' AND (occupation IS NULL OR occupation = '');

UPDATE personalities SET birth_date = '29 January 1926'
WHERE slug = 'dr-abdus-salam' AND (birth_date IS NULL OR birth_date = '');

UPDATE personalities SET death_date = '21 November 1996'
WHERE slug = 'dr-abdus-salam' AND (death_date IS NULL OR death_date = '');

UPDATE personalities SET nationality = 'Pakistani'
WHERE slug = 'dr-abdus-salam' AND (nationality IS NULL OR nationality = '');

UPDATE personalities SET city_slug = 'lahore'
WHERE slug = 'dr-abdus-salam' AND (city_slug IS NULL OR city_slug = '');

UPDATE personalities SET province_slug = 'punjab'
WHERE slug = 'dr-abdus-salam' AND (province_slug IS NULL OR province_slug = '');

UPDATE personalities SET country_slug = 'pakistan'
WHERE slug = 'dr-abdus-salam' AND (country_slug IS NULL OR country_slug = '');

UPDATE personalities SET city_name = 'Lahore'
WHERE slug = 'dr-abdus-salam' AND (city_name IS NULL OR city_name = '');

UPDATE personalities SET province_name = 'Punjab'
WHERE slug = 'dr-abdus-salam' AND (province_name IS NULL OR province_name = '');

UPDATE personalities SET country_name = 'Pakistan'
WHERE slug = 'dr-abdus-salam' AND (country_name IS NULL OR country_name = '');

UPDATE personalities SET primary_color = '#1F3A5F'
WHERE slug = 'dr-abdus-salam' AND (primary_color IS NULL OR primary_color = '');

-- ── Quaid-e-Azam Jinnah ← Muhammad Ali Jinnah ─────────────────────────────

UPDATE personalities
SET achievements = $wch$[{"icon": "🇵🇰", "title": "Founder of Pakistan", "description": "Negotiated a sovereign state into being through constitutional politics."}, {"icon": "⚖️", "title": "Ambassador of Hindu-Muslim Unity", "description": "Gokhale's famous tribute to his early bridge-building career."}, {"icon": "🏛️", "title": "First Governor-General", "description": "Head of state of the new Pakistan, 1947–48."}]$wch$::jsonb
WHERE slug = 'quaid-e-azam-jinnah'
  AND (achievements IS NULL OR achievements = '[]'::jsonb);

UPDATE personalities
SET timeline = $wch$[{"year": "1876", "title": "Born in Karachi", "description": "Born in Wazir Mansion, Karachi, to a Khoja merchant family."}, {"year": "1890s", "title": "Called to the Bar", "description": "Qualifies at Lincoln's Inn, London; builds a Bombay practice."}, {"year": "1940", "title": "Lahore Resolution", "description": "Presides over the Muslim League session that demands separate states."}, {"year": "1947", "title": "Governor-General of Pakistan", "description": "Leads the new dominion; Karachi is its first capital."}, {"year": "1948", "title": "Dies in Karachi", "description": "Passes away in Karachi a year after independence."}]$wch$::jsonb
WHERE slug = 'quaid-e-azam-jinnah'
  AND (timeline IS NULL OR timeline = '[]'::jsonb);

UPDATE personalities
SET works = $wch$[{"title": "Lahore Resolution", "year": "1940", "description": "The session he presided over that set Pakistan's course.", "type": "Politics"}, {"title": "11 August 1947 Address", "description": "His founding speech on citizenship and equal rights.", "type": "Speech"}]$wch$::jsonb
WHERE slug = 'quaid-e-azam-jinnah'
  AND (works IS NULL OR works = '[]'::jsonb);

UPDATE personalities
SET quotes = $wch$[{"text": "Unity, Faith, Discipline.", "context": "His guiding motto for the new nation."}, {"text": "No power on earth can undo Pakistan.", "context": "From his public addresses in the movement's final years."}]$wch$::jsonb
WHERE slug = 'quaid-e-azam-jinnah'
  AND (quotes IS NULL OR quotes = '[]'::jsonb);

UPDATE personalities
SET sources = $wch$[{"name": "Wikipedia", "url": "https://en.wikipedia.org/wiki/Muhammad_Ali_Jinnah"}, {"name": "Wikidata", "url": "https://www.wikidata.org/wiki/Q160554"}]$wch$::jsonb
WHERE slug = 'quaid-e-azam-jinnah'
  AND (sources IS NULL OR sources = '[]'::jsonb);

UPDATE personalities SET occupation = 'Statesman'
WHERE slug = 'quaid-e-azam-jinnah' AND (occupation IS NULL OR occupation = '');

UPDATE personalities SET birth_date = '25 December 1876'
WHERE slug = 'quaid-e-azam-jinnah' AND (birth_date IS NULL OR birth_date = '');

UPDATE personalities SET death_date = '11 September 1948'
WHERE slug = 'quaid-e-azam-jinnah' AND (death_date IS NULL OR death_date = '');

UPDATE personalities SET nationality = 'Pakistani'
WHERE slug = 'quaid-e-azam-jinnah' AND (nationality IS NULL OR nationality = '');

UPDATE personalities SET city_slug = 'karachi'
WHERE slug = 'quaid-e-azam-jinnah' AND (city_slug IS NULL OR city_slug = '');

UPDATE personalities SET province_slug = 'sindh'
WHERE slug = 'quaid-e-azam-jinnah' AND (province_slug IS NULL OR province_slug = '');

UPDATE personalities SET country_slug = 'pakistan'
WHERE slug = 'quaid-e-azam-jinnah' AND (country_slug IS NULL OR country_slug = '');

UPDATE personalities SET city_name = 'Karachi'
WHERE slug = 'quaid-e-azam-jinnah' AND (city_name IS NULL OR city_name = '');

UPDATE personalities SET province_name = 'Sindh'
WHERE slug = 'quaid-e-azam-jinnah' AND (province_name IS NULL OR province_name = '');

UPDATE personalities SET country_name = 'Pakistan'
WHERE slug = 'quaid-e-azam-jinnah' AND (country_name IS NULL OR country_name = '');

UPDATE personalities SET primary_color = '#01411C'
WHERE slug = 'quaid-e-azam-jinnah' AND (primary_color IS NULL OR primary_color = '');

-- Verification (run after applying; expect 2 rows, no empty rich fields
-- other than the documented []/NULL cases: Salam quotes + both
-- description_sections are [] by design, images NULL by design):
-- SELECT slug, name, title,
--        jsonb_array_length(achievements) AS ach,
--        jsonb_array_length(timeline) AS tl,
--        jsonb_array_length(works) AS works,
--        jsonb_array_length(quotes) AS quotes,
--        jsonb_array_length(sources) AS sources,
--        city_slug, country_slug, verified
-- FROM personalities
-- WHERE slug IN ('dr-abdus-salam', 'quaid-e-azam-jinnah');
