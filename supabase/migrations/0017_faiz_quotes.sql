-- ─────────────────────────────────────────────────────────────────────────────
-- 0017_faiz_quotes.sql — Final sitting E19: Faiz Ahmed Faiz quotes
-- (companion to the seed change in src/lib/data/personalities-seed.ts)
--
-- WHAT: fills the `quotes` array on the faiz-ahmed-faiz row with two
-- verified poem lines (see SOURCES below). Until this migration is
-- applied, production serves the same quotes from the seed fallback in
-- src/lib/personalities.ts, so the page is correct either way; after
-- it is applied, the DB row (which getPersonalityBySlug prefers) agrees
-- with the seed.
--
-- NUMBERING: 0017, NOT 0016. On the base (main d193fcf) the highest
-- numbered migration is 0015, but the parallel final-sitting branches
-- final28-p3 (0016_personalities_nusrat_wasim.sql) and final28-p9
-- (0016_personality_photos_p9.sql) BOTH already use 0016. Using 0016
-- here would collide with both at merge time. 0017 applies after
-- either 0016; order is irrelevant here because this migration touches
-- only the faiz-ahmed-faiz row's quotes column, which neither 0016
-- touches, and it only fills an empty quotes array.
--
-- IDEMPOTENT: safe to run twice. The UPDATE fires only where quotes
-- is still empty ('[]'), so it never overwrites quotes an owner may
-- have filled by another route. If the faiz row does not exist yet
-- (migration 0006 unapplied), the UPDATE affects 0 rows and is a
-- harmless no-op — the seed fallback keeps serving the page.
--
-- SOURCES (both lines are Faiz's own poem lines, not attributed sayings):
--   1. "Mujh se pehli si mohabbat mere mehboob na maang" — opening
--      line of the nazm "Mujh Se Pehli Si Mohabbat", in his first
--      collection Naqsh-e-Faryadi. Text verified against the poem's
--      published text (Wikipedia article for the poem; Rekhta/Bahaaristan
--      transcriptions agree line-for-line).
--   2. "Bol ke lab azaad hain tere" — opening line of the nazm "Bol",
--      collected in Nuskha Haye Wafa (p. 81, per Rekhta's source line
--      for the poem). English gloss "Speak, for your lips are free"
--      is Rekhta's own translation of the line.
-- No other quote was used: widely-shared Faiz "sayings" without a poem
-- source were deliberately excluded rather than risk misattribution.
--
-- LAHORE FORT (same PR, no migration): the /places/[slug] page reads
-- its record from the hard-coded PLACES table in
-- src/app/places/[slug]/page.tsx — there is no DB table behind that
-- page — so the Fort's capacity/dress completion lives ONLY in that
-- file (significance sentence + tip) and needs no migration. The
-- legacy landmarks row in supabase/schema.sql (capacity 50000 for
-- lahore-fort) is NOT read by the page and is unsourced, so it was
-- deliberately left untouched, not copied.
-- ─────────────────────────────────────────────────────────────────────────────

-- Defensive: the column exists after 0005/0014, but this keeps the
-- migration runnable even if those steps were skipped.
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS quotes jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE personalities
SET quotes = $wch$[
  {
    "text": "Mujh se pehli si mohabbat mere mehboob na maang",
    "context": "From his poem \"Mujh Se Pehli Si Mohabbat\" — Do not ask of me, my love, the love I once had for you"
  },
  {
    "text": "Bol ke lab azaad hain tere",
    "context": "From his poem \"Bol\" — Speak, for your lips are free"
  }
]$wch$::jsonb
WHERE slug = 'faiz-ahmed-faiz'
  AND (quotes IS NULL OR quotes = '[]'::jsonb);
