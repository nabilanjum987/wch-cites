-- ─────────────────────────────────────────────────────────────────────────────
-- 0014_personalities_shape_fix.sql — Personalities table SHAPE FIX
-- (FRIDAY BATCH Card B, 2026-10-23)
--
-- PROBLEM (verified by the owner's production CSV export): the production
-- `personalities` table is the OLD shape —
--   id, slug, name, profession, category, country_slug, province_slug,
--   city_slug, birth_year (int), death_year (int), birth_city, nationality,
--   achievements (TEXT), photo_url, wikipedia_url, featured_month,
--   created_at
-- while src/lib/personalities.ts expects the shape created by migration
-- 0005 (title, occupation, birth_date, summary, jsonb arrays, sources,
-- verified, …). That mismatch is why 0005's seed rows never landed and
-- why migrations 0006 / 0013 cannot run against production.
--
-- WHAT THIS FILE DOES — in order:
--   STEP 1  ADD COLUMN IF NOT EXISTS for every 0005-shape column the old
--           table lacks (types/defaults copied from 0005).
--   STEP 2  achievements TEXT -> jsonb, SAFELY: text that parses as a
--           JSON array becomes that jsonb array; anything else (plain
--           prose, objects, broken JSON, NULL/'') becomes '[]'. The old
--           text is KEPT in achievements_text_legacy — nothing is lost.
--   STEP 3  Backfills from the old columns where data exists:
--           occupation <- profession, image_url <- photo_url,
--           sources <- [{name:'Wikipedia', url: wikipedia_url}],
--           birth_date <- birth_year::text, death_date <- death_year::text
--           (year-only strings: honest data, no month/day invented).
--   STEP 4  The 0005 indexes + a unique index on slug (the natural key
--           the code, and 0005 itself, already treat as unique; if
--           production somehow held duplicate slugs this fails LOUDLY
--           rather than guessing which row wins).
--   STEP 5  Row Level Security on + 0005's verified-only public-read
--           policy (created only if missing — idempotent).
--   STEP 6  0005's two seed profiles (allama-iqbal, imran-khan) as
--           UPSERTs with their FULL 0005 data, so both land complete
--           whether or not partial old rows exist for those slugs.
--
-- GUARANTEES:
--   * ROW-PRESERVING: the table is never dropped or recreated; no row
--     is deleted; the `id` column is not touched; old columns
--     (profession, category, birth_year, photo_url, …) are KEPT —
--     the code simply ignores them.
--   * IDEMPOTENT: safe to run twice; every step guards itself
--     (IF NOT EXISTS / information_schema / pg_policies checks, and
--     backfills that only fill still-empty targets).
--   * After the owner runs this migration, migrations 0006 and 0013
--     (which assume the 0005 shape) become runnable.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── STEP 1 · Add the 0005-shape columns the old table lacks ─────────────
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS title                text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS occupation           text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS birth_date           text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS death_date           text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS city_name            text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS province_name        text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS country_name         text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS summary              text    NOT NULL DEFAULT '';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS timeline             jsonb   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS works                jsonb   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS quotes               jsonb   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS description_sections jsonb   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS image_url            text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS image_credit         text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS image_licence        text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS primary_color        text    NOT NULL DEFAULT '#01411C';
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS sources              jsonb   NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS verified             boolean NOT NULL DEFAULT false;

-- ── STEP 2 · achievements TEXT -> jsonb (guarded, legacy text kept) ─────
-- A plpgsql helper does the per-row parse because pure SQL has no
-- try/catch: text that parses as a JSON *array* is kept; anything else
-- becomes '[]'. The whole conversion runs inside a DO block that only
-- fires while `achievements` is still text, so re-runs are no-ops.
CREATE OR REPLACE FUNCTION wch_personalities_safe_jsonb_array(p_text text)
RETURNS jsonb
LANGUAGE plpgsql
AS $fn$
BEGIN
  IF p_text IS NULL OR btrim(p_text) = '' THEN
    RETURN '[]'::jsonb;
  END IF;
  BEGIN
    IF jsonb_typeof(p_text::jsonb) = 'array' THEN
      RETURN p_text::jsonb;
    END IF;
    RETURN '[]'::jsonb;
  EXCEPTION WHEN others THEN
    RETURN '[]'::jsonb;
  END;
END;
$fn$;

DO $conv$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'personalities'
      AND column_name = 'achievements'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE personalities
      ADD COLUMN achievements_wch_new jsonb NOT NULL DEFAULT '[]'::jsonb;
    UPDATE personalities
      SET achievements_wch_new = wch_personalities_safe_jsonb_array(achievements);
    ALTER TABLE personalities
      RENAME COLUMN achievements TO achievements_text_legacy;
    ALTER TABLE personalities
      RENAME COLUMN achievements_wch_new TO achievements;
  END IF;
END;
$conv$;

DROP FUNCTION IF EXISTS wch_personalities_safe_jsonb_array(text);

-- ── STEP 3 · Backfill new columns from the old ones (fill-empty only) ───
UPDATE personalities
  SET occupation = profession
  WHERE occupation = ''
    AND profession IS NOT NULL AND profession <> '';

UPDATE personalities
  SET image_url = photo_url
  WHERE image_url IS NULL
    AND photo_url IS NOT NULL AND photo_url <> '';

UPDATE personalities
  SET sources = jsonb_build_array(
                  jsonb_build_object('name', 'Wikipedia', 'url', wikipedia_url))
  WHERE (sources IS NULL OR sources = '[]'::jsonb)
    AND wikipedia_url IS NOT NULL AND wikipedia_url <> '';

UPDATE personalities
  SET birth_date = birth_year::text
  WHERE birth_date IS NULL AND birth_year IS NOT NULL;

UPDATE personalities
  SET death_date = death_year::text
  WHERE death_date IS NULL AND death_year IS NOT NULL;

-- ── STEP 4 · Indexes (0005 set) + unique slug ────────────────────────────
CREATE INDEX IF NOT EXISTS personalities_city_idx    ON personalities (city_slug);
CREATE INDEX IF NOT EXISTS personalities_country_idx ON personalities (country_slug);
CREATE INDEX IF NOT EXISTS personalities_public_idx  ON personalities (verified);
CREATE UNIQUE INDEX IF NOT EXISTS personalities_slug_uidx ON personalities (slug);

-- ── STEP 5 · RLS + verified-only public-read policy (idempotent) ────────
ALTER TABLE personalities ENABLE ROW LEVEL SECURITY;

DO $pol$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'personalities'
      AND policyname = 'Public can read verified personalities'
  ) THEN
    CREATE POLICY "Public can read verified personalities"
      ON personalities FOR SELECT
      TO anon, authenticated
      USING (verified = true);
  END IF;
END;
$pol$;

-- ── STEP 6 · 0005's two seed profiles as UPSERTs (full data) ────────────
-- Values copied VERBATIM from 0005_personalities.sql; the conflict
-- clause is upgraded from DO NOTHING to DO UPDATE so a partial old row
-- (e.g. slug + name only) is completed in place — its id and any
-- legacy-column data are preserved.
INSERT INTO personalities (
  slug, name, title, occupation, birth_date, death_date, nationality,
  city_slug, province_slug, country_slug, city_name, province_name, country_name,
  summary, achievements, timeline, works, quotes, description_sections,
  image_url, image_credit, image_licence, primary_color, sources, verified
) VALUES
  ($wch$allama-iqbal$wch$, $wch$Allama Iqbal$wch$, $wch$Poet-Philosopher & Spiritual Father of Pakistan$wch$, $wch$Poet and philosopher$wch$, $wch$9 November 1877$wch$, $wch$21 April 1938$wch$, $wch$British Indian (Pakistani)$wch$, $wch$lahore$wch$, $wch$punjab$wch$, $wch$pakistan$wch$, $wch$Lahore$wch$, $wch$Punjab$wch$, $wch$Pakistan$wch$, $wch$Sir Muhammad Iqbal, known as Allama Iqbal, was one of the most significant Muslim poets and philosophers of the 20th century. His poetry in Urdu and Persian revived Islamic spiritual and political thought and laid the philosophical foundation for Pakistan.$wch$, $wch$[{"icon":"🖊️","title":"National Poet of Pakistan","description":"Declared Shair-e-Mashriq (Poet of the East) and national poet of Pakistan."},{"icon":"🎓","title":"PhD from Munich","description":"First Muslim to earn a doctorate in philosophy from Ludwig Maximilian University of Munich."},{"icon":"🏛️","title":"Knighthood","description":"Knighted by the British Crown in 1922 for his literary contributions."},{"icon":"🌍","title":"Pan-Islamic Philosopher","description":"His poetry inspired Muslim intellectuals from Egypt to Indonesia."}]$wch$::jsonb, $wch$[{"year":"1877","title":"Born in Sialkot","description":"Born into a Kashmiri family of artisans in Sialkot, Punjab."},{"year":"1905","title":"Studies in Europe","description":"Travels to Europe to study philosophy at Cambridge and Munich, earning his doctorate."},{"year":"1915","title":"Asrar-e-Khudi Published","description":"Publishes his landmark Persian poem on the philosophy of the self (ego)."},{"year":"1930","title":"Allahabad Address","description":"Delivers his historic presidential address envisioning a separate Muslim state in the northwest of India."},{"year":"1938","title":"Passes Away in Lahore","description":"Dies in Lahore at age 60. His mausoleum is at the entrance of Badshahi Mosque."}]$wch$::jsonb, $wch$[{"title":"Asrar-e-Khudi (Secrets of the Self)","year":"1915","description":"Persian poetry on self-realisation and ego development.","type":"Poetry"},{"title":"Bang-e-Dra (The Call of the Marching Bell)","year":"1924","description":"First Urdu collection spanning three phases of his life.","type":"Poetry"},{"title":"Bal-e-Jibril (Gabriel's Wing)","year":"1935","description":"Considered his most mature Urdu poetry.","type":"Poetry"},{"title":"Javid Nama (Book of Eternity)","year":"1932","description":"Persian epic inspired by Dante's Divine Comedy.","type":"Poetry"},{"title":"The Reconstruction of Religious Thought in Islam","year":"1930","description":"His most important philosophical prose work in English.","type":"Philosophy"}]$wch$::jsonb, $wch$[{"text":"Khudi ko kar buland itna ke har taqdeer se pehle, Khuda bande se khud pooche bata teri raza kya hai.","context":"From Bang-e-Dra — on elevating the self"},{"text":"Nations are born in the hearts of poets, they prosper and die in the hands of politicians.","context":"Political philosophy"},{"text":"Rise above sectional interests and private ambitions... Pass from matter to spirit.","context":"Allahabad Address, 1930"}]$wch$::jsonb, $wch$[{"title":"Early Life & Education","content":"Born in Sialkot in 1877, Iqbal showed early aptitude for Persian and Urdu poetry. He studied at Government College Lahore under Sir Thomas Arnold, who encouraged him to study Western philosophy. He later studied at Cambridge, then earned a doctorate in Munich with his thesis on Persian metaphysics."},{"title":"Philosophy of Khudi (Self)","content":"Iqbal's central philosophical concept is Khudi — the development of the individual self through action, love and creative power. Drawing on Rumi, Nietzsche and Bergson, he argued that spiritual vitality begins with self-affirmation, not self-negation. This philosophy became the intellectual foundation for Muslim political awakening in South Asia."},{"title":"Legacy in Pakistan","content":"Iqbal's Allahabad Address of 1930 is considered the intellectual seed of Pakistan. He is buried at the entrance of Lahore's Badshahi Mosque. His birthday (9 November) is a national holiday. His image appears on all Pakistani currency."}]$wch$::jsonb, $wch$https://upload.wikimedia.org/wikipedia/commons/6/65/Allama_Iqbal.jpg$wch$, NULL, NULL, $wch$#01411C$wch$, $wch$[{"name":"Wikipedia","url":"https://en.wikipedia.org/wiki/Muhammad_Iqbal"}]$wch$::jsonb, false),
  ($wch$imran-khan$wch$, $wch$Imran Khan$wch$, $wch$Cricketer, Philanthropist & Former Prime Minister$wch$, $wch$Cricketer and politician$wch$, $wch$5 October 1952$wch$, NULL, $wch$Pakistani$wch$, $wch$lahore$wch$, $wch$punjab$wch$, $wch$pakistan$wch$, $wch$Lahore$wch$, $wch$Punjab$wch$, $wch$Pakistan$wch$, $wch$Imran Khan is one of the greatest all-round cricketers in history, leading Pakistan to its only ICC Cricket World Cup title in 1992. He later founded Shaukat Khanum Cancer Hospital and PTI political party, becoming Pakistan's 22nd Prime Minister in 2018.$wch$, $wch$[{"icon":"🏆","title":"World Cup Champion","description":"Led Pakistan to the 1992 Cricket World Cup — the team's only World Cup win."},{"icon":"🏥","title":"Cancer Hospital Founder","description":"Founded Shaukat Khanum Memorial Cancer Hospital treating thousands annually."},{"icon":"📿","title":"362 Test Wickets","description":"One of only eight players to have scored 3,000 runs and taken 300 wickets in Tests."},{"icon":"🎓","title":"Namal University","description":"Founded Namal University in Mianwali to provide higher education to rural Pakistan."}]$wch$::jsonb, $wch$[{"year":"1971","title":"Test debut","description":"Made Test cricket debut for Pakistan at Edgbaston, Birmingham."},{"year":"1992","title":"World Cup victory","description":"Led Pakistan to its only Cricket World Cup title at the Melbourne Cricket Ground."},{"year":"1996","title":"Founded PTI","description":"Founded Pakistan Tehreek-e-Insaf political party with an anti-corruption platform."},{"year":"1994","title":"Shaukat Khanum Hospital","description":"Opened first cancer hospital in Pakistan offering 75% subsidised treatment."},{"year":"2018","title":"Prime Minister","description":"Elected as Pakistan's 22nd Prime Minister after PTI's election victory."}]$wch$::jsonb, $wch$[{"title":"Pakistan: A Personal History","year":"2011","description":"Memoir and political manifesto outlining his vision for Pakistan.","type":"Book"},{"title":"All Round View","year":"1988","description":"Autobiography of his cricket career.","type":"Book"}]$wch$::jsonb, $wch$[{"text":"When you've won the World Cup, you know that anything is possible if you believe.","context":"Post-1992 World Cup speech"},{"text":"I am not a politician by nature. I came into politics because I saw the direction in which the country was heading.","context":"Interview, 2013"}]$wch$::jsonb, $wch$[{"title":"Cricket Career","content":"Imran Khan played international cricket for Pakistan from 1971 to 1992, captaining the side for much of that period. His all-round ability — combining 362 Test wickets with 3,807 Test runs — placed him among the greatest all-rounders of the 20th century."},{"title":"Humanitarian Work","content":"After retiring from cricket, Imran devoted himself to philanthropy. Shaukat Khanum Memorial Cancer Hospital, which he built in memory of his mother, now treats over 60% of patients free of charge and is the largest cancer hospital in Pakistan."}]$wch$::jsonb, NULL, NULL, NULL, $wch$#006400$wch$, $wch$[{"name":"Wikipedia","url":"https://en.wikipedia.org/wiki/Imran_Khan"}]$wch$::jsonb, false)
ON CONFLICT (slug) DO UPDATE SET
  name                 = EXCLUDED.name,
  title                = EXCLUDED.title,
  occupation           = EXCLUDED.occupation,
  birth_date           = EXCLUDED.birth_date,
  death_date           = EXCLUDED.death_date,
  nationality          = EXCLUDED.nationality,
  city_slug            = EXCLUDED.city_slug,
  province_slug        = EXCLUDED.province_slug,
  country_slug         = EXCLUDED.country_slug,
  city_name            = EXCLUDED.city_name,
  province_name        = EXCLUDED.province_name,
  country_name         = EXCLUDED.country_name,
  summary              = EXCLUDED.summary,
  achievements         = EXCLUDED.achievements,
  timeline             = EXCLUDED.timeline,
  works                = EXCLUDED.works,
  quotes               = EXCLUDED.quotes,
  description_sections = EXCLUDED.description_sections,
  image_url            = EXCLUDED.image_url,
  image_credit         = EXCLUDED.image_credit,
  image_licence        = EXCLUDED.image_licence,
  primary_color        = EXCLUDED.primary_color,
  sources              = EXCLUDED.sources,
  verified             = EXCLUDED.verified;
