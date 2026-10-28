-- ─────────────────────────────────────────────────────────────────────────────
-- 0019_profile_meta_backfill.sql — B2 (final30)
--
-- PROBLEM (live-verified 2026-10-28, all 37 sitemap-listed profile pages
-- swept): four database rows carry an EMPTY title and summary, so their
-- pages render a hollow meta title and a one-line fallback description:
--   abdul-sattar-edhi  → title "Abdul Sattar Edhi —  | WorldCityHub"
--                         description "Abdul Sattar Edhi — ."
--   dr-abdus-salam     → title "Dr Abdus Salam —  | WorldCityHub"
--                         description "Dr Abdus Salam — ."
--   malala-yousafzai   → title "Malala Yousafzai —  | WorldCityHub"
--                         description "Malala Yousafzai — ."
--   quaid-e-azam-jinnah → title "Quaid-e-Azam Muhammad Ali Jinnah —  | WorldCityHub"
--                         description "Quaid-e-Azam Muhammad Ali Jinnah — ."
-- (The data layer maps the DB row first, so the seed cannot rescue these
-- slugs; see src/lib/personalities.ts rowToProfile + ensureDescription.)
--
-- FIX: backfill a real title + summary for exactly those four rows.
-- Every value below is ≤ the rendered limits once the page composes it
-- (meta title = name + " — " + title + " | WorldCityHub" ≤ 60 chars;
-- description = summary ≤ 155 chars — lengths verified by script):
--   quaid-e-azam-jinnah: rendered title 57, summary 152
--   abdul-sattar-edhi:   rendered title 58, summary 149
--   dr-abdus-salam:      rendered title 56, summary 140
--   malala-yousafzai:    rendered title 54, summary 137
--
-- SOURCES (no invented facts):
--   Quaid / Edhi / Salam summaries mirror the site's own verified seed
--   profiles for the same people (muhammad-ali-jinnah, abdul-sattar-edhi,
--   abdus-salam in src/lib/data/personalities-seed.ts), adapted only to
--   the row's own display name. Quaid's title "Founder" is short by
--   necessity: the row's 32-char display name leaves an 11-char title
--   budget under the 60-char meta cap; the summary carries the full
--   "founder of Pakistan" fact.
--   Malala: born in Mingora, Swat; Pakistani education activist;
--   youngest Nobel Peace Prize laureate, honoured 2014
--   (nobelprize.org facts page; Wikipedia article for the birthplace).
--
-- SAFETY: each UPDATE is guarded on its own column being empty, so this
-- migration is idempotent and never clobbers a human fix applied in the
-- meantime. No verified flag, no other row, and no other column is
-- touched. No person URLs are merged or removed (muhammad-ali-jinnah,
-- abdus-salam and abdul-sattar-edhi rows are deliberately untouched).
--
-- NOTE (for the record, not a change): the rendered title ≤ 60 /
-- description ≤ 155 limits already hold on ALL 37 live profile pages
-- thanks to the P4 word-boundary clamp in
-- src/app/personalities/[slug]/page.tsx (worst live title 59 chars,
-- worst live description 154 chars). This migration fixes the empty
-- CONTENT behind four of them, not a limit break. The remaining
-- source-level over-long titles (which the clamp silently truncates in
-- display, e.g. Iqbal's) are a separate display-quality pass, NOT
-- attempted here.
-- ─────────────────────────────────────────────────────────────────────────────

-- Quaid-e-Azam Muhammad Ali Jinnah (row name is 32 chars; title budget 11)
UPDATE personalities
SET title = 'Founder'
WHERE slug = 'quaid-e-azam-jinnah'
  AND (title IS NULL OR title = '');

UPDATE personalities
SET summary = $wch$Quaid-e-Azam Muhammad Ali Jinnah, born in Karachi, was the barrister who led the Pakistan Movement and became Pakistan's first Governor-General in 1947.$wch$
WHERE slug = 'quaid-e-azam-jinnah'
  AND (summary IS NULL OR summary = '');

-- Abdul Sattar Edhi
UPDATE personalities
SET title = 'Edhi Foundation Founder'
WHERE slug = 'abdul-sattar-edhi'
  AND (title IS NULL OR title = '');

UPDATE personalities
SET summary = $wch$Abdul Sattar Edhi, born in Bantva and settled in Karachi, built from one small dispensary Pakistan's largest volunteer ambulance and welfare network.$wch$
WHERE slug = 'abdul-sattar-edhi'
  AND (summary IS NULL OR summary = '');

-- Dr Abdus Salam
UPDATE personalities
SET title = 'Nobel Laureate Physicist'
WHERE slug = 'dr-abdus-salam'
  AND (title IS NULL OR title = '');

UPDATE personalities
SET summary = $wch$Dr Abdus Salam, born in Jhang and educated at Government College Lahore, shared the 1979 Nobel Prize in Physics for electroweak unification.$wch$
WHERE slug = 'dr-abdus-salam'
  AND (summary IS NULL OR summary = '');

-- Malala Yousafzai
UPDATE personalities
SET title = 'Nobel Peace Laureate'
WHERE slug = 'malala-yousafzai'
  AND (title IS NULL OR title = '');

UPDATE personalities
SET summary = $wch$Malala Yousafzai, born in Mingora, Swat, is a Pakistani education activist and the youngest Nobel Peace Prize laureate, honoured in 2014.$wch$
WHERE slug = 'malala-yousafzai'
  AND (summary IS NULL OR summary = '');

-- Verification (run after applying; expect 4 rows, no empty fields):
-- SELECT slug, name, title, char_length(title) AS title_len,
--        char_length(summary) AS summary_len
-- FROM personalities
-- WHERE slug IN ('quaid-e-azam-jinnah', 'abdul-sattar-edhi',
--                'dr-abdus-salam', 'malala-yousafzai');
