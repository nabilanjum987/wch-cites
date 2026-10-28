-- ─────────────────────────────────────────────────────────────────────────────
-- 0018_personalities_quote_sources.sql — Final30 B4
--
-- PROBLEM: the nusrat-fateh-ali-khan and wasim-akram rows (written by
-- 0016_personalities_nusrat_wasim.sql) carry quotes whose contexts cite
-- publications that are NOT in the rows' `sources` arrays:
--   Nusrat: "Outlook interview, January 1996" and "Rediff interview, 1997"
--     — sources array held only Wikipedia, Britannica, Wikiquote.
--   Wasim: "Daily Mirror interview, 2006" and "Wisden interview, 2020"
--     — sources array held only Wikipedia, ICC.
-- No quote is removed: every cited publication was verified before
-- being added (see SOURCES below). No source is invented.
--
-- WHAT: appends the four missing publications to the two rows' `sources`
-- arrays. One UPDATE per publication, each guarded on its own name, so
-- the migration is idempotent (safe to run twice; never duplicates).
-- Existing entries (Wikipedia, Britannica, Wikiquote, ICC) are untouched.
-- The seed file needs no change: it has no `sources` field, and the
-- quote contexts already name these publications.
--
-- NUMBERING: 0018 — the highest numbered migration on main is
-- 0017_faiz_quotes.sql. This migration touches only the two rows'
-- `sources` columns, which no other migration touches, so apply order
-- against other pending migrations is irrelevant.
--
-- SOURCES (each verified 2026-10-28 against the cited publication or
-- its verbatim reprint; quote wording on the page is unchanged):
--   1. Outlook (Nusrat, Jan 1996) — Wikiquote's Nusrat page cites the
--      Outlook interview of 24 Jan 1996 for the "Sufi music tries to
--      banish the hatred" quote, at the outlookindia.com article URL
--      below (legacy article.aspx URL, as cited by Wikiquote).
--   2. Rediff (Nusrat, 1997) — Wikiquote's Nusrat page cites the Rediff
--      interview of April 1997 for the "A man learns all his life"
--      quote, at the rediff.com URL below (as cited by Wikiquote).
--   3. Daily Mirror (Wasim, 2006) — the 2006 Mirror piece by Mike
--      Walters ("When England make the ball move it's reverse swing..
--      when we do the same it's cheating") carries the ball-tampering /
--      reverse-swing quote verbatim in the Oval-test / Inzamam-hearing
--      context of 2006. The Mirror's own 2006 URL is no longer live,
--      so the entry is named transparently as a Free Library reprint
--      and points at that verbatim reprint, not at a guessed Mirror URL.
--   4. Wisden (Wasim, 2020) — Wisden's 12 Dec 2020 interview is titled
--      "Wasim Akram: 'We were artists and we learnt the art from
--      Imran'", the exact wording of the page's quote, at the
--      wisden.com URL below.
-- NOT ADDED: Nusrat's first quote ("Interview, Chicago, 1993") cites
-- no publication — its context names only the place and year — so
-- there is no missing publication to add; it is already covered by
-- the Wikiquote entry in the row's sources, which cites the 1993
-- Chicago interview transcript (Andy Carvin / edwebproject.org).
-- ─────────────────────────────────────────────────────────────────────────────

-- Defensive: the column exists after 0016, but this keeps the migration
-- runnable even if that step was skipped.
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS sources jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Nusrat: Outlook (Jan 1996 interview).
UPDATE personalities
SET sources = sources || $wch$[{"name": "Outlook", "url": "http://www.outlookindia.com/article.aspx?200673"}]$wch$::jsonb
WHERE slug = 'nusrat-fateh-ali-khan'
  AND NOT (sources @> $wch$[{"name": "Outlook"}]$wch$::jsonb);

-- Nusrat: Rediff (1997 interview).
UPDATE personalities
SET sources = sources || $wch$[{"name": "Rediff", "url": "http://www.rediff.com/entertai/apr/05nusra1.htm"}]$wch$::jsonb
WHERE slug = 'nusrat-fateh-ali-khan'
  AND NOT (sources @> $wch$[{"name": "Rediff"}]$wch$::jsonb);

-- Wasim: Daily Mirror (2006 interview), via its verbatim Free Library reprint.
UPDATE personalities
SET sources = sources || $wch$[{"name": "Daily Mirror (via The Free Library)", "url": "https://www.thefreelibrary.com/Cricket%3a+When+England+make+the+ball+move+it%27s+reverse+swing..+when+we...-a0149951470"}]$wch$::jsonb
WHERE slug = 'wasim-akram'
  AND NOT (sources @> $wch$[{"name": "Daily Mirror (via The Free Library)"}]$wch$::jsonb);

-- Wasim: Wisden (12 Dec 2020 interview).
UPDATE personalities
SET sources = sources || $wch$[{"name": "Wisden", "url": "https://www.wisden.com/cricket-news/cricket-news/wasim-akram-we-were-artists-and-we-learnt-the-art-from-imran"}]$wch$::jsonb
WHERE slug = 'wasim-akram'
  AND NOT (sources @> $wch$[{"name": "Wisden"}]$wch$::jsonb);
