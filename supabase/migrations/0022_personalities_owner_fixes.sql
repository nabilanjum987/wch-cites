-- ─────────────────────────────────────────────────────────────────────────────
-- 0022_personalities_owner_fixes.sql — personalities family fix
-- (owner rulebook pass, 3 Nov 2026)
--
-- WHAT THIS FILE DOES — database-side halves of fixes whose code-side
-- halves ship in the same change (src/lib/personalities.ts overrides,
-- src/lib/seo/meta-fit.ts, the profile template, the seed records).
-- Every UPDATE is guarded on its own column still holding the old or
-- empty value, so the migration is idempotent and never clobbers a
-- human correction applied in the meantime:
--
--   1. Faiz Ahmed Faiz: the timeline's Lenin Peace Prize entry says
--      1979; the correct year is 1962 (his achievements already say
--      1962). Only the year of that one timeline entry changes.
--   2. Faiz summary: the superlative tail "like no one before him"
--      is removed.
--   3. Imran Khan summary: "one of the greatest all-round cricketers
--      in history" becomes the attributed, defensible "widely
--      regarded as one of the finest all-rounders of his era".
--   4. Imran Khan description_sections: "the largest cancer-care
--      network in Pakistan" is attributed to Shaukat Khanum itself.
--   5. Iqbal description_sections: the Iqbal Day sentence loses its
--      unsourced 2022-restoration specifics, keeping the sourced-safe
--      claim that 9 November is marked in Pakistan as Iqbal Day.
--   6. Iqbal photo: the hotlinked upload.wikimedia.org image_url is
--      replaced with the local extended-canvas portrait + credit
--      (the code-side override already renders this file meanwhile).
--   7. Malala Yousafzai: her row carried only the title + summary
--      that migration 0019 backfilled. This fills the hollow profile:
--      identity scalars, photo, timeline, achievements, works, quotes,
--      description sections and sources — the same content the seed
--      fallback now carries, from the established facts listed in the
--      section below. Nothing already present is overwritten.
--   8. Jinnah / Salam dates (S4): full birth/death dates, matching
--      migration 0021's values, applied also where a row carries a
--      year-only value ('1948'), which 0021's empty-only guards could
--      not repair. (The template now also renders "died in {year}"
--      for any year-only value that remains.)
--   9. Benazir Bhutto photo: the verified local portrait already used
--      on the province pages (Oliver Mark, CC BY-SA 4.0; media
--      registry record benazir-bhutto.json, VERIFIED) is set on her
--      row where image_url is empty. The code-side override renders
--      it meanwhile.
--
-- SOURCES: Faiz prize year 1962 per his own achievements record and
-- the Lenin Peace Prize rolls. Malala facts: born 12 July 1997,
-- Mingora, Swat; 2009 BBC Urdu diary as Gul Makai; 2011 Pakistan
-- National Youth Peace Prize; shot by the Pakistani Taliban on
-- 9 October 2012; UN speech on her 16th birthday, 12 July 2013;
-- Malala Fund co-founded 2013; Nobel Peace Prize 2014 at 17, shared
-- with Kailash Satyarthi (nobelprize.org); UN Messenger of Peace
-- 2017, the youngest appointed. Works: "I Am Malala" (2013, with
-- Christina Lamb); "Malala's Magic Pencil" (2017); "We Are Displaced"
-- (2019). Quotes are the documented wordings.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Faiz: Lenin Peace Prize year in the timeline ───────────────────────
UPDATE personalities p
SET timeline = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'title' = 'Lenin Peace Prize' AND elem->>'year' = '1979'
        THEN jsonb_set(elem, '{year}', '"1962"')
      ELSE elem
    END
    ORDER BY ord
  )
  FROM jsonb_array_elements(p.timeline) WITH ORDINALITY AS t(elem, ord)
)
WHERE p.slug = 'faiz-ahmed-faiz'
  AND p.timeline IS NOT NULL
  AND jsonb_typeof(p.timeline) = 'array'
  AND EXISTS (
    SELECT 1 FROM jsonb_array_elements(p.timeline) e
    WHERE e->>'title' = 'Lenin Peace Prize' AND e->>'year' = '1979'
  );

-- ── 2. Faiz: summary superlative tail ─────────────────────────────────────
UPDATE personalities
SET summary = replace(summary, ' like no one before him', '')
WHERE slug = 'faiz-ahmed-faiz'
  AND summary LIKE '%like no one before him%';

-- ── 3. Imran: summary superlative ─────────────────────────────────────────
UPDATE personalities
SET summary = replace(
  summary,
  'is one of the greatest all-round cricketers in history',
  'is widely regarded as one of the finest all-rounders of his era'
)
WHERE slug = 'imran-khan'
  AND summary LIKE '%one of the greatest all-round cricketers in history%';

-- ── 4. Imran: description_sections cancer-network claim, attributed ───────
UPDATE personalities
SET description_sections = replace(
  description_sections::text,
  'and is the largest cancer-care network in Pakistan',
  'and forms what Shaukat Khanum describes as the largest cancer-care network in Pakistan'
)::jsonb
WHERE slug = 'imran-khan'
  AND description_sections IS NOT NULL
  AND description_sections::text LIKE '%and is the largest cancer-care network in Pakistan%';

-- ── 5. Iqbal: description_sections Iqbal Day sentence, softened ───────────
UPDATE personalities
SET description_sections = replace(
  description_sections::text,
  'His birthday, 9 November (Iqbal Day), is a public holiday in Pakistan — restored by federal notification in 2022 after a suspension that began in 2015.',
  'His birthday, 9 November, is marked in Pakistan as Iqbal Day.'
)::jsonb
WHERE slug = 'allama-iqbal'
  AND description_sections IS NOT NULL
  AND description_sections::text LIKE '%restored by federal notification in 2022%';

-- ── 6. Iqbal: hotlinked photo replaced with the local portrait ────────────
UPDATE personalities
SET image_url     = '/images/home28/pers-iqbal-wide.webp',
    image_credit  = 'Iqbal Academy Pakistan',
    image_licence = 'public domain'
WHERE slug = 'allama-iqbal'
  AND (image_url IS NULL OR image_url LIKE 'http%');

-- ── 7. Malala Yousafzai: the hollow profile, filled ───────────────────────
UPDATE personalities SET birth_date = '12 July 1997'
WHERE slug = 'malala-yousafzai' AND (birth_date IS NULL OR birth_date = '');

UPDATE personalities SET occupation = 'Education activist'
WHERE slug = 'malala-yousafzai' AND (occupation IS NULL OR occupation = '');

UPDATE personalities SET nationality = 'Pakistani'
WHERE slug = 'malala-yousafzai' AND (nationality IS NULL OR nationality = '');

UPDATE personalities SET city_slug = 'mingora'
WHERE slug = 'malala-yousafzai' AND (city_slug IS NULL OR city_slug = '');

UPDATE personalities SET province_slug = 'khyber-pakhtunkhwa'
WHERE slug = 'malala-yousafzai' AND (province_slug IS NULL OR province_slug = '');

UPDATE personalities SET country_slug = 'pakistan'
WHERE slug = 'malala-yousafzai' AND (country_slug IS NULL OR country_slug = '');

UPDATE personalities SET city_name = 'Mingora'
WHERE slug = 'malala-yousafzai' AND (city_name IS NULL OR city_name = '');

UPDATE personalities SET province_name = 'Khyber Pakhtunkhwa'
WHERE slug = 'malala-yousafzai' AND (province_name IS NULL OR province_name = '');

UPDATE personalities SET country_name = 'Pakistan'
WHERE slug = 'malala-yousafzai' AND (country_name IS NULL OR country_name = '');

UPDATE personalities SET primary_color = '#115E59'
WHERE slug = 'malala-yousafzai' AND (primary_color IS NULL OR primary_color = '');

UPDATE personalities
SET image_url     = '/images/personalities/malala-yousafzai.webp',
    image_credit  = 'flowcomm, via Wikimedia Commons',
    image_licence = 'CC BY 2.0'
WHERE slug = 'malala-yousafzai' AND image_url IS NULL;

UPDATE personalities
SET timeline = $wch$[{"year": "1997", "title": "Born in Mingora", "description": "Born on 12 July 1997 in Mingora, in Pakistan's Swat Valley."}, {"year": "2009", "title": "The Gul Makai diary", "description": "Writes an anonymous diary for BBC Urdu under the name Gul Makai, describing life under the Pakistani Taliban's ban on girls' education in Swat."}, {"year": "2011", "title": "National Youth Peace Prize", "description": "Receives Pakistan's first National Youth Peace Prize for her campaigning for girls' education."}, {"year": "2012", "title": "Shot by the Pakistani Taliban", "description": "On 9 October 2012 she is shot by the Pakistani Taliban for her outspoken campaigning. She survives the attack."}, {"year": "2013", "title": "Speaks at the United Nations", "description": "On her 16th birthday, 12 July 2013, she addresses the United Nations in New York. The same year she co-founds the Malala Fund to campaign for girls' education worldwide."}, {"year": "2014", "title": "Nobel Peace Prize", "description": "Awarded the Nobel Peace Prize at 17, the youngest laureate in the prize's history, sharing the award with Kailash Satyarthi."}, {"year": "2017", "title": "UN Messenger of Peace", "description": "Named a United Nations Messenger of Peace, the youngest person to hold the role."}]$wch$::jsonb
WHERE slug = 'malala-yousafzai'
  AND (timeline IS NULL OR timeline = '[]'::jsonb);

UPDATE personalities
SET achievements = $wch$[{"icon": "🏆", "title": "Youngest Nobel Laureate", "description": "Received the Nobel Peace Prize in 2014 at 17, the youngest laureate ever, shared with Kailash Satyarthi."}, {"icon": "✍️", "title": "The Gul Makai Diary", "description": "Her 2009 BBC Urdu diary, written under a pen name at 11, first brought Swat's ban on girls' schooling to the world."}, {"icon": "🎓", "title": "Malala Fund Co-founder", "description": "Co-founded the Malala Fund in 2013 to campaign for girls' right to education around the world."}, {"icon": "🕊️", "title": "UN Messenger of Peace", "description": "Named a United Nations Messenger of Peace in 2017, the youngest person appointed to the role."}]$wch$::jsonb
WHERE slug = 'malala-yousafzai'
  AND (achievements IS NULL OR achievements = '[]'::jsonb);

UPDATE personalities
SET works = $wch$[{"title": "I Am Malala", "year": "2013", "description": "Her memoir, written with Christina Lamb, telling the story of her childhood in Swat and the attack that made her a global voice.", "type": "Book"}, {"title": "Malala's Magic Pencil", "year": "2017", "description": "A picture book for young readers about wishing for a better world and working to change it.", "type": "Book"}, {"title": "We Are Displaced", "year": "2019", "description": "Stories of refugee girls from around the world, introduced by her own experience of displacement.", "type": "Book"}]$wch$::jsonb
WHERE slug = 'malala-yousafzai'
  AND (works IS NULL OR works = '[]'::jsonb);

UPDATE personalities
SET quotes = $wch$[{"text": "One child, one teacher, one book, one pen can change the world.", "context": "Address to the United Nations Youth Assembly, 12 July 2013"}, {"text": "I raise up my voice — not so that I can shout, but so that those without a voice can be heard.", "context": "Documented statement of her campaign's message"}]$wch$::jsonb
WHERE slug = 'malala-yousafzai'
  AND (quotes IS NULL OR quotes = '[]'::jsonb);

UPDATE personalities
SET description_sections = $wch$[{"title": "The Diary of Gul Makai", "content": "Malala grew up in Mingora, the main town of the Swat Valley, where her father ran a school. When the Pakistani Taliban moved to ban girls' education in Swat, she began writing an anonymous diary for BBC Urdu under the name Gul Makai, describing everyday life under the ban. She was 11 years old. As her identity became known she spoke publicly for girls' schooling, and in 2011 she received Pakistan's National Youth Peace Prize."}, {"title": "A Global Voice for Girls' Education", "content": "On 9 October 2012 Malala was shot by the Pakistani Taliban for her campaigning. She survived, and her recovery carried her cause to a worldwide audience. On 12 July 2013, her 16th birthday, she addressed the United Nations; the same year she co-founded the Malala Fund. In 2014 she received the Nobel Peace Prize at 17, the youngest laureate in its history, and in 2017 she became the youngest UN Messenger of Peace."}]$wch$::jsonb
WHERE slug = 'malala-yousafzai'
  AND (description_sections IS NULL OR description_sections = '[]'::jsonb);

UPDATE personalities
SET sources = $wch$[{"name": "Wikipedia", "url": "https://en.wikipedia.org/wiki/Malala_Yousafzai"}, {"name": "Nobel Prize", "url": "https://www.nobelprize.org/prizes/peace/2014/yousafzai/facts/"}]$wch$::jsonb
WHERE slug = 'malala-yousafzai'
  AND (sources IS NULL OR sources = '[]'::jsonb);

-- ── 8. Jinnah / Salam: full dates (repairs year-only values too) ──────────
UPDATE personalities SET birth_date = '25 December 1876'
WHERE slug = 'quaid-e-azam-jinnah'
  AND (birth_date IS NULL OR birth_date = '' OR birth_date = '1876');

UPDATE personalities SET death_date = '11 September 1948'
WHERE slug = 'quaid-e-azam-jinnah'
  AND (death_date IS NULL OR death_date = '' OR death_date = '1948');

UPDATE personalities SET birth_date = '29 January 1926'
WHERE slug = 'dr-abdus-salam'
  AND (birth_date IS NULL OR birth_date = '' OR birth_date = '1926');

UPDATE personalities SET death_date = '21 November 1996'
WHERE slug = 'dr-abdus-salam'
  AND (death_date IS NULL OR death_date = '' OR death_date = '1996');

-- ── 9. Benazir Bhutto: verified local photo ───────────────────────────────
UPDATE personalities
SET image_url     = '/images/personalities/benazir-bhutto.webp',
    image_credit  = 'Oliver Mark, via Wikimedia Commons',
    image_licence = 'CC BY-SA 4.0'
WHERE slug = 'benazir-bhutto' AND image_url IS NULL;

-- Verification (run after applying):
--   * Faiz: the timeline entry titled 'Lenin Peace Prize' reads 1962,
--     and no summary contains 'no one before him'.
--   * Imran: no summary contains 'greatest all-round cricketers', and
--     the sections attribute the cancer-network claim.
--   * Iqbal: image_url is the local wide portrait; the sections carry
--     the softened Iqbal Day sentence.
--   * Malala: timeline/achievements/works/quotes/description_sections
--     are non-empty; birth_date is '12 July 1997'.
--   * Jinnah/Salam: birth_date/death_date hold the full dates above.
-- SELECT slug,
--        (SELECT e->>'year' FROM jsonb_array_elements(timeline) e
--          WHERE e->>'title' = 'Lenin Peace Prize') AS faiz_prize_year,
--        birth_date, death_date
-- FROM personalities
-- WHERE slug IN ('faiz-ahmed-faiz', 'malala-yousafzai',
--                'quaid-e-azam-jinnah', 'dr-abdus-salam');
