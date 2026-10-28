-- ─────────────────────────────────────────────────────────────────────────────
-- 0016_personality_photos_p9.sql — Personality profile photos (final28 P9)
--
-- PROBLEM (verified live 2026-10-28): the personality detail pages for
-- Faiz Ahmed Faiz, Nusrat Fateh Ali Khan, Wasim Akram and Imran Khan
-- rendered an empty "No image" placeholder block (0 <img>); only
-- Allama Iqbal had a photo.
--
-- WHAT THIS FILE DOES — and nothing else:
--   * Ensures the image_url / image_credit / image_licence columns
--     exist (ADD COLUMN IF NOT EXISTS, so it runs whether or not
--     migration 0014 was applied first).
--   * Sets the locally stored, licence-recorded photo (see
--     docs/personality-photos-p9.md for the full source record) on
--     exactly those four slugs. The paths are site-local
--     (/images/personalities/*.webp in public/) — never hotlinks.
--   * If the legacy photo_url column still exists (old production
--     shape), syncs it to the same local path so the two columns
--     cannot disagree.
--
-- WHAT IT DELIBERATELY DOES NOT DO:
--   * No row is created, deleted, or re-verified: verified flags,
--     titles, summaries, timelines and every other field are
--     untouched. Allama Iqbal's row is untouched (its existing photo
--     is out of scope for P9).
--   * If a slug has no row, its UPDATE is a no-op: Faiz / Imran then
--     still get their photos from the seed fallback
--     (src/lib/data/personalities-seed.ts), and any profile that
--     still has no photo renders with no image column at all after
--     the PersonalityHero template fix in this same PR — never an
--     empty placeholder block.
--
-- IDEMPOTENT: safe to run twice; every step guards itself.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE personalities ADD COLUMN IF NOT EXISTS image_url     text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS image_credit  text;
ALTER TABLE personalities ADD COLUMN IF NOT EXISTS image_licence text;

-- Faiz Ahmed Faiz — "Faiz, London 1983.jpg", Amarjit Chandan, CC BY-SA 4.0
UPDATE personalities
SET image_url     = '/images/personalities/faiz-ahmed-faiz.webp',
    image_credit  = 'Amarjit Chandan, via Wikimedia Commons',
    image_licence = 'CC BY-SA 4.0'
WHERE slug = 'faiz-ahmed-faiz';

-- Nusrat Fateh Ali Khan — "Nusrat Fateh Ali Khan (1948-1997).jpg",
-- Thomas Rome, CC BY 2.0
UPDATE personalities
SET image_url     = '/images/personalities/nusrat-fateh-ali-khan.webp',
    image_credit  = 'Thomas Rome, via Wikimedia Commons',
    image_licence = 'CC BY 2.0'
WHERE slug = 'nusrat-fateh-ali-khan';

-- Wasim Akram — "Wasim Akram.jpg", Arijit Basak, CC BY 2.0
UPDATE personalities
SET image_url     = '/images/personalities/wasim-akram.webp',
    image_credit  = 'Arijit Basak, via Wikimedia Commons',
    image_licence = 'CC BY 2.0'
WHERE slug = 'wasim-akram';

-- Imran Khan — "Imran Khan 2012.jpg", World Economic Forum, CC BY-SA 2.0
UPDATE personalities
SET image_url     = '/images/personalities/imran-khan.webp',
    image_credit  = 'World Economic Forum, via Wikimedia Commons',
    image_licence = 'CC BY-SA 2.0'
WHERE slug = 'imran-khan';

-- Legacy-column sync (only if photo_url exists; no-op otherwise).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'personalities' AND column_name = 'photo_url'
  ) THEN
    UPDATE personalities SET photo_url = image_url
    WHERE slug IN ('faiz-ahmed-faiz', 'nusrat-fateh-ali-khan', 'wasim-akram', 'imran-khan')
      AND image_url IS NOT NULL;
  END IF;
END $$;
