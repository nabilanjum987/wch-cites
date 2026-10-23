-- ════════════════════════════════════════════════════════════════════
-- 0007 — Events depth: Lahore / Karachi / Islamabad seed calendars (R7)
--
-- Every row carries source_name + source_url + last_verified_at
-- (2026-10-22). All rows are status='draft', verified=true: the facts are
-- checked, publication stays gated on the owner's switch-on after audit —
-- nothing in this migration can display until a human flips the status,
-- exactly like the rest of the marathon.
--
-- Doctrine inherited from 0003: Islamic observances and Urs festivals are
-- NOT seeded (Gregorian dates depend on official moon-sighting), PSL 2027
-- fixtures are NOT seeded (unpublished), and no festival's next-edition
-- dates are guessed — where only a confirmed past edition exists, the row
-- IS that edition, labelled as the dated evidence base in its description.
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE events ADD COLUMN IF NOT EXISTS last_verified_at date;

INSERT INTO events (title, slug, city_slug, venue, starts_at, ends_at, category, description, source_name, source_url, verified, status, last_verified_at) VALUES
  ('Sindhi Cultural Day (Ekta Day) — Karachi',
   'sindhi-cultural-day-karachi-2026', 'karachi',
   'Karachi Press Club and gatherings across the city',
   '2026-12-06T00:00:00+05:00', '2026-12-06T23:59:00+05:00', 'culture',
   'Sindhi Cultural Day — Ekta (Unity) Day — is celebrated every year on the first Sunday of December (6 December in 2026, verified against the calendar): ajrak and Sindhi topi across the city, rallies, folk music and literary gatherings, with the Karachi Press Club among the focal points. Date rule and Karachi celebrations are documented by Wikipedia\u2019s "Sindhi Cultural Day" and Radio Pakistan\u2019s coverage.',
   'Wikipedia — Sindhi Cultural Day; Radio Pakistan',
   'https://en.wikipedia.org/wiki/Sindhi_Cultural_Day',
   true, 'draft', '2026-10-22'),
  ('Pakistan Day Parade',
   'pakistan-day-parade-islamabad-2027', 'islamabad',
   'Shakarparian Parade Ground, Islamabad',
   '2027-03-23T00:00:00+05:00', '2027-03-23T23:59:00+05:00', 'community',
   'The annual Pakistan Day armed-forces parade is held on 23 March at the Shakarparian Parade Ground in Islamabad — the fixed-date national ceremony, held at this venue in its modern editions. (The Pakistan Day public holiday itself is seeded nationally in migration 0003; this row is the capital\u2019s ceremony as a city event.)',
   'Pakistan Day observance — fixed by law; venue per the parade\u2019s modern editions',
   'https://en.wikipedia.org/wiki/Pakistan_Day',
   true, 'draft', '2026-10-22'),
  ('Faiz Festival — 10th edition (most recent confirmed)',
   'faiz-festival-lahore-2026', 'lahore',
   'Alhamra — Lahore Arts Council, The Mall',
   '2026-02-13T00:00:00+05:00', '2026-02-15T23:59:00+05:00', 'culture',
   'Dated evidence base for Lahore\u2019s calendar: the 10th Faiz Festival ran 13–15 February 2026 at Alhamra — three days of literature, music, theatre and book launches honouring Faiz Ahmed Faiz, reported by The Express Tribune, Dunya News and Pakistan Today. The festival recurs annually in Lahore; the next edition\u2019s dates are announced by the organisers (Faiz Foundation / Alhamra) and will replace this row when published.',
   'The Express Tribune — "10th Faiz Festival 2026 opens at Alhamra"',
   'https://tribune.com.pk/story/2592448/10th-faiz-festival-2026-opens-at-alhamra',
   true, 'draft', '2026-10-22'),
  ('Karachi Literature Festival — 17th edition (most recent confirmed)',
   'karachi-literature-festival-2026', 'karachi',
   'Beach Luxury Hotel, Karachi',
   '2026-02-06T00:00:00+05:00', '2026-02-08T23:59:00+05:00', 'culture',
   'Dated evidence base for Karachi\u2019s calendar: the 17th Karachi Literature Festival ran 6–8 February 2026 at the Beach Luxury Hotel, organised by Oxford University Press Pakistan under the theme "Literature in a Fragile World" — free and open to the public, reported by Business Recorder, Aaj English and The Express Tribune. KLF recurs annually each February; the next edition\u2019s dates are announced by OUP and will replace this row when published.',
   'Business Recorder — "KLF returns with \u2018Literature in a Fragile World\u2019 theme"',
   'https://www.brecorder.com/news/40405036',
   true, 'draft', '2026-10-22'),
  ('Lok Mela — most recent confirmed edition',
   'lok-mela-islamabad-2025', 'islamabad',
   'Lok Virsa, Shakarparian, Islamabad',
   '2025-11-07T00:00:00+05:00', '2025-11-16T23:59:00+05:00', 'culture',
   'Dated evidence base for Islamabad\u2019s calendar: Lok Mela, the national folk festival organised by Lok Virsa since 1981, ran 7–16 November 2025 at Shakarparian (2024: 8–17 November) — provincial and international pavilions, artisans, folk musicians and cultural nights, reported by The Express Tribune, The News and Radio Pakistan. As of this verification the next edition\u2019s dates had not been announced by Lok Virsa; they will replace this row when published.',
   'The Express Tribune — "Colours of Pakistan set to bloom at Lok Mela"',
   'https://tribune.com.pk/story/2575685/colours-of-pakistan-set-to-bloom-at-lok-mela',
   true, 'draft', '2026-10-22')
ON CONFLICT (slug) DO NOTHING;
